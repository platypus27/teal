---
'@kryv/teal': patch
---

Fix Switch and Button states that misread in dark mode and high contrast. An unchecked Switch no longer fills its track with the primary container color in dark mode, which made it look switched on; the off state now follows the Material 3 pattern with an outline track on a neutral surface container and a smaller outline-colored thumb, so off reads as off in light, dark, and forced-colors modes (where the thumb and checked track now resolve to system colors). Button and IconButton disabled states no longer rely on opacity alone, which kept a dimmed primary looking active on dark surfaces; disabled buttons now use an explicit on-surface treatment (12% container, 38% content, no border or shadow) with a not-allowed cursor, and hover and press feedback is suppressed on disabled buttons.
