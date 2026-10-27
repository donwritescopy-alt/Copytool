# Badge

**Import:** `import { Badge } from "@/components/ui/badge"`

## Purpose

Small label that can't be clicked. It marks a highlight ("4x Pro"), an inactive state ("Invited") or a live status ("Available for work"). It renders a `<span>`.

## When to use / When not to use

- Use `accent` to highlight a plan, feature or count.
- Use `neutral` for a passive or pending state.
- Use `status` for a dot plus text, usually inside a profile or status card.
- Don't use it as a button. If people can click it, use `Button size="sm"`.
- Don't use it for errors. Use `InlineMessage variant="error"`.

## Anatomy

- Container: a pill for `accent` and `neutral`. `status` has no container.
- Label: the `children`.
- Dot (`status` only): an 8px circle in `--success`, drawn with `::before`.

## Variants and sizes

| Name | Look | Use for |
| --- | --- | --- |
| `accent` (default) | 28px lime pill, near-black text | Highlights ("4x Pro", "New") |
| `neutral` | 28px muted-grey pill, secondary text | Inactive or pending states ("Invited") |
| `status` | Green dot plus secondary text, no pill | Live status line ("Available for work") |

There is one size. Text uses `--type-label` at medium weight. `status` uses regular weight.

## States

Badges are static: they have no hover, focus or disabled states.

- **On an inverse card:** inside `Card variant="inverse"`, the `status` text switches from `--text-secondary` to `--text-inverse-secondary` automatically, through `group-data-[variant=inverse]/card`.

## Tokens used

`--accent`, `--text-on-accent`, `--surface-muted`, `--text-secondary`, `--text-inverse-secondary`, `--success`, `--radius-pill`, `--type-label`, `--weight-medium`

## Example

```tsx
import { Badge } from "@/components/ui/badge"

export function PlanBadges() {
  return (
    <div className="flex items-center gap-2">
      <Badge>4x Pro</Badge>
      <Badge variant="neutral">Invited</Badge>
      <Badge variant="status">Available for work</Badge>
    </div>
  )
}
```

## Accessibility

- It is a plain `<span>` with no role, so screen readers read it as inline text. Make sure the text makes sense on its own.
- The `status` dot is decorative (`::before`, with no content). Its meaning must be in the text, not in the colour alone.
- Text on lime is always near-black (`--text-on-accent`).

## Plugin parity

Status: Not started (web only). The Figma plugin would need a badge component with `accent`, `neutral` and `status` variants, using the token values from `build/plugin-tokens.css`.
