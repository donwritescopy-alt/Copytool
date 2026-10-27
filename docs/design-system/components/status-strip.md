# StatusStrip

**Import:** `import { StatusStrip } from "@/components/ds/status-strip"`

## Purpose

A green strip peeking out from under a card (usually `Card variant="inverse"`), carrying one short status line such as "Available for work".

## When to use / When not to use

- Use for one short, positive or neutral status attached to a profile or summary card.
- Pair it with `Card variant="inverse"`, as in the reference design.
- Don't use for errors. Use `InlineMessage variant="error"`.
- Don't use for anything the user must act on. Use a `Button`.
- Use only one per card. Keep the text to a few words.

## Anatomy

- Wrapper: a flex column (`<div>`) that takes `className` and other div props.
- Card slot: the `children`, layered above the strip (`z-10`). A direct child `Card` keeps `--shadow-card`.
- Strip: a `<p>` that tucks up under the card by `--radius-card`, with bottom corners at `--radius-card`, a `--success` fill and near-black `--type-body-sm` medium text, centred. An svg inside is sized to 16px.
- `status`: the strip content (text and an optional icon).

## Variants and sizes

| Name | Look | Use for |
| --- | --- | --- |
| Default | Green strip under the card | Status line under a profile or summary card |

There is one size. Its top padding is the card radius plus 10px, so the visible strip height stays the same whatever the radius.

## States

It is static, with no interactive states.

## Tokens used

`--success`, `--text-on-accent`, `--radius-card`, `--shadow-card`, `--type-body-sm`, `--weight-medium`

## Example

```tsx
import { CircleCheck } from "lucide-react"
import { StatusStrip } from "@/components/ds/status-strip"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ProfileCard() {
  return (
    <StatusStrip
      className="max-w-sm"
      status={
        <>
          <CircleCheck aria-hidden />
          Copy review complete
        </>
      }
    >
      <Card variant="inverse">
        <CardHeader>
          <CardTitle>Harsh</CardTitle>
          <CardDescription>UX writer · 4 projects</CardDescription>
          <Badge variant="status">Available for work</Badge>
        </CardHeader>
      </Card>
    </StatusStrip>
  )
}
```

## Accessibility

- The strip is a plain `<p>` with no live region. It is read in document order after the card. If the status changes while the user is on the page and needs announcing, add `role="status"` through a wrapper.
- The text is near-black (`--text-on-accent`) on `--success` green, never white.
- Mark decorative icons in `status` with `aria-hidden`.

## Plugin parity

Status: Not started (web only). The Figma plugin would need a card-plus-strip component with the strip tucked under the card radius, using the token values from `build/plugin-tokens.css`.
