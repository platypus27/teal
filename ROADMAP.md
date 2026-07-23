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

## Released in 0.3.0

- unified variant naming, ref forwarding, form composition, heading control, and overlay configuration
- accessibility hardening for tables, interactive cards, loading actions, tooltips, and selection controls
- Alert, Avatar, Breadcrumb, and Accordion modules with documentation and axe coverage
- 26 module pages across the seven established groups

## Released in 0.3.1

- recalibrated light and dark surface hierarchy without changing control dimensions
- supported visual tokens for shape, borders, focus, and elevation
- complete `--teal-color-*` values and namespaced public and internal Tailwind utilities
- normalized visual states and component behavior across the existing catalog, with no new modules or React interfaces
- deterministic light, dark, desktop, mobile, and open-overlay visual QA coverage
- clearer setup guidance for compiled CSS, optional document defaults, and optional Tailwind 3 utilities

## Consumer rollout

1. Install the latest `@kryv/teal` patch from the npm registry in Daedalus.
2. Migrate the Settings workflow as the first accessibility and responsive-layout pilot.
3. Migrate remaining call sites and remove Daedalus local UI copies.

## Demand-led additions

- Add recipes for filter toolbars, confirmation flows, and empty tables.
- Promote a recipe into the package only after two Kryv products require the same behavior.
- Evaluate a chart seam only after real chart requirements exist in multiple products.
- Add Tailwind 4 semantic utility integration when a consuming Kryv application adopts it.

## Release engineering

- GitHub Actions runs `npm run verify`, Playwright, and Lighthouse checks on pull requests.
- Changesets owns version PRs, generated changelogs, and npm publishing.
- Open: reduce the packed package from 52.5 kB toward the 35 kB target without dropping source files, declaration maps, or verification coverage.

Teal should deepen existing interfaces before growing a generic catalog. Product behavior remains in products.
