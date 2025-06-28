-- PromptScroll migration: follow counters triggers (Follow System)
-- 2025-06-27 09:10

-- 1. Function to increment counters on INSERT
create or replace function public.handle_follow_insert()
returns trigger as $$
begin
  -- increment target's followers_count
  update profiles set followers_count = coalesce(followers_count,0) + 1
  where id = new.following_id;

  -- increment actor's following_count
  update profiles set following_count = coalesce(following_count,0) + 1
  where id = new.follower_id;

  return new;
end;
$$ language plpgsql security definer;

-- 2. Function to decrement counters on DELETE
create or replace function public.handle_follow_delete()
returns trigger as $$
begin
  update profiles set followers_count = greatest(coalesce(followers_count,1) - 1, 0)
  where id = old.following_id;

  update profiles set following_count = greatest(coalesce(following_count,1) - 1, 0)
  where id = old.follower_id;

  return old;
end;
$$ language plpgsql security definer;

-- 3. Attach triggers to follows table
create trigger on_follow_insert
  after insert on follows
  for each row execute procedure public.handle_follow_insert();

create trigger on_follow_delete
  after delete on follows
  for each row execute procedure public.handle_follow_delete(); 