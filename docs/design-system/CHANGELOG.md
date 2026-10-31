# Changelog

## 0.4.0 · 2026-10-28

Plugin handoff bundle.

- New: `plugin-handoff/` folder with `plugin-ds.css`, `preview.html`, `PLUGIN_HANDOFF.md`, and `inspiration/`.
- `plugin-ds.css` is a single self-contained file: all tokens resolved to plain values, base styles scoped under `.ds-root`, component classes (`.ds-btn`, `.ds-iconbtn`, `.ds-chip`, `.ds-card`, `.ds-input`, `.ds-textarea`, `.ds-label`, `.ds-select`, `.ds-segmented`, `.ds-row`, `.ds-statrow`, `.ds-status-strip`, `.ds-message`), compact density (`.ds-compact`), and accessibility fallbacks.
- New script: `npm run plugin:handoff` (`scripts/build-plugin-handoff.mjs`).
- Plugin impact: 14 components marked "handoff ready" in COMPONENT_STATUS.md.
- Updated `cross-platform.md` with the full update routine.

## 0.3.0 · 2026-10-27

- Less rounding: cards 32→24px, panels 24→16px, inner 16→12px, tight 12→8px. Added `--radius-8` and `--radius-field` (12px).
- Rule: things you click stay pills; things you type in (Input, Textarea, Select trigger) use `--radius-field`.
- Project form's native "Narrative stance" select now uses the shared Input styling.
- Login copy: "Sign in" → "Log in"; "Already have an account?" caption above the Log in button.

## 0.2.0 · 2026-10-27

Pieces for the web app flow (`flows/web-app-flow.md`).

- New: Avatar, Disclosure (`ui/`); SetupChecklist, EmptyState, AppHeader (`ds/`).
- New patterns: Project row, Auth layout.
- On hold: SuggestionDiff, AuditRow (audit history not decided).

## 0.1.0 · 2026-10-27

Foundation release.

- Three-layer tokens in `src/styles/tokens/` (primitives, semantic, effects) mapped into Tailwind v4 in `globals.css`. Tailwind's default colour palette is disabled.
- Gradient canvas on `<body>`. Glass, gradient-card and accent-glow utilities.
- Fallbacks for no `backdrop-filter`, `prefers-reduced-transparency` and `prefers-reduced-motion`.
- Geist now actually applies (the old `--font-sans` pointed at itself).
- `cn()` switched from the `cn` package to `clsx` + `tailwind-merge`, extended with our custom font-size, radius and shadow names.
- Restyled: Button (removed `default`/`outline`/`destructive`/`link` and the icon sizes; added primary/secondary/ghost/inverse/glow, sm/md/lg, `arrow`), Card (variants), Input (pill, `leadingIcon`), Textarea, Label.
- New: IconButton, Badge, Select, SegmentedControl, InlineMessage, ListRow, StatRow, Dock, StatusStrip.
- Pages migrated mechanically: `variant="outline"` → `secondary`. The delete-project button went from `destructive` to `secondary` (it already asks for confirmation).
- `npm run tokens:export` writes `build/plugin-tokens.css` for the Figma plugin.
