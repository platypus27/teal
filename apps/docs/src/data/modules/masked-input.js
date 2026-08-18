export default {
  "id": "masked-input",
  "name": "Masked Input",
  "apiNames": [
    "MaskedInput"
  ],
  "description": "A text field that enforces a simple digit mask, inserting separators automatically as the user types.",
  "usage": "<MaskedInput\n  label=\"Date\"\n  mask=\"##/##/####\"\n  onChange={(value) => console.log(value)}\n/>",
  "anatomy": [
    {
      "part": "Label",
      "description": "The visible label associated with the field."
    },
    {
      "part": "Masked input",
      "description": "A text field that accepts digits for # slots, inserts literal separators automatically, and keeps the caret after the last filled slot."
    },
    {
      "part": "Mask placeholder",
      "description": "The mask itself renders as the placeholder, so the expected shape is visible before typing."
    },
    {
      "part": "Help or error text",
      "description": "Optional description documenting the expected format, linked with aria-describedby."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use it for fixed digit-count formats like dates, card expiries, or US phone numbers.",
      "Add a description when the format is ambiguous across regions, such as day-first dates.",
      "Validate the completed value on submit; the mask only enforces shape."
    ],
    "donts": [
      "Don't use it for formats with letters or variable length; the mask only handles digits.",
      "Don't use it for international phone numbers; use PhoneInput instead."
    ]
  },
  "related": [
    "input",
    "phone-input",
    "pin-input"
  ],
  "examples": [
    {
      "title": "Date and expiry masks",
      "description": "'#' marks a digit slot and every other character is a literal; the mask itself is the placeholder."
    },
    {
      "title": "Phone and ZIP masks",
      "description": "Longer regional formats work the same way, and a description can document the expected shape."
    }
  ],
  "guidance": {
    "useWhen": "The value has a fixed digit count with familiar separators, such as dates, card expiries, or US phone numbers.",
    "avoidWhen": "The format varies by region or allows letters; use a plain Input with a description, or PhoneInput for international numbers.",
    "behavior": "Only digits are accepted, literals are inserted automatically, the caret stays after the last filled slot, and onChange receives the masked string.",
    "responsive": "The field stretches to fill its container; fixed-width masks pair well with tabular numerals."
  }
}
