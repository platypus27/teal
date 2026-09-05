---
'@kryv/teal': patch
---

fix: ship dist/ in the published npm tarball

The 0.5.0 and 0.5.1 tarballs omitted `dist/` entirely because the CI release job ran `changeset publish` without building the library first, so consumers could not resolve `main`, `types`, or any `exports` target. The release job now builds `@kryv/teal` before publishing, and the package builds in `prepublishOnly` so every publish route regenerates `dist/`.
