export default {
  "id": "table",
  "name": "Table",
  "apiNames": [
    "Table"
  ],
  "description": "Accessible data presentation driven by column definitions, with caller-owned sorting and row selection, density, loading, and empty state.",
  "usage": "<Table\n  caption=\"Team members\"\n  columns={[{ key: 'name', header: 'Name', cell: (row) => row.name, sortable: true }]}\n  rows={rows}\n  getRowKey={(row) => row.id}\n  sort={sort}\n  onSortChange={setSort}\n  selectable\n/>",
  "anatomy": [
    {
      "part": "Scroll region",
      "description": "The overflow wrapper with role=\"region\" named after the caption; it takes keyboard focus only when it actually scrolls."
    },
    {
      "part": "Caption",
      "description": "Visually hidden caption announcing the table's subject to screen readers."
    },
    {
      "part": "Header row",
      "description": "Uppercase th cells with scope=\"col\", one per column definition, on a raised surface."
    },
    {
      "part": "Sort headers",
      "description": "Buttons inside sortable th cells that toggle ascending/descending and expose aria-sort on the column."
    },
    {
      "part": "Selection column",
      "description": "A header checkbox with indeterminate state plus one checkbox per row, added by selectable."
    },
    {
      "part": "Body rows",
      "description": "One tr per record keyed by getRowKey; each column's cell renderer produces the td content; selected rows are tinted and expose aria-selected."
    },
    {
      "part": "Loading and empty states",
      "description": "Skeleton rows with a busy region while loading, or the empty content spanning all columns when rows is empty."
    }
  ],
  "dosDonts": {
    "dos": [
      "Always pass a caption; it names both the region and the table for assistive technology.",
      "Keep sort and selectedKeys controlled; the component reports intent, you re-sort the rows.",
      "Use density=\"compact\" in dashboards and side panels where vertical space is scarce.",
      "Give empty a helpful message that explains why there are no rows."
    ],
    "donts": [
      "Don't expect Table to sort for you; onSortChange only reports the next sort state.",
      "Don't derive row keys from array indexes; getRowKey should return a stable id.",
      "Don't put unlabeled icon buttons in cells; every interactive cell needs an accessible name."
    ]
  },
  "related": [
    "permission-matrix",
    "list",
    "pagination"
  ],
  "examples": [
    {
      "title": "Column definitions",
      "description": "Columns declare their header and cell renderer; rows need a stable key."
    },
    {
      "title": "Loading state",
      "description": "loading swaps in skeleton rows, marks the region busy, and announces the loadingLabel."
    },
    {
      "title": "Sorting and selection",
      "description": "Sortable headers set aria-sort and report through onSortChange; selectable adds a header checkbox with indeterminate bulk state."
    }
  ],
  "guidance": {
    "useWhen": "Records need readable rows and columns, optionally with caller-owned sorting and selection.",
    "avoidWhen": "The data is hierarchical; TreeView or TreeGrid fits better.",
    "behavior": "Columns declare a header and a cell renderer; sortable headers report the next sort state through onSortChange, and selectable adds a header checkbox with indeterminate bulk state plus per-row checkboxes reported through onSelectionChange. Loading swaps in skeleton rows and marks the region busy; an empty rows array shows the empty content.",
    "responsive": "The region scrolls horizontally when columns overflow and takes keyboard focus only then."
  }
}
