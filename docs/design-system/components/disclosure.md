# Disclosure

**Import:** `import { Disclosure } from "@/components/ui/disclosure"`

## Purpose
A section that opens and closes, so optional or advanced content doesn't crowd a form. Built on base-ui Collapsible.

## When to use / When not to use
- ✅ "More detail (optional)" in Brand setup (key terminology, words to avoid).
- ✅ Secondary info a few users need.
- ❌ Required fields. Users will miss them.
- ❌ Error messages. Errors must always be visible.
- ❌ Switching between views (use SegmentedControl).

## Anatomy
- Trigger: title text + chevron (turns 180° when open)
- Panel: the hidden content, with a 12px gap above it

## Variants and sizes
One style. Pass `defaultOpen` to start open, or `open` + `onOpenChange` to control it.

## States
| State | What changes |
| --- | --- |
| Closed | Chevron points down; panel height 0 |
| Open | Chevron points up; panel slides to full height (`--duration-base`, `--ease-out`) |
| Hover | Title turns `--text-secondary` |
| Focus | 2px `--focus-ring` outline, 2px offset |
| Reduced motion | No slide; opens instantly |

## Tokens used
`--text-primary`, `--text-secondary`, `--type-body-sm`, `--weight-medium`, `--focus-ring`, `--radius-pill`, `--duration-fast`, `--duration-base`, `--ease-out`

## Example
```tsx
<Disclosure title="More detail (optional)">
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <Label htmlFor="key_terminology">Key terminology</Label>
      <Textarea id="key_terminology" name="key_terminology" />
    </div>
  </div>
</Disclosure>
```

## Accessibility
- The trigger is a real button with `aria-expanded`, and it's linked to the panel (handled by base-ui).
- Closed content uses `hidden="until-found"`, so the browser's find-in-page (Cmd/Ctrl+F) can still find and open it.
- Fields inside a closed panel still submit with the form.
