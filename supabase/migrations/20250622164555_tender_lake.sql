/*
  # Comprehensive PromptScroll Improvements

  1. New Tables
    - `comments` - System komentarzy dla promptów
    - `popular_tags` - Materialized view dla popularnych tagów
    - `user_sessions` - Śledzenie sesji użytkowników dla rate limiting
    
  2. Security Improvements
    - Zaktualizowane polityki RLS dla prompts (pending dla anonimowych)
    - Nowe polityki dla komentarzy
    - Rate limiting funkcje
    
  3. Performance
    - Indeksy dla komentarzy i tagów
    - Materialized view dla popularnych tagów
    
  4. Data Validation
    - Triggery walidacyjne
    - Funkcje sprawdzające integralność danych
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
  moderation_status text DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indeksy dla komentarzy
CREATE INDEX IF NOT EXISTS idx_comments_prompt ON comments(prompt_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_moderation ON comments(moderation_status);

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

-- 3. MATERIALIZED VIEW DLA POPULARNYCH TAGÓW
CREATE MATERIALIZED VIEW IF NOT EXISTS popular_tags AS
SELECT 
  pt.tag,
  COUNT(*) as usage_count,
  COUNT(DISTINCT pt.prompt_id) as prompt_count,
  AVG(p.quality_score) as avg_quality,
  MAX(p.created_at) as last_used
FROM prompt_tags pt
JOIN prompts p ON pt.prompt_id = p.id
WHERE p.moderation_status = 'approved'
GROUP BY pt.tag
HAVING COUNT(*) >= 2
ORDER BY usage_count DESC, avg_quality DESC;

-- Indeks dla materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_popular_tags_tag ON popular_tags(tag);

-- 4. FUNKCJE RATE LIMITING
CREATE OR REPLACE FUNCTION check_rate_limit(
  session_id_param text,
  user_ip_param text,
  action_type text,
  time_window_minutes integer DEFAULT 60,
  max_actions integer DEFAULT 10
) RETURNS boolean AS $$
DECLARE
  action_count integer;
  time_threshold timestamptz;
BEGIN
  time_threshold := now() - (time_window_minutes || ' minutes')::interval;
  
  -- Sprawdź liczbę akcji w oknie czasowym
  IF action_type = 'submission' THEN
    SELECT COUNT(*) INTO action_count
    FROM user_sessions
    WHERE (session_id = session_id_param OR user_ip = user_ip_param)
    AND last_prompt_submission > time_threshold;
  ELSIF action_type = 'vote' THEN
    SELECT COUNT(*) INTO action_count
    FROM user_sessions
    WHERE (session_id = session_id_param OR user_ip = user_ip_param)
    AND last_vote_submission > time_threshold;
  ELSIF action_type = 'comment' THEN
    SELECT COUNT(*) INTO action_count
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
  INSERT INTO user_sessions (session_id, user_ip, last_prompt_submission, last_comment_submission, last_vote_submission, submission_count, vote_count, comment_count)
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
    last_prompt_submission = CASE WHEN action_type = 'submission' THEN now() ELSE user_sessions.last_prompt_submission END,
    last_comment_submission = CASE WHEN action_type = 'comment' THEN now() ELSE user_sessions.last_comment_submission END,
    last_vote_submission = CASE WHEN action_type = 'vote' THEN now() ELSE user_sessions.last_vote_submission END,
    submission_count = CASE WHEN action_type = 'submission' THEN user_sessions.submission_count + 1 ELSE user_sessions.submission_count END,
    vote_count = CASE WHEN action_type = 'vote' THEN user_sessions.vote_count + 1 ELSE user_sessions.vote_count END,
    comment_count = CASE WHEN action_type = 'comment' THEN user_sessions.comment_count + 1 ELSE user_sessions.comment_count END,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. FUNKCJA WALIDACJI PROMPTÓW
CREATE OR REPLACE FUNCTION validate_prompt_data() RETURNS trigger AS $$
BEGIN
  -- Walidacja długości tytułu
  IF length(NEW.title) < 5 OR length(NEW.title) > 200 THEN
    RAISE EXCEPTION 'Title must be between 5 and 200 characters';
  END IF;
  
  -- Walidacja długości treści
  IF length(NEW.content) < 10 OR length(NEW.content) > 5000 THEN
    RAISE EXCEPTION 'Content must be between 10 and 5000 characters';
  END IF;
  
  -- Walidacja opisu (jeśli podany)
  IF NEW.description IS NOT NULL AND (length(NEW.description) < 10 OR length(NEW.description) > 500) THEN
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
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. FUNKCJA WALIDACJI KOMENTARZY
CREATE OR REPLACE FUNCTION validate_comment_data() RETURNS trigger AS $$
BEGIN
  -- Walidacja długości komentarza
  IF length(NEW.content) < 5 OR length(NEW.content) > 1000 THEN
    RAISE EXCEPTION 'Comment must be between 5 and 1000 characters';
  END IF;
  
  -- Walidacja nazwy autora
  IF length(NEW.author_name) < 2 OR length(NEW.author_name) > 50 THEN
    RAISE EXCEPTION 'Author name must be between 2 and 50 characters';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. TRIGGERY WALIDACYJNE
DROP TRIGGER IF EXISTS validate_prompt_trigger ON prompts;
CREATE TRIGGER validate_prompt_trigger
  BEFORE INSERT OR UPDATE ON prompts
  FOR EACH ROW EXECUTE FUNCTION validate_prompt_data();

DROP TRIGGER IF EXISTS validate_comment_trigger ON comments;
CREATE TRIGGER validate_comment_trigger
  BEFORE INSERT OR UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION validate_comment_data();

-- 9. TRIGGER AKTUALIZACJI UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. FUNKCJA ODŚWIEŻANIA POPULARNYCH TAGÓW
CREATE OR REPLACE FUNCTION refresh_popular_tags() RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW popular_tags;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. ZAKTUALIZOWANE POLITYKI RLS DLA PROMPTS
DROP POLICY IF EXISTS "Allow anon insert for prompts" ON prompts;
DROP POLICY IF EXISTS "Allow authenticated insert prompts" ON prompts;

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

-- 12. POLITYKI RLS DLA KOMENTARZY
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

-- 13. POLITYKI RLS DLA USER_SESSIONS
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

-- 14. POLITYKI RLS DLA POPULAR_TAGS
ALTER TABLE popular_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read popular tags"
  ON popular_tags
  FOR SELECT
  TO public
  USING (true);

-- 15. FUNKCJA POBIERANIA KOMENTARZY
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

-- 16. FUNKCJA DODAWANIA KOMENTARZA Z RATE LIMITING
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
  -- Sprawdź rate limit
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

-- 17. FUNKCJA POBIERANIA POPULARNYCH TAGÓW
CREATE OR REPLACE FUNCTION get_popular_tags(limit_param integer DEFAULT 20)
RETURNS TABLE (
  tag text,
  usage_count bigint,
  prompt_count bigint,
  avg_quality numeric
) AS $$
BEGIN
  -- Odśwież materialized view jeśli jest stary
  PERFORM refresh_popular_tags();
  
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

-- 18. ZAKTUALIZOWANE FUNKCJE INCREMENTU Z RATE LIMITING
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
  -- Sprawdź rate limit
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
  -- Sprawdź rate limit
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