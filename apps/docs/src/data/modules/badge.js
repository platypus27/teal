export default {
  "id": "badge",
  "name": "Badge",
  "apiNames": [
    "Badge"
  ],
  "description": "A compact semantic status indicator using canonical information variants.",
  "usage": "<Badge variant=\"success\">Deployed</Badge>",
  "anatomy": [
    {
      "part": "Label",
      "description": "The short status or category text, announced verbatim."
    },
    {
      "part": "Variant tint",
      "description": "The semantic color pairing: neutral, info, success, warning, or danger."
    }
  ],
  "dosDonts": {
    "dos": [
      "Keep labels to one or two words so badges scan quickly.",
      "Match the variant to the meaning of the status, not the decor.",
      "Place the badge next to the thing it describes."
    ],
    "donts": [
      "Don't use a badge as a button or link; use a Chip for removable filters.",
      "Don't rely on color alone; the text must carry the status.",
      "Don't stack several badges competing for attention on one row."
    ]
  },
  "related": [
    "chip",
    "status-dot",
    "health-indicator"
  ],
  "examples": [
    {
      "title": "Variants",
      "description": "Five variants cover neutral, informational, success, warning, and danger statuses."
    },
    {
      "title": "Table statuses",
      "description": "Keep status text explicit when badges appear in dense data rows."
    }
  ],
  "guidance": {
    "useWhen": "A short status or category needs quick visual scanning.",
    "avoidWhen": "The content needs an action or a sentence of explanation.",
    "behavior": "Variant changes meaning without changing the content semantics.",
    "responsive": "Keep labels short so badges do not dominate dense rows."
  }
}
