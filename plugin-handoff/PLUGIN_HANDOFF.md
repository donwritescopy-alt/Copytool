# Plugin design system handoff

This bundle gives the Figma plugin the same look as the web app without Tailwind, React, build steps, CDNs or web fonts.

## How to use

1. Copy `plugin-ds.css` into the plugin project.
2. Link it in your HTML: `<link rel="stylesheet" href="plugin-ds.css">`.
3. Wrap the plugin UI in `<div class="ds-root ds-canvas ds-compact">…</div>`.
4. Use the classes below — all tokens are resolved to plain values, no imports needed.

When the web design changes, re-run `npm run plugin:handoff` in the web repo, copy the new `plugin-ds.css` over, and rebuild the plugin.

---

## Rules

1. **Tokens only.** Never hard-code colours, radii, shadows or font sizes. Use `var(--token-name)` from plugin-ds.css.
2. **Lime is the only accent.** `var(--accent)` / `#d2ff4f`.
3. **Dark text on lime.** Always `var(--text-on-accent)` / `#0a0a0a` on lime fills.
4. **One glow button per screen.** Only one `ds-btn--glow` on any screen.
5. **Glass needs the gradient canvas.** `.ds-card--glass` only works inside `.ds-canvas`. Without the gradient behind it, use `.ds-card--solid`.
6. **Red is for form errors only.** `var(--danger)` / `var(--danger-text)` are only for validation messages.
7. **Compact density.** The `.ds-compact` class on the root shrinks spacing and heights for the ~380px plugin panel.

---

## Class cheat sheet

### Button `.ds-btn`

Variants: `--primary` (default), `--secondary`, `--ghost`, `--inverse`, `--glow`
Sizes: `--sm` (32px), `--md` (40px, default), `--lg` (48px)

```html
<button class="ds-btn ds-btn--primary ds-btn--md">Save</button>
<button class="ds-btn ds-btn--secondary ds-btn--sm">Cancel</button>
<button class="ds-btn ds-btn--glow ds-btn--lg">Run Audit</button>
<button class="ds-btn ds-btn--primary" disabled>Disabled</button>
```

### Icon button `.ds-iconbtn`

Circular. Always add `aria-label`. Variants: (default=secondary), `--ghost`, `--primary`, `--inverse`. Sizes: `--sm`, `--md` (default), `--lg`.

```html
<button class="ds-iconbtn ds-iconbtn--ghost ds-iconbtn--sm" aria-label="Close">
  <svg>…</svg>
</button>
```

### Chip (Badge) `.ds-chip`

Non-interactive label. Variants: `--accent` (default), `--neutral`, `--status` (green dot + text).

```html
<span class="ds-chip ds-chip--accent">Pro</span>
<span class="ds-chip ds-chip--neutral">Draft</span>
<span class="ds-chip ds-chip--status">Connected</span>
```

### Card `.ds-card`

Variants: `--glass` (default, needs canvas), `--gradient`, `--solid`, `--inverse`.

```html
<div class="ds-card ds-card--glass">
  <strong>Title</strong>
  <p>Body text here.</p>
</div>
```

### Input `.ds-input`

```html
<label class="ds-label" for="name">Brand name</label>
<input class="ds-input" id="name" placeholder="e.g. Acme">
<!-- Error state: -->
<input class="ds-input" aria-invalid="true" value="Bad">
```

### Textarea `.ds-textarea`

```html
<textarea class="ds-textarea" placeholder="Describe…"></textarea>
```

### Label `.ds-label`

```html
<label class="ds-label" for="field">Field name</label>
```

### Select `.ds-select`

Styled native `<select>`. No JS needed.

```html
<select class="ds-select">
  <option value="" disabled selected>Choose…</option>
  <option>Option A</option>
  <option>Option B</option>
</select>
```

### Segmented control `.ds-segmented`

```html
<div class="ds-segmented" role="radiogroup" aria-label="Stance">
  <button class="ds-segmented__item is-active" role="radio" aria-checked="true">We</button>
  <button class="ds-segmented__item" role="radio" aria-checked="false">I</button>
  <button class="ds-segmented__item" role="radio" aria-checked="false">No person</button>
</div>
```

Toggle `is-active` and `aria-checked` with JS on click.

### List row `.ds-row`

```html
<div class="ds-row">
  <div class="ds-row__body">
    <span class="ds-row__title">Homepage hero</span>
    <span class="ds-row__desc">Frame #12 · 3 text layers</span>
  </div>
  <div class="ds-row__trail">
    <span class="ds-chip ds-chip--accent">Ready</span>
  </div>
</div>
```

### Stat row `.ds-statrow`

Wrap in `<dl>`. Add `--lg` for the headline pair.

```html
<dl>
  <div class="ds-statrow ds-statrow--lg"><dt>Findings</dt><dd>12</dd></div>
  <div class="ds-statrow"><dt>Applied</dt><dd>8</dd></div>
</dl>
```

### Status strip `.ds-status-strip`

Green bar peeking below an inverse card.

