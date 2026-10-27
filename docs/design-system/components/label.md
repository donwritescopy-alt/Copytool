# Label

**Import:** `import { Label } from "@/components/ui/label"`

## Purpose

The visible name of a form field. It renders a native `<label>`.

## When to use / When not to use

- Use above every `Input`, `Textarea`, `Select` trigger or `SegmentedControl`.
- Connect it with `htmlFor`, or wrap the control inside it.
- Don't use it as general body text or as a section heading.
- Inside a base-ui `Select`, you can use `SelectLabel` instead, which is wired to the Select automatically.

## Anatomy

- Text: the `children`.
- Optional inline icon or hint: children laid out in a row with an 8px gap.

## Variants and sizes

| Name | Look | Use for |
| --- | --- | --- |
| Default | `--type-label` (13px), medium weight, `--text-primary` | All field labels |

There are no variants and only one size.

## States

- **Default:** `--text-primary`.
- **Disabled:** the text changes to `--text-tertiary` in two cases. One is when the label comes right after a disabled `peer` control. The other is when it is inside a `group` with `data-disabled="true"`. In the group case, pointer events are also turned off.

## Tokens used

`--text-primary`, `--text-tertiary`, `--type-label`, `--weight-medium`

## Example

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function NameField() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="project-name">Project name</Label>
      <Input id="project-name" name="name" required />
    </div>
  )
}
```

## Accessibility

- A native `<label>` with `htmlFor` gives the control its accessible name, and clicking the label focuses the control.
- `select-none` stops label text being selected by accident on double-click.
- Mark required fields in the text (for example "Name (required)") or with `required` on the control. Don't rely on colour alone.

## Plugin parity

Status: Not started (web only). The Figma plugin would need a text style for `--type-label` at medium weight, using the token values from `build/plugin-tokens.css`.
