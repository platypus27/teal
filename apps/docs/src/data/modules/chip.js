export default {
  "id": "chip",
  "name": "Chip",
  "apiNames": [
    "Chip"
  ],
  "description": "A compact filter or selection token with an optional remove affordance.",
  "usage": "<Chip label=\"Active only\" selected onRemove={() => undefined} />",
  "anatomy": [
    {
      "part": "Label",
      "description": "The token text naming the filter or selection."
    },
    {
      "part": "Selected tint",
      "description": "The primary tint marking the chip as active."
    },
    {
      "part": "Remove button",
      "description": "The X control rendered when onRemove is set, labelled \"Remove <label>\"."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use chips for active filters above a list or table.",
      "Keep labels to one or two words.",
      "Use selected to reflect state instead of adding and removing chips."
    ],
    "donts": [
      "Don't use a chip for passive status; use a Badge.",
      "Don't use chips as primary actions; they are tokens, not buttons."
    ]
  },
  "related": [
    "badge",
    "tags-input",
    "combobox"
  ],
  "examples": [
    {
      "title": "Removable filters",
      "description": "Selected chips tint primary; the remove button is labeled from the chip text."
    },
    {
      "title": "Locked filters",
      "description": "Disabled chips communicate filters managed elsewhere."
    }
  ],
  "guidance": {
    "useWhen": "Active filters or selections need compact, removable tokens.",
    "avoidWhen": "The status is informational only; use Badge.",
    "behavior": "The remove action is labeled from the chip text for screen readers.",
    "responsive": "Chips wrap in rows; keep labels to one or two words."
  }
}
