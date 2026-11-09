---
'@kryv/teal': patch
---

Harden link safety in MarkdownView and RichTextEditor: reject protocol-relative URLs, backslash tricks, and obfuscated or percent-encoded schemes, and add `rel="noopener noreferrer"` to absolute links.
