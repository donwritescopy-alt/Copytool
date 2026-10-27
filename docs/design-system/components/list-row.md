# ListRow

**Import:** `import { ListRow } from "@/components/ds/list-row"`

## Purpose

One row with a title, an optional secondary line and an optional trailing action, as in an invite list. Stack rows inside a Card with a gap.

## When to use / When not to use

- Use for lists of people, projects or items, each with at most one action.
- Stack rows in a `CardContent` with `flex flex-col gap-4` (or similar).
- Don't use for key/value data. Use `StatRow`.
- Don't make the whole row a link when it also contains a button. Nested interactive elements break keyboard and screen-reader use.

## Anatomy

- `title`: the main line, in `--text-primary`. It is truncated with an ellipsis.
- `description` (optional): the secondary line, in `--text-secondary`. It is also truncated.
- `trailing` (optional): a right-aligned slot that never shrinks, usually a `Button size="sm"`, a `Badge` or an `IconButton`.

## Variants and sizes

| Name | Look | Use for |
| --- | --- | --- |
| Title only | One line | Simple lists |
| Title + description | Two lines, the second in secondary text | People with emails, projects with dates |
| With `trailing` | An action or badge on the right | Invite / Resend, status badges |

There is one size. Both lines use `--type-body-sm`.

## States

The row itself can't be interacted with. Hover, focus and disabled states belong to whatever is in `trailing`.

## Tokens used

`--text-primary`, `--text-secondary`, `--type-body-sm`

## Example

```tsx
import { ListRow } from "@/components/ds/list-row"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function InviteList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite your team</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ListRow title="Maya Chen" description="maya@studio.com" trailing={<Badge variant="neutral">Invited</Badge>} />
        <ListRow title="Leo Park" description="leo@studio.com" trailing={<Button size="sm">Invite</Button>} />
      </CardContent>
    </Card>
  )
}
```

## Accessibility

- It is a plain `<div>`. For a real list, wrap rows in `<ul>`/`<li>`, or add `role="list"` and `role="listitem"`.
- Truncated text is cut off visually. Put the full value in `title` on the element (or make sure it appears elsewhere) if users need it.
- A trailing `Button` or `IconButton` needs an accessible name that includes which row it acts on, for example `aria-label="Invite Leo Park"`.

## Plugin parity

Status: Not started (web only). The Figma plugin would need a two-line row component with a trailing slot, using the token values from `build/plugin-tokens.css`.
