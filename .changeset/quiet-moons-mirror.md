---
'@kryv/teal': minor
---

Add right-to-left support: all layout classes now use CSS logical properties
(ps/pe, start/end, ms/me, border-s/e, rounded-s/e) so components mirror
automatically under `dir="rtl"`, tree and menu depth indents indent from the
start side, and the DatePicker day grid flips its horizontal arrow keys to
match the drawn layout. Left-to-right rendering is pixel-identical.
