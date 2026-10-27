# Design system

Start here before building any UI. Then check [COMPONENT_STATUS.md](COMPONENT_STATUS.md) to see what already exists.

## Look and feel

Soft, calm, rounded. Things you click are pills; boxes and fields have gentler corners (cards 24px, fields 12px). Frosted-glass cards float on a light grey gradient with faint lime and sage tints. A single lime accent marks the most important thing. Lots of whitespace, no heavy borders. Reference images live in [inspiration/](inspiration/).

## Principles

1. **One accent.** Lime (`--accent`) is the only accent colour. Text on lime is always near-black (`--text-on-accent`), never white.
2. **One hero action per screen.** At most one `Button variant="glow"` (or `DockAction`) per screen.
3. **Glass needs a canvas.** Glass surfaces only look right over the gradient canvas (`bg-gradient-canvas`, already on `<body>`). On a flat background use `Card variant="solid"`.
4. **Red means a form error.** `--danger` / `--danger-text` are only for validation and failed submissions. Destructive actions use normal buttons plus a confirmation step.
5. **Tokens only.** Never hard-code colours, radii, shadows or font sizes. Use the Tailwind classes generated from tokens (`bg-surface-glass`, `text-secondary`, `rounded-card`, `shadow-card`, `text-label` …).
6. **Accessible by default.** Text contrast ≥ 4.5:1. Every interactive element has a visible focus ring (near-black, or lime on dark surfaces). Glass and motion respect user preferences.

## Where things live

| What | Where |
| --- | --- |
| Tokens (plain CSS variables) | `src/styles/tokens/primitives.css` → `semantic.css` → `effects.css` (imported by `index.css`) |
| Tailwind mapping | `src/app/globals.css` (`@theme` blocks + `@utility` classes) |
| Base components | `src/components/ui/` |
| Composite patterns | `src/components/ds/` |
| Token reference | [tokens.md](tokens.md) |
| Component docs | [components/](components/) |
| Recipes | [patterns.md](patterns.md) |
| User flows | [flows/](flows/) |
| Figma plugin | [cross-platform.md](cross-platform.md) |
| History | [CHANGELOG.md](CHANGELOG.md) |

## Token layers

1. **Primitives:** raw values (`--neutral-600`, `--lime-400`, `--radius-32`). Never used in components.
2. **Semantic:** meaning (`--text-secondary`, `--accent`, `--radius-card`). This is what components use.
3. **Effects:** blur, shadows, gradients, motion (`--shadow-card`, `--gradient-card`, `--duration-fast`).

Component tokens (e.g. `--input-bg`) are added only when a component needs a value no semantic token provides.

## How to add things

**A token:** add the primitive if the raw value is new, then the semantic token that points at it. Map it in `globals.css` if it needs a Tailwind class, add a row to [tokens.md](tokens.md), log it in [CHANGELOG.md](CHANGELOG.md), and run `npm run tokens:export`.

**A component:**
1. Check [COMPONENT_STATUS.md](COMPONENT_STATUS.md). If something close exists, extend it with a variant instead.
2. Propose it first: write `components/<name>.md` (purpose, when to use / not to use, anatomy, variants, states, tokens, example, accessibility, plugin parity).
3. Build it in `src/components/ui/` (single element/primitive) or `src/components/ds/` (composition of several). Start the file with a short comment: purpose, when to use, when not to use.
4. Use `cn()` from `@/lib/utils`, `cva` for variants, and `@base-ui/react` for anything interactive that needs behaviour (popups, radio groups, etc.).
5. Add a row to [COMPONENT_STATUS.md](COMPONENT_STATUS.md) and a line to [CHANGELOG.md](CHANGELOG.md).

New custom font-size, radius or shadow names must also be registered in `extendTailwindMerge` in `src/lib/utils.ts`, or `cn()` may drop classes.

## Libraries

Tailwind v4, `@base-ui/react`, `class-variance-authority`, `clsx` + `tailwind-merge`, `lucide-react`, Geist via `next/font`. Don't add animation libraries, Storybook, other component libraries or CSS-in-JS without discussing it first.
