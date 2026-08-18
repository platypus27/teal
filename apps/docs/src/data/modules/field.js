export default {
  "id": "field",
  "name": "Field",
  "apiNames": [
    "Field",
    "Label"
  ],
  "imports": [
    "Field",
    "Input"
  ],
  "description": "A deep form seam that connects labels, descriptions, errors, and required state.",
  "usage": "<Field label=\"Display name\" description=\"Shown to other workspace members\" required>\n  <Input defaultValue=\"Avery Chen\" />\n</Field>",
  "anatomy": [
    {
      "part": "Label",
      "description": "Visible label wired to the control with htmlFor; carries the required marker when required is set."
    },
    {
      "part": "Control",
      "description": "The single child that receives the generated id, aria-describedby, and aria-invalid wiring."
    },
    {
      "part": "Description",
      "description": "Optional help text linked to the control through aria-describedby."
    },
    {
      "part": "Error",
      "description": "Validation message that marks the control aria-invalid and renders in error color."
    }
  ],
  "dosDonts": {
    "dos": [
      "Wrap every free-standing control in a Field so labels and errors stay wired automatically.",
      "Write errors that say how to fix the value, not just that it is invalid.",
      "Keep descriptions to one sentence; move longer explanations to an Alert with appearance=\"callout\" or a help page."
    ],
    "donts": [
      "Don't nest more than one control in a Field; use Fieldset for groups.",
      "Don't mark a field required visually without the required prop, or the attribute and marker drift apart.",
      "Don't clear the error while the value is still invalid; re-validate on change."
    ]
  },
  "related": [
    "input",
    "fieldset",
    "form",
    "form-error-summary"
  ],
  "examples": [
    {
      "title": "Label, description, and error",
      "description": "Field wires the label, help text, and error message to the control inside it automatically."
    },
    {
      "title": "Choice controls",
      "description": "Checkbox and Switch render the Field label instead of their own when nested inside one."
    },
    {
      "title": "Account profile",
      "description": "Pair a required profile value with a clear validation message."
    }
  ],
  "guidance": {
    "useWhen": "A control needs a visible label, help text, or validation message.",
    "avoidWhen": "The control already owns an equivalent form-label composition.",
    "behavior": "Field provides the id and ARIA relationships consumed by its child control.",
    "responsive": "Keep labels readable and let long error messages wrap."
  }
}
