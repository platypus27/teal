---
'@kryv/teal': minor
---

Improve and unify the existing component API ahead of expanding the catalog.

Breaking changes:

- Renamed `tone` to `variant` on `Badge`, `toast()` input, and `MenuItem`. `MenuItem`'s default variant is now `'neutral'` (was `'default'`). The `ToastTone` type is now `ToastVariant`.
- Removed the single-value `variant` prop from `TopBar` and `VerticalNav`; `topBarVariants`/`verticalNavVariants` remain but no longer take a `variant` option.

Fixes and additions:

- `Table`: the loading state no longer sets `aria-label` on rows (a name-prohibited role). The scroll region is marked `aria-busy` and announces `loadingLabel` through a live status element. `Table` now forwards its ref to the scroll region.
- `Card`: `disabled` now works as documented — applies `aria-disabled`, disabled styling, and blocks interaction; native `disabled`/`type` are set when the card renders a `button`.
- `Field`, `Pagination`, `Tabs`, and `Toaster` now forward refs to their root elements.
- Exported `useFieldControl` and `mergeDescriptionIds` from the package entry point.
- `IconButton` supports `loading`: a spinner replaces the icon and the button is disabled with `aria-busy`.
- `Select` now accepts the full Radix Select root prop surface (including `open`, `defaultOpen`, `onOpenChange`, `dir`, `autoComplete`).
- `EmptyState` hides caller-supplied icons from assistive technology.
- Replaced deprecated `React.ElementRef` types with `React.ComponentRef`.
