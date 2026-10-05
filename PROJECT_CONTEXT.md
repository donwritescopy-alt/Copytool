# UX Copy Tool — project context for an AI coding agent

This document describes the repository as it exists in the current checkout. Treat observations about runtime behavior as code-derived unless separately confirmed against the deployed Supabase project or other external systems. Do not assume that product copy describes integrations that are not implemented here.

## 1. Project brief

UX Copy Tool is a small web application for users to create product projects and record brand writing guidelines and audience personas. The intended broader product, as suggested by the landing page, is to provide brand-grounded UX copy through a Figma plugin. The current repository implements account entry, project CRUD beginnings, brand guideline editing, and persona create/read/update/delete UI/actions. It contains no copy-generation flow, no Gemini call, and no Figma plugin code.

Main user path:

1. Visit `/` and choose Get started or Log in.
2. Sign in with password, create an account, or request a magic link at `/login`.
3. The authenticated user visits `/dashboard`, which lists projects visible through Supabase policies.
4. Create a project with a required name and optional description.
5. On `/dashboard/projects/[id]`, edit voice, tone, do's, don'ts, terminology, and personas (name, description, goals, pain points).

The app uses Next.js App Router server components for data reads, Server Actions for form mutations, and Supabase Auth cookies for sessions. There are no API route handlers in the current source tree.

## 2. Stack and conventions

- **Runtime/framework:** Next.js `16.3.7`, React and React DOM `19.2.8`, TypeScript `^5` (versions/ranges declared in `package.json`; npm lockfile is version 3).
- **Database/auth:** Supabase Postgres and Supabase Auth, accessed through `@supabase/supabase-js` and `@supabase/ssr`. The app uses the public/anon key in server and browser client factories; authorization of database rows therefore depends on correct Supabase Row Level Security (RLS) policies.
- **UI/styling:** Tailwind CSS 4 through `@tailwindcss/postcss`; shadcn registry/config conventions (`components.json`, style `base-nova`); Base UI React primitives; CVA variants; `cn` class utility; Lucide is configured as icon library, though current app code has no Lucide imports.
- **Fonts:** `Geist` and `Geist_Mono` via `next/font/google` in the root layout.
- **Lint:** ESLint 9, Next core-web-vitals and TypeScript presets.
- **Build/dev:** npm scripts are `dev`, `build`, `start`, and `lint`. No test script/framework is configured in `package.json`.
- **Path alias:** `@/*` maps to `src/*` in `tsconfig.json`.
- **Rendering:** Most route pages/layouts are server components by default. Login, new-project, persona section, and brand-guidelines form use client hooks. Mutations live in files marked `"use server"`.

The root `AGENTS.md` contains an explicit warning that this repository uses a breaking/new Next.js version: before changing Next-specific code, an agent must read the relevant guide shipped under `node_modules/next/dist/docs/` from this checkout and follow its deprecation notes. `CLAUDE.md` simply includes `AGENTS.md`.

## 3. Repository structure and file-by-file guide

### Root configuration and docs

- `AGENTS.md` — repository-specific coding instruction, especially the requirement to consult the installed Next docs before changing code.
- `CLAUDE.md` — delegates instructions to `AGENTS.md` via `@AGENTS.md`.
- `README.md` — still the default create-next-app README; it documents generic Next startup/deploy links and does not explain the product, schema, or integrations.
- `PROJECT_CONTEXT.md` — this handoff document.
- `package.json` — project identity (`ux-copy-tool`, private, `0.1.0`), scripts, dependency declarations.
- `package-lock.json` — npm lockfile v3 with the resolved dependency graph; use it with `npm ci` for reproducible installation. It is intentionally not expanded dependency-by-dependency here.
- `tsconfig.json` — strict TypeScript, no emit, bundler resolution, React JSX, Next plugin, `@/*` source alias.
- `next.config.ts` — currently empty/default Next config.
- `postcss.config.mjs` — enables Tailwind's PostCSS plugin.
- `eslint.config.mjs` — Next core web vitals and TypeScript presets; ignores generated Next/build output.
- `components.json` — shadcn config: `base-nova`, RSC and TSX, Tailwind CSS at `src/app/globals.css`, Lucide icon-library setting, aliases.
- `.gitignore` — ignores dependencies, Next/build output, env files, logs, Vercel metadata, and TypeScript build artifacts.

