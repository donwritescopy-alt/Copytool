# Cross-platform (web ↔ Figma plugin)

The token files in `src/styles/tokens/` are plain CSS custom properties with no Tailwind syntax, so the Figma plugin can share the same values.

## Export tokens for the plugin

```bash
npm run tokens:export
```

This runs `scripts/export-plugin-tokens.mjs`, which:

1. Reads `primitives.css`, `semantic.css` and `effects.css` in that order.
2. Resolves every `var(--x)` to its literal value, so `--text-secondary` becomes `#6b6b6b` instead of `var(--neutral-600)`.
3. Keeps the fallback blocks (`@supports not backdrop-filter`, `prefers-reduced-transparency`, `prefers-reduced-motion`) with resolved values.
4. Writes `build/plugin-tokens.css`. `build/` is git-ignored, so the file is always generated, never edited.

It fails loudly if a token references an unknown name or if any `var()` is left unresolved.

Copy `build/plugin-tokens.css` into the plugin repo and import it once in the plugin UI's stylesheet. Re-run and re-copy whenever a token changes. CHANGELOG.md says when that happened.

## Using tokens in the plugin (no Tailwind)

The Tailwind classes don't exist in the plugin, so write the equivalent CSS with the variables:

```css
.glass-card {
  background: var(--surface-glass);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}
.button-primary {
  background: var(--accent);
  color: var(--text-on-accent);
  border-radius: var(--radius-pill);
  font-size: var(--type-body-sm);
  font-weight: var(--weight-medium);
}
.button-primary:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
body { background: var(--surface-canvas) var(--gradient-canvas); color: var(--text-primary); }
```

Same rules as the web: semantic and effect tokens only, lime is the only accent, near-black text on lime, red only for errors.

## Fonts

The web uses Geist through `next/font`. In the plugin, bundle Geist locally or fall back to `system-ui`. Avoid loading from a font CDN.

## Keeping parity

Track each component's plugin status in [COMPONENT_STATUS.md](COMPONENT_STATUS.md). When a component is built in the plugin, mirror the variants and states in its `components/<name>.md` and update the "Plugin parity" section.
