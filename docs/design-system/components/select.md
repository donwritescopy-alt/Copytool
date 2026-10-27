# Select

**Import:** `import { Select, SelectLabel, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"`

## Purpose

Pick one option from a list of 5 or more, such as a writer persona or a channel. Built on the base-ui `Select`.

## When to use / When not to use

- Use for 5 or more options that don't all need to be visible at once.
- Pass `items` to `Select` so the trigger shows labels instead of raw values.
- Pass `name` so the value is submitted with a form.
- Don't use for 2 to 4 options. Use `SegmentedControl`.
- Don't use for free text. Use `Input`.

## Anatomy

- `Select`: the root (base-ui `Select.Root`). It holds the value, `items`, `name`, `defaultValue` and `disabled`.
- `SelectLabel`: the field label, wired to the select automatically.
- `SelectTrigger`: a 44px button with `--radius-field` corners (same as Input) with a chevron that rotates 180° while open.
- `SelectValue`: the selected label, or the placeholder in `--text-secondary`.
- `SelectContent`: the popup. It is portalled, sits 6px below the trigger (`sideOffset`), is at least as wide as the trigger, and has `--radius-panel` corners and `--shadow-card`.
- `SelectItem`: one option with a check mark when selected (`--radius-tight` corners).

## Variants and sizes

| Name | Look | Use for |
| --- | --- | --- |
| Default | Rounded trigger, white rounded popup | All single-choice lists |

It has one size: a 44px trigger, at least 160px wide, with `--type-body-sm` text.

## States

- **Trigger hover / open:** the fill changes from `--input-bg` to `--surface-solid`, and the chevron rotates.
- **Trigger focus (keyboard):** 2px `--focus-ring` (near-black) outline, offset 2px.
- **Trigger error:** set `aria-invalid` on `SelectTrigger`. The border changes to `--danger`.
- **Disabled:** `--surface-muted` fill and `--text-tertiary` text on the trigger. A disabled item shows `--text-tertiary`.
- **Item highlighted** (hover or arrow keys): `--surface-muted` fill.
- **Popup open/close:** fades and scales from 98% over `--duration-fast`.

## Tokens used

`--input-bg`, `--surface-solid`, `--surface-muted`, `--border-subtle`, `--text-primary`, `--text-secondary`, `--text-tertiary`, `--danger`, `--focus-ring`, `--radius-field`, `--radius-panel`, `--radius-tight`, `--shadow-card`, `--type-label`, `--type-body-sm`, `--duration-fast`, `--ease-out`

## Example

```tsx
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

const personas = [
  { value: "friendly", label: "Friendly guide" },
  { value: "expert", label: "Calm expert" },
  { value: "playful", label: "Playful" },
  { value: "formal", label: "Formal" },
  { value: "minimal", label: "Minimalist" },
]

export function PersonaSelect() {
  return (
    <Select name="persona" items={personas} defaultValue="friendly">
      <div className="flex flex-col gap-2">
        <SelectLabel>Writer persona</SelectLabel>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
      </div>
      <SelectContent>
        {personas.map((p) => (
          <SelectItem key={p.value} value={p.value}>
            {p.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

## Accessibility

- base-ui provides listbox semantics. The trigger opens with Enter, Space or the arrow keys. Arrow keys move the highlight, Enter selects, Escape closes, and typing jumps to a matching item.
- `SelectLabel` is linked to the trigger by base-ui. Use it, or a `Label` with `htmlFor` and `id`.
- The chevron and check icons are `aria-hidden`.
- With `name`, base-ui renders a hidden input, so the value submits with native forms and server actions.
- The trigger focus ring is a near-black 2px outline offset by 2px.

## Plugin parity

Status: Not started (web only). The Figma plugin would need a trigger plus a popup list component with highlighted, selected and disabled item states, using the token values from `build/plugin-tokens.css`.
