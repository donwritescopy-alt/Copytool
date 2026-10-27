# Design patterns

Recipes for putting the design system together. The token names are in [tokens.md](./tokens.md). The reference images are in [`inspiration/`](./inspiration/).

Imports used below:

```tsx
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card"
import { IconButton } from "@/components/ui/icon-button"
import { InlineMessage } from "@/components/ui/inline-message"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Dock, DockItem, DockAction } from "@/components/ds/dock"
import { ListRow } from "@/components/ds/list-row"
import { StatRow } from "@/components/ds/stat-row"
import { StatusStrip } from "@/components/ds/status-strip"
```

---

## 1. Gradient canvas

**When:** on every page, automatically.
**Tokens:** `--surface-canvas` and `--gradient-canvas`. `body` already applies `bg-surface-canvas bg-gradient-canvas bg-fixed` in `globals.css`.
**Source:** the backgrounds of all the inspiration images.

- Don't put an opaque background on page wrappers. It hides the canvas, and glass then has nothing to blur.
- Glass only works with the canvas behind it. On a solid area (such as a modal over white), use `Card variant="solid"` instead.

```tsx
// Nothing to add: just don't cover the body.
<main className="mx-auto max-w-3xl p-6">{/* glass cards here */}</main>
```

## 2. Glass card

**When:** the default container for one topic on the canvas.
**Uses:** `Card` (`variant="glass"` is the default), which applies `glass`, `border-glass`, `rounded-card` and `shadow-card`.
**Source:** `03-list-rows-stat-rows.png`, `02-dock-search-glow-action.png`.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Invite to Home</CardTitle>
    <CardDescription>Find friends on other apps.</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
</Card>
```

Don't nest cards. For sections inside a card, use `ListRow`s or a `bg-surface-muted rounded-panel` panel. Use `size="sm"` for compact cards (16px padding).

## 3. Promo / upsell card

**When:** one upsell or feature announcement per screen.
**Uses:** `Card variant="tinted"` (`bg-gradient-card-lime`), `Badge variant="accent"`, `IconButton` close (secondary, with an `aria-label`), and `Button variant="secondary"` with `arrow`. Use `variant="gradient"` if you don't want the lime tint.
**Source:** `04-upgrade-card-gradient.png`.

```tsx
<Card variant="tinted" className="max-w-sm">
  <CardHeader>
    <Badge>4x Pro</Badge>
    <CardAction>
      <IconButton aria-label="Dismiss" size="sm" onClick={onDismiss}>
        <X />
      </IconButton>
    </CardAction>
  </CardHeader>
  <CardContent className="flex flex-col gap-2">
    <CardTitle>Upgrade To Pro</CardTitle>
    <CardDescription>Unlock automations and unlimited escalation rules.</CardDescription>
  </CardContent>
  <CardFooter>
    <Button variant="secondary" size="lg" arrow className="w-full">Upgrade plan</Button>
  </CardFooter>
</Card>
```

## 4. List of rows

**When:** a short list of people or items, each with one action.
**Uses:** `ListRow` (title, plus a `text-secondary` description and a `trailing` slot) stacked in a Card. The action is `Button size="sm"` (primary/lime). For a state that's already done, use a **disabled** button, which renders `bg-surface-muted text-tertiary`.
**Source:** `03-list-rows-stat-rows.png` (left card).

```tsx
<CardContent className="flex flex-col gap-3">
  {people.map((p) => (
    <ListRow
      key={p.id}
      title={p.name}
      description={p.place}
      trailing={
        <Button size="sm" disabled={p.invited} onClick={() => invite(p.id)}>
          {p.invited ? "Invited" : "Invite"}
        </Button>
      }
    />
  ))}
