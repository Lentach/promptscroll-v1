/*
  # Comprehensive PromptScroll Improvements Migration
  
  1. Comments System
    - New comments table with moderation
    - RLS policies for public access
    - Rate limiting integration
  
  2. User Sessions & Rate Limiting
    - Session tracking table
    - Rate limiting functions
    - Spam prevention
  
  3. Popular Tags System
    - Regular table instead of materialized view (to support RLS)
    - Automatic refresh triggers
    - Efficient tag statistics
  
  4. Enhanced Security
    - Updated RLS policies for prompts
    - Server-side validation functions
    - Comprehensive data integrity checks
  
  5. Performance Optimizations
    - Proper indexing strategy
    - Efficient query functions
    - Automatic maintenance triggers
*/

-- 1. TABELA KOMENTARZY
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id uuid NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  author_name text NOT NULL DEFAULT 'Anonymous',
  content text NOT NULL,
  user_ip text,
  user_session_id text,
  is_flagged boolean DEFAULT false,
  moderation_status text DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indeksy dla komentarzy
CREATE INDEX IF NOT EXISTS idx_comments_prompt ON comments(prompt_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_moderation ON comments(moderation_status);
CREATE INDEX IF NOT EXISTS idx_comments_session ON comments(user_session_id);

-- 2. TABELA SESJI UŻYTKOWNIKÓW (dla rate limiting)
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  user_ip text,
  last_prompt_submission timestamptz,
  last_comment_submission timestamptz,
  last_vote_submission timestamptz,
  submission_count integer DEFAULT 0,
  vote_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indeksy dla sesji
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_ip ON user_sessions(user_ip);
CREATE INDEX IF NOT EXISTS idx_user_sessions_updated ON user_sessions(updated_at);

-- 3. TABELA POPULARNYCH TAGÓW (zamiast materialized view)
CREATE TABLE IF NOT EXISTS popular_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag text UNIQUE NOT NULL,
  usage_count bigint DEFAULT 0,
  prompt_count bigint DEFAULT 0,
  avg_quality numeric(5,2) DEFAULT 0.00,
  last_used timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indeksy dla popularnych tagów
CREATE INDEX IF NOT EXISTS idx_popular_tags_usage ON popular_tags(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_popular_tags_quality ON popular_tags(avg_quality DESC);
CREATE INDEX IF NOT EXISTS idx_popular_tags_updated ON popular_tags(updated_at);

-- 4. FUNKCJE RATE LIMITING
CREATE OR REPLACE FUNCTION check_rate_limit(
  session_id_param text,
  user_ip_param text,
  action_type text,
  time_window_minutes integer DEFAULT 60,
  max_actions integer DEFAULT 10
) RETURNS boolean AS $$
DECLARE
  action_count integer := 0;
  time_threshold timestamptz;
BEGIN
  time_threshold := now() - (time_window_minutes || ' minutes')::interval;
  
  -- Sprawdź liczbę akcji w oknie czasowym
  IF action_type = 'submission' THEN
    SELECT COALESCE(SUM(submission_count), 0) INTO action_count
    FROM user_sessions
    WHERE (session_id = session_id_param OR user_ip = user_ip_param)
    AND last_prompt_submission > time_threshold;
  ELSIF action_type = 'vote' THEN
    SELECT COALESCE(SUM(vote_count), 0) INTO action_count
    FROM user_sessions
    WHERE (session_id = session_id_param OR user_ip = user_ip_param)
    AND last_vote_submission > time_threshold;
  ELSIF action_type = 'comment' THEN
    SELECT COALESCE(SUM(comment_count), 0) INTO action_count
    FROM user_sessions
    WHERE (session_id = session_id_param OR user_ip = user_ip_param)
    AND last_comment_submission > time_threshold;
  END IF;
  
  RETURN action_count < max_actions;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. FUNKCJA AKTUALIZACJI SESJI
CREATE OR REPLACE FUNCTION update_user_session(
  session_id_param text,
  user_ip_param text,
  action_type text
) RETURNS void AS $$
BEGIN
  INSERT INTO user_sessions (
    session_id, 
    user_ip,
    last_prompt_submission,
    last_comment_submission,
    last_vote_submission,
    submission_count,
    vote_count,
    comment_count
  )
  VALUES (
    session_id_param, 
    user_ip_param,
    CASE WHEN action_type = 'submission' THEN now() ELSE NULL END,
    CASE WHEN action_type = 'comment' THEN now() ELSE NULL END,
    CASE WHEN action_type = 'vote' THEN now() ELSE NULL END,
    CASE WHEN action_type = 'submission' THEN 1 ELSE 0 END,
    CASE WHEN action_type = 'vote' THEN 1 ELSE 0 END,
    CASE WHEN action_type = 'comment' THEN 1 ELSE 0 END
  )
  ON CONFLICT (session_id) DO UPDATE SET
    user_ip = EXCLUDED.user_ip,
    last_prompt_submission = CASE 
      WHEN action_type = 'submission' THEN now() 
      ELSE user_sessions.last_prompt_submission 
    END,
    last_comment_submission = CASE 
      WHEN action_type = 'comment' THEN now() 
      ELSE user_sessions.last_comment_submission 
    END,
    last_vote_submission = CASE 
      WHEN action_type = 'vote' THEN now() 
      ELSE user_sessions.last_vote_submission 
    END,
    submission_count = CASE 
      WHEN action_type = 'submission' THEN user_sessions.submission_count + 1 
      ELSE user_sessions.submission_count 
    END,
    vote_count = CASE 
      WHEN action_type = 'vote' THEN user_sessions.vote_count + 1 
      ELSE user_sessions.vote_count 
    END,
    comment_count = CASE 
      WHEN action_type = 'comment' THEN user_sessions.comment_count + 1 
      ELSE user_sessions.comment_count 
    END,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. FUNKCJA AKTUALIZACJI POPULARNYCH TAGÓW
CREATE OR REPLACE FUNCTION refresh_popular_tags() RETURNS void AS $$
BEGIN
  -- Wyczyść istniejące dane
  DELETE FROM popular_tags;
  
  -- Wstaw zaktualizowane dane
  INSERT INTO popular_tags (tag, usage_count, prompt_count, avg_quality, last_used)
  SELECT 
    pt.tag,
    COUNT(*) as usage_count,
    COUNT(DISTINCT pt.prompt_id) as prompt_count,
    COALESCE(AVG(p.quality_score), 0) as avg_quality,
    MAX(p.created_at) as last_used
  FROM prompt_tags pt
  JOIN prompts p ON pt.prompt_id = p.id
  WHERE p.moderation_status = 'approved'
  GROUP BY pt.tag
  HAVING COUNT(*) >= 2
  ORDER BY COUNT(*) DESC, AVG(p.quality_score) DESC;
  
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. FUNKCJA WALIDACJI PROMPTÓW
CREATE OR REPLACE FUNCTION validate_prompt_data() RETURNS trigger AS $$
BEGIN
  -- Walidacja długości tytułu
  IF length(trim(NEW.title)) < 5 OR length(trim(NEW.title)) > 200 THEN
    RAISE EXCEPTION 'Title must be between 5 and 200 characters';
  END IF;
  
  -- Walidacja długości treści
  IF length(trim(NEW.content)) < 10 OR length(trim(NEW.content)) > 5000 THEN
    RAISE EXCEPTION 'Content must be between 10 and 5000 characters';
  END IF;
  
  -- Walidacja opisu (jeśli podany)
  IF NEW.description IS NOT NULL AND (length(trim(NEW.description)) < 10 OR length(trim(NEW.description)) > 500) THEN
    RAISE EXCEPTION 'Description must be between 10 and 500 characters';
  END IF;
  
  -- Walidacja modelu AI
  IF NEW.primary_model NOT IN ('chatgpt', 'claude', 'dalle', 'midjourney', 'gpt-4', 'gemini', 'perplexity', 'grok', 'other') THEN
    RAISE EXCEPTION 'Invalid AI model specified';
  END IF;
  
  -- Walidacja poziomu trudności
  IF NEW.difficulty_level NOT IN ('beginner', 'intermediate', 'advanced') THEN
    RAISE EXCEPTION 'Invalid difficulty level';
  END IF;
  
  -- Walidacja statusu moderacji
  IF NEW.moderation_status NOT IN ('pending', 'approved', 'rejected') THEN
    RAISE EXCEPTION 'Invalid moderation status';
  END IF;
  
  -- Trim whitespace
  NEW.title = trim(NEW.title);
  NEW.content = trim(NEW.content);
  NEW.author_name = trim(NEW.author_name);
  IF NEW.description IS NOT NULL THEN
    NEW.description = trim(NEW.description);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. FUNKCJA WALIDACJI KOMENTARZY
CREATE OR REPLACE FUNCTION validate_comment_data() RETURNS trigger AS $$
BEGIN
  -- Walidacja długości komentarza
  IF length(trim(NEW.content)) < 5 OR length(trim(NEW.content)) > 1000 THEN
    RAISE EXCEPTION 'Comment must be between 5 and 1000 characters';
  END IF;
  
  -- Walidacja nazwy autora
  IF length(trim(NEW.author_name)) < 2 OR length(trim(NEW.author_name)) > 50 THEN
    RAISE EXCEPTION 'Author name must be between 2 and 50 characters';
  END IF;
  
  -- Walidacja statusu moderacji
  IF NEW.moderation_status NOT IN ('pending', 'approved', 'rejected') THEN
    RAISE EXCEPTION 'Invalid moderation status';
  END IF;
  
  -- Trim whitespace
  NEW.content = trim(NEW.content);
  NEW.author_name = trim(NEW.author_name);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. FUNKCJA AKTUALIZACJI UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. FUNKCJA AKTUALIZACJI TAGÓW PO ZMIANACH
CREATE OR REPLACE FUNCTION update_popular_tags_on_change() RETURNS trigger AS $$
BEGIN
  -- Asynchronicznie odśwież popularne tagi
  PERFORM refresh_popular_tags();
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 11. TRIGGERY WALIDACYJNE
DROP TRIGGER IF EXISTS validate_prompt_trigger ON prompts;
CREATE TRIGGER validate_prompt_trigger
  BEFORE INSERT OR UPDATE ON prompts
  FOR EACH ROW EXECUTE FUNCTION validate_prompt_data();

DROP TRIGGER IF EXISTS validate_comment_trigger ON comments;
CREATE TRIGGER validate_comment_trigger
  BEFORE INSERT OR UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION validate_comment_data();

-- 12. TRIGGERY AKTUALIZACJI UPDATED_AT
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_sessions_updated_at ON user_sessions;
CREATE TRIGGER update_user_sessions_updated_at
  BEFORE UPDATE ON user_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_popular_tags_updated_at ON popular_tags;
CREATE TRIGGER update_popular_tags_updated_at
  BEFORE UPDATE ON popular_tags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 13. TRIGGERY AKTUALIZACJI POPULARNYCH TAGÓW
DROP TRIGGER IF EXISTS refresh_tags_on_prompt_change ON prompts;
CREATE TRIGGER refresh_tags_on_prompt_change
  AFTER INSERT OR UPDATE OR DELETE ON prompts
  FOR EACH STATEMENT EXECUTE FUNCTION update_popular_tags_on_change();

DROP TRIGGER IF EXISTS refresh_tags_on_tag_change ON prompt_tags;
CREATE TRIGGER refresh_tags_on_tag_change
  AFTER INSERT OR UPDATE OR DELETE ON prompt_tags
  FOR EACH STATEMENT EXECUTE FUNCTION update_popular_tags_on_change();

-- 14. ZAKTUALIZOWANE POLITYKI RLS DLA PROMPTS (bezpieczne usuwanie)
DO $$
BEGIN
  -- Usuń istniejące polityki jeśli istnieją
  DROP POLICY IF EXISTS "Allow anon insert for prompts" ON prompts;
  DROP POLICY IF EXISTS "Allow authenticated insert prompts" ON prompts;
  DROP POLICY IF EXISTS "Allow anon insert for pending prompts only" ON prompts;
EXCEPTION
  WHEN undefined_object THEN
    -- Polityka nie istnieje, kontynuuj
    NULL;
END $$;

-- Nowa polityka dla anonimowych użytkowników - tylko pending
CREATE POLICY "Allow anon insert for pending prompts only"
  ON prompts
  FOR INSERT
  TO anon
  WITH CHECK (moderation_status = 'pending');

-- Polityka dla uwierzytelnionych użytkowników - mogą ustawiać approved
CREATE POLICY "Allow authenticated insert prompts"
  ON prompts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 15. POLITYKI RLS DLA KOMENTARZY
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read approved comments"
  ON comments
  FOR SELECT
  TO public
  USING (moderation_status = 'approved');

CREATE POLICY "Allow public insert comments"
  ON comments
  FOR INSERT
  TO public
  WITH CHECK (moderation_status = 'pending');

CREATE POLICY "Allow authenticated moderate comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 16. POLITYKI RLS DLA USER_SESSIONS
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read own session"
  ON user_sessions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert session"
  ON user_sessions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update own session"
  ON user_sessions
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- 17. POLITYKI RLS DLA POPULAR_TAGS
ALTER TABLE popular_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read popular tags"
  ON popular_tags
  FOR SELECT
  TO public
  USING (true);

-- 18. FUNKCJA POBIERANIA KOMENTARZY
CREATE OR REPLACE FUNCTION get_prompt_comments(prompt_id_param uuid)
RETURNS TABLE (
  id uuid,
  author_name text,
  content text,
  created_at timestamptz,
  updated_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.author_name,
    c.content,
    c.created_at,
    c.updated_at
  FROM comments c
  WHERE c.prompt_id = prompt_id_param
    AND c.moderation_status = 'approved'
  ORDER BY c.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 19. FUNKCJA DODAWANIA KOMENTARZA Z RATE LIMITING
CREATE OR REPLACE FUNCTION add_comment_with_rate_limit(
  prompt_id_param uuid,
  author_name_param text,
  content_param text,
  user_ip_param text DEFAULT NULL,
  session_id_param text DEFAULT NULL
) RETURNS TABLE (
  success boolean,
  message text,
  comment_id uuid
) AS $$
DECLARE
  new_comment_id uuid;
  rate_limit_ok boolean;
BEGIN
  -- Sprawdź rate limit (5 komentarzy na godzinę)
  SELECT check_rate_limit(session_id_param, user_ip_param, 'comment', 60, 5) INTO rate_limit_ok;
  
  IF NOT rate_limit_ok THEN
    RETURN QUERY SELECT false, 'Rate limit exceeded. Please wait before adding another comment.', NULL::uuid;
    RETURN;
  END IF;
  
  -- Dodaj komentarz
  INSERT INTO comments (prompt_id, author_name, content, user_ip, user_session_id, moderation_status)
  VALUES (prompt_id_param, author_name_param, content_param, user_ip_param, session_id_param, 'pending')
  RETURNING id INTO new_comment_id;
  
  -- Aktualizuj sesję użytkownika
  PERFORM update_user_session(session_id_param, user_ip_param, 'comment');
  
  RETURN QUERY SELECT true, 'Comment added successfully and is pending moderation.', new_comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 20. FUNKCJA POBIERANIA POPULARNYCH TAGÓW
CREATE OR REPLACE FUNCTION get_popular_tags(limit_param integer DEFAULT 20)
RETURNS TABLE (
  tag text,
  usage_count bigint,
  prompt_count bigint,
  avg_quality numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pt.tag,
    pt.usage_count,
    pt.prompt_count,
    pt.avg_quality
  FROM popular_tags pt
  ORDER BY pt.usage_count DESC, pt.avg_quality DESC
  LIMIT limit_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 21. ZAKTUALIZOWANE FUNKCJE INCREMENTU Z RATE LIMITING
CREATE OR REPLACE FUNCTION increment_prompt_likes_with_rate_limit(
  prompt_id_param uuid,
  user_session_id text DEFAULT NULL,
  user_ip_param text DEFAULT NULL
) RETURNS TABLE (
  success boolean,
  message text,
  new_likes integer,
  new_dislikes integer
) AS $$
DECLARE
  current_likes integer;
  current_dislikes integer;
  rate_limit_ok boolean;
BEGIN
  -- Sprawdź rate limit (10 głosów na godzinę)
  SELECT check_rate_limit(user_session_id, user_ip_param, 'vote', 60, 10) INTO rate_limit_ok;
  
  IF NOT rate_limit_ok THEN
    RETURN QUERY SELECT false, 'Rate limit exceeded. Please wait before voting again.', 0, 0;
    RETURN;
  END IF;
  
  -- Aktualizuj likes
  UPDATE prompts 
  SET total_likes = total_likes + 1,
      updated_at = now()
  WHERE id = prompt_id_param
  RETURNING total_likes, total_dislikes INTO current_likes, current_dislikes;
  
  -- Aktualizuj sesję użytkownika
  PERFORM update_user_session(user_session_id, user_ip_param, 'vote');
  
  RETURN QUERY SELECT true, 'Like added successfully.', current_likes, current_dislikes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_prompt_dislikes_with_rate_limit(
  prompt_id_param uuid,
  user_session_id text DEFAULT NULL,
  user_ip_param text DEFAULT NULL
) RETURNS TABLE (
  success boolean,
  message text,
  new_likes integer,
  new_dislikes integer
) AS $$
DECLARE
  current_likes integer;
  current_dislikes integer;
  rate_limit_ok boolean;
BEGIN
  -- Sprawdź rate limit (10 głosów na godzinę)
  SELECT check_rate_limit(user_session_id, user_ip_param, 'vote', 60, 10) INTO rate_limit_ok;
  
  IF NOT rate_limit_ok THEN
    RETURN QUERY SELECT false, 'Rate limit exceeded. Please wait before voting again.', 0, 0;
    RETURN;
  END IF;
  
  -- Aktualizuj dislikes
  UPDATE prompts 
  SET total_dislikes = total_dislikes + 1,
      updated_at = now()
  WHERE id = prompt_id_param
  RETURNING total_likes, total_dislikes INTO current_likes, current_dislikes;
  
  -- Aktualizuj sesję użytkownika
  PERFORM update_user_session(user_session_id, user_ip_param, 'vote');
  
  RETURN QUERY SELECT true, 'Dislike added successfully.', current_likes, current_dislikes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 22. FUNKCJA DODAWANIA PROMPTU Z RATE LIMITING
CREATE OR REPLACE FUNCTION add_prompt_with_rate_limit(
  title_param text,
  content_param text,
  description_param text,
  category_id_param uuid,
  primary_model_param text,
  difficulty_level_param text,
  author_name_param text,
  technique_explanation_param text,
  example_output_param text,
  user_ip_param text DEFAULT NULL,
  session_id_param text DEFAULT NULL
) RETURNS TABLE (
  success boolean,
  message text,
  prompt_id uuid
) AS $$
DECLARE
  new_prompt_id uuid;
  rate_limit_ok boolean;
BEGIN
  -- Sprawdź rate limit (3 prompty na godzinę)
  SELECT check_rate_limit(session_id_param, user_ip_param, 'submission', 60, 3) INTO rate_limit_ok;
  
  IF NOT rate_limit_ok THEN
    RETURN QUERY SELECT false, 'Rate limit exceeded. Please wait before submitting another prompt.', NULL::uuid;
    RETURN;
  END IF;
  
  -- Dodaj prompt
  INSERT INTO prompts (
    title, content, description, category_id, primary_model, 
    difficulty_level, author_name, technique_explanation, example_output,
    compatible_models, moderation_status, total_likes, total_dislikes, 
    total_uses, quality_score, is_verified, is_featured
  )
  VALUES (
    title_param, content_param, description_param, category_id_param, primary_model_param,
    difficulty_level_param, author_name_param, technique_explanation_param, example_output_param,
    ARRAY[primary_model_param], 'pending', 0, 0, 0, 0.0, false, false
  )
  RETURNING id INTO new_prompt_id;
  
  -- Aktualizuj sesję użytkownika
  PERFORM update_user_session(session_id_param, user_ip_param, 'submission');
  
  RETURN QUERY SELECT true, 'Prompt added successfully and is pending moderation.', new_prompt_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 23. INICJALIZACJA POPULARNYCH TAGÓW
SELECT refresh_popular_tags();

-- 24. FUNKCJA CZYSZCZENIA STARYCH SESJI (maintenance)
CREATE OR REPLACE FUNCTION cleanup_old_sessions() RETURNS void AS $$
BEGIN
  -- Usuń sesje starsze niż 7 dni
  DELETE FROM user_sessions 
  WHERE updated_at < now() - interval '7 days';
  
  -- Usuń odrzucone komentarze starsze niż 30 dni
  DELETE FROM comments 
  WHERE moderation_status = 'rejected' 
  AND updated_at < now() - interval '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 25. GRANT PERMISSIONS
GRANT EXECUTE ON FUNCTION get_prompt_comments(uuid) TO public;
GRANT EXECUTE ON FUNCTION add_comment_with_rate_limit(uuid, text, text, text, text) TO public;
GRANT EXECUTE ON FUNCTION get_popular_tags(integer) TO public;
GRANT EXECUTE ON FUNCTION increment_prompt_likes_with_rate_limit(uuid, text, text) TO public;
GRANT EXECUTE ON FUNCTION increment_prompt_dislikes_with_rate_limit(uuid, text, text) TO public;
GRANT EXECUTE ON FUNCTION add_prompt_with_rate_limit(text, text, text, uuid, text, text, text, text, text, text, text) TO public;
GRANT EXECUTE ON FUNCTION refresh_popular_tags() TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_sessions() TO authenticated;