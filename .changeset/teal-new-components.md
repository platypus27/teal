---
'@kryv/teal': minor
---

Expand the catalog with four new components.

- `Alert`: inline feedback banner with the shared `variant` vocabulary (neutral/info/success/warning/danger), optional `title`, `icon` override, and `onDismiss`. Assertive `role="alert"` for danger, `role="status"` otherwise.
- `Avatar`: image with initials fallback (also on load error) and a generic icon fallback; `size` scale, alt defaults to `name`, decorative when unnamed.
- `Breadcrumb`: hierarchy navigation with `aria-current="page"` on the last item, router-link support via `as`, and middle-item collapse into an overflow menu beyond `collapseAfter`.
- `Accordion`: single- or multi-open collapsible sections built on a new `@radix-ui/react-accordion` dependency, with mode-aware `value`/`defaultValue`/`onValueChange` typing.

All four forward refs, ship with unit and axe coverage, and are documented with new module pages.
