export default {
  "id": "select",
  "name": "Select",
  "apiNames": [
    "Select"
  ],
  "description": "An accessible single-value picker with keyboard navigation, typeahead, and collision-aware positioning.",
  "usage": "<Select\n  aria-label=\"Role\"\n  defaultValue=\"viewer\"\n  options={[\n    { value: 'admin', label: 'Administrator' },\n    { value: 'viewer', label: 'Viewer' },\n  ]}\n/>",
  "anatomy": [
    {
      "part": "Trigger",
      "description": "The button that shows the current value or placeholder and opens the listbox."
    },
    {
      "part": "Content",
      "description": "The collision-aware listbox popup, sized to the trigger's measured width."
    },
    {
      "part": "Option",
      "description": "A selectable row with a check indicator on the current value; disabled options are skipped."
    }
  ],
  "dosDonts": {
    "dos": [
      "Order options predictably, such as alphabetically or most common first.",
      "Provide an aria-label when the select has no visible Field label.",
      "Keep option labels short so the trigger stays on one line."
    ],
    "donts": [
      "Don't use Select for two or three options; use RadioGroup or ToggleGroup.",
      "Don't use it when typing should filter a long list; use Combobox.",
      "Don't hide critical context in the placeholder; it disappears once a value is chosen."
    ]
  },
  "related": [
    "combobox",
    "radio-group"
  ],
  "examples": [
    {
      "title": "Controlled selection",
      "description": "Select is controlled through value and onValueChange with an options array."
    },
    {
      "title": "Placeholder and disabled option",
      "description": "An uncontrolled select can show placeholder text, and individual options can be disabled."
    },
    {
      "title": "Role assignment",
      "description": "Use a labeled picker when a person must choose one role."
    },
    {
      "title": "Keyboard selection",
      "description": "Typeahead and arrow-key navigation keep long option lists efficient."
    }
  ],
  "guidance": {
    "useWhen": "Users choose one value from a known list.",
    "avoidWhen": "There are only two choices or users need to compare all options at once.",
    "behavior": "Radix manages keyboard navigation, typeahead, focus, and collision handling.",
    "responsive": "The trigger fills its parent width and the menu follows its measured width."
  }
}
