# InlineMessage

**Import:** `import { InlineMessage } from "@/components/ui/inline-message"`

## Purpose

One line of feedback placed next to the thing it is about. It renders a `<p>` with an icon and text. `error` is the **only** place red appears in the system.

## When to use / When not to use

- Use `error` for form and validation failures, directly under the field.
- Use `info` for a neutral hint.
- Use `success` to confirm that an action finished.
- Don't use for page-level announcements.
- Don't use for anything that needs a dismiss or action button.
- Don't use red anywhere else to signal danger.

## Anatomy

- Icon: chosen by the variant (`CircleAlert`, `Info` or `CircleCheck`). It is 16px and `aria-hidden`.
- Text: the `children`, wrapped in a `<span>`.

## Variants and sizes

| Name | Look | Use for |
| --- | --- | --- |
| `info` (default) | Info icon, `--text-secondary` | Hints, helper text |
| `error` | Alert icon, `--danger-text` (red) | Form and validation errors only |
| `success` | Check icon, `--text-primary` | Confirmation that an action finished |

There is one size: `--type-body-sm`.

## States

It is static, with no hover, focus or disabled state. The variant sets the text and icon colour through `currentColor`.

## Tokens used

`--danger-text`, `--text-secondary`, `--text-primary`, `--type-body-sm`

## Example

```tsx
import { InlineMessage } from "@/components/ui/inline-message"

export function FormFeedback({ error, saved }: { error?: string; saved: boolean }) {
  if (error) return <InlineMessage id="form-error" variant="error">{error}</InlineMessage>
  if (saved) return <InlineMessage variant="success">Project saved.</InlineMessage>
  return <InlineMessage>Changes save when you press Save.</InlineMessage>
}
```

## Accessibility

- `error` renders with `role="alert"`, so it is announced right away when it appears.
- `info` and `success` render with `role="status"` (polite), so they are announced without interrupting.
- Live regions announce changes. Mount the message when the error or confirmation happens, not before.
- Give the error an `id` and reference it from the field's `aria-describedby`, alongside `aria-invalid` on the field.
- The icon is `aria-hidden`. The meaning is in the text, not in the colour.
- Error text uses `--danger-text` (red-600). `--danger` (red-500) is used only for invalid field borders and focus outlines.

## Plugin parity

Status: Not started (web only). The Figma plugin would need an icon-plus-text component with `info`, `error` and `success` variants, using the token values from `build/plugin-tokens.css`.