</CardContent>
```

If the item shows a state and has no action, use `<Badge variant="neutral">Invited</Badge>` instead.

## 5. Stat rows

**When:** read-only label and value pairs (metadata, durations, dates).
**Uses:** `StatRow` renders `<dt>`/`<dd>`, so **wrap the rows in a `<dl>`**. Use `size="lg"` for the headline pair (`text-title-sm`, with the value in `text-title`). The default `sm` is `text-body-sm text-secondary`. Values use `tabular-nums`.
**Source:** `03-list-rows-stat-rows.png` (right card).

```tsx
<CardContent>
  <dl className="flex flex-col gap-2">
    <StatRow size="lg" label="Jonny Medison" value="04:11" />
    <StatRow label="Call duration" value="21.02.2025" />
  </dl>
</CardContent>
```

## 6. Dark profile card with StatusStrip

**When:** a profile or status summary that should stand out from the glass cards. Use at most one per screen.
**Uses:** `Card variant="inverse"` (`bg-surface-inverse` `#1f1f1f`, `text-inverse`), `Badge variant="status"` (green dot; switches to `text-inverse-secondary` on its own), `Button variant="inverse"` (`bg-surface-inverse-raised`, lime focus ring), and `StatusStrip` wrapped around the card (`bg-success`, `text-on-accent`). For supporting text on the card, use `CardDescription`, which switches to `text-inverse-secondary` on its own.
**Source:** `05-dark-card-status-strip.png`.

```tsx
<StatusStrip status={<><Zap aria-hidden /> Currently high on creativity</>}>
  <Card variant="inverse">
    <CardHeader>
      <Badge variant="status">Available for work</Badge>
      <CardAction className="text-body-sm text-inverse-secondary">8:30 PM</CardAction>
    </CardHeader>
    <CardContent>
      <CardTitle>Prasanjit Dey</CardTitle>
      <CardDescription>Software Engineer</CardDescription>
    </CardContent>
    <CardFooter className="*:flex-1">
      <Button variant="inverse" size="lg"><CirclePlus /> Hire me</Button>
      <Button variant="inverse" size="lg"><Copy /> Copy email</Button>
    </CardFooter>
  </Card>
</StatusStrip>
```

StatusStrip is for one short, positive line of status. Don't use it for errors or calls to action.

## 7. Dock with a single glow action

**When:** primary app navigation for up to 5 destinations, plus one hero action.
**Uses:** `Dock` (a glass pill), `DockItem` (`text-caption`; the active item gets `aria-current="page"` and `text-primary`), and `DockAction`, a `Button variant="glow"` (`bg-accent-glow`, `shadow-glow-accent`, `border-glass`). `DockAction` needs a `label`, which becomes its `aria-label`.
**Source:** `01-dock-segmented-nav.png` (layout, glow, active state; we use lime, not purple) and `02-dock-search-glow-action.png`.

```tsx
<Dock aria-label="Main">
  <DockItem href="/dashboard" icon={<Home />} label="Home" active />
  <DockItem href="/dashboard/chat" icon={<MessageSquare />} label="Chat" />
  <DockAction icon={<Plus />} label="New project" onClick={create} />
  <DockItem href="/dashboard/activity" icon={<Bell />} label="Activity" />
  <DockItem href="/dashboard/account" icon={<User />} label="Account" />
</Dock>
```

**Use at most one glow button per screen**, whether it's in the Dock or anywhere else. If the Dock is visible, nothing else on the page uses `variant="glow"`.

## 8. Search field

**When:** filtering or searching a list or command set.
**Uses:** `Input` with `leadingIcon` (`bg-input-bg`, `rounded-field`, `text-secondary` placeholder and icon). The icon is `aria-hidden`, so give the field an accessible name.
**Source:** `02-dock-search-glow-action.png`.

```tsx
<Input
  type="search"
  aria-label="Search"
  placeholder="Search for actions, people, instruments"
  leadingIcon={<Search />}
/>
```

## 9. Form field

**When:** any labelled input that can fail validation.
**Uses:** `Label` (`text-label`) with `htmlFor`, then `Input`, then `InlineMessage variant="error"` (`text-danger-text`, `role="alert"`). Set `aria-invalid` on the input to turn on `border-danger` and point `aria-describedby` at the message. Use `variant="info"` for hints.
**Source:** none (functional pattern); the visual style follows `02` (field) and the tokens.

