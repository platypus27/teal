# @kryv/teal

## 0.3.1

### Patch Changes

- b155c34: Refine visual cohesion across the existing catalog with clearer light and dark surface hierarchy, shared shape, border, focus, and elevation tokens, and normalized component states without changing public React interfaces or control dimensions.

## 0.3.0

### Minor Changes

- f0d8777: Improve and unify the existing component API ahead of expanding the catalog.

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

- f0d8777: Hardening pass on the existing catalog: composition and accessibility improvements.

  - `PageHeader`, `CardTitle`, and `EmptyState` accept `titleAs` (`'h1'`–`'h6'`) so heading levels can follow the page outline; defaults unchanged (`h1`/`h2`/`h3`).
  - New `TooltipProvider` export: mount it once near the app root so tooltips share open-delay grouping (moving between triggers skips the delay). `Tooltip.delayDuration` is now an optional per-instance override; standalone tooltips keep their previous 300ms default.
  - `Checkbox` and `Switch` no longer render a second `<label>` when nested in a `Field` — the Field's label is the single label. Their `label` prop is now optional and only needed outside a Field.
  - `Menu` accepts `modal` to trap focus and block outside interaction while open (defaults to `false`, unchanged behavior).
  - `Table` only adds its scroll region to the tab order when the content actually overflows horizontally.

- 22b632d: Expand the catalog with four new components.

  - `Alert`: inline feedback banner with the shared `variant` vocabulary (neutral/info/success/warning/danger), optional `title`, `icon` override, and `onDismiss`. Assertive `role="alert"` for danger, `role="status"` otherwise.
  - `Avatar`: image with initials fallback (also on load error) and a generic icon fallback; `size` scale, alt defaults to `name`, decorative when unnamed.
  - `Breadcrumb`: hierarchy navigation with `aria-current="page"` on the last item, router-link support via `as`, and middle-item collapse into an overflow menu beyond `collapseAfter`.
  - `Accordion`: single- or multi-open collapsible sections built on a new `@radix-ui/react-accordion` dependency, with mode-aware `value`/`defaultValue`/`onValueChange` typing.

  All four forward refs, ship with unit and axe coverage, and are documented with new module pages.

### Patch Changes

- 5b8ae41: Fix `VerticalNavItem` rendering an empty icon column for items without an `icon` (labels were pushed right and rows showed a blank circle). The label row is now a flex container, so trailing content such as `ml-auto` indicators aligns at the end of the row.
- 08cacca: Add jest-axe accessibility testing infrastructure and comprehensive a11y test suite

  - Add jest-axe dependency for automated accessibility checks
  - Configure toHaveNoViolations matcher in vitest setup
  - Add 18 axe tests covering all components (actions, forms, display, data, navigation, overlays, feedback)

## 0.2.1

### Patch Changes

- 145e32f: Harden the published package with cross-platform builds, shared form semantics, polymorphic navigation typing, generated token outputs, packed artifact verification, and required accessible names for Popover dialog surfaces.
