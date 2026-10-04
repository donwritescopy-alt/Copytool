-- Full reset: drop every table, trigger, and function from Phase 1.
-- Run this once in Supabase SQL Editor (Project -> SQL Editor -> New query)
-- to wipe the project back to a blank Postgres database before rebuilding
-- the schema from scratch.

drop trigger if exists on_auth_user_created on auth.users;

drop table if exists public.analysis_history;
drop table if exists public.user_api_keys;
drop table if exists public.personas;
drop table if exists public.projects;
drop table if exists public.profiles;

drop function if exists public.handle_new_user();
drop function if exists public.handle_updated_at();
