export default {
  "id": "button-group",
  "name": "Button Group",
  "apiNames": [
    "ButtonGroup"
  ],
  "imports": [
    "ButtonGroup",
    "Button"
  ],
  "description": "An attached cluster of related actions with hairline seams and shared corner radius.",
  "usage": "<ButtonGroup>\n  <Button variant=\"secondary\">Day</Button>\n  <Button variant=\"secondary\">Week</Button>\n  <Button variant=\"secondary\">Month</Button>\n</ButtonGroup>",
  "anatomy": [
    {
      "part": "Buttons",
      "description": "Two to four sibling Buttons rendered flush against each other."
    },
    {
      "part": "Seams",
      "description": "Hairline borders between buttons that replace the usual gap."
    },
    {
      "part": "Shared radius",
      "description": "Only the first and last buttons keep their outer corner rounding."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use for closely related options of equal weight, like Day / Week / Month.",
      "Keep labels to one word so the cluster stays compact.",
      "Switch to the vertical orientation in narrow side panels."
    ],
    "donts": [
      "Don't mix variants inside a group; the cluster reads as one control.",
      "Don't group unrelated actions just to save space.",
      "Don't exceed four buttons; use a Menu for larger sets."
    ]
  },
  "related": [
    "button",
    "toggle-group",
    "toolbar"
  ],
  "examples": [
    {
      "title": "Attached actions",
      "description": "Buttons butt together with shared seams; vertical stacks work too."
    },
    {
      "title": "Vertical cluster",
      "description": "Use vertical orientation when the actions stack in a narrow panel."
    }
  ],
  "guidance": {
    "useWhen": "Two to four tightly related actions belong to one decision.",
    "avoidWhen": "The actions are unrelated or need distinct visual priority; space them normally.",
    "behavior": "Seams collapse to hairlines and only the outer corners keep their radius.",
    "responsive": "Let the cluster wrap or switch to vertical orientation on narrow screens."
  }
}
