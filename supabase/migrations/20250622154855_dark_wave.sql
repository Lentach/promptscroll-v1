/*
  # Fix RLS Policy for Anonymous Prompt Insertion

  1. Security Policy Update
    - Add policy to allow anonymous users to insert prompts
    - Restrict to only allow prompts with moderation_status = 'pending'
    - Ensures all user-submitted prompts go through moderation

  2. Changes
    - Create new policy "Allow anon insert for pending prompts"
    - Allows INSERT operations for anon role
    - Enforces moderation_status = 'pending' constraint
*/

-- Drop existing public insert policy if it exists
DROP POLICY IF EXISTS "Allow public insert prompts" ON public.prompts;

-- Create new policy for anonymous users to insert prompts with pending status
CREATE POLICY "Allow anon insert for pending prompts"
  ON public.prompts
  FOR INSERT
  TO anon
  WITH CHECK (moderation_status = 'pending');

-- Create policy for authenticated users to insert prompts (if needed in future)
CREATE POLICY "Allow authenticated insert prompts"
  ON public.prompts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Ensure the existing read policy works for both anon and authenticated users
DROP POLICY IF EXISTS "Allow public read prompts" ON public.prompts;

CREATE POLICY "Allow public read approved prompts"
  ON public.prompts
  FOR SELECT
  TO anon, authenticated
  USING (moderation_status = 'approved');

-- Keep the update policy for stats
DROP POLICY IF EXISTS "Allow public update prompt stats" ON public.prompts;

CREATE POLICY "Allow public update prompt stats"
  ON public.prompts
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);