### App routes (`src/app`)

- `src/app/layout.tsx` — root HTML/body layout; loads Geist fonts, imports global CSS, sets UX Copy Tool title and description.
- `src/app/globals.css` — imports Tailwind, tw-animate-css, shadcn Tailwind styles; maps design tokens to CSS variables and defines light/dark palettes and base styles.
- `src/app/page.tsx` — public landing page with product positioning and links to `/login`; its Figma-plugin claim is aspirational relative to the checked-in code.
- `src/app/favicon.ico` — app favicon binary.
- `src/app/login/page.tsx` — client login UI with three modes (password login, account creation, magic link), form pending/error/message states, and mode-switch buttons.
- `src/app/login/actions.ts` — server actions for Supabase password sign-in, sign-up, OTP/magic-link email, and sign-out. Signup asks the user to check email; magic link constructs a redirect from `NEXT_PUBLIC_SITE_URL`.
- `src/app/dashboard/layout.tsx` — authenticated-area header, user email (loaded asynchronously under Suspense), logout form, and dashboard content wrapper.
- `src/app/dashboard/loading.tsx` — dashboard route loading status.
- `src/app/dashboard/page.tsx` — server-side project list, newest first, empty state and links to create/open projects. Query errors are not surfaced separately from an empty list.
- `src/app/dashboard/projects/actions.ts` — `createProject` validates name, reads current user, inserts project and redirects to detail; `updateBrandGuidelines` updates five writing-guideline columns and revalidates project page.
- `src/app/dashboard/projects/new/page.tsx` — client form for project name and description.
- `src/app/dashboard/projects/[id]/page.tsx` — async server page that loads a project and its personas concurrently, calls `notFound()` when no project is returned, and renders brand guideline/persona areas.
- `src/app/dashboard/projects/[id]/loading.tsx` — project detail skeleton.
- `src/app/dashboard/projects/[id]/brand-guidelines-form.tsx` — client form for voice, tone, do's, don'ts, terminology, wired to `updateBrandGuidelines`.
- `src/app/dashboard/projects/[id]/personas-section.tsx` — client UI for listing persona cards, inline edit/cancel, delete, and adding a persona; uses `useActionState` for create/update pending/error state.
- `src/app/dashboard/projects/[id]/personas/actions.ts` — server actions to create, update and delete persona rows, then revalidate the project detail route. Create/update require a nonblank name.

### Shared components and libraries

- `src/components/ui/button.tsx` — Base UI button primitive styled with CVA variants and sizes.
- `src/components/ui/card.tsx` — composable card/header/title/description/action/content/footer wrappers.
- `src/components/ui/input.tsx` — Base UI input primitive with shared Tailwind styling.
- `src/components/ui/label.tsx` — styled native label component.
- `src/components/ui/textarea.tsx` — styled native textarea component.
- `src/lib/utils.ts` — re-exports `cn` from the installed `cn` package for class composition (component files also directly import `cn`).
- `src/lib/types.ts` — handwritten `Project` and `Persona` types; these are not generated from the Supabase schema.
- `src/lib/supabase/server.ts` — server client factory. Awaits Next `cookies()`, reads/writes Supabase auth cookies, tolerating cookie write failures in Server Components because session refresh is handled by the proxy.
- `src/lib/supabase/client.ts` — browser client factory using the public Supabase URL and anon key. No current source module imports this factory.
- `src/lib/encryption.ts` — Node crypto AES-256-GCM encrypt/decrypt helper. Reads a 64-character hex `API_KEY_ENCRYPTION_SECRET`, generates a random 12-byte IV, and serializes `iv:authTag:ciphertext` as hex. No current source module imports it; no API-key persistence/use flow is implemented.
- `src/proxy.ts` — Supabase SSR session refresh for all paths excluding Next static/image assets and favicon. Redirects unauthenticated `/dashboard...` requests to `/login`, and authenticated `/login` or `/signup` requests to `/dashboard`. This is route gating; database row authorization still depends on RLS.

