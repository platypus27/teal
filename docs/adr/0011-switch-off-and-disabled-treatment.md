# 0011. Switch off-state and disabled control treatment

Date: 2026-11-17

## Status

Accepted

## Context

Two states misread in dark mode. An unchecked Switch filled its track with
`--teal-color-primary-container` in dark mode, so the off state looked like a
teal-filled "on" switch. A disabled Button relied on `opacity: 0.55` alone, so
a dimmed primary still read as active on a dark surface. Teal has no separate
high-contrast theme; Windows forced-colors mode is the high-contrast story, and
the forced-colors UA mapping painted the Switch thumb the same color as its
track, erasing the knob.

## Decision

- Switch off state follows Material 3: an outline-colored border on a neutral
  `surface-container-highest` track with a smaller outline-colored thumb. The
  checked state keeps the primary track with a white thumb, and the thumb grows
  to full size when checked. The track root flex-centers the thumb so both
  thumb sizes sit on the same center line.
- Button and IconButton disabled states follow Material 3's disabled recipe:
  `on-surface` at 12% for the container and 38% for the content, no border and
  no shadow, plus `cursor: not-allowed`. Hover and press feedback carry an
  `enabled:` guard so disabled buttons stay inert to pointer feedback.
- Forced-colors mode resolves the Switch thumb and checked track, and disabled
  button content, to system colors (`CanvasText`, `Highlight`, `HighlightText`,
  `GrayText`) via a dedicated `forced-colors` block in `styles.css`, using
  `forced-color-adjust: none` on those elements so the system colors stick.

## Consequences

Off and disabled states are unambiguous in light, dark, and forced-colors
modes and agree across themes. Disabled controls are exempt from WCAG contrast
rules but stay legible and clearly distinct from enabled ones. Components that
still dim via opacity alone (Toggle, ToggleGroup, Tabs, Accordion, RadioGroup,
and menu or option rows) are scheduled for the same explicit treatment in a
follow-up.
