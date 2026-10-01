---
'@kryv/teal': major
---

Revalue the design tokens for the voxel-world redesign (ADR 0007). Surfaces
move to warm cream glass by day and deep teal glass by night, ink and borders
follow the new palette, status colors are revalued (warning's day value is
darkened to keep WCAG AA on tinted chips), and radii revalue to the
10/14/20/28px scale with motion tokens at 160/320/600ms on a shared ease
curve. New tokens: per-product accents
(`--teal-color-product-{home,photos,yang,trict,twinkle}`),
`--teal-color-stale`, `--teal-radius-xl`, `--teal-motion-{med,slow,ease}`, and
the theme-aware `--teal-shadow-voxel` bevel. All existing token names keep
their roles, so components reskin automatically through CSS variables and
`teal-u-*` utilities; the visual change itself is breaking.
