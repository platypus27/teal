---
'@kryv/teal': patch
---

Fix keyboard and screen-reader gaps in interactive widgets: TreeSelect now keeps a
roving tabindex in its tree and columns popovers (no more keyboard dead end when
deferred focus loses the race) and skips disabled items during arrow navigation;
RichTextEditor adds Cmd/Ctrl+B and Cmd/Ctrl+I shortcuts, aria-pressed state on its
toolbar toggles, and a live-region announcement for formatting actions; toast ids
are unique across server requests; GanttChart month labels use Intl locale data.
