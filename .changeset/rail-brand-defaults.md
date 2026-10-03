---
'@kryv/teal': minor
---

Make Home's production navigation rail the ecosystem standard (ADR 0008).
`EcosystemShell` now renders the new `EcosystemBrand` by default — the Kryv
mark with the wordmark reveal, artwork inlined so consumers need no asset
plumbing — and the stock rail is the floating glass-pill overlay (14rem hover
expansion, wordmark reveal) previously hand-rolled in Home's CSS, using the
same class names so existing per-app overrides can be deleted with zero
visual change. New `catalogIcon`/`CATALOG_ICONS` map every app-catalog icon
name and app id to the canonical glyph Home uses (house→House, gauge→Gauge,
images→Camera, candlestick-chart→LineChart, sparkles→Sparkles);
`EcosystemRail` resolves Home and destination icons through it when no
explicit `icon` is given, and explicit per-item icons still win. Note for
upgraders: the rail is now an overlay, so main-region content must clear the
collapsed 5rem rail in desktop layouts.
