---
'@kryv/teal': patch
---

**This release intentionally ships a breaking change.** Authentik is retired across the Kryv ecosystem, so the generated Authentik theming adapter is removed entirely (maintainer-approved semver exception for this patch, same precedent as 0.5.1).

- Delete the `@kryv/teal/authentik.css` export, `packages/teal/authentik-source.mjs`, `scripts/generate-authentik.mjs`, `src/authentik.css`, the `test/authentik/` Playwright fixture and its 25 reference screenshots, and the `fixture:authentik*` / `capture:authentik` package scripts.
- The packed-consumer verification no longer expects `dist/authentik.css`.
- The docs site Foundations page drops the "Authentik adapter" section.

Consumers branding an Authentik deployment should pin their last generated `authentik.css` copy locally; no replacement ships in this package.
