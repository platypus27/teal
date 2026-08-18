export default {
  "id": "menu",
  "name": "Menu",
  "apiNames": [
    "Menu"
  ],
  "imports": [
    "Menu",
    "IconButton"
  ],
  "description": "A structured action menu with keyboard navigation, disabled items, icons, and danger styling.",
  "usage": "<Menu\n  trigger={<IconButton label=\"Project actions\"><MoreVertical /></IconButton>}\n  items={[\n    { id: 'settings', label: 'Settings', onSelect: () => undefined },\n    { id: 'archive', label: 'Archive', variant: 'danger', onSelect: () => undefined },\n  ]}\n/>",
  "anatomy": [
    {
      "part": "Trigger",
      "description": "The element that opens the menu; give icon-only triggers an accessible label via IconButton."
    },
    {
      "part": "Content",
      "description": "The floating list that follows the menu pattern with roving highlight and typeahead."
    },
    {
      "part": "Item",
      "description": "One action with a label, optional leading icon, disabled state, and a danger variant."
    },
    {
      "part": "Separator",
      "description": "A hairline inserted with separatorBefore to group related actions and isolate destructive ones."
    }
  ],
  "dosDonts": {
    "dos": [
      "Group related actions with separatorBefore and put destructive items last with the danger variant.",
      "Keep labels short and verb-led, like \"Duplicate\" or \"Export as PDF\".",
      "Disable unavailable items instead of hiding them so the menu stays stable."
    ],
    "donts": [
      "Don't hide frequently used primary actions behind a menu; keep them visible.",
      "Don't use a menu for navigation links; use NavigationMenu or plain links instead.",
      "Don't open dialogs from a menu item without closing the menu first (onSelect handles this)."
    ]
  },
  "related": [
    "menubar",
    "popover"
  ],
  "examples": [
    {
      "title": "Project actions",
      "description": "Items support icons, separators, and a danger variant for destructive actions."
    },
    {
      "title": "Text trigger with disabled item",
      "description": "A labelled Button can replace the icon trigger; disabled items stay visible but skip the highlight."
    },
    {
      "title": "Separated destructive action",
      "description": "Keep destructive actions at the end of the menu behind a separator."
    },
    {
      "title": "Keyboard action menu",
      "description": "Menus preserve arrow-key navigation and Escape dismissal."
    },
    {
      "title": "Right-click context menu",
      "description": "mode=\"context\" attaches the menu to any element and opens it on right-click."
    }
  ],
  "guidance": {
    "useWhen": "Several related actions belong behind one trigger.",
    "avoidWhen": "The actions should remain visible for frequent workflows.",
    "behavior": "Keyboard navigation and dismissal are managed by Radix.",
    "responsive": "Keep destructive actions separated and easy to reach on touch."
  }
}
