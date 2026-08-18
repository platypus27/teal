export default {
  "id": "combobox",
  "name": "Combobox",
  "apiNames": [
    "Combobox"
  ],
  "description": "A filterable picker combining free text with a suggestion list; pass multiple to select several values shown as removable pills.",
  "usage": "<Combobox\n  label=\"Assignee\"\n  options={[\n    { value: 'avery', label: 'Avery Chen' },\n    { value: 'morgan', label: 'Morgan Reyes' },\n  ]}\n/>",
  "anatomy": [
    {
      "part": "Input",
      "description": "The text field with combobox semantics that filters the list as you type."
    },
    {
      "part": "Listbox",
      "description": "The suggestion popup matched to the field width."
    },
    {
      "part": "Option",
      "description": "A filterable row with a check mark on the selected value."
    },
    {
      "part": "Empty message",
      "description": "The text shown when no option matches the filter."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use Combobox when the list is long enough to need filtering.",
      "Write an emptyMessage that suggests what to try next.",
      "Keep the committed value readable as the input text."
    ],
    "donts": [
      "Don't use it for short lists; use Select.",
      "Don't treat unmatched text as a value; use TagsInput for free entry.",
      "Don't clear the current value on Escape; it should restore, not wipe."
    ]
  },
  "related": [
    "select",
    "mention-input",
    "input"
  ],
  "examples": [
    {
      "title": "Filter and select",
      "description": "Type to filter, arrows to highlight, Enter to select; Escape keeps the current value."
    },
    {
      "title": "Filter with empty state",
      "description": "A project picker with a disabled option and a custom message when nothing matches."
    },
    {
      "title": "Multiple values",
      "description": "With multiple, options toggle without closing and selected values render as removable pills."
    }
  ],
  "guidance": {
    "useWhen": "Users choose one value from a list long enough to need filtering; pass multiple to pick several values.",
    "avoidWhen": "The list is short; use Select, or the value is free text; use Input.",
    "behavior": "Typing filters, arrows highlight, Enter selects, Escape preserves the current value. With multiple, options toggle without closing and pills remove individual values.",
    "responsive": "The suggestion list matches the field width and collision-handles vertically; in multiple mode pills wrap inside the control as values accumulate."
  }
}
