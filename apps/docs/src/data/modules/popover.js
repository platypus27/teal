export default {
  "id": "popover",
  "name": "Popover",
  "apiNames": [
    "Popover"
  ],
  "imports": [
    "Popover",
    "Button",
    "Checkbox"
  ],
  "description": "An anchored surface for arbitrary controls and supplemental content.",
  "usage": "<Popover label=\"Filter projects\" trigger={<Button variant=\"secondary\">Filters</Button>}>\n  <div className=\"grid gap-3\">\n    <Checkbox label=\"Active only\" defaultChecked />\n    <Button size=\"sm\">Apply filters</Button>\n  </div>\n</Popover>",
  "anatomy": [
    {
      "part": "Trigger",
      "description": "The control that toggles the panel; exposes aria-expanded and aria-controls."
    },
    {
      "part": "Content",
      "description": "The anchored panel holding arbitrary controls, named by the required label prop."
    }
  ],
  "dosDonts": {
    "dos": [
      "Always pass a label so the panel has an accessible name even without a visible heading.",
      "Keep the content to one small task, like a filter set or a share action.",
      "Let collision handling flip placement; only set side or align when the default reads wrong."
    ],
    "donts": [
      "Don't use a popover for blocking decisions; use Dialog or AlertDialog.",
      "Don't build multi-step flows inside a popover; focus is not trapped by design.",
      "Don't use it for a one-line hint; use Tooltip instead."
    ]
  },
  "related": [
    "tooltip",
    "menu",
    "popconfirm"
  ],
  "examples": [
    {
      "title": "Filter panel",
      "description": "Popover anchors interactive content to a trigger with collision-aware placement."
    },
    {
      "title": "Share panel",
      "description": "side=\"top\" opens the panel above the trigger; a read-only Input holds the share link."
    },
    {
      "title": "Checkbox filters",
      "description": "align=\"start\" keeps a filter set of checkboxes and an apply action tucked under the trigger."
    },
    {
      "title": "Display options",
      "description": "A compact preferences panel with checkboxes and a secondary reset action."
    },
    {
      "title": "Preview on hover",
      "description": "openOn=\"hover\" reveals rich preview content on hover or keyboard focus; openDelay and closeDelay tune the timing."
    },
    {
      "title": "Inline filters",
      "description": "Keep a small set of filters anchored to the toolbar that owns them."
    },
    {
      "title": "Supplemental controls",
      "description": "Use a popover for controls that do not deserve a full route or dialog."
    }
  ],
  "guidance": {
    "useWhen": "Supplemental controls should stay anchored to a trigger.",
    "avoidWhen": "The content is a blocking task or a simple one-line hint.",
    "behavior": "Focus returns to the trigger after dismissal.",
    "responsive": "Keep panels within the viewport and avoid overly wide forms."
  }
}
