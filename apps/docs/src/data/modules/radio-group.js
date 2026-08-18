export default {
  "id": "radio-group",
  "name": "Radio Group",
  "apiNames": [
    "RadioGroup"
  ],
  "description": "A single-choice option set with an integrated label, description, and subtle borders; pass variant=\"card\" for selectable cards with a title, description, and optional icon.",
  "usage": "<RadioGroup\n  label=\"Home region\"\n  defaultValue=\"eu\"\n  options={[\n    { value: 'eu', label: 'Europe (Frankfurt)' },\n    { value: 'us', label: 'United States (Virginia)' },\n  ]}\n/>",
  "anatomy": [
    {
      "part": "Group label",
      "description": "The legend-style label wired to the group through aria-labelledby."
    },
    {
      "part": "Item control",
      "description": "The circular radio that fills when its option is selected."
    },
    {
      "part": "Item label",
      "description": "Clickable text naming each option."
    },
    {
      "part": "Item description",
      "description": "Optional per-option supporting text."
    }
  ],
  "dosDonts": {
    "dos": [
      "Set a defaultValue so exactly one option is always selected.",
      "Keep the set to about two to five options so every choice stays visible.",
      "Use per-option descriptions when the choices need explanation."
    ],
    "donts": [
      "Don't use radios for long or filterable lists; use Select or Combobox.",
      "Don't leave all options unselected to imply a none state; add an explicit option.",
      "Don't switch to horizontal orientation when labels would wrap."
    ]
  },
  "related": [
    "select",
    "checkbox",
    "toggle-group"
  ],
  "examples": [
    {
      "title": "Single choice",
      "description": "Keyboard arrows move and select within the group following the roving-focus pattern."
    },
    {
      "title": "Horizontal options",
      "description": "A horizontal orientation suits short labels like digest frequencies."
    },
    {
      "title": "Card variant",
      "description": "variant=\"card\" renders each option as a selectable card with a description and optional icon, for choices that need explanation."
    }
  ],
  "guidance": {
    "useWhen": "Users pick exactly one option from a small visible set.",
    "avoidWhen": "The list is long or needs filtering; use Select or Combobox.",
    "behavior": "Arrow keys move and select within the group; the label is wired through aria-labelledby. With variant=\"card\", options render as selectable cards whose checked card holds the only tab stop; arrows wrap around and skip disabled cards, and Home/End check the first or last enabled card.",
    "responsive": "Switch to horizontal orientation only when labels stay on one line. In the card variant, horizontal groups wrap cards onto multiple rows on narrow screens."
  }
}
