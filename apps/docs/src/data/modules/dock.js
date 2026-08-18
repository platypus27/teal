export default {
  "id": "dock",
  "name": "Dock",
  "apiNames": [
    "Dock",
    "DockItem"
  ],
  "description": "A macOS-style dock of icon buttons with hover tooltips, accessible names, and an active-app indicator dot.",
  "usage": "<Dock>\n  <DockItem active icon={<Mail />} label=\"Mail\" />\n  <DockItem icon={<Music />} label=\"Music\" />\n  <DockItem icon={<Folder />} label=\"Files\" />\n</Dock>",
  "anatomy": [
    {
      "part": "Dock",
      "description": "Centered icon bar rendered as a named navigation landmark."
    },
    {
      "part": "Items",
      "description": "Icon buttons whose label is both the accessible name and the tooltip text."
    },
    {
      "part": "Active dot",
      "description": "Non-interactive indicator under the current app."
    }
  ],
  "dosDonts": {
    "dos": [
      "Keep the set small; every icon must stay recognizable.",
      "Give the dock a distinct aria-label when other nav landmarks share the page."
    ],
    "donts": [
      "Don't use it when items need visible text labels; use Bottom Nav.",
      "Don't overload it with destinations; it is a launcher, not a full nav."
    ]
  },
  "related": [
    "nav-rail",
    "bottom-nav",
    "floating-toolbar"
  ],
  "examples": [
    {
      "title": "App dock",
      "description": "Icon buttons lift on hover and show a tooltip label; active apps get a dot underneath."
    },
    {
      "title": "Custom landmark name",
      "description": "A custom aria-label scopes the dock when several navigation landmarks share the page."
    }
  ],
  "guidance": {
    "useWhen": "A small set of apps or tools should be launchable from a playful, icon-only bar, such as in a desktop-like workspace.",
    "avoidWhen": "Items need visible text labels or there are more than a handful of destinations; use BottomNav or Sidebar instead.",
    "behavior": "Every item is a real button whose label prop is both the accessible name and the tooltip text; active adds a non-interactive indicator dot.",
    "responsive": "The dock sizes to its icons and centers in available space; on narrow screens keep the item count low or allow horizontal scrolling in a wrapper."
  }
}
