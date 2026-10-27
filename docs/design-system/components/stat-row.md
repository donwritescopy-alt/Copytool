# StatRow

**Import:** `import { StatRow } from "@/components/ds/stat-row"`

## Purpose

A label on the left and a value on the right, as in "Call Duration · 21.02.2025". It renders a `<div>` containing a `<dt>` and a `<dd>`, so a group of rows must be wrapped in a `<dl>`.

## When to use / When not to use

- Use for read-only key/value facts: dates, durations, counts, plan details.
- Use `size="lg"` for the headline pair, such as a name and a duration.
- Always wrap rows in a `<dl>`.
- Don't use for rows people act on. Use `ListRow`.

## Anatomy

- `label`: rendered in a `<dt>` on the left. It can shrink.
- `value`: rendered in a `<dd>` on the right. It never shrinks and uses `tabular-nums` so digits line up.
- The two are aligned on their text baseline.

## Variants and sizes

| Name | Look | Use for |
| --- | --- | --- |
| `sm` (default) | `--type-body-sm`, `--text-secondary` for both | Supporting facts |
| `lg` | Label `--type-title-sm`, value `--type-title`, medium weight, `--text-primary` | The headline pair at the top of a card |

## States

It is static, with no interactive states. The value inherits the row colour. To emphasise one value, pass a styled element as `value`.

## Tokens used

`--text-primary`, `--text-secondary`, `--type-body-sm`, `--type-title-sm`, `--type-title`, `--weight-medium`

## Example

```tsx
import { StatRow } from "@/components/ds/stat-row"
import { Card, CardContent } from "@/components/ui/card"

export function CallSummary() {
  return (
    <Card variant="solid">
      <CardContent>
        <dl className="flex flex-col gap-3">
          <StatRow size="lg" label="Ana Silva" value="12:48" />
          <StatRow label="Call Duration" value="21.02.2025" />
          <StatRow label="Participants" value="4" />
        </dl>
      </CardContent>
    </Card>
  )
}
```

## Accessibility

- The `<dl>`/`<dt>`/`<dd>` structure tells screen readers that each label belongs to its value. Without the `<dl>` wrapper the HTML is invalid.
- On an inverse card, set the colour with `className` (for example `text-inverse-secondary`), because StatRow does not switch automatically.

## Plugin parity

Status: Not started (web only). The Figma plugin would need a label/value row component in `sm` and `lg` sizes, using the token values from `build/plugin-tokens.css`.
