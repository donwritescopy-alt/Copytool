-- Persist the project-scoped copy flow on the existing project row.
-- Existing projects remain valid and can be completed gradually.
alter table public.projects
  add column brand_name text,
  add column target_audience text,
  add column narrative_stance text,
  add column channel text,
  add column primary_goal text,
  add column constraints text,
  add column writer_id text;