```tsx
<div className="flex flex-col gap-2">
  <Label htmlFor="project-name">Project name</Label>
  <Input
    id="project-name"
    name="name"
    aria-invalid={!!error || undefined}
    aria-describedby={error ? "project-name-error" : undefined}
  />
  {error && (
    <InlineMessage id="project-name-error" variant="error">{error}</InlineMessage>
  )}
</div>
```

## 10. Select vs SegmentedControl

**Source:** `01-dock-segmented-nav.png` (pill track with a strong active state).

| Situation | Use |
| --- | --- |
| Choose exactly one of **2–4** short options, all visible at once | `SegmentedControl` |
| Choose one of **5+** options, or labels are long | `Select` |
| Switch between pages or sections | `Dock` / links, not either of these |
| Free text | `Input` |

Both components submit with a form when you pass `name`.

```tsx
<SegmentedControl name="stance" defaultValue="neutral" aria-label="Narrative stance">
  <SegmentedControlItem value="friendly">Friendly</SegmentedControlItem>
  <SegmentedControlItem value="neutral">Neutral</SegmentedControlItem>
  <SegmentedControlItem value="direct">Direct</SegmentedControlItem>
</SegmentedControl>
```

```tsx
<Select name="persona" items={personas} defaultValue="editor">
  <SelectTrigger aria-label="Writer persona">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {personas.map((p) => (
      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
    ))}
  </SelectContent>
</Select>
```

Pass `items` (`{ value, label }[]`) to `Select` so the trigger shows the label, not the raw value.

---

## 11. Project row

**When:** listing projects on Home, each with its readiness at a glance.
**Uses:** `ListRow` wrapped in a `Link`, with the brand name as the description and a `Badge` as `trailing`. Status: `neutral` "Needs brand details" or `accent` "Ready". The whole row is the link, so don't put buttons inside it.

```tsx
<CardContent className="flex flex-col gap-1">
  {projects.map((p) => (
    <Link
      key={p.id}
      href={`/dashboard/projects/${p.id}`}
      className="-mx-3 rounded-panel px-3 py-2 outline-none hover:bg-surface-solid focus-visible:outline-2 focus-visible:outline-focus-ring"
    >
      <ListRow
        title={p.name}
        description={p.brand_name}
        trailing={
          p.ready ? <Badge variant="accent">Ready</Badge> : <Badge variant="neutral">Needs brand details</Badge>
        }
      />
    </Link>
  ))}
</CardContent>
```

With no projects, show an `EmptyState` in the Card instead of an empty list.

---

## 12. Auth layout

**When:** sign up / log in, "check your email", and the plugin approval page. These are screens with one job and no app header.
**Uses:** one `Card` (glass, `max-w-sm`), centred on the gradient canvas. Product name above the title. One primary action. Errors as `InlineMessage variant="error"`, notes as `InlineMessage variant="info"`.

```tsx
<main className="flex min-h-screen items-center justify-center p-4">
  <Card className="w-full max-w-sm">
    <CardHeader>
      <CardDescription>UX Copy Tool</CardDescription>
      <CardTitle>Check your email</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <InlineMessage variant="info">We sent a link to {email}. Open it to finish signing up.</InlineMessage>
      <Button variant="secondary">Resend email</Button>
    </CardContent>
  </Card>
</main>
```

Don't add a solid background here. The body's gradient canvas is what makes the glass card read.

---

## Rules recap

1. **Lime is the only accent.** No other hue is used for emphasis.
2. **Text on lime (or green) is always near-black**: use `text-on-accent`, never white.
3. **Use at most one glow button per screen.**
4. **Glass needs the gradient canvas behind it.** If there's no canvas, use `variant="solid"`.
5. **Red is only for form errors**: `border-danger` on the field and `text-danger-text` in an `InlineMessage`.
6. **No hard-coded colours, radii, shadows or font sizes.** Use the semantic and effect classes only: no hex values, no `rounded-[20px]`, no `text-[15px]`, no `shadow-[…]`, no primitive `var()`s.
