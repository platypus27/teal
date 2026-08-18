export default {
  "id": "activity-feed",
  "name": "Activity Feed",
  "apiNames": [
    "ActivityFeed"
  ],
  "description": "Chronological list of actor-plus-action events with avatars or icons and timestamps, optionally grouped under day headings.",
  "usage": "<ActivityFeed\n  label=\"Project activity\"\n  groupByDay\n  items={[\n    { id: \"1\", actor: \"Ada Lovelace\", action: \"merged the parser rewrite\", timestamp: new Date() },\n  ]}\n/>",
  "anatomy": [
    {
      "part": "Feed container",
      "description": "A role=\"feed\" region with an accessible label describing whose activity it lists."
    },
    {
      "part": "Event article",
      "description": "One focusable article per event; its accessible name combines actor, action, and time, with aria-posinset and aria-setsize for position."
    },
    {
      "part": "Avatar or icon",
      "description": "An initials avatar per actor, or a status icon when events are typed."
    },
    {
      "part": "Day heading",
      "description": "Optional Today/Yesterday groupings when groupByDay is set."
    }
  ],
  "dosDonts": {
    "dos": [
      "Supply items newest first; the feed renders them in the order given.",
      "Keep the action text to a short phrase so articles stay scannable.",
      "Turn on groupByDay for feeds spanning several days."
    ],
    "donts": [
      "Don't use it for machine logs; use LogViewer.",
      "Don't nest interactive controls inside events; the feed pattern expects focus on the articles themselves."
    ]
  },
  "related": [
    "avatar",
    "notification-item",
    "comment-thread"
  ],
  "examples": [
    {
      "title": "Flat feed",
      "description": "Shows events newest-first with initials avatars and relative-looking timestamps."
    },
    {
      "title": "Grouped by day with icons",
      "description": "Groups events under Today/Yesterday headings and swaps avatars for status icons per event type."
    }
  ],
  "guidance": {
    "useWhen": "A project, document, or account page needs a readable history of who did what and when.",
    "avoidWhen": "Events are machine logs rather than human activity; use LogViewer instead.",
    "behavior": "Renders items in the order given (supply newest first), formats timestamps via formatTime, and groups by calendar day when groupByDay is set.",
    "responsive": "Stacks avatar, text, and timestamp vertically in a single column that wraps at narrow widths."
  }
}
