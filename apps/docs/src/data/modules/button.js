export default {
  "id": "button",
  "name": "Button",
  "apiNames": [
    "Button",
    "IconButton"
  ],
  "description": "Actions with consistent hierarchy, sizing, loading, and accessible icon treatment.",
  "usage": "<Button variant=\"primary\">Save changes</Button>\n<IconButton label=\"More options\"><MoreHorizontal /></IconButton>",
  "anatomy": [
    {
      "part": "Label",
      "description": "The visible text naming the action; required unless the button is icon-only."
    },
    {
      "part": "Icon",
      "description": "An optional leading or trailing glyph that supports the label, hidden from assistive technology."
    },
    {
      "part": "Spinner",
      "description": "Replaces the content while loading and keeps the button disabled until the action settles."
    },
    {
      "part": "IconButton",
      "description": "The icon-only variant; its label prop becomes the aria-label and the tooltip text."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use one primary button per view so the main action is unambiguous.",
      "Write verb-led labels that say what happens, like \"Save changes\".",
      "Use IconButton with a descriptive label for icon-only actions."
    ],
    "donts": [
      "Don't use a button for navigation; use a Link instead.",
      "Don't rely on the danger color alone; keep the destructive label explicit.",
      "Don't disable a button without explaining why nearby."
    ]
  },
  "related": [
    "link",
    "button-group",
    "toolbar",
    "split-button"
  ],
  "examples": [
    {
      "title": "Variants and sizes",
      "description": "Primary, secondary, ghost, and danger variants with a dedicated IconButton for icon-only actions."
    },
    {
      "title": "Disabled actions",
      "description": "Use disabled state when the action cannot be completed yet, and explain why nearby."
    }
  ],
  "guidance": {
    "useWhen": "A user needs to take an explicit action.",
    "avoidWhen": "The control is only communicating status or navigation.",
    "behavior": "Loading disables the native button until the action completes.",
    "responsive": "Let actions wrap in narrow toolbars instead of shrinking their labels."
  }
}
