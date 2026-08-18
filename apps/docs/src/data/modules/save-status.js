export default {
  "id": "save-status",
  "name": "Save Status",
  "apiNames": [
    "SaveStatus"
  ],
  "description": "An inline saved/saving/error indicator with an optional relative timestamp.",
  "usage": "<SaveStatus\n  status=\"saved\"\n  savedAt={lastSavedAt}\n/>",
  "anatomy": [
    {
      "part": "Status icon",
      "description": "Check, spinner, or error glyph matched to the status; aria-hidden."
    },
    {
      "part": "Status text",
      "description": "Saved, Saving, or Save failed wording rendered by the component."
    },
    {
      "part": "Timestamp",
      "description": "Optional relative saved-at time appended after \"Saved\", with a custom formatter option."
    }
  ],
  "dosDonts": {
    "dos": [
      "Place it in the header or toolbar of an autosaving editor where it stays visible.",
      "Pass the real savedAt time so the relative timestamp stays honest."
    ],
    "donts": [
      "Don't use it for an explicit save action; show the result with a Toast instead.",
      "Don't show the saved state before the persistence request actually resolves."
    ]
  },
  "related": [
    "toast",
    "network-status",
    "status-dot"
  ],
  "examples": [
    {
      "title": "All three states",
      "description": "Saved, saving, and error side by side — the full lifecycle of an autosave."
    },
    {
      "title": "Relative timestamp",
      "description": "A saved-at time rendered as relative text, with a custom formatter option."
    }
  ],
  "guidance": {
    "useWhen": "A document or form autosaves and the user needs quiet, continuous confidence about persistence.",
    "avoidWhen": "A save is an explicit user action with a clear result; use a Toast or inline Button feedback instead.",
    "behavior": "Reflects the status prop: saved shows a check with an optional relative timestamp, saving shows a spinner, error shows a failure message.",
    "responsive": "Stays inline and compact; pair it with a toolbar or header where space is tight."
  }
}
