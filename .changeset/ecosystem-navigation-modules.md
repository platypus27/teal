---
'@kryv/teal': minor
---

Add ecosystem navigation modules for Kryv Home (WP1).

- `AppSwitcher`: entitlement-filtered application switcher with an explicit Home destination, anchor items with optional `current` marking, and keyboard navigation inherited from Radix. The caller filters applications first; the switcher renders only what it is given.
- `AccountMenu`: household account menu with avatar trigger, identity header, product-supplied items, and distinct app-session and SSO sign-out actions so people can tell which session ends.

Both ship with unit and axe coverage and documented module pages.
