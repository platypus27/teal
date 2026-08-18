export default {
  "id": "floating-panel",
  "name": "Floating Panel",
  "apiNames": [
    "FloatingPanel"
  ],
  "description": "A non-modal panel anchored to a viewport corner for tools that coexist with the page.",
  "usage": "<FloatingPanel\n  open={open}\n  onOpenChange={setOpen}\n  anchor=\"bottom-right\"\n  title=\"Clipboard history\"\n>\n  <p>Panel content</p>\n</FloatingPanel>",
  "anatomy": [
    {
      "part": "Panel",
      "description": "The non-modal surface pinned to a viewport corner; the page stays interactive behind it."
    },
    {
      "part": "Header",
      "description": "The title row with a close button, naming the panel for assistive technology."
    },
    {
      "part": "Body",
      "description": "The caller's companion content, like clipboard history or shortcuts."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use for companion tooling the user keeps open while working, like history or inspectors.",
      "Pick an anchor corner that doesn't cover the page's primary navigation.",
      "Keep the content compact; the panel has a fixed, viewport-capped width."
    ],
    "donts": [
      "Don't use it for decisions that need full attention; use Dialog.",
      "Don't open several floating panels that overlap each other.",
      "Don't put transient feedback in it; use Toast."
    ]
  },
  "related": [
    "dialog",
    "popover"
  ],
  "examples": [
    {
      "title": "Corner panel",
      "description": "A closable panel floats above the page without trapping focus or dimming content."
    },
    {
      "title": "Alternate anchor",
      "description": "The anchor prop moves the panel to any viewport corner."
    }
  ],
  "guidance": {
    "useWhen": "Companion tooling (history, shortcuts, inspectors) the user keeps open while working in the page.",
    "avoidWhen": "Tasks that demand full attention or decisions; use Dialog instead.",
    "behavior": "Non-modal: the page stays interactive, focus is not trapped, and the panel closes via its close button or Escape.",
    "responsive": "Fixed width capped to the viewport with margins on every side, so it never covers edge-to-edge on phones."
  }
}
