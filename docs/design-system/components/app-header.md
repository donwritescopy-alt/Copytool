# AppHeader

**Import:** `import { AppHeader } from "@/components/ds/app-header"`

## Purpose
The top bar on signed-in pages: product name (links home) on the left; the user's avatar, name and actions on the right.

## When to use / When not to use
- ✅ Once, in the signed-in layout (`/dashboard`).
- ❌ Sign-up, log-in, check-your-email and plugin approval pages (use the auth layout pattern in `patterns.md`).

## Anatomy
- Floating glass pill that sticks 16px from the top
- Product name: link to `homeHref` (default `/dashboard`)
- Avatar (sm)
- User's name: hidden on small screens
- Actions slot (`children`), e.g. a log-out form

## Variants and sizes
One style.

## States
- **Product name:** focus shows a 2px `--focus-ring` outline.
- **Actions:** use their own component states.
- **Glass:** without `backdrop-filter` support, or with reduced transparency, it becomes near-solid white automatically.

## Tokens used
`--surface-glass`, `--glass-blur`, `--glass-saturate`, `--border-glass`, `--shadow-card`, `--radius-pill`, `--text-primary`, `--type-body`, `--type-body-sm`, `--focus-ring`, plus Avatar tokens

## Example
```tsx
<AppHeader name={displayName} avatarSrc={avatarUrl}>
  <form action={signOut}>
    <Button type="submit" variant="secondary" size="sm">Log out</Button>
  </form>
</AppHeader>
```

`displayName` comes from the user's saved name, with the email as a fallback.

## Accessibility
- It renders a `<header>` landmark.
- The name is visible text on wider screens. On narrow screens only the avatar shows, so keep the full name available elsewhere (e.g. account settings).
- Every action inside must have a visible label or an `aria-label`.
