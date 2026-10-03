# ADR-0008: Home's production rail becomes the EcosystemShell default

- Status: Accepted
- Date: 2026-10-03

## Context

The redesign-2026 program's Phase 0 mockups asked which shell the five Kryv
apps should converge on. The owner's captured answer
(`home/mockups/redesign-2026/NOTES.md`, decided 2026-09-30 → 2026-10-01) is:
**the current production Home rail — as rendered by `apps/web/src/App.tsx`
with the overrides in `apps/web/src/index.css` — becomes the ecosystem
standard, propagated to all five apps as-is. No new rail design.**

Teal 1.0 shipped `EcosystemShell`/`EcosystemRail` with no default brand, no
catalog icon map, and a stock in-flow rail. As a result every deployed app
hand-rolled the surrounding pieces, and they diverged:

- **Four different `brand` implementations**: home passes the kryv mark +
  wordmark reveal; yang and photos pass a plain text "K" tile; trict passes a
  badge + wordmark.
- **Three icon-keying schemes producing different glyphs for the same
  product**: home keys rail icons by app id (photos → `Camera`, trict →
  `LineChart`); yang/trict/photos key by the app-catalog contract's
  `icon` field (photos → `Images`, trict → `ChartCandlestick`).
- **Divergent rail geometry**: only home carries the glass-pill overlay
  overrides (floating translucent pill, 14rem hover expansion, wordmark
  reveal); the other apps render teal's stock rail.

## Decision

Promote home's production rail to the default rendering of
`EcosystemShell`:

- **Default brand** — new `EcosystemBrand` component upstreaming home's
  brand exactly: the kryv "k" mark plus the "ryv" wordmark tail revealed on
  rail expansion, with home's class names (`ecosystem-brand__mark`,
  `ecosystem-brand__reveal`, `ecosystem-brand__wordmark`). The artwork is
  home's two production PNGs, palette-quantized to 256 colors (visually
  identical, ~150KB → ~11KB) and inlined as data URIs in
  `src/brand-assets.ts`, so the default works in any consuming app with zero
  asset plumbing and no bundler asset-pipeline assumptions. `EcosystemShell`'s
  `brand` prop stays as the escape hatch and now defaults to
  `<EcosystemBrand />`.
- **Rail skin** — home's rail overrides are ported into `src/styles.css`
  with the same selectors (`.ecosystem-shell > nav`, the
  `.ecosystem-brand__*` classes, the `[role='dialog']` drawer fixes) and the
  same values, so consumers carrying home's overrides can delete them with
  zero visual change. `EcosystemShell` now renders the `ecosystem-shell`
  class itself. Two deliberate deviations, both invisible in real apps:
  - The rail is positioned `absolute` against the (now `relative`) shell
    root instead of `fixed` against the viewport, and its pinned height is
    `calc(100% - 2rem)` instead of `calc(100dvh - 2rem)`. `EcosystemShell`
    is full-viewport chrome, so the computed geometry is identical, but the
    skin now composes inside embedded contexts (docs demos) instead of
    escaping to the viewport.
  - The wordmark-reveal transition is disabled under
    `prefers-reduced-motion`, matching the rest of the library.
- **Canonical icon map** — new `catalog-icons` module exports
  `CATALOG_ICONS` and `catalogIcon(name)`, resolving every app-catalog
  contract icon name **and** every app id to the glyph home's production
  rail uses: house→`House`, gauge→`Gauge`, images→`Camera`,
  candlestick-chart→`LineChart`, sparkles→`Sparkles` (app ids map onto the
  same five entries). Home's glyph choices are canonical per the owner
  decision. Unknown names are a compile-time error for typed callers and a
  documented runtime fallback (undefined + a one-time development warning).
  `EcosystemRail` resolves the Home and destination icons through
  `catalogIcon` when no explicit `icon` is passed; an explicit per-item
  `icon` still wins.

## Consequences

- Every app rendering a stock `EcosystemShell` now gets home's rail: glass
  pill, 14rem hover expansion, wordmark reveal, canonical glyphs, default
  brand. This is an intentional visual change for yang, trict, and photos,
  shipped as a minor with a changeset; per-app follow-ups delete their
  hand-rolled brand/icons/CSS.
- Because the rail is an overlay, main-region content sits under the
  collapsed 5rem rail unless the app offsets it (home does this per page,
  e.g. `.settings-workspace { margin-left: 5rem }`). Apps adopting the
  default skin must clear the rail in their own layouts.
- The z-scale layering bug home works around (`[role='menu']` under the
  drawer dialog because `--teal-z-popover` sits below `--teal-z-dialog`) is
  **not** fixed here; it predates this change and needs its own token-level
  fix. Home's workaround can stay until then.
- `EcosystemRail` standalone keeps its in-flow stock geometry; the skin is
  scoped to `.ecosystem-shell` so only the assembled chrome changes.
