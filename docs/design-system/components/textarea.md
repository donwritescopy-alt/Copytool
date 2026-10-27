# Textarea

**Import:** `import { Textarea } from "@/components/ui/textarea"`

## Purpose

Multi-line text field that grows with its content (`field-sizing: content`). It looks the same as `Input`, with the same `--radius-field` corners.

## When to use / When not to use

- Use for longer free text: briefs, descriptions, copy to review.
- Always pair it with a `Label`.
- Don't use for one-line answers. Use `Input`.

## Anatomy

- Field: a native `<textarea>` at least 96px high, with 16px horizontal and 12px vertical padding, `--radius-field` (12px) corners, a subtle border and the `--input-bg` fill.
- Placeholder: shown in `--text-secondary`.

## Variants and sizes

| Name | Look | Use for |
| --- | --- | --- |
| Default | Rounded panel field, grows with content | All multi-line entry |

It has no variants. The minimum height is 96px (`min-h-24`). Override it with `className` (for example `min-h-40`) when you expect longer text.

## States

- **Default:** `--input-bg` fill, `--border-subtle` border.
- **Hover:** the fill changes to `--surface-solid`.
- **Focus (keyboard):** the fill changes to `--surface-solid`, and a 2px `--focus-ring` (near-black) outline appears, offset 2px.
- **Error:** set `aria-invalid`. The border and the focus outline change to `--danger`.
- **Disabled:** `--surface-muted` fill, `--text-tertiary` text, not-allowed cursor.

## Tokens used

`--input-bg`, `--surface-solid`, `--surface-muted`, `--border-subtle`, `--text-primary`, `--text-secondary`, `--text-tertiary`, `--danger`, `--focus-ring`, `--radius-field`, `--type-body-sm`, `--duration-fast`, `--ease-out`

## Example

```tsx
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function BriefField() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="brief">Project brief</Label>
      <Textarea id="brief" name="brief" placeholder="What is this screen for, and who reads it?" />
    </div>
  )
}
```

## Accessibility

- Connect a `Label` with `htmlFor` and `id`.
- For errors, set `aria-invalid` and point `aria-describedby` at an `InlineMessage variant="error"`.
- The focus ring is a near-black 2px outline offset by 2px, or red when the field is invalid.
- Auto-grow means the content never scrolls inside a fixed box. Keep the page scrollable around it.

## Plugin parity

Status: Not started (web only). The Figma plugin would need a multi-line field with `--radius-field` corners and the same states as Input, using the token values from `build/plugin-tokens.css`.
