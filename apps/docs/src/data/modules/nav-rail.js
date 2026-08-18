export default {
  "id": "nav-rail",
  "name": "Nav Rail",
  "apiNames": [
    "NavRail",
    "NavRailItem"
  ],
  "description": "A fully rounded floating icon rail for dense product navigation.",
  "usage": "<NavRail aria-label=\"Primary\">\n  <NavRailItem icon={<Home />} label=\"Home\" href=\"/\" active />\n  <NavRailItem icon={<Search />} label=\"Search\" href=\"/search\" />\n  <NavRailItem icon={<Settings />} label=\"Settings\" href=\"/settings\" />\n</NavRail>",
  "anatomy": [
    {
      "part": "Rail landmark",
      "description": "The rounded floating nav container named through aria-label, defaulting to \"Primary\"."
    },
    {
      "part": "Items",
      "description": "Circular icon links or buttons; each requires a label applied as aria-label and mirrored in a tooltip."
    },
    {
      "part": "Badge dot",
      "description": "An attention dot in the item corner, flagged with badge and hidden from assistive technology."
    }
  ],
  "dosDonts": {
    "dos": [
      "Give every item a short label; it is the accessible name and the tooltip text.",
      "Render items as links with href for real destinations so open-in-new-tab works.",
      "Use badge sparingly to flag a destination that needs attention without carrying a count."
    ],
    "donts": [
      "Don't use it when destinations need visible labels or grouped sections; use Sidebar.",
      "Don't crowd in more than a handful of destinations; the rail is for top-level navigation only.",
      "Don't rely on the badge dot alone to convey meaning; pair it with a notification surface."
    ]
  },
  "related": [
    "sidebar",
    "ecosystem-rail",
    "tooltip"
  ],
  "examples": [
    {
      "title": "Icon destinations",
      "description": "Circular items tint the active destination; every icon carries an accessible label and a tooltip."
    },
    {
      "title": "Badge dots",
      "description": "Pass badge to flag a destination that needs attention without carrying a count."
    }
  ],
  "guidance": {
    "useWhen": "A dense product needs a compact, always-visible strip of top-level destinations.",
    "avoidWhen": "Destinations need visible labels or grouped sections; use Sidebar.",
    "behavior": "The active item sets aria-current and every icon is named through aria-label and a tooltip.",
    "responsive": "Keep the rail floating on desktop and fold destinations into a drawer on narrow screens."
  }
}
