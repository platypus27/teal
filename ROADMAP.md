# Teal roadmap

## Implemented for 0.2.0

- npm workspace and public `@kryv/teal` package structure
- ESM build, TypeScript declarations, compiled styles, and explicit CSS exports
- React 18 and 19 peer support
- Lucide SVG icon system with no global icon-font dependency
- Radix-backed Select, Checkbox, Switch, Dialog, Tooltip, Toast, Tabs, Menu, Popover, Progress, and Separator
- typed Button, IconButton, Field, Input, TextArea, Card, Badge, PageHeader, EmptyState, loading, Table, and Pagination modules
- responsive routed documentation with generated interface tables and recipes
- interface, SSR, accessibility, browser, and visual-regression test foundations

## Consumer rollout

1. Pack 0.2.0 locally and install the artifact in Daedalus.
2. Migrate the Settings workflow as the first accessibility and responsive-layout pilot.
3. Migrate remaining call sites and remove Daedalus local UI copies.
4. Publish `@kryv/teal@0.2.0` publicly after both repositories pass their release gates.

## Demand-led additions

- Add recipes for filter toolbars, confirmation flows, and empty tables.
- Promote a recipe into the package only after two Kryv products require the same behavior.
- Evaluate a chart seam only after real chart requirements exist in multiple products.
- Add Tailwind 4 semantic utility integration when a consuming Kryv application adopts it.

Teal should deepen existing interfaces before growing a generic catalog. Product behavior remains in products.
