# 0011. Switch off-state and disabled control treatment

Date: 2026-11-17

## Status

Accepted

## Context

Two states misread in dark mode. An unchecked Switch filled its track with
`--teal-color-primary-container` in dark mode, so the off state looked like a
teal-filled "on" switch. A disabled Button relied on `opacity: 0.55` alone, so
a dimmed primary still read as active on a dark surface. Teal has no separate
high-contrast theme; Windows forced-colors mode is the high-contrast story.

## Decision

- Switch off state follows Material 3: an outline-colored border on a neutral
  `surface-container-highest` track with a smaller outline-colored thumb. The
  checked state keeps the primary track and grows the thumb to full size.
- The checked thumb uses the `on-primary` token (white in light, black in
  dark) so it keeps at least 3:1 contrast against the primary track in both
  themes; a white thumb on the dark primary measured 1.86:1.
- Thumb geometry is symmetric at a 2px inset from the track border on every
  side (md checked: a 20px thumb in a 24px track; all sm positions). The md
  unchecked thumb stays at its smaller 16px size, which the track
  flex-centering insets vertically at 4px, so its start inset is 4px to
  match. Content-relative margins: md 3px unchecked and 21px checked, sm 1px
  and 17px, sizes selected by a `data-size` attribute on the root. Thumb
  travel uses logical margins, not translate utilities: flex places the
  thumb at inline start and `margin-inline-start` pushes it toward inline
  end, so movement follows the element's own direction even when a wrapper
  pins `direction` (for example Radix Tabs content defaults to `dir="ltr"`),
  survives CSS minifiers that rewrite `:dir()`, and needs no Tailwind base
  variable defaults. Under `prefers-reduced-motion` the travel transition is
  silenced with `transition: none !important`, since the component-level
  motion-reduce utility cannot outrank the travel rule.
- Hover feedback is a Material 3 state layer: `on-surface` at 8% over the
  unchecked track and `on-primary` at 8% over the checked track, applied to
  enabled switches only.
- Button and IconButton disabled states follow Material 3's disabled recipe:
  `on-surface` at 12% for the container and 38% for the content, no border and
  no shadow, plus `cursor: not-allowed`. Disabled buttons receive pointer
  events, so tooltips work and clicks no longer fall through to elements
  underneath; hover and press feedback carry a `:not(:disabled)` guard, which
  also keeps hover working on links composed via `asChild`.
- Forced-colors mode resolves the Switch thumb and checked track, and disabled
  button content, to system colors (`CanvasText`, `Highlight`, `HighlightText`,
  `GrayText`). The rules live at the end of `styles.css` with raised
  specificity (`!important` on the colors) because the compiled variant
  utilities are emitted after every hand-written rule, so order alone cannot
  protect them; a hovered checked switch selector reaches (0,4,0) otherwise.

## Consequences

Off and disabled states are unambiguous in light, dark, and forced-colors
modes and agree across themes. Disabled controls are exempt from WCAG contrast
rules but stay legible and clearly distinct from enabled ones. Components that
still dim via opacity alone (Toggle, ToggleGroup, Tabs, Accordion, RadioGroup,
and menu or option rows) are scheduled for the same explicit treatment in a
follow-up.

Known gap, reported not fixed here: transform-composition utilities (button
press scale) depend on the `--tw-*` custom-property defaults that only
Tailwind's base layer emits. Consumers that skip `@tailwind base` (for example
Home, which imports only `@kryv/teal/styles.css` plus `@tailwind utilities`)
get no press scale; the switch thumb is unaffected because its travel uses
logical margins rather than transform utilities. Recommended fix: ship the
defaults in `@kryv/teal/base.css`.
