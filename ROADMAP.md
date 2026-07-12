# Teal roadmap

## Released in 0.2.0

- npm workspace and public `@kryv/teal` package on the npm registry
- ESM build, TypeScript declarations, compiled styles, and explicit CSS exports
- React 18 and 19 peer support
- Lucide SVG icon system with no global icon-font dependency
- Radix-backed Select, Checkbox, Switch, Dialog, Tooltip, Toast, Tabs, Menu, Popover, Progress, and Separator
- typed Button, IconButton, Field, Input, TextArea, Card, Badge, PageHeader, EmptyState, loading, Table, and Pagination modules
- responsive routed documentation with live examples, interactive playgrounds, generated interface tables, keyboard documentation, recipes, command palette, and `llms.txt` support for all 22 module pages
- interface, SSR, accessibility, browser, and visual-regression test foundations

## Consumer rollout

1. Install `@kryv/teal@0.2.0` from the npm registry in Daedalus.
2. Migrate the Settings workflow as the first accessibility and responsive-layout pilot.
3. Migrate remaining call sites and remove Daedalus local UI copies.

## Demand-led additions

- Add recipes for filter toolbars, confirmation flows, and empty tables.
- Promote a recipe into the package only after two Kryv products require the same behavior.
- Evaluate a chart seam only after real chart requirements exist in multiple products.
- Add Tailwind 4 semantic utility integration when a consuming Kryv application adopts it.

## Release engineering follow-ups

- GitHub Actions CI running `npm run verify` on pull requests.
- Changesets release workflow (version PRs and npm publish on merge).

Teal should deepen existing interfaces before growing a generic catalog. Product behavior remains in products.