### Supabase and public assets

- `supabase/schema.sql` — currently only comments; it does not create tables, functions, triggers, grants, or RLS policies.
- `supabase/migrations/20261003000000_add_project_flow_fields.sql` — adds `brand_name`, `target_audience`, `narrative_stance`, `channel`, `primary_goal`, `constraints`, and `writer_id` columns to an assumed existing `public.projects` table.
- `supabase/migrations/20261004000000_reset_everything.sql` — destructive reset script that drops the phase-one trigger, selected tables (`analysis_history`, `user_api_keys`, `personas`, `projects`, `profiles`) and two functions. Its comments say to run once manually in the Supabase SQL Editor.
- `public/writers/val.webp` — writer/avatar artwork asset; no current source reference was found.
- `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg` — stock scaffold SVGs; no current route source reference was found.

## 4. Data model and database state

The TypeScript and query layer expect these tables/columns:

- **`projects`**: `id`, `created_by`, `name`, nullable `description`, nullable `voice`, `tone`, `dos`, `donts`, `terminology`, `created_at`, `updated_at`. Project reads use `select("*")`; create inserts `name`, `description`, `created_by`; guideline update writes the five guideline columns.
- **`personas`**: `id`, `project_id`, `name`, nullable `description`, `goals`, `pain_points`, `created_at`, `updated_at`.
- The old flow migration additionally assumes project columns for brand name, target audience, narrative stance, channel, primary goal, constraints, and writer ID. They are not represented by the current `Project` type or edited by current pages.

**Important setup gap:** the checked-in canonical `schema.sql` is blank except comments. The migration directory has one `ALTER TABLE` migration and a later reset script; neither establishes the currently required `projects` and `personas` tables. The reset migration drops those tables and has no matching create migration. Consequently a clean database created only from the current checked-in SQL will not support the running app. Confirm the actual remote Supabase schema before deploying or running the reset script; do not run the reset casually because it deletes data.

The code uses the anon key and relies on RLS to scope projects/personas. The repository does not define or document RLS policies, foreign keys, indexes, constraints, timestamp triggers, or schema types. The proxy checks whether a user is signed in, but is not a substitute for per-row authorization. Several update/delete actions filter by row ID without independently checking ownership; security must be validated against the actual RLS policy configuration. `createProject` explicitly checks the current user, while persona and guideline actions rely on Supabase policies to reject unauthorized writes.

## 5. Environment variables, services, and account clues

`.env.local` exists locally and is ignored by git. **Never copy its values into prompts, docs, commits, logs, or generated context.** The variable names present are:

| Variable | How it is used | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase server/browser clients and `src/proxy.ts` | Publicly exposed project endpoint by naming convention. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase server/browser clients and proxy | Public/anon key; database safety must come from RLS. |
| `NEXT_PUBLIC_SITE_URL` | Magic-link email redirect in login action | Must match a redirect URL permitted in Supabase Auth settings. |
| `SUPABASE_SERVICE_ROLE_KEY` | Present in local env only | No source reference found. Keep server-only; never expose to browser/client. |
| `API_KEY_ENCRYPTION_SECRET` | `src/lib/encryption.ts` only | Requires exactly 64 hex chars. Helper currently has no call site. |

Services/account evidence in the repo:

