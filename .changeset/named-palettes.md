---
'@kryv/teal': minor
---

Add named palettes as an additive selection layer over the existing light and
dark modes. `safari` stays the default and emits no `data-palette` attribute, so
default rendering is unchanged. The new `garden` palette overrides
`--teal-color-surface` and `--teal-color-primary` under
`data-palette='garden'` in both light and dark, inheriting every other token.
`ThemeProvider` gains optional `palette` and `paletteStorageKey` props and
`palette`/`setPalette` on the theme context, persisting the choice to
localStorage and removing the attribute for the default palette. The two new
context members are optional in the exported `ThemeContextValue` type so a
hand-built or mocked 1.2.0-shaped context still typechecks; the provider
always supplies both at runtime. See the
package README and `docs/palette-release-prep.md` for the attribute contract,
supported names, capability detection, and the release checklist.
