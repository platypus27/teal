---
'@kryv/teal': patch
---

Fix overlay layering: menus, selects, comboboxes, and other popups opened from inside a Dialog (or drawer or bottom sheet) rendered underneath it, because `--teal-z-popover` (40) sat below `--teal-z-dialog` (51); the popup is portaled to the body, so the dialog surface covered it and its items could not be clicked. The z scale now stacks popup layers above the dialog surface: overlay (50), dialog (51), popover (52), toast (60), tooltip (70). Consumers who lifted menus to the tooltip layer to work around the bug (the Home shell rule `[role='menu'] { z-index: var(--teal-z-tooltip) }`, for example) can delete that override after upgrading.
