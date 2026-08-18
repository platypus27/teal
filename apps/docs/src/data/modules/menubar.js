export default {
  "id": "menubar",
  "name": "Menubar",
  "apiNames": [
    "Menubar"
  ],
  "description": "An application command bar of labeled dropdown menus with full keyboard navigation.",
  "usage": "<Menubar\n  label=\"Application\"\n  menus={[\n    { label: 'File', items: [{ id: 'new', label: 'New project', onSelect: () => undefined }] },\n    { label: 'Edit', items: [{ id: 'undo', label: 'Undo', onSelect: () => undefined }] },\n  ]}\n/>",
  "anatomy": [
    {
      "part": "Menu bar",
      "description": "The menubar root row, named by the label prop."
    },
    {
      "part": "Triggers",
      "description": "Labeled menu buttons such as File and Edit."
    },
    {
      "part": "Menu panels",
      "description": "Dropdown lists of items with optional icons, separators, and a danger variant."
    }
  ],
  "dosDonts": {
    "dos": [
      "Group commands the way desktop users expect: File, Edit, View.",
      "Use separatorBefore to split destructive commands from safe ones."
    ],
    "donts": [
      "Don't use it for site navigation; use Navigation Menu.",
      "Don't use it for a handful of actions; use a Toolbar."
    ]
  },
  "related": [
    "menu",
    "toolbar",
    "command"
  ],
  "examples": [
    {
      "title": "Application commands",
      "description": "Arrows move across menus and through items following the menubar pattern."
    },
    {
      "title": "Menu items",
      "description": "Items share the Menu contract, including icons, disabled states, and danger."
    }
  ],
  "guidance": {
    "useWhen": "A desktop-style application exposes many commands in labeled menus.",
    "avoidWhen": "There are few actions; use a Toolbar or Menu.",
    "behavior": "Arrows traverse triggers and items following the menubar pattern.",
    "responsive": "Collapse into a single menu on narrow screens."
  }
}
