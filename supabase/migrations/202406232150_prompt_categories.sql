-- PromptScroll migration: prompt_categories join table
-- 2024-06-23 21:50

-- 1. Create join table if it doesn't exist
create table if not exists prompt_categories (
  prompt_id   uuid references prompts(id) on delete cascade,
  category_id uuid references categories(id) on delete cascade,
  primary key (prompt_id, category_id)
);

-- 2. Migrate existing single-category data from prompts table
insert into prompt_categories (prompt_id, category_id)
select id, category_id
from prompts
where category_id is not null
on conflict do nothing;

-- 3. Enable Row Level Security and allow public read/insert
alter table prompt_categories enable row level security;

-- delete old policies if exist (idempotent)
do $$
begin
  if exists (select 1 from pg_policies where polrelid = 'prompt_categories'::regclass and polname = 'prompt_categories_select') then
    drop policy prompt_categories_select on prompt_categories;
  end if;
  if exists (select 1 from pg_policies where polrelid = 'prompt_categories'::regclass and polname = 'prompt_categories_insert') then
    drop policy prompt_categories_insert on prompt_categories;
  end if;
end $$;

-- create policies
create policy prompt_categories_select
  on prompt_categories
  for select
  using (true);

create policy prompt_categories_insert
  on prompt_categories
  for insert
  with check (true); 