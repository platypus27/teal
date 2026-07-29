---
'@kryv/teal': minor
---

Add NavRail and refine the shared visual language:

- New `NavRail`/`NavRailItem`: a fully rounded floating icon rail with tooltips, active tint, and optional badge dots.
- Standardized radius scale: all controls and boxes use the 0.75rem control radius (buttons and button groups lose their pill shape), nested items use concentric 0.5rem, pill is reserved for icon-only controls, tags, and avatars.
- Icon-only controls are circular: IconButton (including Dialog/Drawer close, Calendar and Carousel arrows, BackTop, dismiss buttons), CopyButton, ThemeToggle, Rating stars, NumberInput steppers, and Pagination page numbers; tooltips are pill-shaped.
- Flush focus ring: the highlight now sits directly on the control border with no offset gap.
- Alert and Banner use opaque tinted surfaces; Banner drops its thick left accent border.
- InputGroup highlights as one control on focus instead of only the editable section.
- Combobox no longer dismisses itself when opened by mouse click, and focuses with its current text selected.
- Drawer floats inset from the viewport edge with fully rounded corners.
- Page no longer shifts when Dialog/Drawer/AlertDialog lock scroll (`scrollbar-gutter: stable`).
- ProgressCircle indeterminate state spins smoothly without snapping back.
- AppSwitcher plays its open animation; ScrollArea constrains its viewport correctly and supports horizontal scrolling.
- VerticalNav items use a full-row rounded active/hover treatment instead of a separate icon chip.
