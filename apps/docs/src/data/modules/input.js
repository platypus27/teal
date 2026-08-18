export default {
  "id": "input",
  "name": "Input and TextArea",
  "apiNames": [
    "Input",
    "TextArea"
  ],
  "description": "Native text controls with Teal sizing, invalid states, and forwarded refs; Input adds a clear action, a loading spinner, and a password reveal toggle, while autosize on TextArea grows with the content.",
  "usage": "<Input placeholder=\"Project name\" />\n<Input clearable label=\"Search projects\" />\n<Input type=\"password\" label=\"Password\" />\n<TextArea autosize label=\"Bio\" minRows={2} maxRows={6} />",
  "anatomy": [
    {
      "part": "Control",
      "description": "The native input or textarea element with Teal sizing, focus ring, and a forwarded ref."
    },
    {
      "part": "Placeholder",
      "description": "A short hint that disappears on entry; never a substitute for a label."
    },
    {
      "part": "Invalid state",
      "description": "Error styling applied through aria-invalid, either directly or from the surrounding Field."
    }
  ],
  "dosDonts": {
    "dos": [
      "Set type, inputMode, and autoComplete to match the value, like email or tel.",
      "Wrap the control in a Field so the label and messages stay associated.",
      "Set rows on TextArea to roughly the expected answer length."
    ],
    "donts": [
      "Don't use placeholder text as the only label.",
      "Don't disable a field the user must fix; show an error instead.",
      "Don't use free text for a constrained choice; use Select or RadioGroup."
    ]
  },
  "related": [
    "field",
    "input-group",
    "combobox"
  ],
  "examples": [
    {
      "title": "States",
      "description": "Default, invalid, and disabled inputs share the same sizing and focus treatment."
    },
    {
      "title": "Semantic types",
      "description": "type, inputMode, and autoComplete steer the on-screen keyboard and autofill."
    },
    {
      "title": "Autosize",
      "description": "TextArea with autosize grows and shrinks with its content, capped by maxRows before it scrolls."
    },
    {
      "title": "Search and inline validation",
      "description": "Use a compact search control alongside an input that reports its invalid state."
    },
    {
      "title": "Clearable and loading",
      "description": "clearable shows a clear action once the field has a value; loading swaps it for a spinner in the same slot, and disabled fields hide both."
    },
    {
      "title": "Password reveal",
      "description": "type=\"password\" adds a visibility toggle that flips the field type and reports its state through aria-pressed."
    }
  ],
  "guidance": {
    "useWhen": "Users enter or search for short text, or multi-line text where TextArea with autosize should track the content height.",
    "avoidWhen": "A constrained set of choices or a long-form editor is clearer.",
    "behavior": "Native input behavior is preserved, including browser validation and refs. clearable shows a clear action once the field has a value and loading swaps it for a spinner in the same slot; type=\"password\" adds a visibility toggle that reports state through aria-pressed. With autosize, TextArea height follows the content between minRows and maxRows; beyond maxRows the field scrolls instead of growing.",
    "responsive": "Use full width on small screens and constrain width at larger sizes."
  }
}
