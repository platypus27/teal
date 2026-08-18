export default {
  "id": "floating-action-button",
  "name": "Floating Action Button",
  "apiNames": [
    "FloatingActionButton"
  ],
  "description": "A fixed-position primary action button for the single most important creation task on a screen.",
  "usage": "<FloatingActionButton\n  label=\"Create item\"\n  tooltip=\"Add a new item\"\n  position=\"bottom-right\"\n  onClick={createItem}\n/>",
  "anatomy": [
    {
      "part": "Button",
      "description": "The round, fixed-position button named by the required label prop."
    },
    {
      "part": "Icon",
      "description": "The centered glyph, a plus by default, hidden from assistive technology."
    },
    {
      "part": "Tooltip",
      "description": "The optional hover and focus hint defaulting to the label."
    },
    {
      "part": "Extended label",
      "description": "The optional text that turns the round button into a labelled pill."
    }
  ],
  "dosDonts": {
    "dos": [
      "Reserve it for the single most important creation action on a screen.",
      "Always provide label so the icon-only button has an accessible name.",
      "Use extendedLabel where space allows for extra clarity."
    ],
    "donts": [
      "Don't use it for destructive or secondary actions.",
      "Don't show more than one floating action button per screen.",
      "Don't let it cover primary content; pick the corner that stays clear."
    ]
  },
  "related": [
    "action-bar",
    "button",
    "menu"
  ],
  "examples": [
    {
      "title": "Round FAB with tooltip",
      "description": "Icon-only button fixed to a viewport corner; the tooltip supplies the visible name on hover."
    },
    {
      "title": "Extended FAB",
      "description": "An extendedLabel turns the round button into a pill with text for extra clarity."
    },
    {
      "title": "Actions fan-out",
      "description": "The actions prop expands the FAB into a fan of related actions with menu keyboard support."
    }
  ],
  "guidance": {
    "useWhen": "One creation action dominates the screen, such as composing a message or adding a record to a long list.",
    "avoidWhen": "Several actions compete or the action is destructive; use an ActionBar or regular Button instead.",
    "behavior": "Stays fixed to the chosen viewport corner while content scrolls; label always names the button for assistive tech.",
    "responsive": "Keeps a constant offset from the viewport edges at all widths; prefer the extended pill only when space allows."
  }
}
