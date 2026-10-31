-- Bring-your-own Gemini API key.
-- Each user's key is stored encrypted in Supabase Vault. This table only
-- remembers WHICH vault secret belongs to the user, plus the last 4
-- characters so the Settings page can show "Saved, ends in ••••1234".
-- The full key is never stored in this table.

create table public.user_gemini_keys (
  -- One row per user. The row disappears automatically if the user is deleted.
  user_id uuid primary key references auth.users (id) on delete cascade,
  -- Points at the encrypted secret inside Supabase Vault.
  vault_secret_id uuid not null,
  key_last4 text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row-level security: turned on, so rows are invisible unless a policy allows them.
alter table public.user_gemini_keys enable row level security;

-- Take away every direct permission, then give back read-only access.
-- Nobody can insert, update or delete from the browser; only the three
-- functions below can change this table.
revoke all on table public.user_gemini_keys from anon, authenticated;
grant select on table public.user_gemini_keys to authenticated;

-- A signed-in user may read only their own row (to show the last 4 characters).
create policy "owner reads own key row" on public.user_gemini_keys
  for select to authenticated
  using (user_id = (select auth.uid()));

-- SAVE OR REPLACE the current user's key.
-- SECURITY DEFINER = runs with the database owner's rights, which is what
-- allows it to write to Vault. It always uses auth.uid() (the logged-in
-- user) and never accepts a user id, so nobody can touch another user's key.
-- `set search_path = ''` is a safety setting: every name below is fully
-- spelled out (public.xxx, vault.xxx) so it can't be tricked.
create function public.set_user_gemini_key(p_key text) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_secret_id uuid;
  v_name text;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;
  if p_key is null or length(trim(p_key)) = 0 then
    raise exception 'Key is required';
  end if;

  v_name := 'user_gemini_key:' || v_uid::text;

  select vault_secret_id into v_secret_id
  from public.user_gemini_keys
  where user_id = v_uid;

  if v_secret_id is null then
    -- First save: clear any leftover secret with our name, then create a new one.
    delete from vault.secrets where name = v_name;
    v_secret_id := vault.create_secret(p_key, v_name, 'Gemini API key');
  else
    -- Replacing: update the existing encrypted secret in place.
    perform vault.update_secret(v_secret_id, p_key);
  end if;

  insert into public.user_gemini_keys (user_id, vault_secret_id, key_last4)
  values (v_uid, v_secret_id, right(p_key, 4))
  on conflict (user_id) do update
    set vault_secret_id = excluded.vault_secret_id,
        key_last4 = excluded.key_last4,
        updated_at = now();
end;
$$;

-- GET the current user's decrypted key (or null if none is saved).
-- Used only by the server when running an audit; it is never sent to the browser.
create function public.get_user_gemini_key() returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_key text;
begin
  select ds.decrypted_secret into v_key
  from public.user_gemini_keys k
  join vault.decrypted_secrets ds on ds.id = k.vault_secret_id
  where k.user_id = auth.uid();

  return v_key;
end;
$$;

-- DELETE the current user's key: removes the encrypted secret and the row.
create function public.delete_user_gemini_key() returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  delete from vault.secrets
  where id in (select vault_secret_id from public.user_gemini_keys where user_id = v_uid);

  delete from public.user_gemini_keys where user_id = v_uid;
end;
$$;

-- Only signed-in users may call these. Logged-out visitors (anon) may not.
revoke all on function public.set_user_gemini_key(text) from public, anon;
revoke all on function public.get_user_gemini_key() from public, anon;
revoke all on function public.delete_user_gemini_key() from public, anon;
grant execute on function public.set_user_gemini_key(text) to authenticated;
grant execute on function public.get_user_gemini_key() to authenticated;
grant execute on function public.delete_user_gemini_key() to authenticated;
