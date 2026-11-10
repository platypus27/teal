---
'@kryv/teal': patch
---

Reject markdown link targets whose first path segment decodes to a slash, backslash, or ASCII control character, including multiply-encoded forms such as `/%2525252F/evil.com` and dot-hidden forms such as `/./%2F/evil.com`, which a server that decodes before redirecting could turn into a protocol-relative URL, and reject absolute URLs with userinfo such as `https://evil.com@good.com` from MarkdownView and the RichTextEditor preview. Encoded slashes later in the path, such as `/a/%2F/b`, remain allowed.
