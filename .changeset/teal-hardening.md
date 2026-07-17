---
'@kryv/teal': minor
---

Hardening pass on the existing catalog: composition and accessibility improvements.

- `PageHeader`, `CardTitle`, and `EmptyState` accept `titleAs` (`'h1'`–`'h6'`) so heading levels can follow the page outline; defaults unchanged (`h1`/`h2`/`h3`).
- New `TooltipProvider` export: mount it once near the app root so tooltips share open-delay grouping (moving between triggers skips the delay). `Tooltip.delayDuration` is now an optional per-instance override; standalone tooltips keep their previous 300ms default.
- `Checkbox` and `Switch` no longer render a second `<label>` when nested in a `Field` — the Field's label is the single label. Their `label` prop is now optional and only needed outside a Field.
- `Menu` accepts `modal` to trap focus and block outside interaction while open (defaults to `false`, unchanged behavior).
- `Table` only adds its scroll region to the tab order when the content actually overflows horizontally.
