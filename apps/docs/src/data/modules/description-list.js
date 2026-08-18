export default {
  "id": "description-list",
  "name": "Description List",
  "apiNames": [
    "DescriptionList"
  ],
  "description": "A label/value definition list for detail pages, stacked or two-column.",
  "usage": "<DescriptionList\n  items={[\n    { label: 'Owner', value: 'Avery Chen' },\n    { label: 'Created', value: 'March 4, 2026' },\n  ]}\n/>",
  "anatomy": [
    {
      "part": "Term (dt)",
      "description": "The muted label on the left of each row."
    },
    {
      "part": "Definition (dd)",
      "description": "The right-aligned value in semibold, paired with its term."
    },
    {
      "part": "Row",
      "description": "A hairline-separated flex row; the last row drops its border."
    }
  ],
  "dosDonts": {
    "dos": [
      "Keep labels short and scannable; the value carries the detail.",
      "Order items so the most identifying facts come first.",
      "Switch to layout=\"grid\" on detail pages with more than a handful of rows."
    ],
    "donts": [
      "Don't compare several records in one list; use Table for columnar comparison.",
      "Don't fill values with long paragraphs; link out to full content instead."
    ]
  },
  "related": [
    "table",
    "stat",
    "card"
  ],
  "examples": [
    {
      "title": "Detail summary",
      "description": "Real dl markup; grid layout splits into two columns on wider screens."
    },
    {
      "title": "Two-column grid",
      "description": "layout=\"grid\" splits rows into two columns from the small breakpoint up."
    }
  ],
  "guidance": {
    "useWhen": "A detail view lists labeled values for one entity.",
    "avoidWhen": "Records need column comparison; use Table.",
    "behavior": "Real dl/dt/dd markup keeps the relationship semantic.",
    "responsive": "Stacked layout is default; grid splits to two columns on wider screens."
  }
}
