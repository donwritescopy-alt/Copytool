# Avatar

**Import:** `import { Avatar } from "@/components/ui/avatar"`

## Purpose
A circle that shows the user's photo, or their initials when there's no photo (or it fails to load).

## When to use / When not to use
- ✅ Next to a person's name: AppHeader, member lists.
- ❌ As a decorative icon or a button on its own. Wrap it in a Button/IconButton if it must be clickable.

## Anatomy
- Circle (lime background)
- Photo (optional, from `src`)
- Initials fallback: first letter of the first and last word of `name` ("Sam Lee" → "SL", "Sam" → "S")

## Variants and sizes
| Size | Look | Use for |
| --- | --- | --- |
| `sm` | 32px, caption text | Headers, dense rows |
| `md` (default) | 40px, label text | Profile cards |

## States
- **Photo loaded:** shows the photo.
- **No photo / loading / failed:** shows the initials on lime.

## Tokens used
`--accent`, `--text-on-accent`, `--radius-pill`, `--type-caption`, `--type-label`, `--weight-medium`

## Example
```tsx
<Avatar name="Sam Lee" src={user.avatarUrl} size="sm" />
<span>Sam Lee</span>
```

## Accessibility
- The avatar is hidden from screen readers (the photo has empty alt text, and the initials are `aria-hidden`), because the name is always shown next to it. If you ever show an avatar without a visible name, add a visually hidden name.
- Near-black initials on lime pass contrast easily.
