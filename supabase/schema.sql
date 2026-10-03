-- ============================================================================
-- UX Copy Tool — Phase 1 database schema
-- Run this once in Supabase SQL Editor (Project -> SQL Editor -> New query)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- profiles: one row per authenticated user, mirrors auth.users
-- ----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Automatically create a profile row whenever a new user signs up
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- projects: a brand's project, owned by the user who created it
-- ----------------------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,

  -- Brand guidelines fields
  voice text,           -- e.g. "Friendly, confident, concise"
  tone text,            -- e.g. "Warm but professional"
  dos text,              -- freeform list of things to do
  donts text,            -- freeform list of things to avoid
  terminology text,      -- preferred terms / words to avoid

  -- Project-scoped copy flow context
  brand_name text,
  target_audience text,
  narrative_stance text,
  channel text,
  primary_goal text,
  constraints text,
  writer_id text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "Users can view their own projects"
  on public.projects for select
  using (auth.uid() = created_by);

create policy "Users can insert their own projects"
  on public.projects for insert
  with check (auth.uid() = created_by);

create policy "Users can update their own projects"
  on public.projects for update
  using (auth.uid() = created_by);

create policy "Users can delete their own projects"
  on public.projects for delete
  using (auth.uid() = created_by);

-- ----------------------------------------------------------------------------
-- personas: target user personas belonging to a project
-- ----------------------------------------------------------------------------
create table public.personas (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  description text,
  goals text,
  pain_points text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.personas enable row level security;

-- Personas are accessed through their parent project's ownership
create policy "Users can view personas of their own projects"
  on public.personas for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = personas.project_id
      and projects.created_by = auth.uid()
    )
  );

create policy "Users can insert personas into their own projects"
  on public.personas for insert
  with check (
    exists (
      select 1 from public.projects
      where projects.id = personas.project_id
      and projects.created_by = auth.uid()
    )
  );

create policy "Users can update personas of their own projects"
  on public.personas for update
  using (
    exists (
      select 1 from public.projects
      where projects.id = personas.project_id
      and projects.created_by = auth.uid()
    )
  );

create policy "Users can delete personas of their own projects"
  on public.personas for delete
  using (
    exists (
      select 1 from public.projects
      where projects.id = personas.project_id
      and projects.created_by = auth.uid()
    )
  );

-- ----------------------------------------------------------------------------
-- user_api_keys: each user's encrypted Anthropic API key
-- ----------------------------------------------------------------------------
create table public.user_api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'anthropic',
  encrypted_key text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider)
);

alter table public.user_api_keys enable row level security;

create policy "Users can view their own api keys"
  on public.user_api_keys for select
  using (auth.uid() = user_id);

create policy "Users can insert their own api keys"
  on public.user_api_keys for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own api keys"
  on public.user_api_keys for update
  using (auth.uid() = user_id);

create policy "Users can delete their own api keys"
  on public.user_api_keys for delete
  using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- analysis_history: (optional, for later phases) log of past copy analyses
-- ----------------------------------------------------------------------------
create table public.analysis_history (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  input_text text,
  output_text text,
  created_at timestamptz not null default now()
);

alter table public.analysis_history enable row level security;

create policy "Users can view analysis history of their own projects"
  on public.analysis_history for select
  using (auth.uid() = created_by);

create policy "Users can insert analysis history for their own projects"
  on public.analysis_history for insert
  with check (auth.uid() = created_by);

-- ----------------------------------------------------------------------------
-- Keep updated_at fresh automatically
-- ----------------------------------------------------------------------------
create function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.projects
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.personas
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.user_api_keys
  for each row execute function public.handle_updated_at();
