export default {
  "id": "mention-input",
  "name": "Mention Input",
  "apiNames": [
    "MentionInput"
  ],
  "description": "A textarea with @-mention autocomplete that inserts chosen people as plain text tokens.",
  "usage": "<MentionInput\n  label=\"Comment\"\n  placeholder=\"Type @ to mention a teammate…\"\n  options={[{ value: 'ada', label: 'Ada Lovelace' }]}\n  onMentionSelect={(option) => undefined}\n/>",
  "anatomy": [
    {
      "part": "Label",
      "description": "The visible label associated with the textarea."
    },
    {
      "part": "Textarea",
      "description": "A plain multi-line field that keeps focus while the popup is open, with aria-autocomplete list."
    },
    {
      "part": "Mention popup",
      "description": "A listbox of options filtered by the query after an @ that starts a new token."
    },
    {
      "part": "Inserted mention",
      "description": "Plain @Label text at the caret, so drafts round-trip through any storage."
    }
  ],
  "dosDonts": {
    "dos": [
      "Feed options from the people or records directory of the current context.",
      "Use onMentionSelect to record the chosen id alongside the plain text.",
      "Keep option labels as display names people recognize."
    ],
    "donts": [
      "Don't use it when mentions must stay structured or deletable as chips; that needs a tokenized editor.",
      "Don't dump hundreds of options in the popup; filter server-side for large directories."
    ]
  },
  "related": [
    "input",
    "combobox"
  ],
  "examples": [
    {
      "title": "Mention autocomplete",
      "description": "Typing @ opens the popup; the query filters options and Enter inserts the highlighted person."
    },
    {
      "title": "Prefilled conversation",
      "description": "Existing mentions are plain text, so drafts round-trip through any storage without a rich text format."
    }
  ],
  "guidance": {
    "useWhen": "Free-form text needs lightweight references to people or records, such as comments, handoff notes, or review feedback.",
    "avoidWhen": "Mentions must stay structured or deletable as chips — that needs a tokenized editor; for plain multi-line text without mentions use TextArea.",
    "behavior": "Choosing an option inserts `@Label ` at the caret as plain text; the popup only opens for an @ that starts a new token and closes after insertion.",
    "responsive": "The textarea fills its container and the popup anchors below it with a fixed, scrollable width."
  }
}
