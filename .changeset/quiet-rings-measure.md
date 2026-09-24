---
'@kryv/teal': minor
---

Ship the package as per-module ES modules instead of one bundled barrel:
consumers' bundlers now parse and tree-shake only the components they import
instead of the whole ~400 KB library. dist also ships JavaScript source maps,
the package exports `./package.json`, and CI enforces size budgets on the total
dist JS, the largest module, and styles.css.
