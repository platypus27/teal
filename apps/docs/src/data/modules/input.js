export default {
  "id": "input",
  "name": "Input",
  "apiNames": [
    "Input"
  ],
  "description": "A native single-line text control with Teal sizing, invalid states, and a forwarded ref; clearable adds a clear action, loading swaps it for a spinner, and type=\"password\" adds a reveal toggle.",
  "usage": "<Input placeholder=\"Project name\" />\n<Input clearable label=\"Search projects\" />\n<Input type=\"password\" label=\"Password\" />",
  "anatomy": [
    {
      "part": "Control",
      "description": "The native input element with Teal sizing, focus ring, and a forwarded ref."
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
      "Use TextArea instead when the answer runs to multiple lines."
    ],
    "donts": [
      "Don't use placeholder text as the only label.",
      "Don't disable a field the user must fix; show an error instead.",
      "Don't use free text for a constrained choice; use Select or RadioGroup."
    ]
  },
  "related": [
    "field",
    "text-area",
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
    "useWhen": "Users enter or search for a single line of text.",
    "avoidWhen": "A constrained set of choices, a long-form editor, or multi-line text (use TextArea) is clearer.",
    "behavior": "Native input behavior is preserved, including browser validation and refs. clearable shows a clear action once the field has a value and loading swaps it for a spinner in the same slot; type=\"password\" adds a visibility toggle that reports state through aria-pressed.",
    "responsive": "Use full width on small screens and constrain width at larger sizes."
  }
}
