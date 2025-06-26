-- Add author_id column to prompts to reference profile
alter table if exists public.prompts
  add column if not exists author_id uuid references public.profiles(id) on delete set null;

-- Index for efficient joins
create index if not exists prompts_author_id_idx on public.prompts(author_id);

-- Enable RLS if not already enabled (idempotent)
alter table public.prompts enable row level security;

-- Allow insert/select for all roles (demo)
do $$
begin
  if not exists (select 1 from pg_policy where polrelid = 'public.prompts'::regclass and polname = 'prompt_select_all') then
    create policy prompt_select_all on public.prompts for select using (true);
  end if;
  if not exists (select 1 from pg_policy where polrelid = 'public.prompts'::regclass and polname = 'prompt_insert_all') then
    create policy prompt_insert_all on public.prompts for insert with check (true);
  end if;
end $$; 