export default {
  "id": "page-header",
  "name": "Page Header",
  "apiNames": [
    "PageHeader"
  ],
  "imports": [
    "PageHeader",
    "Button"
  ],
  "description": "A responsive page title, supporting text, and action area.",
  "usage": "<PageHeader\n  title=\"Workspace settings\"\n  subtitle=\"Manage security and notifications\"\n  actions={<Button>Save changes</Button>}\n/>",
  "anatomy": [
    {
      "part": "Title",
      "description": "Page heading rendered as h1 by default; adjust with titleAs to fit the page outline."
    },
    {
      "part": "Subtitle",
      "description": "Supporting text rendered under the title."
    },
    {
      "part": "Actions",
      "description": "Trailing action area that wraps below the title on narrow screens."
    }
  ],
  "dosDonts": {
    "dos": [
      "Keep one primary action in the actions slot; demote the rest.",
      "Set titleAs so the heading level fits the page outline.",
      "Pair with Breadcrumb above when the page sits deep in a hierarchy."
    ],
    "donts": [
      "Don't repeat the global Top Bar actions here; keep them page-level.",
      "Don't stack multiple page headers on one route."
    ]
  },
  "related": [
    "breadcrumb",
    "top-bar",
    "sub-nav"
  ],
  "examples": [
    {
      "title": "Settings header",
      "description": "Actions wrap below the title on narrow screens automatically."
    },
    {
      "title": "Responsive actions",
      "description": "Let actions wrap beneath the title on narrow screens."
    }
  ],
  "guidance": {
    "useWhen": "A route needs a consistent title, context, and primary actions.",
    "avoidWhen": "The content is a small inline section without route-level actions.",
    "behavior": "Actions remain aligned with the title and wrap below it when needed.",
    "responsive": "Let actions wrap naturally below the heading at narrow widths."
  }
}
