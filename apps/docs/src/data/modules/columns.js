export default {
  "id": "columns",
  "name": "Columns",
  "apiNames": [
    "Columns"
  ],
  "description": "An equal-width grid column layout that keeps row alignment and collapses to fewer columns on narrow screens.",
  "usage": "<Columns\n  columns={3}\n  gap={3}\n>\n  {features.map((f) => <FeatureCard key={f.id} {...f} />)}\n</Columns>",
  "anatomy": [
    {
      "part": "Track grid",
      "description": "Equal-width cells that keep rows aligned; DOM order matches visual order."
    },
    {
      "part": "Column count",
      "description": "The columns prop sets the wide-screen count and collapses through fewer columns at smaller breakpoints."
    },
    {
      "part": "Gap",
      "description": "Row and column spacing from the spacing scale."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use it for feature grids and stat groups that need tidy, aligned rows.",
      "Let the built-in collapse (for example 3 to 2 to 1) handle narrow screens.",
      "Keep cell content roughly equal in height for the cleanest rows."
    ],
    "donts": [
      "Don't use Columns when heights vary wildly and tight packing matters; use Masonry.",
      "Don't fight the equal widths with per-child width utilities.",
      "Don't use it for one-axis lists; Stack is simpler."
    ]
  },
  "related": [
    "grid",
    "masonry",
    "card"
  ],
  "examples": [
    {
      "title": "Three-up feature grid",
      "description": "Equal cells keep row alignment at three columns on wide screens, collapsing through two to one."
    },
    {
      "title": "Two-column detail",
      "description": "A wider gap and two columns suit richer cards that need more horizontal room."
    }
  ],
  "guidance": {
    "useWhen": "Items should form tidy rows of equal-width cells that step down responsively, like feature grids or stat groups.",
    "avoidWhen": "Items have wildly different heights and tight packing matters more than row alignment; use Masonry instead.",
    "behavior": "Columns guarantees every cell in a row shares the same width and the row order matches the DOM order.",
    "responsive": "The count collapses automatically (for example 3 -> 2 -> 1) at the sm and lg breakpoints; nothing is measured in JavaScript."
  }
}
