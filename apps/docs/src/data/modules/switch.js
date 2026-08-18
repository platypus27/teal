export default {
  "id": "switch",
  "name": "Switch",
  "apiNames": [
    "Switch"
  ],
  "description": "An immediate boolean setting with explicit labeling and controlled or uncontrolled state.",
  "usage": "<Switch label=\"Security notifications\" description=\"High-risk account activity\" defaultChecked />",
  "anatomy": [
    {
      "part": "Track",
      "description": "The pill that tints with the checked state."
    },
    {
      "part": "Thumb",
      "description": "The knob that slides between the off and on ends of the track."
    },
    {
      "part": "Label",
      "description": "Text wired to the control so clicking it toggles the setting."
    },
    {
      "part": "Description",
      "description": "Optional supporting text linked through aria-describedby."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use switches for settings that take effect the moment they change.",
      "Name the setting, not the action, so on and off stay unambiguous.",
      "Keep the description to one line explaining the effect."
    ],
    "donts": [
      "Don't use a switch inside a form that submits several values together; use Checkbox.",
      "Don't gate a switch behind a separate Save button.",
      "Don't use one for hard-to-reverse actions without a confirmation step."
    ]
  },
  "related": [
    "checkbox",
    "toggle",
    "field"
  ],
  "examples": [
    {
      "title": "Settings",
      "description": "Switches apply immediately, so label them as settings rather than form fields."
    },
    {
      "title": "Dependent settings",
      "description": "A secondary switch disables itself while its prerequisite setting is off."
    },
    {
      "title": "Application settings",
      "description": "Use switches in a settings list for changes that apply immediately."
    },
    {
      "title": "Compact settings",
      "description": "The small size keeps dense preference lists scannable without losing the accessible label."
    }
  ],
  "guidance": {
    "useWhen": "A boolean setting takes effect immediately.",
    "avoidWhen": "The user must submit several values together as a form.",
    "behavior": "The label and description remain associated with the switch control.",
    "responsive": "Keep the control at a fixed size while the setting copy takes available width."
  }
}
