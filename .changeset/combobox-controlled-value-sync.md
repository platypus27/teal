---
'@kryv/teal': patch
---

Fix the single-select Combobox label when its controlled `value` changes. The input shows the selected label as soon as the option is available. Refreshing options preserves an active search query even when the new options omit the selected value.
