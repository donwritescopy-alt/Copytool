# Component status

| Component | Web | Plugin | Notes |
| --- | --- | --- | --- |
| [Button](components/button.md) | ✅ `ui/button` | 📦 handoff ready | primary, secondary, ghost, inverse, glow; sm/md/lg; `arrow` prop |
| [IconButton](components/icon-button.md) | ✅ `ui/icon-button` | 📦 handoff ready | Circular; `aria-label` required |
| [Badge](components/badge.md) | ✅ `ui/badge` | 📦 handoff ready | accent, neutral, status (dot). Plugin class: `.ds-chip` |
| [Card](components/card.md) | ✅ `ui/card` | 📦 handoff ready | glass, gradient, tinted, solid, inverse |
| [Input](components/input.md) | ✅ `ui/input` | 📦 handoff ready | Pill; `leadingIcon` |
| [Textarea](components/textarea.md) | ✅ `ui/textarea` | 📦 handoff ready | Auto-grows |
| [Label](components/label.md) | ✅ `ui/label` | 📦 handoff ready | |
| [Select](components/select.md) | ✅ `ui/select` | 📦 handoff ready | Plugin: styled native `<select>` (no base-ui) |
| [SegmentedControl](components/segmented-control.md) | ✅ `ui/segmented-control` | 📦 handoff ready | Plugin: plain buttons with `.is-active` (no base-ui) |
| [InlineMessage](components/inline-message.md) | ✅ `ui/inline-message` | 📦 handoff ready | error, info, success |
| [ListRow](components/list-row.md) | ✅ `ds/list-row` | 📦 handoff ready | |
| [StatRow](components/stat-row.md) | ✅ `ds/stat-row` | 📦 handoff ready | Use inside `<dl>` |
| [Dock](components/dock.md) | ✅ `ds/dock` | ⬜ | Dock, DockItem, DockAction (web-only navigation) |
| [StatusStrip](components/status-strip.md) | ✅ `ds/status-strip` | 📦 handoff ready | Under an inverse Card |
| [Avatar](components/avatar.md) | ✅ `ui/avatar` | ⬜ | Photo or initials (web-only; plugin doesn't show profiles) |
| [Disclosure](components/disclosure.md) | ✅ `ui/disclosure` | ⬜ | base-ui Collapsible; optional form sections (web-only) |
| [SetupChecklist](components/setup-checklist.md) | ✅ `ds/setup-checklist` | ⬜ | Home onboarding steps (web-only) |
| [EmptyState](components/empty-state.md) | ✅ `ds/empty-state` | ⬜ | Empty lists that teach the next step (web-only; plugin uses inline empty states) |
| [AppHeader](components/app-header.md) | ✅ `ds/app-header` | ⬜ | Signed-in top bar with name + avatar (web-only) |
| Project row | ✅ pattern | ⬜ | ListRow + Badge, see patterns.md §11 |
| Auth layout | ✅ pattern | ⬜ | Centred glass card, see patterns.md §12 |
| SuggestionDiff, AuditRow | ⏸ on hold | ⬜ | Waiting on the audit history decision |
| Toast | ⬜ | ⬜ | Not built; add only when a flow needs it |

✅ built · 📦 handoff ready · ⬜ not started
