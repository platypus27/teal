# @kryv/teal

## 0.5.0

### Minor Changes

- a65fbb0: Grow the catalog from 96 to 200 modules. New additions span every group: charts (LineChart, AreaChart, BarChart, PieChart, ScatterChart, RadarChart, Heatmap, CalendarHeatmap, FunnelChart, GaugeChart, ChartContainer), data displays (KanbanBoard, GanttChart, OrgChart, TreeGrid, ActivityFeed, CommentThread, JsonViewer, DiffViewer, LogViewer, MarkdownView, QrCode), form controls (Cascader, TreeSelect, TransferList, MentionInput, RichTextEditor, ToggleGroup, RadioCard, CheckboxCard, CurrencyInput, MaskedInput, PhoneInput, RangeSlider, DateTimePicker, MonthPicker, YearPicker, TimezoneSelect, and more), overlays (BottomSheet, ActionSheet, Lightbox, ImageViewer, SearchOverlay, NotificationCenter, FloatingPanel, PromptDialog, FullscreenDialog, CookieConsent), navigation (Sidebar, Dock, MegaMenu, SubNav, AnchorNav, BottomNav, TableOfContents, FloatingToolbar, SkipLink), layout primitives (Box, Flex, Container, Section, Center, Masonry, Columns, StickyHeader, AppShell, ScrollShadow), surfaces (Panel, ExpandableCard, GlassPanel, Callout), feedback (StatusDot, PulseDot, ErrorBoundary, NetworkStatus, OfflineBanner, BlockingOverlay, SaveStatus, UploadProgress, LoadingBar), actions (ActionBar, BulkActionBar, FloatingActionButton, SpeedDial, ShareButton), and utilities (Portal, FocusTrap, Collapse, Presence, Reveal, TruncatedText, HighlightText, InfiniteScroll, VirtualList, LazyImage, CountdownTimer, Marquee, TimeAgo, NumberTicker). Every module ships TypeScript declarations, keyboard support, visible focus states, unit tests, and central axe coverage; the docs site documents all 200 modules with anatomy, do/don't guidance, accessibility notes, and at least two live examples each.

## 0.4.1

### Patch Changes

- Add `SideRail`: a floating glass rail that collapses to an icon strip and expands to a full labeled navigation on hover or focus. It composes the `VerticalNav` compound parts over a translucent, blurred, fully rounded surface with a floating shadow, and positions itself wherever the consumer places it via `className`.
- Normalize source formatting in Calendar, Carousel, CodeBlock, DatePicker, DateRangePicker, MultiSelect, NumberInput, and ScrollArea (plus their tests) to the house style. No behavior changes.

## 0.4.0

### Minor Changes

- bfe6829: Add the generated Authentik theme adapter (WP2).

  - New `@kryv/teal/authentik.css` export, generated from the canonical token source by `npm run generate:authentik`. Never edit the generated file.
  - Maps Teal semantic tokens onto supported Authentik (`--ak-*`) and PatternFly 4/5 global variables only — color, typography, radii, elevation, focus, light and `html[data-theme="dark"]` dark, and reduced motion. No private shadow-DOM selectors.
  - Pinned to Authentik 2026.5 in `packages/teal/authentik-source.mjs`; the Foundations docs page records the brand asset contract and the upgrade procedure (regenerate, then verify the reference flow screenshots).
  - `check:generated` now covers the adapter, and the packed consumer verifies the new export.

- 5769d41: Add 15 more components: DatePicker, NumberInput, PasswordInput, MultiSelect, FileUpload, DataTable, TreeView, Command, Toggle, Toolbar, SplitButton, AvatarGroup, Timeline, ProgressCircle, and CodeBlock.

  - Forms: `DatePicker` (keyboard-navigable calendar popover with min/max bounds), `NumberInput` (steppers with clamping), `PasswordInput` (visibility toggle), `MultiSelect` (filterable multi-value picker with removable pills), and `FileUpload` (dropzone with removable file list).
  - Data: `DataTable` (sortable headers with aria-sort plus row selection with indeterminate bulk state), `TreeView` (hierarchical disclosure with full arrow-key navigation), and `AvatarGroup` (overlapping stack with +N overflow).
  - Overlays: `Command` (command palette dialog with grouped, filterable actions that resets on every open).
  - Actions: `Toggle` (pressed-state button), `Toolbar` with `ToolbarGroup` and `ToolbarSeparator`, and `SplitButton` (default action plus related menu).
  - Display: `Timeline` (tone-dotted activity feed), `ProgressCircle` (determinate and indeterminate radial progress), and `CodeBlock` (language label, optional line numbers, copy-to-clipboard).

