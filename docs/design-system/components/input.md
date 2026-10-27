# Input

**Import:** `import { Input } from "@/components/ui/input"`

## Purpose

Single-line text field with 12px corners (`--radius-field`). It can show a leading icon, for example for search. Built on the base-ui `Input` primitive.

## When to use / When not to use

- Use for short free text: names, emails, search, URLs.
- Always pair it with a `Label`.
- Don't use for multi-line text. Use `Textarea`.
- Don't use for fixed choices. Use `Select` (5 or more options) or `SegmentedControl` (2 to 4).

## Anatomy

- Field: a 44px-high field with `--radius-field` corners, a subtle border and the `--input-bg` fill.
- Placeholder: shown in `--text-secondary`.
- Optional leading icon: the `leadingIcon` prop. It sits 16px from the left, is 16px in size, uses `--text-secondary`, and is `aria-hidden`. Passing it wraps the input in a relative `<div>` and increases the left padding.

## Variants and sizes

| Name | Look | Use for |
| --- | --- | --- |
| Default | Rounded field, no icon | Standard text entry |
| With `leadingIcon` | Icon inside the left edge | Search and other fields with a clear icon |

There is one size: 44px high with `--type-body-sm` text.

## States

- **Default:** `--input-bg` fill, `--border-subtle` border.
- **Hover:** the fill changes to `--surface-solid`.
- **Focus (keyboard):** the fill changes to `--surface-solid`, and a 2px `--focus-ring` (near-black) outline appears, offset 2px.
- **Error:** set `aria-invalid`. The border changes to `--danger`, and the focus outline is also `--danger`. Show the reason in an `InlineMessage variant="error"` below the field.
- **Disabled:** `--surface-muted` fill, `--text-tertiary` text, not-allowed cursor.

## Tokens used

`--input-bg`, `--surface-solid`, `--surface-muted`, `--border-subtle`, `--text-primary`, `--text-secondary`, `--text-tertiary`, `--danger`, `--focus-ring`, `--radius-field`, `--type-body-sm`, `--duration-fast`, `--ease-out`

## Example

```tsx
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { InlineMessage } from "@/components/ui/inline-message"
import { Label } from "@/components/ui/label"

export function EmailField({ error }: { error?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="you@company.com"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "email-error" : undefined}
      />
      {error && <InlineMessage id="email-error" variant="error">{error}</InlineMessage>}
      <Input aria-label="Search projects" leadingIcon={<Search />} placeholder="Search" />
    </div>
  )
}
```

## Accessibility

- Connect a `Label` with `htmlFor` and `id`. Use `aria-label` only when there is no visible label, as with a search field.
- The leading icon is `aria-hidden`, so it never replaces a label.
- For errors, set `aria-invalid` and point `aria-describedby` at the `InlineMessage`. The message itself is announced through `role="alert"`.
- The focus ring is a near-black 2px outline offset by 2px, or red when the field is invalid.
- Placeholder text uses `--text-secondary`. Don't use it as the only label.

## Plugin parity

Status: Not started (web only). The Figma plugin would need an input component with default, hover, focus, error and disabled states and an optional icon slot, using the token values from `build/plugin-tokens.css`.
