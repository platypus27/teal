export default {
  "id": "tree-view",
  "name": "Tree View",
  "apiNames": [
    "TreeView"
  ],
  "description": "A hierarchical disclosure list with keyboard navigation and selection.",
  "usage": "<TreeView\n  aria-label=\"Project files\"\n  items={[\n    { id: 'src', label: 'src', children: [{ id: 'app', label: 'App.tsx' }] },\n  ]}\n/>",
  "anatomy": [
    {
      "part": "Tree",
      "description": "The role=\"tree\" list, named by a required aria-label."
    },
    {
      "part": "Tree items",
      "description": "role=\"treeitem\" rows with aria-expanded on parents and aria-selected on the selection."
    },
    {
      "part": "Toggle",
      "description": "Chevron that expands or collapses a parent without selecting it."
    },
    {
      "part": "Groups",
      "description": "role=\"group\" lists holding each parent's children."
    }
  ],
  "dosDonts": {
    "dos": [
      "Always pass an aria-label naming the tree.",
      "Use it only for genuinely hierarchical data like files or categories."
    ],
    "donts": [
      "Don't render flat lists as trees; use List instead.",
      "Don't put interactive controls inside rows; keep the single-focus tree pattern."
    ]
  },
  "related": [
    "accordion",
    "list",
    "tree-grid"
  ],
  "examples": [
    {
      "title": "Hierarchy",
      "description": "Arrows expand, collapse, and move; Enter selects with aria-selected."
    },
    {
      "title": "Default expansion",
      "description": "Open key branches on first render with defaultExpandedIds."
    }
  ],
  "guidance": {
    "useWhen": "Content is genuinely hierarchical, like files or nested categories.",
    "avoidWhen": "The list is flat; use a plain list or Tabs.",
    "behavior": "Arrow keys expand, collapse, and move; Enter selects.",
    "responsive": "Indent scales with depth; keep labels truncating, not wrapping."
  }
}
