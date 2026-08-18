export default {
  "id": "text-area",
  "name": "TextArea",
  "apiNames": [
    "TextArea"
  ],
  "description": "Multi-line text entry with Teal sizing, invalid states, and a forwarded ref; autosize grows the field with its content.",
  "usage": "<TextArea label=\"Bio\" rows={4} />\n<TextArea autosize label=\"Notes\" minRows={2} maxRows={6} />",
  "anatomy": [
    {
      "part": "Control",
      "description": "The native textarea element with Teal sizing, focus ring, and a forwarded ref."
    },
    {
      "part": "Label",
      "description": "The visible label associated with the textarea, wired to any description or error text."
    },
    {
      "part": "Help or error text",
      "description": "Optional description or validation message linked to the field with aria-describedby."
    }
  ],
  "dosDonts": {
    "dos": [
      "Set rows to roughly the expected answer length.",
      "Set minRows on autosize fields so the empty field hints at the expected entry length.",
      "Set maxRows on autosize fields that can grow long, so the form below is not pushed down."
    ],
    "donts": [
      "Don't use placeholder text as the only label.",
      "Don't use autosize when the layout needs a fixed, user-resizable field.",
      "Don't use a textarea for a constrained choice; use Select or RadioGroup."
    ]
  },
  "related": [
    "input",
    "field",
    "mention-input"
  ],
  "examples": [
    {
      "title": "Rows and states",
      "description": "Fixed-row textareas share the same sizing, focus, and invalid treatment as Input."
    },
    {
      "title": "Autosize",
      "description": "TextArea with autosize grows and shrinks with its content, starting at minRows."
    },
    {
      "title": "Capped growth",
      "description": "maxRows stops the growth and switches to scrolling, keeping long entries from pushing the form down."
    }
  ],
  "guidance": {
    "useWhen": "Users enter multi-line text, and autosize should track the content height when the entry length varies.",
    "avoidWhen": "A single-line Input or a constrained set of choices is clearer.",
    "behavior": "Native textarea behavior is preserved, including browser validation and refs. With autosize, the height follows the content between minRows and maxRows; beyond maxRows the field scrolls instead of growing.",
    "responsive": "Use full width on small screens and constrain width at larger sizes."
  }
}
