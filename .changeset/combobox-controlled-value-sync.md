---
'@kryv/teal': patch
---

Fix Combobox not re-rendering its displayed label when the controlled `value` changes externally. The single-select Combobox kept the input text as mount-only state, so a parent that reloaded data, applied a suggestion, or saved a canonical name left the box showing stale text until it was closed and reopened. The input now follows the selected option's label whenever the controlled value changes and shows the label once options arrive for a value that was set before they loaded. Typing is untouched, because the sync only runs when the value or its label changes, so keyboard focus and in-progress edits are preserved. Consumers who keyed the Combobox to force a remount on external value changes (the Home ProactiveSettings timezone box, for example) can drop the remount after upgrading.
