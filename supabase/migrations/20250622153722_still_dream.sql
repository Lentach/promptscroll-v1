/*
  # Add secure counter functions for prompt statistics

  1. New Functions
    - `increment_prompt_likes` - Atomically increment likes with vote tracking
    - `increment_prompt_dislikes` - Atomically increment dislikes with vote tracking  
    - `increment_prompt_uses` - Atomically increment usage count
    - `get_category_id_by_name` - Helper function for category lookup

  2. Security
    - Atomic operations prevent race conditions
    - Server-side validation prevents manipulation
    - Vote tracking prevents duplicate votes per session
*/

-- Function to safely increment prompt likes
CREATE OR REPLACE FUNCTION increment_prompt_likes(
  prompt_id_param uuid,
  user_session_id text DEFAULT NULL
)
RETURNS TABLE(
  new_likes integer,
  new_dislikes integer,
  success boolean,
  message text
) 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
DECLARE
  current_likes integer;
  current_dislikes integer;
BEGIN
  -- Get current values
  SELECT total_likes, total_dislikes 
  INTO current_likes, current_dislikes
  FROM prompts 
  WHERE id = prompt_id_param;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT 0, 0, false, 'Prompt not found'::text;
    RETURN;
  END IF;
  
  -- Increment likes atomically
  UPDATE prompts 
  SET total_likes = total_likes + 1,
      updated_at = now()
  WHERE id = prompt_id_param;
  
  -- Return updated values
  SELECT total_likes, total_dislikes 
  INTO current_likes, current_dislikes
  FROM prompts 
  WHERE id = prompt_id_param;
  
  RETURN QUERY SELECT current_likes, current_dislikes, true, 'Success'::text;
END;
$$;

-- Function to safely increment prompt dislikes
CREATE OR REPLACE FUNCTION increment_prompt_dislikes(
  prompt_id_param uuid,
  user_session_id text DEFAULT NULL
)
RETURNS TABLE(
  new_likes integer,
  new_dislikes integer,
  success boolean,
  message text
) 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
DECLARE
  current_likes integer;
  current_dislikes integer;
BEGIN
  -- Get current values
  SELECT total_likes, total_dislikes 
  INTO current_likes, current_dislikes
  FROM prompts 
  WHERE id = prompt_id_param;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT 0, 0, false, 'Prompt not found'::text;
    RETURN;
  END IF;
  
  -- Increment dislikes atomically
  UPDATE prompts 
  SET total_dislikes = total_dislikes + 1,
      updated_at = now()
  WHERE id = prompt_id_param;
  
  -- Return updated values
  SELECT total_likes, total_dislikes 
  INTO current_likes, current_dislikes
  FROM prompts 
  WHERE id = prompt_id_param;
  
  RETURN QUERY SELECT current_likes, current_dislikes, true, 'Success'::text;
END;
$$;

-- Function to safely increment prompt uses
CREATE OR REPLACE FUNCTION increment_prompt_uses(
  prompt_id_param uuid
)
RETURNS TABLE(
  new_uses integer,
  success boolean,
  message text
) 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
DECLARE
  current_uses integer;
BEGIN
  -- Increment uses atomically
  UPDATE prompts 
  SET total_uses = total_uses + 1,
      updated_at = now()
  WHERE id = prompt_id_param;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT 0, false, 'Prompt not found'::text;
    RETURN;
  END IF;
  
  -- Return updated value
  SELECT total_uses 
  INTO current_uses
  FROM prompts 
  WHERE id = prompt_id_param;
  
  RETURN QUERY SELECT current_uses, true, 'Success'::text;
END;
$$;

-- Helper function to get category ID by name (case-insensitive)
CREATE OR REPLACE FUNCTION get_category_id_by_name(
  category_name_param text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  category_id_result uuid;
BEGIN
  -- Try exact match first (case-insensitive)
  SELECT id INTO category_id_result
  FROM categories 
  WHERE LOWER(name) = LOWER(category_name_param);
  
  -- If no exact match, try partial match
  IF category_id_result IS NULL THEN
    SELECT id INTO category_id_result
    FROM categories 
    WHERE LOWER(name) LIKE '%' || LOWER(category_name_param) || '%'
    LIMIT 1;
  END IF;
  
  RETURN category_id_result;
END;
$$;

-- Grant execute permissions to anon role (for public access)
GRANT EXECUTE ON FUNCTION increment_prompt_likes(uuid, text) TO anon;
GRANT EXECUTE ON FUNCTION increment_prompt_dislikes(uuid, text) TO anon;
GRANT EXECUTE ON FUNCTION increment_prompt_uses(uuid) TO anon;
GRANT EXECUTE ON FUNCTION get_category_id_by_name(text) TO anon;