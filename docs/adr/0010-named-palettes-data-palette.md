# ADR-0010: Named palettes via data-palette

- Status: Accepted
- Date: 2026-10-23

## Context

ADR 0004 keeps theming class-based: the generated token source emits light
values on `:root` and dark values under `html.dark`, and `ThemeProvider`
owns the 3-way `light | dark | system` choice. ADR 0007 defines the single
voxel-world palette that all Kryv surfaces share.

The unified-frontend program adds a user-selectable world palette: Home's
front door offers `garden` alongside the default `safari`, stored as an
account preference. A palette is a different axis from light/dark: it
revalues a subset of color tokens while keeping the rest. Adding a second
full token set per palette would duplicate `:root`/`html.dark` blocks,
hand the mode machinery to every consumer, and make composition with dark
mode undefined.

## Decision

Palettes are a named override layer selected by the `data-palette`
attribute on the document root, alongside the existing `dark` class:

- `safari` is the default palette and sets **no** attribute; its rendering
  is byte-identical to the pre-palette token output (same `:root` and
  `html.dark` blocks).
- A palette overrides a subset of color tokens and inherits every token it
  does not list from the default palette. Garden currently overrides
  `teal-color-surface` and `teal-color-primary` in each mode.
- The token generator emits override blocks containing only the overridden
  variables, scoped as `:root:not(.dark)[data-palette='<name>']` for light
  and `html.dark[data-palette='<name>']` for dark, after the default
  blocks. `:not(.dark)` is load-bearing: plain `:root[data-palette=...]`
  would still match in dark mode and a light-only override would leak into
  dark. Palette overrides are generated only; `src/tokens.css` is never
  edited by hand.
- `ThemeProvider` exposes `palette` and `setPalette`, applies the
  attribute when the palette is not `safari` and deletes it otherwise, and
  persists the choice to localStorage (default key `kryv:palette`,
  configurable with `paletteStorageKey`). The `palette` prop is the mount
  fallback when nothing is stored. Unknown stored strings are passed
  through verbatim: no matching CSS block exists, so those consumers get
  the default tokens.
- Consumers keep mode and palette separate. `choice`/`resolved` own
  light/dark/system; `palette` owns the named override layer. Consumers
  must not toggle the `dark` class or set `data-palette` by hand alongside
  a provider.

The garden light `teal-color-primary` is `#1b5e20` (27, 94, 32), darker
than the mockup's `#2e7d32` (46, 125, 50). The mockup value fails WCAG AA
when primary is text on backgrounds and on primary/10 or primary/15 tints
used by Badge, Sidebar, TreeSelect, and Command; ADR 0007 makes AA
contrast the design contract, so the override was darkened rather than
weakening the contrast gate. `test/tokens.test.ts` now gates both raw and
composed palette contrast states in both modes.

## Consequences

- Adding a palette is a source-only change: extend `palettes` in
  `packages/teal/token-source.mjs`, regenerate tokens, and add contrast
  coverage if the palette changes a token used as text or a tint. The
  generator, CSS contract, and `ThemeProvider` API stay unchanged.
- The light palette selector is structurally safe against future
  light-only overrides leaking into dark mode; dark overrides remain
  explicit, which is the one place a palette author must supply values
  twice (as with the default token source).
- Palette overrides do not appear in `src/tokens.json` or the docs token
  metadata, because those describe the default palette; named palettes are
  CSS-block only until a consumer contract needs more.
- Only `@kryv/teal` ships the palette layer; per-app palette selectors and
  account preferences live in Home, which chooses the palette and writes it
  through `ThemeProvider` rather than reimplementing tokens.
- Existing WCAG suites that parse only `:root`/`html.dark` are unaffected;
  the added garden gate reads the palette blocks and applies them over the
  default tokens.