- dede4c3: Add 15 components: RadioGroup, Slider, SearchInput, Combobox, Chip, ButtonGroup, Drawer, HoverCard, ScrollArea, SegmentedControl, Link, Kbd, DescriptionList, Steps, and Banner.

  - Forms: `RadioGroup` (roving-focus single choice), `Slider` (range scrubber with optional live value), `SearchInput` (leading icon, clear action, loading state), `Combobox` (filterable picker with full keyboard support), and `Chip` (removable filter token) — all wired into the shared form-semantics seam with hairline default borders.
  - Overlays: `Drawer` (slide-over panel on the dialog focus model, left or right edge, with slide-in motion), `HoverCard` (rich hover/focus preview), and `ScrollArea` (theme-consistent scrollbars).
  - Actions: `SegmentedControl` (mutually exclusive options with the same sliding-pill indicator as Tabs), `ButtonGroup` (attached action cluster), and `Link` (inline/standalone variants with external indicator).
  - Display: `DescriptionList` (semantic dl for detail pages), `Steps` (numbered flow indicator with aria-current), `Banner` (page-level notice with role="status"/"alert"), and `Kbd` (keyboard shortcut keycap).

- 405ebb6: Add 30 new components across feedback, forms, overlays, navigation, data display, layout, and utilities:

  - Feedback: Meter, Rating, Announcer
  - Forms: PinInput, TagsInput, InputGroup, Editable, TimePicker, DateRangePicker, ColorPicker
  - Overlays: AlertDialog, Popconfirm, ContextMenu, Tour
  - Navigation: Menubar, NavigationMenu, BackTop
  - Data display: Stat, List, Sparkline, Calendar, Result
  - Layout: Stack, Grid, Resizable, AspectRatio
  - Utilities: VisuallyHidden, CopyButton, ThemeToggle, Carousel

- 39a413b: Add ecosystem feedback modules for Kryv Home (WP1).

  - `NotificationItem`: sanitized inbox row with severity indicator, source application label, timestamp, read-state emphasis with an announced unread marker, deep link, and mute/archive controls that touch delivery state only.
  - `HealthIndicator`: explicit ecosystem health badge covering healthy, degraded, down, stale, unknown, and checking — health is never inferred from missing evidence.
  - `StepUpNotice`: inline warning built on `Alert` that explains a required fresh verification and hosts a caller-supplied action; it never starts verification itself.

  All three ship with unit and axe coverage and documented module pages.

- e0b6393: Add ecosystem navigation modules for Kryv Home (WP1).

  - `AppSwitcher`: entitlement-filtered application switcher with an explicit Home destination, anchor items with optional `current` marking, and keyboard navigation inherited from Radix. The caller filters applications first; the switcher renders only what it is given.
  - `AccountMenu`: household account menu with avatar trigger, identity header, product-supplied items, and distinct app-session and SSO sign-out actions so people can tell which session ends.

  Both ship with unit and axe coverage and documented module pages.

- a57969c: Add ecosystem surface modules for Kryv Home (WP1).

  - `LauncherCard`: interactive application destination card built on the polymorphic `Card`, with icon, description, caller-supplied status content, and an honest unavailable state that leaves the focus order and blocks navigation.
  - `PermissionMatrix`: people-by-applications access matrix built on `Table`, with caller-rendered cells, explicit em-dash no-access cells, and a screen-reader header for the row-label column. Permission policy stays with the caller.

  Both ship with unit and axe coverage and documented module pages.

