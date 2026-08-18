export default {
  "id": "notification-item",
  "name": "Notification Item",
  "apiNames": [
    "NotificationItem"
  ],
  "imports": [
    "NotificationItem"
  ],
  "description": "A sanitized ecosystem inbox row with severity, source application, read state, deep link, and delivery-state controls.",
  "usage": "<NotificationItem\n  severity=\"warning\"\n  appLabel=\"Yang Operations\"\n  timestamp=\"2 hours ago\"\n  title=\"photos-api restarted unexpectedly\"\n  href=\"#\"\n  onMute={() => undefined}\n  onArchive={() => undefined}\n/>",
  "anatomy": [
    {
      "part": "Severity dot",
      "description": "Small colored marker matched to the severity variant."
    },
    {
      "part": "Severity icon",
      "description": "Decorative status icon beside the content; hidden from assistive technology."
    },
    {
      "part": "Title link",
      "description": "Deep link to the source application event; unread items are bold and append a screen-reader-only unread marker."
    },
    {
      "part": "Metadata",
      "description": "Source application label and caller-supplied timestamp."
    },
    {
      "part": "Mute and archive",
      "description": "Optional IconButtons that change delivery state only, never the source event."
    }
  ],
  "dosDonts": {
    "dos": [
      "Pass sanitized title and appLabel from the ecosystem payload; the row renders what it is given.",
      "Wire mute and archive to delivery-state endpoints only."
    ],
    "donts": [
      "Don't mutate the source event from onMute or onArchive.",
      "Don't use NotificationItem for feedback local to the current task; use Alert or Toast."
    ]
  },
  "related": [
    "notification-center",
    "health-indicator",
    "toast"
  ],
  "examples": [
    {
      "title": "Unread with controls",
      "description": "Unread items are emphasized and announced; mute and archive only touch delivery state, never the source event."
    },
    {
      "title": "Read",
      "description": "Read items drop the emphasis and the unread announcement."
    }
  ],
  "guidance": {
    "useWhen": "An inbox lists sanitized pointers to application events.",
    "avoidWhen": "The feedback is local to the current task; use Alert or Toast instead.",
    "behavior": "Mute and archive touch delivery state only; the deep link never mutates the source.",
    "responsive": "Text wraps and controls stay reachable at mobile widths."
  }
}
