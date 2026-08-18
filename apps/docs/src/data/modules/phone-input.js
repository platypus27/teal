export default {
  "id": "phone-input",
  "name": "Phone Input",
  "apiNames": [
    "PhoneInput"
  ],
  "description": "A country calling-code dropdown paired with a national number field that emits an E.164-ish string.",
  "usage": "<PhoneInput\n  label=\"Phone number\"\n  defaultValue=\"+14155552671\"\n  onChange={(value) => console.log(value)}\n/>",
  "anatomy": [
    {
      "part": "Country dropdown",
      "description": "A select of curated calling codes with its own accessible name, preceding the number field in tab order."
    },
    {
      "part": "Number field",
      "description": "A type=tel input that strips non-digits and emits +dial plus national number on every edit."
    },
    {
      "part": "Label",
      "description": "The visible label, associated with the number field."
    },
    {
      "part": "Help or error text",
      "description": "Optional description or validation message linked with aria-describedby."
    }
  ],
  "dosDonts": {
    "dos": [
      "Store the emitted E.164-ish string so numbers stay normalized across regions.",
      "Prefill existing values; the component parses them back into country and number.",
      "Validate the final number on submit; the field only normalizes shape."
    ],
    "donts": [
      "Don't use it for domestic-only entry; a MaskedInput with the national format is less UI.",
      "Don't split the value yourself; read the combined string from onChange."
    ]
  },
  "related": [
    "masked-input",
    "input",
    "select"
  ],
  "examples": [
    {
      "title": "Basic entry",
      "description": "A curated calling-code list keeps the dropdown short while covering the most common regions."
    },
    {
      "title": "Prefilled international number",
      "description": "An existing E.164-ish value is parsed back into the right country and national number."
    }
  ],
  "guidance": {
    "useWhen": "You collect phone numbers that must be stored in a normalized international form, such as contact or billing profiles.",
    "avoidWhen": "The number is always domestic; a MaskedInput with a national format is less UI. For free-form contact info use a plain Input.",
    "behavior": "Emits +<dial><digits> on every edit and undefined when the number is emptied; non-digit characters are stripped from the national number.",
    "responsive": "The country dropdown keeps its natural width while the number field flexes to fill the remaining space."
  }
}