```html
<div class="ds-status-strip">
  <div class="ds-status-strip__card">
    <div class="ds-card ds-card--inverse">…card content…</div>
  </div>
  <div class="ds-status-strip__bar">✓ Connected</div>
</div>
```

### Inline message `.ds-message`

Variants: `--error`, `--info` (default), `--success`.

```html
<span class="ds-message ds-message--error">
  <svg>…icon…</svg>
  <span>Something went wrong.</span>
</span>
```

---

## Plugin screens

Based on the decisions in `docs/design-system/flows/web-app-flow.md`. Brand setup and project creation happen on the web; the plugin handles per-audit work.

### 1. Connect / Log in

**Purpose:** authenticate the user via the web app's OAuth flow.

- One `ds-card--glass` centred in the panel.
- Logo or product name at top.
- "Log in" `ds-btn--glow` (the hero action) opens the web app's login page in the browser.
- Below: `ds-message--info` "You'll be redirected to your browser to sign in."
- **After redirect returns:** card updates to show "Connected" `ds-chip--status` + the user's name.
- **Error state:** `ds-message--error` "Could not connect. Check your internet and try again." with a "Retry" `ds-btn--secondary`.
- **Loading state:** disabled glow button with "Connecting…" text.

### 2. Project picker

**Purpose:** choose which project to audit against (brand details live on the web).

- `ds-label` "Project" above a `ds-select` listing the user's projects.
- Each option shows the project / brand name.
- If no projects exist: a `ds-card--solid` empty state — "No projects yet. Create one on the web app." with a `ds-btn--secondary` "Open web app".
- Below the select: a read-only summary of the selected project's brand details in `ds-statrow` pairs (brand name, voice keywords, audience, stance).
- "Continue" `ds-btn--primary` at the bottom.

### 3. Selected text (grouped by frame)

**Purpose:** show the Figma text layers the user selected, grouped by their parent frame.

- One `ds-card--solid` per frame group.
  - Frame name as the card title (bold `ds-row__title` style).
  - Inside: a list of `ds-row` items, each showing the layer name and a preview of its text content (truncated).
  - `ds-chip--neutral` showing the layer count per frame.
- If nothing is selected: empty state `ds-card--solid` — "Select text layers in Figma" + `ds-message--info`.
- "Run Audit" `ds-btn--glow` at the bottom (the hero action for this screen).

### 4. Writer persona + context fields

**Purpose:** per-audit settings that don't belong in the brand profile.

- `ds-select` for writer persona.
- `ds-select` for channel (e.g. landing page, email, social).
- `ds-input` for goal (free text, one line).
- `ds-textarea` for constraints / extra context (optional).
- `ds-textarea` for flow description (what the user journey is).
- Each field has a `ds-label` above it.
- "Run Audit" `ds-btn--glow` (same hero action, this screen and the previous can be one scrolling view or tabs via `ds-segmented`).

### 5. Results: findings + suggestions

**Purpose:** show the AI's audit results and let the user apply changes to Figma layers.

- One `ds-card--solid` per finding.
  - `ds-row` header: layer name (title) + severity `ds-chip` (accent=important, neutral=minor).
  - Body: the original text, an arrow or divider, the suggested text.
  - `ds-message--info` with the reasoning.
  - Actions row: "Apply" `ds-btn--primary ds-btn--sm` and "Dismiss" `ds-btn--ghost ds-btn--sm`.
- Summary at the top: `ds-statrow--lg` for total findings, `ds-statrow` for applied / dismissed counts.
- "Apply All" `ds-btn--glow` at the top (hero action).
- After applying: the finding card shows `ds-chip--status` "Applied" and the Apply button becomes disabled.

### 6. Empty state

When there's nothing to show (no selection, no results):

```html
<div class="ds-card ds-card--solid" style="text-align:center;">
  <strong>No text selected</strong>
  <span style="color:var(--text-secondary);">Select text layers in Figma, then come back here.</span>
</div>
```

### 7. Loading state

While the audit runs:

- The "Run Audit" button becomes disabled with "Auditing…" text.
- A simple "Analyzing your copy…" `ds-message--info` below.
- No spinner needed — the message and disabled button are enough.

### 8. Error state

When the API call fails:

```html
<span class="ds-message ds-message--error">
  <svg>…</svg>
  <span>Audit failed. Check your connection and try again.</span>
</span>
<button class="ds-btn ds-btn--secondary ds-btn--sm">Retry</button>
```

---

## Inspiration

The `inspiration/` folder contains reference screenshots from the web app showing the visual language: segmented nav, glow actions, list rows, gradient cards, dark cards with status strips.

---

## Accessibility

- `plugin-ds.css` includes `-webkit-backdrop-filter` alongside `backdrop-filter`.
- `@supports not (backdrop-filter)` makes glass nearly opaque so text stays readable.
- `prefers-reduced-transparency` turns glass solid white.
- `prefers-reduced-motion` sets all durations to 0ms.
- Focus rings are near-black (`var(--focus-ring)`) on light surfaces and lime on dark (`var(--focus-ring-inverse)`).
- Every `ds-iconbtn` needs `aria-label`.
- Use `role="alert"` on error messages, `role="status"` on info/success.
