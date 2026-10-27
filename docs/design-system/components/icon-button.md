# IconButton

**Import:** `import { IconButton } from "@/components/ui/icon-button"`

## Purpose

Circular button with only an icon, such as a close "X". Built on the base-ui `Button` primitive.

## When to use / When not to use

- Use when the icon alone is universally understood: close, back, more, search.
- Use `inverse` on dark cards.
- Don't use when a text label would be clearer. Use `Button`.
- Don't use for the hero action in the dock. Use `DockAction`.

## Anatomy

- Container: a circle (`--radius-pill` on a square box).
- Icon: the single svg child. It is sized automatically unless it has its own `size-*` class.
- Accessible name: the required `aria-label` prop.

## Variants and sizes

| Name | Look | Use for |
| --- | --- | --- |
| `secondary` (default) | White fill, raised shadow | Close or back on light surfaces |
| `ghost` | No fill, secondary-colour icon | Quiet toolbar actions |
| `primary` | Lime fill, near-black icon | Rare: an icon-only main action |
| `inverse` | Dark raised fill, white icon | Actions on dark cards |
| `sm` | 32px circle, 16px icon | Dense rows |
| `md` (default) | 40px circle, 20px icon | Most cases |
| `lg` | 48px circle, 20px icon | Large touch targets |

## States

- **Hover:** `secondary` changes to `--surface-canvas`. `ghost` gets a `--surface-muted` fill and the icon turns from `--text-secondary` to `--text-primary`. `primary` changes to `--accent-hover`. `inverse` changes to `--surface-inverse-raised-hover`.
- **Pressed:** scales to 95%. `primary` changes to `--accent-pressed`.
- **Focus (keyboard):** 2px outline in `--focus-ring` (near-black), offset 2px. `inverse` uses `--focus-ring-inverse` (lime).
- **Disabled:** set `disabled`. The fill changes to `--surface-muted`, the icon to `--text-tertiary`, there is no shadow and pointer events are off.

## Tokens used

`--surface-solid`, `--surface-canvas`, `--surface-muted`, `--surface-inverse-raised`, `--surface-inverse-raised-hover`, `--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-on-accent`, `--text-inverse`, `--accent`, `--accent-hover`, `--accent-pressed`, `--radius-pill`, `--shadow-raised`, `--focus-ring`, `--focus-ring-inverse`, `--duration-fast`, `--ease-out`

## Example

```tsx
import { X } from "lucide-react"
import { IconButton } from "@/components/ui/icon-button"

export function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <IconButton aria-label="Close" onClick={onClose}>
      <X />
    </IconButton>
  )
}
```

## Accessibility

- `aria-label` is **required** by the TypeScript type. The icon has no text, so the label is its only accessible name.
- Mark the icon `aria-hidden` if it isn't already (lucide icons are decorative here).
- The focus ring shows only for keyboard focus. It is a near-black 2px outline offset by 2px, or lime on `inverse`.
- `sm` (32px) is below the 44px touch-target guideline. Prefer `md` or `lg` on touch screens.

## Plugin parity

Status: Not started (web only). The Figma plugin would need a circular icon-button component with 4 variants and 3 sizes, using the token values from `build/plugin-tokens.css`.