- **Supabase account/project:** clearly required by runtime configuration for database and Auth; local env contains project credentials, but this report intentionally does not reveal values or infer an account owner/provider dashboard configuration. Auth supports password sign-in, signup, and email OTP/magic link.
- **GitHub:** git remote is `origin` pointing to `https://github.com/donwritescopy-alt/Copytool`, current branch `main`. This identifies repository hosting, not which personal account is currently logged in or who controls deployment.
- **Vercel:** referenced only by the stock README and `.gitignore`; no deployment settings or Vercel integration code is present.
- **Google Gemini:** `@google/genai` is declared as a dependency, but no import, client, API-key variable, model call, or generation action exists in source. Treat as unused/planned until implementation is added.
- **Figma:** named in landing page marketing text, but there is no plugin manifest, plugin source, Figma API client, or plugin build config in the repository.
- **Supabase service role:** a secret is present in `.env.local` but unused by searched source. Prefer the anon key plus RLS unless a well-justified server-only administrative workflow is introduced.

## 6. Important behavior, risks, and open questions

1. **Database schema is not reproducible from repo.** Recover or author a safe canonical schema with RLS and migration history after inspecting the actual Supabase database. Verify the apparent reset migration history before applying anything.
2. **Verify row-level authorization.** Ensure users can only read/write their own projects and personas belonging to those projects. Current code does not consistently perform ownership checks before mutations and uses client-supplied project/persona IDs.
3. **The advertised product is ahead of implementation.** No UX-copy generation, Gemini integration, user API-key UI/storage, analysis history UI, or Figma extension is present. `GoogleGenAI`, encryption helper, and migration-era fields suggest planned/previous functionality only.
4. **Error handling is uneven.** Project/persona form actions return Supabase's raw error message to UI. Dashboard query errors are treated like empty data; project detail checks only whether project data exists; persona delete ignores error. Consider user-safe messages and logging.
5. **Input normalization/validation is minimal.** Only project/persona names are checked for nonblank strings. Optional form values are cast to strings and sent to Postgres. Add server-side validation if more complex data or model prompts are added.
6. **Magic-link redirects depend on deployment config.** `NEXT_PUBLIC_SITE_URL` must be defined correctly and Supabase Auth must allow that redirect.
7. **Potential build-time dependency on Google Fonts.** Root layout fetches fonts via `next/font/google`; deployments/builds need access or a strategy for offline/self-hosted builds.
8. **No tests or product documentation.** README remains boilerplate and there is no test suite, CI workflow, `.vscode/extensions.json`, or editor setup visible in tracked files.

## 7. Suggested next work for a separate agent

1. Inspect Supabase SQL Editor/project state read-only first. Record current schema, RLS policies, Auth providers, redirect allow-list, triggers, and migration history without exposing secret keys.
2. Reconcile the live schema with `Project`, `Persona`, and query/action code. Create a migration-based source of truth with ownership policies and foreign keys only after preserving existing data.
3. Decide whether Gemini, user-provided API keys, copy history, writer personas, and Figma are in the current product scope. Remove unused dependencies/variables or implement the feature end-to-end consistently.
4. Add clear setup docs: Node/npm requirements, install/dev/build/lint commands, required env variable names (never values), Supabase setup, redirect URLs, and database bootstrap instructions.
5. Add durable generated Supabase database types and use them instead of handwritten broad row types once schema is stable.
6. Add tests for auth redirects, project/persona ownership, CRUD actions, validation, and schema migrations when requested by the project owner.

## 8. Quick start (based on current package scripts)

```sh
npm ci
npm run dev
```

Local dev expects the five environment variables above as present in the current local environment; deployments need the applicable values in their secret manager. `npm run build`, `npm start`, and `npm run lint` are defined. Database readiness is a separate prerequisite and is not achieved by the current `supabase/schema.sql`.

## 9. Scope of inspection

This description is based on tracked source/config/docs plus the presence and names (not values) of `.env.local` variables. Generated `.next` output, local dependency contents, the contents of the remote GitHub repository, live Supabase state/policies, provider dashboards, and untracked external Figma/Vercel projects were not treated as source-of-truth for application features.
