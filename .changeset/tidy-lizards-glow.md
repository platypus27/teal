---
'@kryv/teal': patch
---

Harden link rendering in MarkdownView and the RichTextEditor preview against URL allowlist bypasses. Links now resolve against the document origin: `https:` and same-origin links (including relative paths like `./page` or `?tab=2`) render, `mailto:` links render with `cc`/`bcc`/`body` stripped, and protocol-relative (`//`, `/.//`), backslash, whitespace/control/zero-width-prefixed, numeric-entity, and percent-encoded scheme tricks are rejected. `http:` and `tel:` render only when passed via the new `allowedLinkSchemes` prop, and apps can narrow links further with the new `isAllowedHref` prop. Absolute links render with `rel="noreferrer"`, matching `Link`.
