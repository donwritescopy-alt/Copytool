# Button

**Import:** `import { Button } from "@/components/ui/button"`

## Purpose

Pill-shaped button for any click that does something: submit a form, start a flow, confirm a choice. Built on the base-ui `Button` primitive.

## When to use / When not to use

- Use `primary` for the main action on a surface.
- Use `glow` for the single hero action on a screen. Use it **at most once per screen**.
- Use `secondary` or `ghost` for supporting actions next to a primary one.
- Use `inverse` on dark surfaces (`Card variant="inverse"`).
- Don't use for icon-only actions. Use `IconButton`.
- Don't use for navigation lists. Use `ListRow` or `Dock`.
- There is no destructive or outline variant. Red is reserved for form errors (see `InlineMessage`).

## Anatomy

- Container: a pill (`--radius-pill`) with a 1px border that is transparent unless the variant sets one.
- Label: the `children`.
- Optional leading icon: any svg passed in `children`. It is sized automatically (16px, or 20px at `lg`) unless it has its own `size-*` class.
- Optional trailing arrow: `arrow` adds a lucide `ArrowRight` (marked `aria-hidden`) that moves 2px right on hover.

## Variants and sizes

| Name | Look | Use for |
| --- | --- | --- |
| `primary` (default) | Lime fill, near-black text | Main action on a surface |
| `secondary` | White fill, subtle border, raised shadow | Supporting action |
| `ghost` | No fill until hover | Low-emphasis action, toolbars |
| `inverse` | Dark raised fill, white text | Actions on dark cards |
| `glow` | Lime radial gradient, white inner rim, lime glow shadow | The one hero action per screen |
| `sm` | 32px high, label text | Dense rows, inline actions |
| `md` (default) | 40px high, body-sm text | Most buttons |
| `lg` | 48px high, body text, 20px icons | Hero and CTA buttons |

## States

- **Hover:** `primary` changes to `--accent-hover`. `secondary` changes to `--surface-canvas`. `ghost` changes to `--surface-muted`. `inverse` changes to `--surface-inverse-raised-hover`. `glow` brightens to 105%. The arrow, if shown, moves right.
- **Pressed:** scales to 98%. `primary` changes to `--accent-pressed`. `secondary` and `ghost` change to `--surface-muted`. `glow` dims to 95%.
- **Focus (keyboard):** 2px outline in `--focus-ring` (near-black), offset 2px. `inverse` uses `--focus-ring-inverse` (lime).
- **Disabled:** set `disabled`. Every variant flattens to `--surface-muted` with `--text-tertiary`, with no gradient, border or shadow. The cursor shows not-allowed and pointer events are off.
- Transitions use `--duration-fast` and `--ease-out`. They drop to 0ms when the user prefers reduced motion.

## Tokens used

`--accent`, `--accent-hover`, `--accent-pressed`, `--text-on-accent`, `--text-primary`, `--text-inverse`, `--text-tertiary`, `--surface-solid`, `--surface-canvas`, `--surface-muted`, `--surface-inverse-raised`, `--surface-inverse-raised-hover`, `--border-subtle`, `--border-glass`, `--radius-pill`, `--shadow-raised`, `--shadow-glow-accent`, `--gradient-accent-glow`, `--focus-ring`, `--focus-ring-inverse`, `--type-label`, `--type-body-sm`, `--type-body`, `--duration-fast`, `--ease-out`

## Example

```tsx
import { Button } from "@/components/ui/button"

export function UpgradeActions() {
  return (
    <div className="flex gap-3">
      <Button variant="secondary">Maybe later</Button>
      <Button variant="glow" size="lg" arrow>
        Upgrade Plan
      </Button>
    </div>
  )
}
```

## Accessibility

- It renders a native `<button>` through base-ui, so Enter and Space work.
- The focus ring shows only for keyboard focus (`focus-visible`). It is a near-black 2px outline offset by 2px, or lime on `inverse`.
- Text on lime (`primary`, `glow`) is always `--text-on-accent` (near-black), never white.
- The trailing arrow is `aria-hidden`, so the label is what screen readers announce.
- Disabled buttons are set with `data-disabled` by base-ui. Don't rely on a disabled button to explain why it is unavailable.

## Plugin parity

Status: Not started (web only). The Figma plugin would need a pill component with these 5 variants and 3 sizes, using the token values from `build/plugin-tokens.css`.
