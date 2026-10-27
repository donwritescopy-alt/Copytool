# Design tokens

Source files: `src/styles/tokens/primitives.css`, `semantic.css` and `effects.css`, loaded through `index.css`. `src/app/globals.css` maps them to Tailwind.

## Layers

| Layer | File | Contains | Who may use it |
| --- | --- | --- | --- |
| 1. Primitives | `primitives.css` | Raw hex and px values | **Only** the semantic and effect layers |
| 2. Semantic | `semantic.css` | Values named by role (surface, text, accent…) | Components |
| 3. Effects | `effects.css` | Blur, shadows, gradients, motion | Components |

**Rules**

- Components use **only semantic and effect tokens**, through their Tailwind classes. They never use primitives or raw hex, px font sizes, radii or shadows.
- Primitives have no Tailwind class on purpose. Writing `bg-[var(--lime-400)]` breaks the rule, so don't do it.
- **Component tokens** (such as `--input-bg`) live in `semantic.css`. Add one only when a component needs a value that no semantic token provides.
- **Tailwind's default colour palette is disabled** (`--color-*: initial` in `@theme`), so classes like `bg-red-500`, `text-gray-600` and `bg-white` don't exist. The only colour classes are the ones listed below.

---

## Primitives (layer 1)

None of these has a Tailwind class.

### Neutrals

| Token | Value | Use it for |
| --- | --- | --- |
| `--neutral-0` | `#ffffff` | White: solid surfaces, inverse text |
| `--neutral-50` | `#f7f7f7` | Input fill |
| `--neutral-100` | `#f2f2f2` | Canvas base, top of the canvas gradient |
| `--neutral-200` | `#e6e6e6` | Muted surface, subtle border, bottom of the canvas gradient |
| `--neutral-300` | `#dedede` | Spare step (no semantic token uses it yet) |
| `--neutral-400` | `#cfcfcf` | Spare step (no semantic token uses it yet) |
| `--neutral-500` | `#a3a3a3` | Tertiary/disabled text, secondary text on dark |
| `--neutral-600` | `#6b6b6b` | Secondary text |
| `--neutral-700` | `#4a4a4a` | Hover for raised buttons on dark surfaces |
| `--neutral-800` | `#333333` | Raised buttons on dark surfaces |
| `--neutral-900` | `#1f1f1f` | Dark (inverse) card |
| `--neutral-950` | `#0a0a0a` | Primary text, text on lime, focus ring |

### Lime

| Token | Value | Use it for |
| --- | --- | --- |
| `--lime-100` | `#f1ffc4` | Soft accent fill |
| `--lime-200` | `#e6ff94` | Centre of the glow gradient, lime tint on cards |
| `--lime-300` | `#d9ff6e` | Lime haze on the canvas |
| `--lime-400` | `#d2ff4f` | The accent; glow shadow; focus ring on dark |
| `--lime-500` | `#b5f23d` | Accent hover; edge of the glow gradient |
| `--lime-600` | `#8cc41c` | Accent pressed |

### Green / Red

| Token | Value | Use it for |
| --- | --- | --- |
| `--green-400` | `#a8f560` | Success: status dot, StatusStrip |
| `--red-500` | `#e5484d` | Error borders and outlines (not text) |
| `--red-600` | `#ce2c31` | Error text |

### Tints (sage / sand)

| Token | Value | Use it for |
| --- | --- | --- |
| `--sage-100` | `#e8eeea` | Middle stop of the card gradient; canvas haze |
| `--sand-100` | `#ede7df` | Last stop of the card gradient |

### Radius

| Token | Value | Use it for |
| --- | --- | --- |
| `--radius-8` | `8px` | Source for `--radius-tight` |
| `--radius-12` | `12px` | Source for `--radius-inner`, `--radius-field` |
| `--radius-16` | `16px` | Source for `--radius-panel` |
| `--radius-24` | `24px` | Source for `--radius-card` |
| `--radius-32` | `32px` | Unused (cards were 32px before 0.3.0) |
| `--radius-999` | `999px` | Source for `--radius-pill` |

### Spacing

Components use Tailwind's built-in 4px spacing scale (`p-4`, `gap-6`…), which uses the same steps.

