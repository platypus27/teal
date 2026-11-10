---
'@kryv/teal': patch
---

Reject markdown link targets whose first path segment is a percent-encoded slash or backslash, including double-encoded forms such as `/%252F/evil.com`, which a server that decodes before redirecting could turn into a protocol-relative URL, and reject absolute URLs with userinfo such as `https://evil.com@good.com` from MarkdownView and the RichTextEditor preview.
