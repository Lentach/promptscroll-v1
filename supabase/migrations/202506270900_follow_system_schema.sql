-- PromptScroll migration: follows table and profile counters (Follow System)
-- 2025-06-27 09:00

-- 1. Create follows table to map follower→following relationships
create table if not exists follows (
  follower_id  uuid not null references profiles(id) on delete cascade,
  following_id uuid not null references profiles(id) on delete cascade,
  created_at   timestamp with time zone default timezone('utc', now()),
  primary key (follower_id, following_id)
);

-- 2. Index to speed up "followers of X" queries
create index if not exists idx_follows_following_id on follows (following_id);

-- 3. Denormalised counters on profiles for fast lookup
alter table profiles
  add column if not exists followers_count integer not null default 0,
  add column if not exists following_count integer not null default 0;

-- Note: Trigger functions to maintain counters will be added in a subsequent migration (FS2).

-- 4. Ensure RLS is enabled (policies added in FS3)
alter table follows enable row level security; 