| Token | Value | Use it for |
| --- | --- | --- |
| `--space-1` | `4px` | Same as `*-1` |
| `--space-2` | `8px` | Same as `*-2` |
| `--space-3` | `12px` | Same as `*-3` |
| `--space-4` | `16px` | Same as `*-4` |
| `--space-5` | `20px` | Same as `*-5` |
| `--space-6` | `24px` | Same as `*-6` (default card padding) |
| `--space-8` | `32px` | Same as `*-8` |
| `--space-10` | `40px` | Same as `*-10` |
| `--space-12` | `48px` | Same as `*-12` |
| `--space-16` | `64px` | Same as `*-16` |

### Type size

| Token | Value | Use it for |
| --- | --- | --- |
| `--font-size-12` | `12px` | Source for `--type-caption` |
| `--font-size-13` | `13px` | Source for `--type-label` |
| `--font-size-14` | `14px` | Source for `--type-body-sm` |
| `--font-size-16` | `16px` | Source for `--type-body` |
| `--font-size-20` | `20px` | Source for `--type-title-sm` |
| `--font-size-24` | `24px` | Source for `--type-title` |
| `--font-size-32` | `32px` | Source for `--type-display` |

### Weight

| Token | Value | Use it for |
| --- | --- | --- |
| `--font-weight-400` | `400` | Source for `--weight-regular` |
| `--font-weight-500` | `500` | Source for `--weight-medium` |
| `--font-weight-600` | `600` | Source for `--weight-semibold` |

---

## Semantic (layer 2)

### Surfaces

| Token | Value | Tailwind | Use it for |
| --- | --- | --- | --- |
| `--surface-canvas` | `var(--neutral-100)` → `#f2f2f2` | `bg-surface-canvas` | Page background, under the canvas gradient |
| `--surface-glass` | `rgb(255 255 255 / 0.62)` | `bg-surface-glass` (prefer the `glass` utility) | Frosted cards and dock over the canvas |
| `--surface-solid` | `var(--neutral-0)` → `#ffffff` | `bg-surface-solid` | Opaque cards, popovers, secondary buttons |
| `--surface-inverse` | `var(--neutral-900)` → `#1f1f1f` | `bg-surface-inverse` | Dark profile/status card |
| `--surface-inverse-raised` | `var(--neutral-800)` → `#333333` | `bg-surface-inverse-raised` | Buttons on a dark card |
| `--surface-inverse-raised-hover` | `var(--neutral-700)` → `#4a4a4a` | `bg-surface-inverse-raised-hover` | Hover for those buttons |
| `--surface-muted` | `var(--neutral-200)` → `#e6e6e6` | `bg-surface-muted` | Disabled fills, neutral badges, hovered items |

### Text

| Token | Value | Tailwind | Use it for |
| --- | --- | --- | --- |
| `--text-primary` | `var(--neutral-950)` → `#0a0a0a` | `text-primary` | Body text, headings |
| `--text-secondary` | `var(--neutral-600)` → `#6b6b6b` | `text-secondary` | Supporting text, descriptions, **placeholders** |
| `--text-tertiary` | `var(--neutral-500)` → `#a3a3a3` | `text-tertiary` | **Disabled text only** (fails 4.5:1) |
| `--text-on-accent` | `var(--neutral-950)` → `#0a0a0a` | `text-on-accent` | Text on lime or green fills |
| `--text-inverse` | `var(--neutral-0)` → `#ffffff` | `text-inverse` | Text on dark surfaces |
| `--text-inverse-secondary` | `var(--neutral-500)` → `#a3a3a3` | `text-inverse-secondary` | Supporting text on dark surfaces |

### Borders

| Token | Value | Tailwind | Use it for |
| --- | --- | --- | --- |
| `--border-subtle` | `var(--neutral-200)` → `#e6e6e6` | `border-subtle` (the default border colour) | Inputs, solid cards, dividers |
| `--border-glass` | `rgb(255 255 255 / 0.85)` | `border-glass` | Light rim on glass, gradient cards and the glow button |

### Accent

