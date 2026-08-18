export default {
  "id": "masonry",
  "name": "Masonry",
  "apiNames": [
    "Masonry"
  ],
  "description": "A CSS-columns masonry layout where unequal-height items pack tightly down each column without row gaps.",
  "usage": "<Masonry\n  columns={3}\n  gap={3}\n>\n  {notes.map((note) => <NoteCard key={note.id} {...note} />)}\n</Masonry>",
  "anatomy": [
    {
      "part": "Column tracks",
      "description": "CSS multi-column tracks; items fill the first column before spilling into the next."
    },
    {
      "part": "Item wrapper",
      "description": "Each child is wrapped with break-inside: avoid so cards never split across columns."
    },
    {
      "part": "Gap",
      "description": "Column and row spacing from the spacing scale."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use it for note walls and photo grids where item heights are unpredictable.",
      "Set minColumnWidth when the column count should adapt to the container width.",
      "Keep DOM order meaningful; screen readers read down each column in source order."
    ],
    "donts": [
      "Don't use Masonry when left-to-right row reading order matters; use Columns or Grid.",
      "Don't put row-aligned comparisons, such as pricing tiers, into masonry.",
      "Don't expect equal column heights; the final column may run short."
    ]
  },
  "related": [
    "columns",
    "grid",
    "card"
  ],
  "examples": [
    {
      "title": "Fixed column count",
      "description": "Cards of different heights flow down three columns; each card is wrapped to avoid column breaks."
    },
    {
      "title": "Minimum column width",
      "description": "A minColumnWidth lets the browser add or drop columns as the container changes size."
    }
  ],
  "guidance": {
    "useWhen": "Items have unpredictable heights and packing them tightly matters more than keeping rows aligned, like note or photo walls.",
    "avoidWhen": "Reading order must run left to right across rows, or rows must align; use Columns or Grid instead.",
    "behavior": "Items fill the first column before spilling into the next, so DOM order reads top-to-bottom per column; every child is wrapped with break-inside: avoid.",
    "responsive": "With minColumnWidth the column count derives from the available width and collapses naturally on narrow screens."
  }
}
