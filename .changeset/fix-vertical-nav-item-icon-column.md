---
'@kryv/teal': patch
---

Fix `VerticalNavItem` rendering an empty icon column for items without an `icon` (labels were pushed right and rows showed a blank circle). The label row is now a flex container, so trailing content such as `ml-auto` indicators aligns at the end of the row.
