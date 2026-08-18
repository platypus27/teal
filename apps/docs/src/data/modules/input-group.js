export default {
  "id": "input-group",
  "name": "Input Group",
  "apiNames": [
    "InputGroup",
    "InputAddon"
  ],
  "imports": [
    "InputGroup",
    "InputAddon",
    "Input"
  ],
  "description": "An input joined with leading or trailing addons such as protocols and units.",
  "usage": "<InputGroup>\n  <InputAddon position=\"leading\">https://</InputAddon>\n  <Input aria-label=\"Domain\" placeholder=\"workspace.example\" />\n</InputGroup>",
  "anatomy": [
    {
      "part": "Group",
      "description": "The wrapper that owns the border and focus ring so the box reads as one control."
    },
    {
      "part": "Addon",
      "description": "Fixed leading or trailing content such as a protocol or unit."
    },
    {
      "part": "Input",
      "description": "The flexing field whose joined corners square automatically."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use addons for static text like https://, units, or currency codes.",
      "Give the input an aria-label, since addon text is presentational context.",
      "Keep addon text to a few characters so the field keeps most of the width."
    ],
    "donts": [
      "Don't put interactive controls in an addon; compose separate controls instead.",
      "Don't use an addon as a substitute for a real label.",
      "Don't join more than one input into a group."
    ]
  },
  "related": [
    "input",
    "currency-input",
    "phone-input",
    "field"
  ],
  "examples": [
    {
      "title": "Addons",
      "description": "The group squares the joined input corners automatically on the attached side."
    },
    {
      "title": "Trailing units",
      "description": "Trailing addons carry units like GB or USD/h beside the value."
    }
  ],
  "guidance": {
    "useWhen": "An input needs a fixed prefix or suffix such as a protocol or unit.",
    "avoidWhen": "The accessory is interactive; use separate controls instead.",
    "behavior": "The group owns the border and focus ring, so the whole box highlights as one control.",
    "responsive": "Addons stay fixed width while the input flexes."
  }
}
