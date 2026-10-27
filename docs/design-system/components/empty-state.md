# EmptyState

**Import:** `import { EmptyState } from "@/components/ds/empty-state"`

## Purpose
What a list shows when it has nothing in it yet. It says what will appear here and offers the one next step, so the screen teaches instead of dead-ending.

## When to use / When not to use
- ✅ No projects yet, no results yet, a search with no matches.
- ❌ Errors (use InlineMessage).
- ❌ Loading (use skeletons).
- ❌ Onboarding with several steps (use SetupChecklist).

## Anatomy
- Icon (optional) in a white raised circle
- Title: one short line ("No projects yet")
- Description (optional): one sentence on what to do and why
- Action (optional): one button

## Variants and sizes
One style, centred. Place it inside a Card when it replaces a card grid, or directly on the page when it replaces a list.

## States
None of its own. The action button has its own states.

## Tokens used
`--surface-solid`, `--shadow-raised`, `--radius-pill`, `--text-primary`, `--text-secondary`, `--type-body`, `--type-body-sm`, `--weight-medium`

## Example
```tsx
<Card>
  <EmptyState
    icon={<FolderPlus />}
    title="No projects yet"
    description="A project holds your brand's voice, audience and words to avoid. Audits use it to suggest copy."
    action={<Button render={<Link href="/dashboard/projects/new" />}>Set up your brand</Button>}
  />
</Card>
```

## Accessibility
- The icon is decorative (`aria-hidden`); the title carries the meaning.
- Keep it to one action so keyboard users reach it in one Tab.
- Write the title and description in plain language. Say what to do, not "Nothing here".
