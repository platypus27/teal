---
"@kryv/teal": patch
---

Skip the trigger focus-restore when an ecosystem drawer destination is picked or an account-menu sign-out action runs: those closes navigate or replace the surface, and the consumer owns the next focus move. `Dialog` gains an optional `onCloseAutoFocus` hook (call `event.preventDefault()` to take over close focus); drawer Escape/close-button closes and plain menu items keep restoring focus to their triggers.
