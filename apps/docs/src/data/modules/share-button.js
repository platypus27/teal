export default {
  "id": "share-button",
  "name": "Share Button",
  "apiNames": [
    "ShareButton"
  ],
  "description": "A button that opens a small popover with a copy-link action and, where supported, the native share sheet.",
  "usage": "<ShareButton\n  url=\"https://example.com/report/42\"\n  title=\"Q3 report\"\n/>",
  "anatomy": [
    {
      "part": "Trigger",
      "description": "The button that opens the share popover."
    },
    {
      "part": "Popover",
      "description": "The small panel holding the copy-link action and, where supported, the native share action."
    },
    {
      "part": "Confirmation",
      "description": "The swapped label plus a visually hidden live region announcing that the link was copied."
    }
  ],
  "dosDonts": {
    "dos": [
      "Pass a canonical URL for the record rather than relying on the current page URL.",
      "Keep the title short; it is forwarded to the native share sheet.",
      "Let the native share action appear automatically where navigator.share exists."
    ],
    "donts": [
      "Don't use it to duplicate content inside the app; add a dedicated duplicate action.",
      "Don't build custom copy feedback; the announced confirmation is built in."
    ]
  },
  "related": [
    "popover",
    "button",
    "toast"
  ],
  "examples": [
    {
      "title": "Copy link",
      "description": "The popover copies the URL to the clipboard and confirms with a swapped label and live-region announcement."
    },
    {
      "title": "Native share fallback",
      "description": "Where navigator.share exists a Share via action appears; elsewhere the popover quietly offers copy only."
    }
  ],
  "guidance": {
    "useWhen": "Users need to pass a deep link to a record, report, or page to someone else.",
    "avoidWhen": "The goal is duplicating content inside the app; use a dedicated duplicate action instead.",
    "behavior": "Copies the given URL (or the current page URL) with visible and announced feedback, and degrades gracefully when clipboard or share APIs are missing.",
    "responsive": "The trigger is a standard button and the popover clamps to the viewport width, so it works at any size."
  }
}
