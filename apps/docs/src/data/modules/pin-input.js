export default {
  "id": "pin-input",
  "name": "PIN Input",
  "apiNames": [
    "PinInput"
  ],
  "description": "A segmented one-time code field with per-cell navigation, paste support, and masking.",
  "usage": "<PinInput label=\"Verification code\" length={6} onComplete={(code) => undefined} />",
  "anatomy": [
    {
      "part": "Group",
      "description": "The labeled container with group semantics wrapping the cells."
    },
    {
      "part": "Cells",
      "description": "One single-character input per digit, each labeled by its position."
    }
  ],
  "dosDonts": {
    "dos": [
      "Set length to the code your service actually issues.",
      "Handle onComplete to submit as soon as the last digit lands.",
      "Use masked for PINs that should not linger on screen."
    ],
    "donts": [
      "Don't use it for free-form codes; use Input.",
      "Don't split long secrets into cells; keep it for short numeric codes.",
      "Don't rely on per-cell placeholders as labels; each cell is already labeled by position."
    ]
  },
  "related": [
    "input",
    "form"
  ],
  "examples": [
    {
      "title": "One-time code",
      "description": "Typing advances to the next cell, Backspace retreats, and paste fills from the focused cell."
    },
    {
      "title": "Masked PIN",
      "description": "A four-digit masked entry for codes that should stay hidden."
    }
  ],
  "guidance": {
    "useWhen": "The user enters a fixed-length numeric code.",
    "avoidWhen": "The value is free-form text; use Input.",
    "behavior": "Typing, Backspace, arrows, and paste move between cells; onComplete fires when full.",
    "responsive": "Cells keep a fixed tap size; reduce length on narrow screens."
  }
}