- 8b8738b: Add NavRail and refine the shared visual language:

  - New `NavRail`/`NavRailItem`: a fully rounded floating icon rail with tooltips, active tint, and optional badge dots.
  - Standardized radius scale: all controls and boxes use the 0.75rem control radius (buttons and button groups lose their pill shape), nested items use concentric 0.5rem, pill is reserved for icon-only controls, tags, and avatars.
  - Icon-only controls are circular: IconButton (including Dialog/Drawer close, Calendar and Carousel arrows, BackTop, dismiss buttons), CopyButton, ThemeToggle, Rating stars, NumberInput steppers, and Pagination page numbers; tooltips are pill-shaped.
  - Flush focus ring: the highlight now sits directly on the control border with no offset gap.
  - Alert and Banner use opaque tinted surfaces; Banner drops its thick left accent border.
  - InputGroup highlights as one control on focus instead of only the editable section.
  - Combobox no longer dismisses itself when opened by mouse click, and focuses with its current text selected.
  - Drawer floats inset from the viewport edge with fully rounded corners.
  - Page no longer shifts when Dialog/Drawer/AlertDialog lock scroll (`scrollbar-gutter: stable`).
  - ProgressCircle indeterminate state spins smoothly without snapping back.
  - AppSwitcher plays its open animation; ScrollArea constrains its viewport correctly and supports horizontal scrolling.
  - VerticalNav items use a full-row rounded active/hover treatment instead of a separate icon chip.
  - Nested items inside padded containers now use a true concentric radius (`--teal-radius-nested`), and the light page background is pure white instead of mint.
  - Docs interface tables are generated for every module: the API generator now scans all component sources instead of a hardcoded list, and the registry validator fails if any module's `apiNames` lack a generated entry.

- 89017a8: Refine the visual tokens and fix two dark-mode/contrast issues.

  - Tighter radius ramp: `--teal-radius-control` 1rem → 0.5rem, `--teal-radius-surface` 1.25rem → 0.75rem for a crisper, more deliberate look.
  - Calmer elevation: softer `--teal-shadow-raised` and `--teal-shadow-overlay` with less spread and lower opacity.
  - Dark mode no longer drops `--teal-color-surface-container-lowest` to pure black; it now sits on the surface ramp (rgb(7 31 32)) so cards and panels stay layered against the background.
  - `Switch` unchecked state is no longer a white thumb on a white track: in light mode the thumb is solid teal on a white track with a hairline border; in dark mode the thumb stays white on a teal-tinted track.
  - Motion on every state change, all honoring `prefers-reduced-motion`: checkbox marks pop in, the switch thumb settles with a pulse, tab panels fade in on switch, popovers/menus/tooltips/select dropdowns get a fade-and-rise entrance, toasts slide in and fade out, and accordion sections animate their height.
  - `Tabs` now slides a single measured pill behind the active trigger instead of swapping backgrounds per tab.
  - Form controls (`Input`, `TextArea`, `Select`, `Checkbox`, `Switch`) default to hairline (`--teal-border-subtle`) borders that strengthen on hover/focus.

### Patch Changes

- 3498166: Improve accessibility hardening across shared controls:

  - Expand carousel dots, multi-select remove actions, and number steppers to 24px touch targets while preserving their visual scale.
  - Make scrollable regions and code blocks keyboard focusable.
  - Preserve readable selected-date contrast in calendar variants.

## 0.3.1

### Patch Changes

- b155c34: Harden visual cohesion and consumer isolation across the existing catalog.

  - Replace legacy channel-only `--color-*` variables with complete, namespaced `--teal-color-*` CSS color values. This is an intentional breaking token migration in a patch release.
  - Namespace public Tailwind utilities as `*-teal-*` and isolate compiled component utilities behind `teal-u-` so consumer themes can safely define generic names such as `primary`.
  - Improve light and dark contrast, focus visibility, forced-colors support, required Select semantics, disabled Card links, Avatar source retries, and dynamic Table overflow handling.
  - Preserve public React component exports, prop types, and control dimensions.

## 0.3.0

### Minor Changes

