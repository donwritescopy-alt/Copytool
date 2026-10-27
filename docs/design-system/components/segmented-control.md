# SegmentedControl

**Import:** `import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control"`

## Purpose

Choose exactly one of 2 to 4 short options, such as a narrative stance. Built on the base-ui `RadioGroup` and `Radio`, so it behaves like a radio group and submits with a form.

## When to use / When not to use

- Use for 2 to 4 short options where seeing every option at once helps the choice.
- Pass `name` to submit with a form, and `defaultValue` (or `value` + `onValueChange`) to set the selection.
- Don't use for 5 or more options. Use `Select`.
- Don't use for switching page sections or routes. Use `Dock` or tabs.

## Anatomy

- `SegmentedControl`: the track. It is a pill with a subtle border, the `--input-bg` fill and 4px padding.
- `SegmentedControlItem`: one 36px pill option. The selected one is raised onto a white fill. Each item needs a `value`. An optional svg is sized to 16px.

## Variants and sizes

| Name | Look | Use for |
| --- | --- | --- |
| Default | Grey pill track, white raised selected segment | All 2–4 option choices |

It has one size: 36px items with `--type-label` text inside a 46px track.

## States

- **Unselected:** `--text-secondary`, no fill.
- **Hover:** the text changes to `--text-primary`.
- **Selected (`data-checked`):** `--surface-solid` fill, `--text-primary` text and `--shadow-raised`.
- **Focus (keyboard):** 2px `--focus-ring` (near-black) outline, offset 2px, on the focused item.
- **Disabled item:** `--text-tertiary`, not-allowed cursor.
- **Disabled group:** the whole track drops to 60% opacity.

## Tokens used

`--input-bg`, `--surface-solid`, `--border-subtle`, `--text-primary`, `--text-secondary`, `--text-tertiary`, `--focus-ring`, `--radius-pill`, `--shadow-raised`, `--type-label`, `--duration-fast`, `--ease-out`

## Example

```tsx
import { Label } from "@/components/ui/label"
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control"

export function StanceField() {
  return (
    <div className="flex flex-col gap-2">
      <Label id="stance-label">Narrative stance</Label>
      <SegmentedControl name="stance" defaultValue="second" aria-labelledby="stance-label">
        <SegmentedControlItem value="first">We</SegmentedControlItem>
        <SegmentedControlItem value="second">You</SegmentedControlItem>
        <SegmentedControlItem value="neutral">Neutral</SegmentedControlItem>
      </SegmentedControl>
    </div>
  )
}
```

## Accessibility

- base-ui renders `role="radiogroup"` with `role="radio"` items. Tab moves focus into and out of the group (onto the selected item), and the arrow keys move and select within it.
- A `<label htmlFor>` can't name a radiogroup. Give the group a name with `aria-labelledby` pointing at a visible label, or with `aria-label`.
- With `name`, base-ui renders hidden inputs so the value submits with the form.
- The focus ring is a near-black 2px outline offset by 2px.
- The selected item differs by fill, shadow and text colour, not by colour alone.

## Plugin parity

Status: Not started (web only). The Figma plugin would need a segmented track component with 2–4 item slots and selected, hover and disabled states, using the token values from `build/plugin-tokens.css`.
