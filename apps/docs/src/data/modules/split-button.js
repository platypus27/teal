export default {
  "id": "split-button",
  "name": "Split Button",
  "apiNames": [
    "SplitButton"
  ],
  "description": "A primary action joined to a menu of related alternatives.",
  "usage": "<SplitButton\n  label=\"Deploy\"\n  onClick={() => undefined}\n  items={[{ id: 'staging', label: 'Deploy to staging', onSelect: () => undefined }]}\n/>",
  "anatomy": [
    {
      "part": "Main action",
      "description": "The button that fires the default action on click."
    },
    {
      "part": "Menu trigger",
      "description": "The chevron button named by menuLabel (\"More actions\" by default)."
    },
    {
      "part": "Menu",
      "description": "The list of alternative actions sharing the main action's context."
    }
  ],
  "dosDonts": {
    "dos": [
      "Make the default the action most people want most of the time.",
      "Keep alternatives to a handful of close variants of the same action.",
      "Keep the main label short so the joined control stays on one line."
    ],
    "donts": [
      "Don't put unrelated actions in the menu; use separate buttons or a plain Menu.",
      "Don't hide the only way to do something behind the chevron."
    ]
  },
  "related": [
    "button",
    "menu",
    "button-group"
  ],
  "examples": [
    {
      "title": "Default plus alternatives",
      "description": "The main action fires directly; the chevron opens the related menu."
    },
    {
      "title": "Secondary and danger variants",
      "description": "The menu can carry a danger item behind the separator."
    }
  ],
  "guidance": {
    "useWhen": "One default action has a few close alternatives.",
    "avoidWhen": "The actions are unrelated; use separate buttons or a plain Menu.",
    "behavior": "The main button fires the default; the chevron owns the menu.",
    "responsive": "Keep the label short so the joined control stays one line."
  }
}
