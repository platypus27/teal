export default {
  "id": "log-viewer",
  "name": "Log Viewer",
  "apiNames": [
    "LogViewer"
  ],
  "description": "Scrollable monospace log pane with severity coloring, a follow/auto-scroll toggle, and optional search highlighting.",
  "usage": "<LogViewer\n  label=\"Deploy logs\"\n  lines={[\n    { id: \"1\", level: \"info\", message: \"build started\", timestamp: \"10:00:01\" },\n    { id: \"2\", level: \"error\", message: \"type check failed\", timestamp: \"10:00:33\" },\n  ]}\n  search=\"failed\"\n/>",
  "anatomy": [
    {
      "part": "Header",
      "description": "Label with a live line count and the follow/pause toggle (aria-pressed)."
    },
    {
      "part": "Log pane",
      "description": "role='log' scroll region with monospace lines; screen readers announce appended lines politely."
    },
    {
      "part": "Log line",
      "description": "Optional timestamp, uppercase severity prefix, and message with search matches highlighted."
    }
  ],
  "dosDonts": {
    "dos": [
      "Keep follow on for live streams and let users pause it to read history.",
      "Pass a search query to spotlight the current incident keyword.",
      "Give streamed lines a stable id so updates render cleanly."
    ],
    "donts": [
      "Don't use it for human activity with actors and avatars; use ActivityFeed.",
      "Don't strip the severity prefix; it carries the meaning without color.",
      "Don't mount it with unbounded height for huge histories; window or virtualize the lines."
    ]
  },
  "related": [
    "activity-feed",
    "code-block",
    "highlight-text"
  ],
  "examples": [
    {
      "title": "Following log",
      "description": "Auto-scrolls to the newest line while follow mode is on; the header toggle pauses it."
    },
    {
      "title": "Search highlight",
      "description": "Highlights every case-insensitive match of the query inside log messages."
    }
  ],
  "guidance": {
    "useWhen": "Build, deploy, or runtime output streams need live, glanceable monitoring with severity at a glance.",
    "avoidWhen": "Entries are human activity with actors and avatars; use ActivityFeed instead.",
    "behavior": "While follow is on the pane scrolls to the newest line whenever lines change; toggling pauses auto-scroll so the user can read history. Follow can be controlled via follow/onFollowChange or uncontrolled via defaultFollow.",
    "responsive": "Fixed-height pane (max-h-64 by default, overridable via className) with internal vertical scroll and wrapped long lines."
  }
}
