# Card

**Import:** `import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card"`

## Purpose

Rounded container for one topic: a form, a plan upsell, a profile, a list. It is the main surface that sits on the gradient canvas.

## When to use / When not to use

- Use `glass` (default) over the gradient canvas (`body` applies `bg-gradient-canvas`).
- Use `gradient` or `tinted` for promotional or hero cards, such as an upgrade card.
- Use `solid` for dense content, or when no canvas gradient is behind the card.
- Use `inverse` for a dark profile or status card. Pair it with `StatusStrip`.
- Don't nest cards inside cards. Use `ListRow`, or a `bg-surface-muted` panel with `rounded-panel`.
- Don't put `glass` on a flat background. It needs the gradient canvas behind it to read as glass.

## Anatomy

- `Card`: the container. It is a column with `--card-spacing` gap and vertical padding (24px, or 16px at `size="sm"`).
- `CardHeader`: a grid holding the title and description. It becomes two columns when it contains a `CardAction`.
- `CardTitle`: heading text (`--type-title-sm`, or `--type-body` at `sm`).
- `CardDescription`: secondary text.
- `CardAction`: top-right slot inside the header, for example an `IconButton` close.
- `CardContent`: the body, with horizontal padding.
- `CardFooter`: a row of actions.
- If an `<img>` is the first child, it goes edge to edge with rounded top corners.

## Variants and sizes

| Name | Look | Use for |
| --- | --- | --- |
| `glass` (default) | Translucent white, backdrop blur, white rim | Most cards over the canvas |
| `gradient` | White to sage to sand diagonal gradient | Promotional cards |
| `tinted` | Card gradient plus a lime glow in the bottom-left | Upgrade or hero cards |
| `solid` | Opaque white, subtle border | Dense content, no canvas behind |
| `inverse` | Near-black fill, white text | Profile or status cards |
| `size="default"` | 24px spacing, title-sm title | Standard |
| `size="sm"` | 16px spacing, body-size title | Compact cards |

All variants use `--radius-card` (24px) and `--shadow-card`.

## States

Cards can't be interacted with, so they have no hover, focus or disabled states.

- **Inverse context:** `Card variant="inverse"` sets `data-variant="inverse"`. `CardDescription` and `Badge variant="status"` then switch to `--text-inverse-secondary` automatically. Use `inverse` variants of `Button` and `IconButton` inside it.
- **Reduced transparency:** `glass` becomes opaque white with no blur (`--surface-glass` and `--glass-blur` are overridden). The same happens when the browser has no `backdrop-filter` support.

## Tokens used

`--surface-glass`, `--glass-blur`, `--glass-saturate`, `--surface-solid`, `--surface-inverse`, `--border-glass`, `--border-subtle`, `--gradient-card`, `--gradient-card-tint-lime`, `--text-primary`, `--text-secondary`, `--text-inverse`, `--text-inverse-secondary`, `--radius-card`, `--shadow-card`, `--type-title-sm`, `--type-body`, `--type-body-sm`

## Example

```tsx
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { IconButton } from "@/components/ui/icon-button"

export function UpgradeCard() {
  return (
    <Card variant="tinted" className="max-w-sm">
      <CardHeader>
        <CardTitle>Upgrade to Pro</CardTitle>
        <CardDescription>Unlock every writer persona and unlimited projects.</CardDescription>
        <CardAction>
          <IconButton aria-label="Dismiss" size="sm">
            <X />
          </IconButton>
        </CardAction>
      </CardHeader>
      <CardContent>Billed yearly. Cancel any time.</CardContent>
      <CardFooter>
        <Button variant="glow" arrow>Upgrade Plan</Button>
      </CardFooter>
    </Card>
  )
}
```

## Accessibility

- It renders a plain `<div>` with no landmark role. If the card is a distinct region, add `role="region"` and `aria-labelledby` pointing to the title.
- `CardTitle` is a `<div>`, not a heading. Put an `<h2>` or `<h3>` inside it when the card needs to appear in the heading outline.
- On `inverse` cards, use the `inverse` variants of `Button` and `IconButton` so the focus ring is lime and stays visible against the dark fill.
- Glass contrast depends on the canvas. Keep body text on glass at `--text-primary` or `--text-secondary`, never `--text-tertiary`.

## Plugin parity

Status: Not started (web only). The Figma plugin would need a card frame with 5 fill variants and 2 spacing sizes. Glass needs background blur. Use the token values from `build/plugin-tokens.css`.
