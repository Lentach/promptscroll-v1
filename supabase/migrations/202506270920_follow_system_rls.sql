-- PromptScroll migration: RLS policies for follow system
-- 2025-06-27 09:20

-- Ensure RLS enabled (already in previous migrations but idempotent)
alter table follows enable row level security;

-- Drop existing policies if run multiple times
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE polrelid = 'follows'::regclass AND polname = 'follows_select_all') THEN
    DROP POLICY follows_select_all ON follows;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE polrelid = 'follows'::regclass AND polname = 'follows_insert_own') THEN
    DROP POLICY follows_insert_own ON follows;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE polrelid = 'follows'::regclass AND polname = 'follows_delete_own') THEN
    DROP POLICY follows_delete_own ON follows;
  END IF;
END $$;

-- Public read policy (everyone can see follower relationships)
create policy follows_select_all
  on follows
  for select
  using (true);

-- Allow authenticated users to follow others (insert row where follower_id = auth.uid())
create policy follows_insert_own
  on follows
  for insert
  with check (follower_id = auth.uid());

-- Allow authenticated users to unfollow (delete) where they're follower_id
create policy follows_delete_own
  on follows
  for delete
  using (follower_id = auth.uid()); 