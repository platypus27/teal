export default {
  "id": "permission-matrix",
  "name": "Permission Matrix",
  "apiNames": [
    "PermissionMatrix"
  ],
  "imports": [
    "PermissionMatrix",
    "Badge"
  ],
  "description": "A people-by-applications access matrix with caller-supplied cell content and explicit no-access cells.",
  "usage": "<PermissionMatrix\n  caption=\"Household application access\"\n  columns={[\n    { id: 'photos', label: 'Photos' },\n    { id: 'trict', label: 'Trict' },\n  ]}\n  rows={[\n    { id: 'avery', label: 'Avery', cells: { photos: <Badge variant=\"success\">Owner</Badge> } },\n  ]}\n/>",
  "anatomy": [
    {
      "part": "Caption and region",
      "description": "A visually hidden table caption inside a labelled region states whose access the matrix shows."
    },
    {
      "part": "Row-label column",
      "description": "The first column names each person or capability; its header stays visually hidden and defaults to \"Name\"."
    },
    {
      "part": "Application columns",
      "description": "One column per application, rendered in the order the columns array supplies."
    },
    {
      "part": "Access cells",
      "description": "Caller-rendered content per row and column, such as badges or short words; policy stays in the calling product."
    },
    {
      "part": "Empty cells",
      "description": "Missing entries render an explicit em dash, overridable through emptyCell."
    }
  ],
  "dosDonts": {
    "dos": [
      "Keep cell content short — a Badge or a single word like \"Operate\" reads best in a grid.",
      "Write a caption that names the people and applications being compared.",
      "Override emptyCell when \"no access\" deserves explicit wording rather than a dash."
    ],
    "donts": [
      "Don't encode access policy in color alone; render it as text or badges.",
      "Don't use the matrix for a flat, single-resource list; use Table instead.",
      "Don't leave cells blank; a blank reads as missing data, not as \"no access\"."
    ]
  },
  "related": [
    "table",
    "badge"
  ],
  "examples": [
    {
      "title": "Household access",
      "description": "Cells carry caller-rendered content such as badges; missing entries show an explicit em dash."
    },
    {
      "title": "Entitlement review",
      "description": "Capability rows work the same way, keeping entitlement policy in the calling product."
    }
  ],
  "guidance": {
    "useWhen": "Owners review who can reach which application or capability.",
    "avoidWhen": "The data is a flat list rather than a people-by-applications grid; use Table instead.",
    "behavior": "Cells are caller-rendered; missing entries show an explicit em dash rather than a blank.",
    "responsive": "The table region scrolls horizontally on narrow screens and becomes focusable only when it overflows."
  }
}
