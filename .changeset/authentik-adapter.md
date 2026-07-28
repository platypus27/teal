---
'@kryv/teal': minor
---

Add the generated Authentik theme adapter (WP2).

- New `@kryv/teal/authentik.css` export, generated from the canonical token source by `npm run generate:authentik`. Never edit the generated file.
- Maps Teal semantic tokens onto supported Authentik (`--ak-*`) and PatternFly 4/5 global variables only — color, typography, radii, elevation, focus, light and `html[data-theme="dark"]` dark, and reduced motion. No private shadow-DOM selectors.
- Pinned to Authentik 2026.5 in `packages/teal/authentik-source.mjs`; the Foundations docs page records the brand asset contract and the upgrade procedure (regenerate, then verify the reference flow screenshots).
- `check:generated` now covers the adapter, and the packed consumer verifies the new export.