| Token | Value | Tailwind | Use it for |
| --- | --- | --- | --- |
| `--accent` | `var(--lime-400)` → `#d2ff4f` | `bg-accent` | Primary buttons, accent badges |
| `--accent-hover` | `var(--lime-500)` → `#b5f23d` | `bg-accent-hover` | Hover on the accent |
| `--accent-pressed` | `var(--lime-600)` → `#8cc41c` | `bg-accent-pressed` | Pressed state of the accent |
| `--accent-soft` | `var(--lime-100)` → `#f1ffc4` | `bg-accent-soft` | Faint lime highlight behind content |

### States

| Token | Value | Tailwind | Use it for |
| --- | --- | --- | --- |
| `--danger` | `var(--red-500)` → `#e5484d` | `border-danger`, `outline-danger` | Invalid-field border and outline |
| `--danger-text` | `var(--red-600)` → `#ce2c31` | `text-danger-text` | Error message text |
| `--success` | `var(--green-400)` → `#a8f560` | `bg-success` | Status dot, StatusStrip |
| `--focus-ring` | `var(--neutral-950)` → `#0a0a0a` | `outline-focus-ring` | Keyboard focus on light surfaces |
| `--focus-ring-inverse` | `var(--lime-400)` → `#d2ff4f` | `outline-focus-ring-inverse` | Keyboard focus on dark surfaces |

### Radius

| Token | Value | Tailwind | Use it for |
| --- | --- | --- | --- |
| `--radius-tight` | `var(--radius-8)` → `8px` | `rounded-tight` | Items inside a popup (select options), thumbnails |
| `--radius-inner` | `var(--radius-12)` → `12px` | `rounded-inner` | Small boxes nested inside a card |
| `--radius-field` | `var(--radius-12)` → `12px` | `rounded-field` | Things you type or pick in: Input, Textarea, Select trigger, inline notes |
| `--radius-panel` | `var(--radius-16)` → `16px` | `rounded-panel` | Popups, dropdown lists, rows inside a card |
| `--radius-card` | `var(--radius-24)` → `24px` | `rounded-card` | Cards |
| `--radius-pill` | `var(--radius-999)` → `999px` | `rounded-pill` | Things you click: buttons, icon buttons, badges, segmented control, dock, header |

### Type

Each size class includes its own line height.

| Token | Value | Tailwind | Use it for |
| --- | --- | --- | --- |
| `--type-caption` | `var(--font-size-12)` → `12px` | `text-caption` (lh 1.35) | Dock labels, fine print |
| `--type-label` | `var(--font-size-13)` → `13px` | `text-label` (lh 1.35) | Form labels, badges, small buttons |
| `--type-body-sm` | `var(--font-size-14)` → `14px` | `text-body-sm` (lh 1.45) | Default UI text, card body |
| `--type-body` | `var(--font-size-16)` → `16px` | `text-body` (lh 1.5) | Reading text, large buttons |
| `--type-title-sm` | `var(--font-size-20)` → `20px` | `text-title-sm` (lh 1.3) | Card titles |
| `--type-title` | `var(--font-size-24)` → `24px` | `text-title` (lh 1.25) | Section titles, headline values |
| `--type-display` | `var(--font-size-32)` → `32px` | `text-display` (lh 1.15) | Page hero heading |
| `--weight-regular` | `var(--font-weight-400)` → `400` | `font-normal`* | Body text |
| `--weight-medium` | `var(--font-weight-500)` → `500` | `font-medium`* | Labels, buttons, titles |
| `--weight-semibold` | `var(--font-weight-600)` → `600` | `font-semibold`* | Strong emphasis (use rarely) |

\* There's no Tailwind mapping for the weight tokens. Tailwind's built-in weight classes have the same values.

### Component tokens

| Token | Value | Tailwind | Use it for |
| --- | --- | --- | --- |
| `--input-bg` | `var(--neutral-50)` → `#f7f7f7` | `bg-input-bg` | Fill for Input, Select trigger and SegmentedControl track |

---

## Effects (layer 3)

### Glass

| Token | Value | Tailwind | Use it for |
| --- | --- | --- | --- |
| `--glass-blur` | `24px` | `glass` utility | Backdrop blur on glass surfaces |
| `--glass-saturate` | `140%` | `glass` utility | Backdrop saturation on glass surfaces |

`glass` = `background-color: var(--surface-glass)` plus `backdrop-filter: blur(--glass-blur) saturate(--glass-saturate)`, with the `-webkit-` prefix.

### Shadows

