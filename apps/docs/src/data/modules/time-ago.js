export default {
  "id": "time-ago",
  "name": "Time Ago",
  "apiNames": [
    "TimeAgo"
  ],
  "description": "Renders a self-updating relative timestamp like \"5 minutes ago\" with the absolute time on hover.",
  "usage": "<TimeAgo\n  date={event.createdAt}\n  updateInterval={30000}\n/>",
  "anatomy": [
    {
      "part": "Time element",
      "description": "The semantic time tag with a machine-readable dateTime attribute."
    },
    {
      "part": "Relative label",
      "description": "The self-updating text, like \"5 minutes ago\", recomputed every updateInterval."
    },
    {
      "part": "Absolute tooltip",
      "description": "The locale-formatted exact time exposed through the title attribute."
    }
  ],
  "dosDonts": {
    "dos": [
      "Keep updateInterval modest, around 30 seconds, for feeds and logs.",
      "Rely on the built-in title for the exact timestamp instead of duplicating it.",
      "Use it for future dates too; scheduled jobs read naturally with the in-prefix."
    ],
    "donts": [
      "Don't use it for legal, billing, or scheduling contexts that need unambiguous absolute times.",
      "Don't set one-second intervals that churn the DOM constantly.",
      "Don't restyle the label into ambiguity; recency must stay readable."
    ]
  },
  "related": [
    "countdown-timer",
    "timeline",
    "activity-feed"
  ],
  "examples": [
    {
      "title": "Event feed",
      "description": "Past events read as relative times that refresh on an interval, with the exact timestamp in the title."
    },
    {
      "title": "Future time",
      "description": "Future dates render with an in-prefix, handy for scheduled jobs and upcoming syncs."
    }
  ],
  "guidance": {
    "useWhen": "Feeds, logs, and activity lists where recency matters more than the exact clock time.",
    "avoidWhen": "Legal, billing, or scheduling contexts that demand an unambiguous absolute timestamp; format the Date directly instead.",
    "behavior": "Recomputes the label every updateInterval, scales from seconds to years via Intl.RelativeTimeFormat, and always exposes the absolute time in the title and dateTime attributes.",
    "responsive": "An inline time element that wraps with its surrounding text; no layout constraints of its own."
  }
}
