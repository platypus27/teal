export default {
  "id": "editable",
  "name": "Editable",
  "apiNames": [
    "Editable"
  ],
  "description": "Click-to-edit text that commits on Enter or blur and cancels with Escape.",
  "usage": "<Editable label=\"Project name\" defaultValue=\"Orion\" onSubmit={(value) => undefined} />",
  "anatomy": [
    {
      "part": "Preview",
      "description": "The button that shows the current value and starts editing on activation."
    },
    {
      "part": "Edit input",
      "description": "The autofocused field with the current draft preselected."
    },
    {
      "part": "Edit affordance",
      "description": "The labeled edit button with a pencil icon marking the value as changeable."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use Editable for single values renamed in place, like project titles.",
      "Commit on Enter and blur so keyboard and pointer flows both save.",
      "Show a placeholder so empty values stay discoverable."
    ],
    "donts": [
      "Don't use it inside multi-field forms; use Field and Input.",
      "Don't validate on cancel; Escape always restores the committed value.",
      "Don't hide the edit affordance; the pencil communicates interactivity."
    ]
  },
  "related": [
    "input",
    "field",
    "form"
  ],
  "examples": [
    {
      "title": "Inline rename",
      "description": "Preview stays a button; editing autofocuses and selects the draft."
    },
    {
      "title": "Empty value",
      "description": "A placeholder keeps an empty value discoverable and inviting."
    }
  ],
  "guidance": {
    "useWhen": "A displayed value is renamed or corrected in place.",
    "avoidWhen": "The value is edited alongside others in a form; use Field and Input.",
    "behavior": "Enter and blur commit, Escape cancels, and the draft is preselected.",
    "responsive": "The preview truncates within its container width."
  }
}
