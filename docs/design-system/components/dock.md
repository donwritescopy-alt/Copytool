# Dock

**Import:** `import { Dock, DockItem, DockAction } from "@/components/ds/dock"`

## Purpose

Floating glass pill navigation. Each item has an icon and a label, the active item is shown in near-black, and there is at most one glow action. It renders a `<nav>` with a `<ul>`.

## When to use / When not to use

- Use for the primary destinations of a small app (5 or fewer).
- Use one `DockAction` for the single hero action (for example "New project"). This counts as the screen's one glow button.
- Don't use for in-page filters. Use `SegmentedControl`.
- Don't use for long menus or secondary navigation.
- Place it over the gradient canvas. Glass needs that background to read as glass.

## Anatomy

- `Dock`: the glass pill container (`<nav>`), with 16px horizontal and 8px vertical padding, `--shadow-card` and a white glass rim.
- `DockItem`: a Next.js `Link` inside an `<li>`, with a 24px icon stacked above a `--type-caption` label. Props: `href`, `icon`, `label`, `active`, `className`.
- `DockAction`: a `Button variant="glow"` inside an `<li>`, 56px × 96px, with a 24px icon. Props: `icon`, `label`, plus any Button props except `children` and `variant`.

## Variants and sizes

| Name | Look | Use for |
| --- | --- | --- |
| `DockItem` | Icon over a caption label, `--text-secondary` | A destination |
| `DockItem active` | Same, in `--text-primary` | The current page |
| `DockAction` | Lime glow pill, icon only | The single hero action |

There is one size.

## States

- **DockItem hover:** the text and icon change from `--text-secondary` to `--text-primary`.
- **DockItem active:** `aria-current="page"` turns it `--text-primary`.
- **DockItem focus (keyboard):** 2px `--focus-ring` (near-black) outline, offset 2px, with `--radius-panel` corners.
- **DockAction:** has the `Button` glow states: it brightens on hover, scales to 98% and dims when pressed, shows the near-black focus ring, and turns muted when disabled.
- **Reduced transparency:** the dock becomes opaque white.

## Tokens used

`--surface-glass`, `--glass-blur`, `--glass-saturate`, `--border-glass`, `--shadow-card`, `--radius-pill`, `--radius-panel`, `--text-primary`, `--text-secondary`, `--focus-ring`, `--type-caption`, `--accent`, `--text-on-accent`, `--gradient-accent-glow`, `--shadow-glow-accent`, `--duration-fast`, `--ease-out`

## Example

```tsx
import { FolderOpen, Home, Plus, Settings } from "lucide-react"
import { Dock, DockAction, DockItem } from "@/components/ds/dock"

export function AppDock({ pathname }: { pathname: string }) {
  return (
    <Dock aria-label="Main" className="fixed bottom-6 left-1/2 -translate-x-1/2">
      <DockItem href="/dashboard" icon={<Home />} label="Home" active={pathname === "/dashboard"} />
      <DockItem href="/dashboard/projects" icon={<FolderOpen />} label="Projects" active={pathname.startsWith("/dashboard/projects")} />
      <DockAction icon={<Plus />} label="New project" />
      <DockItem href="/dashboard/settings" icon={<Settings />} label="Settings" active={pathname === "/dashboard/settings"} />
    </Dock>
  )
}
```

## Accessibility

- It renders `<nav>` with a list. Give it an `aria-label` (for example "Main") when the page has more than one nav.
- The active item gets `aria-current="page"`. Set `active` from the current route, because Dock doesn't detect it.
- The `DockItem` icon is `aria-hidden`, and the visible label is the link name.
- `DockAction` is icon-only. Its `label` prop is **required** and becomes the button's `aria-label`.
- The focus ring is a near-black 2px outline offset by 2px on both items and the action.
- Active and inactive items differ by colour only. Keep labels short and clear so the current page is also clear from context.

## Plugin parity

Status: Not started (web only). The Figma plugin would need a glass dock frame with item (default and active) and glow-action components, using the token values from `build/plugin-tokens.css`.
