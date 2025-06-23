/*
  # Add total_dislikes column to prompts table

  1. Changes
    - Add `total_dislikes` column to `prompts` table
    - Set default value to 0
    - Set as non-nullable with default

  2. Security
    - No RLS changes needed as this is just adding a column to existing table
*/

-- Add total_dislikes column to prompts table
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS total_dislikes INTEGER DEFAULT 0 NOT NULL;

-- Update any existing records to have 0 dislikes (should be automatic with DEFAULT, but being explicit)
UPDATE prompts SET total_dislikes = 0 WHERE total_dislikes IS NULL;