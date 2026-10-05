-- Run once in Supabase SQL Editor. Wipes all app data, keeps auth.users (accounts),
-- then rebuilds the schema below. Replaces the earlier add_project_flow_fields/reset migrations.
drop trigger if exists on_auth_user_created on auth.users;
drop table if exists public.analysis_history, public.user_api_keys, public.personas,
  public.projects, public.profiles cascade;
drop function if exists public.handle_new_user();
drop function if exists public.handle_updated_at();
drop function if exists public.set_updated_at();

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,

  -- Step 1: create project
  name text not null check (length(btrim(name)) > 0),
  description text,

  -- Step 2: brand details (free text; keyword lists are comma/newline separated)
  brand_name text,
  target_audience text,
  brand_voice_keywords text,
  key_terminology text,
  words_to_avoid text,
  narrative_stance text check (narrative_stance in ('we', 'i', 'none')),
  details_saved_at timestamptz, -- set on first save of step 2; gates the Figma step

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_user_id_idx on public.projects (user_id, created_at desc);

create function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

alter table public.projects enable row level security;

create policy "owner reads" on public.projects
  for select using (user_id = (select auth.uid()));
create policy "owner inserts" on public.projects
  for insert with check (user_id = (select auth.uid()));
create policy "owner updates" on public.projects
  for update using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy "owner deletes" on public.projects
  for delete using (user_id = (select auth.uid()));
