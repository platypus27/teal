---
'@kryv/teal': minor
---

Add ecosystem surface modules for Kryv Home (WP1).

- `LauncherCard`: interactive application destination card built on the polymorphic `Card`, with icon, description, caller-supplied status content, and an honest unavailable state that leaves the focus order and blocks navigation.
- `PermissionMatrix`: people-by-applications access matrix built on `Table`, with caller-rendered cells, explicit em-dash no-access cells, and a screen-reader header for the row-label column. Permission policy stays with the caller.

Both ship with unit and axe coverage and documented module pages.
