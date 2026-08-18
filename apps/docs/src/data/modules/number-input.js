export default {
  "id": "number-input",
  "name": "Number Input",
  "apiNames": [
    "NumberInput"
  ],
  "description": "A numeric field with stepper buttons and min/max clamping.",
  "usage": "<NumberInput label=\"Seats\" defaultValue={4} min={1} max={12} />",
  "anatomy": [
    {
      "part": "Input",
      "description": "The numeric text field that re-clamps to the bounds on blur."
    },
    {
      "part": "Steppers",
      "description": "Increment and decrement buttons that step the value and disable at min and max."
    }
  ],
  "dosDonts": {
    "dos": [
      "Set min and max so clamping matches the business rule.",
      "Choose a step that matches how people think, like 5 for story points.",
      "Treat an empty field as undefined in the caller, not as zero."
    ],
    "donts": [
      "Don't use it for identifiers like codes or phone numbers; use Input.",
      "Don't use it when the value needs currency formatting; use CurrencyInput.",
      "Don't hide the bounds; state them in the description."
    ]
  },
  "related": [
    "currency-input",
    "slider",
    "input",
    "meter"
  ],
  "examples": [
    {
      "title": "Steppers and bounds",
      "description": "Steppers disable at the bounds; typing re-clamps on blur."
    },
    {
      "title": "Custom step",
      "description": "A step of 5 with 0–100 bounds for story-point entry."
    }
  ],
  "guidance": {
    "useWhen": "A numeric value benefits from quick stepping.",
    "avoidWhen": "The value is an identifier, not a quantity; use Input.",
    "behavior": "Steppers use 24px touch targets and blur clamps to min/max; empty means undefined.",
    "responsive": "The field fills its container; constrain it in the form layout."
  }
}
