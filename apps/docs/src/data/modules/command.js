export default {
  "id": "command",
  "name": "Command",
  "apiNames": [
    "Command"
  ],
  "imports": [
    "Command",
    "Button"
  ],
  "description": "A command palette dialog with grouped, filterable actions and keyboard navigation; pass a render function as children for full-screen search with caller-owned results.",
  "usage": "<Command\n  open={open}\n  onOpenChange={setOpen}\n  groups={[\n    { label: 'Projects', items: [{ id: 'orion', label: 'Open Orion', onSelect: () => undefined }] },\n  ]}\n/>",
  "anatomy": [
    {
      "part": "Dialog shell",
      "description": "The modal surface that owns focus, dismissal, and scroll locking while the palette is open."
    },
    {
      "part": "Input",
      "description": "The filter field, focused on open, with a caller-set placeholder."
    },
    {
      "part": "Group",
      "description": "A labelled cluster of related commands, like \"Project\" or \"Danger zone\"."
    },
    {
      "part": "Item",
      "description": "One command with a label, optional icon, and a keyboard hint such as ⌘N."
    }
  ],
  "dosDonts": {
    "dos": [
      "Group commands under short labels so filtering reads as structured sections.",
      "Write verb-led item labels and show shortcut hints where they exist.",
      "Set placeholder and emptyMessage to match the palette's scope."
    ],
    "donts": [
      "Don't use the grouped palette as site search over content; use render-prop mode with resultCount instead.",
      "Don't run destructive commands without a follow-up AlertDialog confirmation.",
      "Don't overload it with every possible action; keep it to high-frequency commands."
    ]
  },
  "related": [
    "combobox",
    "menu",
    "dialog"
  ],
  "examples": [
    {
      "title": "Palette",
      "description": "Arrows cycle filtered items, Enter runs the action, state resets on open."
    },
    {
      "title": "Scoped palette",
      "description": "A palette scoped to admin commands with its own placeholder and empty message."
    },
    {
      "title": "Keyboard first",
      "description": "Bind a global shortcut to open the palette; keep item hints scannable."
    },
    {
      "title": "Full-screen search",
      "description": "A render function as children switches to full-screen search; the render prop receives query and highlight state while resultCount drives arrow-key cycling."
    }
  ],
  "guidance": {
    "useWhen": "Power users need fast keyboard access to many actions.",
    "avoidWhen": "There are few actions; use visible buttons or a Menu.",
    "behavior": "Filtering, highlight, and selection reset on every open.",
    "responsive": "The panel caps at viewport width with its own internal scroll."
  }
}
