export default {
  "id": "anchor-nav",
  "name": "Anchor Nav",
  "apiNames": [
    "AnchorNav"
  ],
  "description": "A scroll-spy nav of page section anchors that highlights the section in view and smooth-scrolls on click.",
  "usage": "<AnchorNav\n  containerRef={scrollBoxRef}\n  items={[\n    { id: 'overview', label: 'Overview' },\n    {\n      id: 'features',\n      label: 'Features',\n      children: [{ id: 'feature-flags', label: 'Feature flags' }],\n    },\n    { id: 'pricing', label: 'Pricing' },\n  ]}\n/>",
  "anatomy": [
    {
      "part": "Nav",
      "description": "Landmark labelled \"On this page\" by default."
    },
    {
      "part": "Items",
      "description": "Anchor links to page sections; the section in view sets aria-current=\"location\"."
    },
    {
      "part": "Children",
      "description": "Optional nested sections rendered as an indented sub-list under their parent item."
    }
  ],
  "dosDonts": {
    "dos": [
      "Give each section a stable id that matches its item.",
      "Seed defaultActiveId when deep links should start highlighted.",
      "Pass containerRef when the sections live in their own scroll box instead of the window."
    ],
    "donts": [
      "Don't nest deeper than two levels; a deeper outline becomes hard to scan.",
      "Don't render sections inside the nav; it only points at them."
    ]
  },
  "related": [
    "scroll-area",
    "sub-nav",
    "back-top"
  ],
  "examples": [
    {
      "title": "Scroll-spy sections",
      "description": "An IntersectionObserver rooted at the scroll box tracks the rendered sections and moves the highlight as the page scrolls."
    },
    {
      "title": "Seeded active item",
      "description": "defaultActiveId controls the initial highlight before any scrolling happens, useful for deep links."
    },
    {
      "title": "Nested sections",
      "description": "Items accept children to mirror the page outline; nested sections are indented and tracked by the same scroll spy."
    }
  ],
  "guidance": {
    "useWhen": "A long page is split into id-addressable sections and readers need a persistent way to jump between them, such as docs or marketing pages.",
    "avoidWhen": "The outline runs deeper than two levels or the links switch routes instead of scrolling within the page; use a Sidebar or SubNav instead.",
    "behavior": "Clicking an item activates it and smooth-scrolls its section into view; scrolling updates the active item through IntersectionObserver, items can nest via children, and activeId can be controlled.",
    "responsive": "The vertical layout suits side rails on wide screens; on narrow screens hide it or move it above the content."
  }
}
