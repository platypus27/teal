export default {
  "id": "tree-grid",
  "name": "Tree Grid",
  "apiNames": [
    "TreeGrid"
  ],
  "description": "A data table whose rows form an expandable tree, following the WAI-ARIA treegrid pattern.",
  "usage": "<TreeGrid\n  aria-label=\"Project files\"\n  columns={[\n    { key: 'name', label: 'Name' },\n    { key: 'size', label: 'Size' },\n  ]}\n  rows={[\n    { id: 'src', name: 'src', size: '—', children: [{ id: 'app', name: 'app.ts', size: '2 KB' }] },\n  ]}\n/>",
  "anatomy": [
    {
      "part": "Header row",
      "description": "columnheader cells; the first column owns the tree affordances."
    },
    {
      "part": "Tree cell",
      "description": "First column with depth indentation, a chevron toggle on parent rows, and the row label."
    },
    {
      "part": "Data cells",
      "description": "Remaining gridcell columns read from the row object by key."
    }
  ],
  "dosDonts": {
    "dos": [
      "Put the most identifying column first; it carries the indentation and expand toggle.",
      "Use defaultExpandedIds to spotlight one or two branches on first render.",
      "Keep cell content as simple text; interaction belongs on the row."
    ],
    "donts": [
      "Don't use it for flat tables; Table adds sorting and selection.",
      "Don't nest deeper than four or five levels; indentation eats the first column.",
      "Don't put focusable controls inside cells; the keyboard model is row-level."
    ]
  },
  "related": [
    "table",
    "tree-view",
    "tree-select"
  ],
  "examples": [
    {
      "title": "File tree",
      "description": "A collapsed-by-default file listing; Arrow Right expands a folder row to reveal its children."
    },
    {
      "title": "Pre-expanded budget",
      "description": "defaultExpandedIds opens chosen branches on first render, useful for spotlight rows."
    }
  ],
  "guidance": {
    "useWhen": "Tabular data has a parent-child structure, such as file trees, budget rollups, or nested categories with shared columns.",
    "avoidWhen": "Rows are flat — use Table, which supports sorting and selection; if there is no per-row data beyond a label, TreeView is simpler.",
    "behavior": "Collapsed rows hide their whole subtree. Arrow Right expands a collapsed parent, Arrow Left collapses it or moves focus to its parent, and expansion state is controlled or uncontrolled.",
    "responsive": "Columns keep their content width and the grid scrolls horizontally on narrow screens; indentation grows with depth instead of widening columns."
  }
}
