export default {
  "id": "notification-center",
  "name": "Notification Center",
  "apiNames": [
    "NotificationCenter"
  ],
  "description": "Popover panel that lists recent notifications with read states and a mark-all-read action.",
  "usage": "<NotificationCenter\n  trigger={<Button variant=\"secondary\">Notifications</Button>}\n  items={notifications}\n  onMarkAllRead={markAllRead}\n/>",
  "anatomy": [
    {
      "part": "Trigger",
      "description": "The caller-supplied button, often a bell icon, that opens the panel."
    },
    {
      "part": "Panel",
      "description": "The popover surface listing notifications, capped in width with internal scrolling."
    },
    {
      "part": "Notification rows",
      "description": "NotificationItem rows with read state emphasis for unread items."
    },
    {
      "part": "Mark-all-read",
      "description": "An action shown only while unread items remain; the caller applies the change via onMarkAllRead."
    }
  ],
  "dosDonts": {
    "dos": [
      "Keep items sanitized pointers to source events, with severity and app labels.",
      "Apply onMarkAllRead in caller state so read changes persist.",
      "Show the empty state message instead of an empty list when nothing remains."
    ],
    "donts": [
      "Don't mutate the source events from the panel; it reports intent only.",
      "Don't use it for transient feedback; use Toast.",
      "Don't let the list grow unbounded; trim to recent notifications."
    ]
  },
  "related": [
    "notification-item",
    "popover",
    "toast"
  ],
  "examples": [
    {
      "title": "Inbox with unread items",
      "description": "Unread rows stay emphasized and the mark-all-read action appears only while unread items remain."
    },
    {
      "title": "Empty center",
      "description": "With no notifications the panel shows a catch-up message instead of a list."
    }
  ],
  "guidance": {
    "useWhen": "A product aggregates events from several sources behind a single bell-style entry point, such as deploys, comments, and billing alerts.",
    "avoidWhen": "A single transient update; use Toast or Alert instead of an inbox.",
    "behavior": "Rows reuse NotificationItem; the panel never mutates the items — read state changes are reported through onMarkAllRead for the caller to apply.",
    "responsive": "The panel caps at 24rem and narrows to the viewport on small screens, with the list scrolling internally."
  }
}
