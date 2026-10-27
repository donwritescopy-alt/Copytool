# SetupChecklist

**Import:** `import { SetupChecklist } from "@/components/ds/setup-checklist"`

## Purpose
Shows the few steps a new user must finish to get value (e.g. Set up your brand → Connect the Figma plugin → Run your first audit), and gives one obvious next action.

## When to use / When not to use
- ✅ On Home, until every step is done. Then stop rendering it.
- ✅ 2–5 steps that happen in order.
- ❌ Long task lists, optional tips, or anything the user can't actually complete.
- ❌ Progress inside a single form (just use the form).

## Anatomy
- Card (glass) with title (default "Get set up") and "N of M done"
- Ordered list of steps. Each has:
  - A marker: number, or a check when done
  - A title
  - A description (hidden once done)
  - An action: shown **only on the current step**

## Variants and sizes
No variants. Each step's look comes from its `status`:

| Status | Marker | Text | Row |
| --- | --- | --- | --- |
| `done` | Green circle with check | Primary text, struck through; description hidden | Plain |
| `current` | Lime circle with number | Primary text + description + action | White, raised |
| `upcoming` | Grey circle with number | Secondary text + description | Plain |

Work out each status from real data (see `flows/web-app-flow.md`); don't let users tick steps by hand.

## States
- **Action button:** use its own states. The current step's action is normally the screen's one `Button variant="glow"`.
- **All done:** don't render the checklist.

## Tokens used
`--success`, `--accent`, `--text-on-accent`, `--surface-muted`, `--surface-solid`, `--shadow-raised`, `--text-primary`, `--text-secondary`, `--text-tertiary`, `--radius-panel`, `--radius-pill`, `--type-label`, `--type-body-sm`, plus Card tokens

## Example
```tsx
<SetupChecklist
  steps={[
    { title: "Set up your brand", status: "done" },
    {
      title: "Connect the Figma plugin",
      description: "Open UX Copy Tool in Figma and click Log in.",
      status: "current",
      action: <Button variant="glow">How to connect</Button>,
    },
    { title: "Run your first audit", description: "Select text in Figma and run an audit.", status: "upcoming" },
  ]}
/>
```

## Accessibility
- It's an ordered list (`<ol>`), so screen readers announce "1 of 3".
- The current step has `aria-current="step"`.
- Done steps add a hidden "(done)" so the state isn't conveyed by strike-through and colour alone.
- Step titles must be unique (they're used as keys).
