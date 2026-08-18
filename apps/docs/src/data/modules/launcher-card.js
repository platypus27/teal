export default {
  "id": "launcher-card",
  "name": "Launcher Card",
  "apiNames": [
    "LauncherCard"
  ],
  "imports": [
    "LauncherCard",
    "Badge"
  ],
  "description": "An interactive application destination card with an icon, description, optional status, and an honest unavailable state.",
  "usage": "<LauncherCard\n  href=\"#\"\n  label=\"Photos\"\n  description=\"Household media, albums, and sharing\"\n  icon={<Camera />}\n  status={<Badge variant=\"success\">Healthy</Badge>}\n/>",
  "anatomy": [
    {
      "part": "Icon",
      "description": "The application glyph at the start of the card."
    },
    {
      "part": "Label and description",
      "description": "The destination name and its one-line summary."
    },
    {
      "part": "Status",
      "description": "Caller-supplied status content, such as a Badge, rendered below the summary."
    },
    {
      "part": "Unavailable state",
      "description": "The disabled treatment that blocks navigation and leaves the focus order."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use it for application or destination grids where the whole card navigates.",
      "Keep descriptions to one scannable line.",
      "Show an honest unavailable state instead of hiding the destination."
    ],
    "donts": [
      "Don't use it for minor links inside prose; use a plain Link.",
      "Don't nest interactive controls inside; the whole card is the link."
    ]
  },
  "related": [
    "card",
    "badge",
    "app-switcher"
  ],
  "examples": [
    {
      "title": "Available application",
      "description": "The whole card navigates; status content stays caller-supplied and sanitized."
    },
    {
      "title": "Unavailable application",
      "description": "A disabled card is removed from focus order and blocks navigation."
    }
  ],
  "guidance": {
    "useWhen": "An application destination needs a prominent, scannable entry point.",
    "avoidWhen": "The destination is a minor link inside prose; use a plain link instead.",
    "behavior": "Disabled cards leave the focus order and block navigation instead of hiding.",
    "responsive": "Cards stack single-column on mobile and grid at larger widths under the caller’s layout."
  }
}
