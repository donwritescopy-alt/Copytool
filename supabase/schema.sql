-- ============================================================================
-- UX Copy Tool — database schema (source of truth)
-- Accounts live in Supabase Auth (auth.users). The app owns one table.
-- ============================================================================

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

-- ---------------------------------------------------------------------------
-- figma_auth_handoffs: Figma plugin web-bridge login (see migrations)
-- ---------------------------------------------------------------------------
-- The browser (signed-in user) inserts an encrypted session under a hash of
-- the plugin's random `state`; the plugin (no login yet) claims it exactly
-- once through claim_figma_handoff().

create table public.figma_auth_handoffs (
  state_hash text primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  tokens_encrypted text not null,
  expires_at timestamptz not null default now() + interval '5 minutes'
);

alter table public.figma_auth_handoffs enable row level security;

-- Signed-in users may only insert rows for themselves. There is deliberately
-- no select/update/delete policy: nobody can read the table directly.
create policy "owner inserts" on public.figma_auth_handoffs
  for insert to authenticated
  with check (user_id = (select auth.uid()));

-- Returns the encrypted session for a state hash and deletes it (single use).
-- Returns null while the user hasn't approved yet, or once expired.
create function public.claim_figma_handoff(p_state_hash text) returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  result text;
begin
  delete from public.figma_auth_handoffs where expires_at < now();

  delete from public.figma_auth_handoffs
  where state_hash = p_state_hash
  returning tokens_encrypted into result;

  return result;
end;
$$;

revoke all on function public.claim_figma_handoff(text) from public;
grant execute on function public.claim_figma_handoff(text) to anon, authenticated;
