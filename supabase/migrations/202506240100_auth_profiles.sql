-- Create profiles table linked to auth.users
create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    display_name text not null,
    avatar_url text,
    is_admin boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Updated timestamp trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

-- Enable RLS
alter table public.profiles enable row level security;

-- Policy: allow authenticated user to select/update own profile
create policy "Self profile access" on public.profiles
  for select using ( auth.uid() = id )
  with check ( auth.uid() = id );

create policy "Self profile update" on public.profiles
  for update using ( auth.uid() = id )
  with check ( auth.uid() = id );

-- Policy: allow admins to select all profiles
create policy "Admin read all" on public.profiles
  for select using (
    exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.is_admin
    )
  );

-- Public read of display_name & avatar only
create or replace view public.public_profiles as
select id, display_name, avatar_url from public.profiles;

grant select on public.public_profiles to anon, authenticated; 