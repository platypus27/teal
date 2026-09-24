---
'@kryv/teal': minor
---

Forward refs on all remaining public components: AccountMenu, AppSwitcher, Chip,
Command, EcosystemRail, FileUpload, Menu, Menubar, NavigationMenu,
PermissionMatrix, Popconfirm, Popover, Tooltip, and TreeView. Each ref lands on
the element that carries the component's `className` — the root element for
always-rendered components and the popup surface for overlay components.
