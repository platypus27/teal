export default {
  "id": "kanban-board",
  "name": "Kanban Board",
  "apiNames": [
    "KanbanBoard"
  ],
  "description": "A column-based board where cards move between workflow stages with full keyboard support.",
  "usage": "<KanbanBoard\n  label=\"Sprint board\"\n  defaultColumns={[\n    { id: 'todo', title: 'To do', cards: [{ id: 'a', title: 'Design tokens' }] },\n    { id: 'done', title: 'Done', cards: [] },\n  ]}\n  onColumnsChange={(columns) => undefined}\n/>",
  "anatomy": [
    {
      "part": "Column",
      "description": "Fixed-width section named by its heading, with a live card count beside the title."
    },
    {
      "part": "Card",
      "description": "Button with a title and optional description; a single tab stop roves across all cards."
    },
    {
      "part": "Grab state",
      "description": "A grabbed card gets a primary border and shadow plus aria-pressed while it moves."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use onColumnsChange to persist moves; uncontrolled state resets on remount.",
      "Keep it to three to five columns; each column holds a fixed 16rem width.",
      "Announce the outcome of a move yourself (for example a toast) if it matters beyond the board."
    ],
    "donts": [
      "Don't reach for it when rows need sorting or filtering; that is Table territory.",
      "Don't put interactive controls inside cards; the whole card is the grab button.",
      "Don't expect pointer drag-and-drop; movement is keyboard-first by design."
    ]
  },
  "related": [
    "table",
    "card",
    "list"
  ],
  "examples": [
    {
      "title": "Sprint board",
      "description": "A three-stage uncontrolled board; Enter grabs a card and arrow keys move it between columns."
    },
    {
      "title": "Compact checklist",
      "description": "Two columns with optional card descriptions, showing the board adapts to smaller workflows."
    }
  ],
  "guidance": {
    "useWhen": "Users track work items across a small set of named stages, such as a sprint board or a review pipeline.",
    "avoidWhen": "Rows need sorting, filtering, or many columns — use Table; for pure drag-and-drop file or list ordering, a dedicated sortable list fits better.",
    "behavior": "Cards move one step per arrow key press. Enter or Space grabs the focused card, arrows move it, Enter or Space drops it, and Escape cancels the grab. Focus always follows the grabbed card.",
    "responsive": "Columns keep a fixed width and the board scrolls horizontally when they overflow the viewport."
  }
}
