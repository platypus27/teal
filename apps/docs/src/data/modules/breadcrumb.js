export default {
  "id": "breadcrumb",
  "name": "Breadcrumb",
  "apiNames": [
    "Breadcrumb"
  ],
  "description": "A hierarchical trail with router-ready items and automatic middle-item collapse.",
  "usage": "<Breadcrumb\n  items={[\n    { label: 'Workspace', href: '/' },\n    { label: 'Projects', href: '/projects' },\n    { label: 'Orion' },\n  ]}\n/>",
  "anatomy": [
    {
      "part": "Trail",
      "description": "Nav landmark rendering the items in order as links."
    },
    {
      "part": "Separators",
      "description": "Chevron icons between items, hidden from assistive technology."
    },
    {
      "part": "Current page",
      "description": "The last item, rendered as text with aria-current=\"page\"."
    },
    {
      "part": "Collapse menu",
      "description": "Middle items fold into an overflow menu past collapseAfter."
    }
  ],
  "dosDonts": {
    "dos": [
      "Keep the last item as plain text; it is the current page, not a link.",
      "Prefer collapsing middle items over truncating labels on narrow screens."
    ],
    "donts": [
      "Don't use breadcrumbs on flat structures or as a back button.",
      "Don't duplicate the primary navigation in the trail."
    ]
  },
  "related": [
    "page-header",
    "sub-nav",
    "anchor-nav"
  ],
  "examples": [
    {
      "title": "Hierarchy",
      "description": "Items render in order; the last item is the current page."
    },
    {
      "title": "Collapsed middle items",
      "description": "Trails longer than collapseAfter move middle items into a labeled menu."
    }
  ],
  "guidance": {
    "useWhen": "Users need to see and move within a deep page hierarchy.",
    "avoidWhen": "The structure is flat or the trail would duplicate primary navigation.",
    "behavior": "The last item is the current page; middle items collapse into a menu past collapseAfter.",
    "responsive": "Let items wrap and prefer collapsing over shrinking labels."
  }
}
