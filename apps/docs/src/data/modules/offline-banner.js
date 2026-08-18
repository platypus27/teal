export default {
  "id": "offline-banner",
  "name": "Offline Banner",
  "apiNames": [
    "OfflineBanner"
  ],
  "description": "A dismissible banner that appears at the top of the page when the browser loses connectivity.",
  "usage": "<OfflineBanner\n  message=\"You are offline. Changes may not be saved.\"\n  onDismiss={() => logDismiss()}\n/>",
  "anatomy": [
    {
      "part": "Status strip",
      "description": "Top-of-page role=\"status\" banner with aria-live=\"polite\" that appears on the offline event and clears when the connection returns."
    },
    {
      "part": "Message",
      "description": "Caller-supplied warning text; wraps at narrow widths."
    },
    {
      "part": "Dismiss",
      "description": "Labeled close button; the banner stays dismissed until the next offline transition."
    }
  ],
  "dosDonts": {
    "dos": [
      "Say what offline means for the user's work, such as \"Changes may not be saved\".",
      "Let the banner reappear on the next drop even if it was dismissed."
    ],
    "donts": [
      "Don't show it when the app is fully local and connectivity is irrelevant.",
      "Don't auto-hide it on a timer; it clears itself when the connection returns."
    ]
  },
  "related": [
    "network-status",
    "alert"
  ],
  "examples": [
    {
      "title": "Default banner",
      "description": "Appears automatically on the offline event and disappears when the connection returns."
    },
    {
      "title": "Custom message",
      "description": "Tailored copy and dismiss label for product-specific offline behavior."
    }
  ],
  "guidance": {
    "useWhen": "Losing connectivity has real consequences — unsaved edits, stalled sync — and the user must be told immediately.",
    "avoidWhen": "A subtle always-on indicator is enough; use NetworkStatus instead.",
    "behavior": "Shows on the offline event, hides on the online event, stays hidden once dismissed until the next offline transition.",
    "responsive": "Spans the full viewport width and wraps its message at narrow widths."
  }
}
