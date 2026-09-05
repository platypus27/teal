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

## Released in 0.5.0

- catalog grown from 96 to 168 modules across eleven groups
- SVG chart family (line, area, bar, pie, scatter, radar, heatmap, calendar heatmap, funnel, gauge) on shared ChartContainer scaffolding with screen-reader data tables
- data displays: KanbanBoard, GanttChart, OrgChart, TreeGrid, ActivityFeed, CommentThread, JsonViewer, DiffViewer, LogViewer, MarkdownView, QrCode
- advanced form controls: Cascader, TreeSelect, TransferList, MentionInput, RichTextEditor, masked/currency/phone inputs, date-time/month/year pickers, card-style choices
- overlays (BottomSheet, ActionSheet, Lightbox, ImageViewer, SearchOverlay, NotificationCenter, and more), navigation (Sidebar, Dock, MegaMenu, AnchorNav, BottomNav, TableOfContents, SkipLink), layout primitives (Box, Flex, Container, Masonry, AppShell, StickyHeader, and more), and utility modules (FocusTrap, Collapse, Presence, VirtualList, InfiniteScroll, TimeAgo, and more)
- every module documented with anatomy, do/don't guidance, accessibility notes, and at least two live examples on the [docs site](https://teal.kryvlabs.com)
- central axe suite extended to cover all 168 modules; three real accessibility bugs found and fixed in the process

## Consumer rollout

1. Install the latest `@kryv/teal` patch from the npm registry in a private Kryv app.
2. Migrate the Settings workflow as the first accessibility and responsive-layout pilot.
3. Migrate remaining call sites and remove the app's local UI copies.

## Demand-led additions

- The 0.5.0 expansion brought the catalog to 168 modules; further growth returns to a demand-led pace.
- Add recipes for filter toolbars, confirmation flows, and empty tables.
- Promote a recipe into the package only after two Kryv products require the same behavior.
- Harden and deepen the 0.5.0 additions (charts, boards, editors) against real product usage before adding more.
- Add Tailwind 4 semantic utility integration when a consuming Kryv application adopts it.

## Release engineering

- GitHub Actions runs `npm run verify`, Playwright, and Lighthouse checks on pull requests.
- Changesets owns version PRs, generated changelogs, and npm publishing.
- Open: reduce the packed package from 52.5 kB toward the 35 kB target without dropping source files, declaration maps, or verification coverage.

With 168 modules shipped, Teal's focus shifts back to deepening existing interfaces before growing the catalog further. Product behavior remains in products.
