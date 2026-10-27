<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Design system rules

- Before creating or changing UI, read `docs/design-system/README.md` and `docs/design-system/COMPONENT_STATUS.md`.
- Use existing components (`src/components/ui`, `src/components/ds`) first. If none fits, propose a new one and write its doc (`docs/design-system/components/<name>.md`) before using it.
- Never hard-code colours, radii, shadows or font sizes (no hex, no `rounded-[..px]`, no `text-[..px]`). Use the token classes (`bg-surface-glass`, `text-secondary`, `rounded-card`, `shadow-card`, `text-label` …) or semantic CSS variables. Never reference primitive tokens (`--neutral-*`, `--lime-*`, …) in components.
- Every new component ships with its doc file and a row in `COMPONENT_STATUS.md`, and a line in `docs/design-system/CHANGELOG.md`.
- Lime is the only accent. Text on lime is always near-black. At most one glow button per screen.
- Glass surfaces need the gradient canvas behind them; otherwise use `Card variant="solid"`.
- Red is for form errors only.
- Use `cn()` from `@/lib/utils`. New custom font-size/radius/shadow names must be registered in its `extendTailwindMerge` config.
- After changing token files, run `npm run tokens:export` for the Figma plugin.
