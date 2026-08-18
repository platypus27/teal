export default {
  "id": "bottom-nav",
  "name": "Bottom Nav",
  "apiNames": [
    "BottomNav",
    "BottomNavItem"
  ],
  "description": "A mobile bottom navigation bar of three to five icon-and-label items with aria-current and safe-area padding.",
  "usage": "<BottomNav>\n  <BottomNavItem active href=\"/home\" icon={<Home />} label=\"Home\" />\n  <BottomNavItem href=\"/search\" icon={<Search />} label=\"Search\" />\n  <BottomNavItem badge={3} href=\"/alerts\" icon={<Bell />} label=\"Alerts\" />\n  <BottomNavItem href=\"/profile\" icon={<User />} label=\"Profile\" />\n</BottomNav>",
  "anatomy": [
    {
      "part": "Bar",
      "description": "Fixed bottom nav landmark with safe-area padding for notched devices."
    },
    {
      "part": "Items",
      "description": "Icon-and-label links sharing the width equally; the active one sets aria-current=\"page\"."
    },
    {
      "part": "Badge",
      "description": "Optional count bubble on an item for unseen activity."
    }
  ],
  "dosDonts": {
    "dos": [
      "Keep it to three to five top-level destinations.",
      "Hide it at desktop widths and switch to a Sidebar or Top Bar."
    ],
    "donts": [
      "Don't use it for hierarchical or numerous destinations.",
      "Don't put creation actions like compose here; it switches destinations."
    ]
  },
  "related": [
    "nav-rail",
    "sidebar",
    "dock"
  ],
  "examples": [
    {
      "title": "Four destinations",
      "description": "The default mobile pattern with an active destination and a badge count on the alerts icon."
    },
    {
      "title": "Five destinations",
      "description": "Items share the bar width equally up to the recommended maximum of five destinations."
    }
  ],
  "guidance": {
    "useWhen": "A mobile app has three to five top-level destinations the user switches between constantly.",
    "avoidWhen": "Destinations are numerous or hierarchical; use a Sidebar or an off-canvas Dialog instead, and hide BottomNav on desktop widths.",
    "behavior": "Items are links with equal flex width; the active item exposes aria-current=\"page\", and the bar pads for the device safe area with env(safe-area-inset-bottom).",
    "responsive": "Fixed to the bottom edge and full width; at desktop widths replace it with a Sidebar or TopBar navigation."
  }
}