- f0d8777: Improve and unify the existing component API ahead of expanding the catalog.

  Breaking changes:

  - Renamed `tone` to `variant` on `Badge`, `toast()` input, and `MenuItem`. `MenuItem`'s default variant is now `'neutral'` (was `'default'`). The `ToastTone` type is now `ToastVariant`.
  - Removed the single-value `variant` prop from `TopBar` and `VerticalNav`; `topBarVariants`/`verticalNavVariants` remain but no longer take a `variant` option.

  Fixes and additions:

  - `Table`: the loading state no longer sets `aria-label` on rows (a name-prohibited role). The scroll region is marked `aria-busy` and announces `loadingLabel` through a live status element. `Table` now forwards its ref to the scroll region.
  - `Card`: `disabled` now works as documented — applies `aria-disabled`, disabled styling, and blocks interaction; native `disabled`/`type` are set when the card renders a `button`.
  - `Field`, `Pagination`, `Tabs`, and `Toaster` now forward refs to their root elements.
  - Exported `useFieldControl` and `mergeDescriptionIds` from the package entry point.
  - `IconButton` supports `loading`: a spinner replaces the icon and the button is disabled with `aria-busy`.
  - `Select` now accepts the full Radix Select root prop surface (including `open`, `defaultOpen`, `onOpenChange`, `dir`, `autoComplete`).
  - `EmptyState` hides caller-supplied icons from assistive technology.
  - Replaced deprecated `React.ElementRef` types with `React.ComponentRef`.

- f0d8777: Hardening pass on the existing catalog: composition and accessibility improvements.

  - `PageHeader`, `CardTitle`, and `EmptyState` accept `titleAs` (`'h1'`–`'h6'`) so heading levels can follow the page outline; defaults unchanged (`h1`/`h2`/`h3`).
  - New `TooltipProvider` export: mount it once near the app root so tooltips share open-delay grouping (moving between triggers skips the delay). `Tooltip.delayDuration` is now an optional per-instance override; standalone tooltips keep their previous 300ms default.
  - `Checkbox` and `Switch` no longer render a second `<label>` when nested in a `Field` — the Field's label is the single label. Their `label` prop is now optional and only needed outside a Field.
  - `Menu` accepts `modal` to trap focus and block outside interaction while open (defaults to `false`, unchanged behavior).
  - `Table` only adds its scroll region to the tab order when the content actually overflows horizontally.

- 22b632d: Expand the catalog with four new components.

  - `Alert`: inline feedback banner with the shared `variant` vocabulary (neutral/info/success/warning/danger), optional `title`, `icon` override, and `onDismiss`. Assertive `role="alert"` for danger, `role="status"` otherwise.
  - `Avatar`: image with initials fallback (also on load error) and a generic icon fallback; `size` scale, alt defaults to `name`, decorative when unnamed.
  - `Breadcrumb`: hierarchy navigation with `aria-current="page"` on the last item, router-link support via `as`, and middle-item collapse into an overflow menu beyond `collapseAfter`.
  - `Accordion`: single- or multi-open collapsible sections built on a new `@radix-ui/react-accordion` dependency, with mode-aware `value`/`defaultValue`/`onValueChange` typing.

  All four forward refs, ship with unit and axe coverage, and are documented with new module pages.

### Patch Changes

- 5b8ae41: Fix `VerticalNavItem` rendering an empty icon column for items without an `icon` (labels were pushed right and rows showed a blank circle). The label row is now a flex container, so trailing content such as `ml-auto` indicators aligns at the end of the row.
- 08cacca: Add jest-axe accessibility testing infrastructure and comprehensive a11y test suite

  - Add jest-axe dependency for automated accessibility checks
  - Configure toHaveNoViolations matcher in vitest setup
  - Add 18 axe tests covering all components (actions, forms, display, data, navigation, overlays, feedback)

## 0.2.1

### Patch Changes

- 145e32f: Harden the published package with cross-platform builds, shared form semantics, polymorphic navigation typing, generated token outputs, packed artifact verification, and required accessible names for Popover dialog surfaces.
