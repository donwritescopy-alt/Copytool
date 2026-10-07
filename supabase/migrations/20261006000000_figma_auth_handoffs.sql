-- Run once in Supabase SQL Editor.
-- Short-lived, single-use parking spot for the Figma plugin login handoff.
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