| Token | Value | Tailwind | Use it for |
| --- | --- | --- | --- |
| `--shadow-card` | `0 24px 48px -16px rgb(0 0 0/.14), 0 8px 16px -8px rgb(0 0 0/.06)` | `shadow-card` | Cards, dock, popovers |
| `--shadow-raised` | `inset 0 1px 0 rgb(255 255 255/.1), 0 1px 2px rgb(0 0 0/.12), 0 4px 12px rgb(0 0 0/.1)` | `shadow-raised` | Secondary/inverse buttons, selected segment |
| `--shadow-glow-accent` | `inset 0 0 0 1.5px rgb(255 255 255/.7), 0 8px 28px -4px` lime-400 at 75% | `shadow-glow-accent` | The single glow button |

### Gradients

| Token | Value | Tailwind | Use it for |
| --- | --- | --- | --- |
| `--gradient-canvas` | Lime-300 haze at top left (22%), sage-100 haze at bottom right (90%), over `linear(180deg, neutral-100 → neutral-200)` | `bg-gradient-canvas` | Page background (already on `body`) |
| `--gradient-card` | `linear(135deg, neutral-0 0%, sage-100 55%, sand-100 100%)` | `bg-gradient-card` | Hero/feature card |
| `--gradient-card-tint-lime` | Lime-200 haze at bottom left (45%) over `--gradient-card` | `bg-gradient-card-lime` | Promo/upsell card |
| `--gradient-accent-glow` | `radial(lime-200 0% → lime-400 55% → lime-500 100%)` | `bg-accent-glow` | Glow button fill |

### Motion

| Token | Value | Tailwind | Use it for |
| --- | --- | --- | --- |
| `--duration-fast` | `150ms` | `duration-fast` | Hover, press and colour changes |
| `--duration-base` | `250ms` | `duration-base` | Bigger transitions (open/close, layout) |
| `--ease-out` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | `ease-out` | Every transition |

---

## Fallbacks

These overrides live in `effects.css`. Components need no changes to support them.

| Condition | Effect |
| --- | --- |
| `@supports not (backdrop-filter)` | `--surface-glass` becomes `rgb(255 255 255 / 0.94)`, so glass is nearly opaque and text stays readable |
| `prefers-reduced-transparency: reduce` | `--surface-glass` becomes `var(--neutral-0)` (solid white) and `--glass-blur` becomes `0px` |
| `prefers-reduced-motion: reduce` | `--duration-fast` and `--duration-base` become `0ms` |

---

## Deviations from the original brief

- **`--neutral-600`** changed from `#7A7A7A` to `#6B6B6B` so secondary text passes 4.5:1 on glass over the canvas.
- **`--neutral-800`** changed from `#262626` to `#333333` so raised buttons stand out on the `#1F1F1F` dark card.
- **Added `--red-600` `#CE2C31`** for error text, because `--red-500` is only about 3.9:1 on white.
- **Added `--sage-100` `#E8EEEA` and `--sand-100` `#EDE7DF`** for the card gradient.
- **Added semantic tokens:** `--surface-inverse-raised` (and `-hover`), `--text-inverse-secondary`, `--danger-text`, and `--focus-ring-inverse` (lime focus ring on dark surfaces).
- **Added radius names:** `tight` / `inner` / `field` / `panel` / `card` / `pill`.
- **Added type names:** `caption` / `label` / `body-sm` / `body` / `title-sm` / `title` / `display`.
- **Placeholders use `text-secondary`** (not tertiary) for contrast. **`text-tertiary` is for disabled text only.**

---

## Legacy aliases

`globals.css` still maps these shadcn colour names, **only so pages that haven't been migrated keep working**. New code must not use them.

| Legacy class | Points to | Use instead |
| --- | --- | --- |
| `background` | `--surface-canvas` | `bg-surface-canvas` |
| `foreground` | `--text-primary` | `text-primary` |
| `muted` | `--surface-muted` | `bg-surface-muted` |
| `muted-foreground` | `--text-secondary` | `text-secondary` |
| `border` | `--border-subtle` | `border-subtle` |
| `input` | `--border-subtle` | `border-subtle` |
| `ring` | `--focus-ring` | `outline-focus-ring` |
| `destructive` | `--danger-text` | `text-danger-text` / `border-danger` |
