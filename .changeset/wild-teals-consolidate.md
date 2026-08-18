---
'@kryv/teal': patch
---

**0.5.1 intentionally ships breaking changes.** The library consolidates 33 overlapping components into 24 merged ones; old component names are deleted with no alias re-exports (maintainer-approved semver exception for this patch). Migrate with the table below.

### Migration table

| Removed component(s) | Use instead |
| --- | --- |
| `MonthPicker`, `YearPicker`, `DateTimePicker`, `DateRangePicker` | `DatePicker` with `mode="month" \| "year" \| "datetime"` and/or `selection="range"` |
| `Cascader` | `TreeSelect` with `display="columns"` (emits full path `string[]`; `display="tree"` emits leaf `string`) |
| `SegmentedControl` | `ToggleGroup` with `variant="segmented"` |
| `FullscreenDialog`, `Drawer`, `BottomSheet` | `Dialog` with `placement="fullscreen" \| "left" \| "right" \| "bottom"` (`BottomSheet`'s `snap` carries over) |
| `Banner`, `Callout` | `Alert` with `appearance="banner" \| "callout"` |
| `RangeSlider` | `Slider` with `range` / `value: [number, number]` |
| `DataTable` | `Table` (absorbs sorting + row-selection props; `DataTableColumn` shape) |
| `ContextMenu` | `Menu` with `mode="context"` |
| `Result` | `EmptyState` with optional `status` |
| `TableOfContents` | `AnchorNav` with nested `items` |
| `AreaChart` | `LineChart` with `type="area"` (+ `stacked`) |
| `VerticalNav`, `SideRail` | `Sidebar` with `collapsed` / `mode="rail" \| "full"` |
| `PulseDot` | `StatusDot` with `pulse` |
| `RadioCard` | `RadioGroup` with `variant="card"` |
| `CheckboxCard` | `Checkbox` with `variant="card"` |
| `MultiSelect` | `Combobox` with `multiple` |
| `AutosizeTextarea` | `TextArea` with `autosize` (+ `minRows`/`maxRows`) |
| `HoverCard` | `Popover` with `openOn="hover"` |
| `SpeedDial` | `FloatingActionButton` with `actions[]` |
| `ProgressCircle` | `Progress` with `shape="circle"` |
| `Panel`, `GlassPanel` | `Card` with `title`/`actions` header props and `variant="glass"` |
| `SearchOverlay` | `Command` (render-prop/children API absorbed) |
| `MegaMenu` | `NavigationMenu` |
| `SearchInput`, `PasswordInput` | `Input` with `clearable` / `loading`, and built-in reveal for `type="password"` |

### Behavioral changes to note when migrating

- `Slider`'s `onValueChange` now emits a scalar `number` for single sliders (previously a single-element array); range mode emits `[number, number]`.
- `Result`'s `actions` prop is renamed to `action` on `EmptyState`.
- `Sidebar`'s full-mode content area is now focusable (`tabIndex=0`), adding one tab stop for keyboard users.
- `NavigationMenu` (absorbing `MegaMenu`) uses Radix's keyboard model: arrows move between triggers, Enter/Space/click/hover open panels, Tab moves within content, Escape closes — replacing MegaMenu's hand-rolled in-panel arrow navigation.
- `NumberInput`'s default field height grows from 40px to 48px so the joined steppers meet the 24px minimum target size.
- `DatePicker`'s popover renders inline rather than in a portal.
- `Combobox`'s `onValueChange` is typed as a union: `(value: string) => void` in single mode, `(value: string[]) => void` with `multiple`.

### Fixed

- ButtonGroup: selected option now gets an elevated accent treatment so the active selection is obvious.
- ActionBar: bottom corners are rounded to match the surrounding surface.
- NumberInput: steppers are a compact joined control with tighter spacing.
- InputGroup: focus highlight now matches the standalone input treatment.
- PhoneInput: country picker rebuilt on the shared Radix popover, consistent with the other dropdowns.
- Tooltip: accepts `placement` as an alias for `side`.
- BlockingOverlay: scrim strengthened for legibility.
- OfflineBanner: restyled with warning emphasis for legibility.
- Table: bulk-selection checkbox now matches the standard Checkbox visuals.
- Combobox: clicking the open dropdown's input now closes it (toggle close).
- Input: the loading spinner occupies the same trailing slot as the clear button — no more broken/jumping loading indicator.
- Card (`variant="glass"`): higher-opacity surface, stronger blur, and token text colors so glass content stays legible.
- FunnelChart: labels stay inside or beside narrow bands instead of overflowing.
- GaugeChart: zones draw over a track with full-opacity caps.
- PieChart: the label halo (weird shadow) is gone.
- OrgChart: connectors stay centered across differing node widths.
- Tour: highlight and popover now portal to `document.body`, so tours work inside transformed ancestors.
- DatePicker range selection: the selected range renders as a connected band instead of circles at the ends with boxes between.
