---
'@kryv/teal': minor
---

Add the voxel-world component layer (ADR 0007 components addendum).
`ThemeProvider` + `useTheme` own the ecosystem-wide light/dark/system
preference: the choice persists to localStorage (configurable `storageKey`),
system tracks `prefers-color-scheme` live, and the resolved theme is applied
as the `dark` class on the document root; storage and matchMedia are guarded
for SSR. `ThemeToggle` becomes controlled when rendered inside a provider and
keeps its previous uncontrolled behavior otherwise. `EcosystemShell` assembles
the shared ecosystem chrome — the `EcosystemRail` with brand, Home, and
health-dotted destinations, a composed settings + `AccountMenu` footer, a top
bar slot, a scrolling main region, and a mobile `Dialog` drawer with the voxel
bevel shadow. `SettingsShell` is the unified settings layout: a sections nav
(anchors for `href` items, buttons for `onSelect`, `aria-current` and a
product-accent edge on the current item) beside a content panel with step-up
notice and save bar slots.
