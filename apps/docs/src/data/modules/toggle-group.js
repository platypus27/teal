export default {
  "id": "toggle-group",
  "name": "Toggle Group",
  "apiNames": [
    "ToggleGroup",
    "ToggleGroupItem"
  ],
  "description": "A cluster of Toggle-styled options with roving focus, in mutually exclusive single mode or independent multiple mode; variant=\"segmented\" renders an options array with a sliding selection pill.",
  "usage": "<ToggleGroup type=\"single\" defaultValue=\"left\" aria-label=\"Text alignment\">\n  <ToggleGroupItem value=\"left\">Left</ToggleGroupItem>\n  <ToggleGroupItem value=\"center\">Center</ToggleGroupItem>\n  <ToggleGroupItem value=\"right\">Right</ToggleGroupItem>\n</ToggleGroup>",
  "anatomy": [
    {
      "part": "Group",
      "description": "A roving-focus container that needs an accessible name, usually through aria-label."
    },
    {
      "part": "Item",
      "description": "A Toggle-styled option; single mode exposes aria-checked, multiple mode aria-pressed."
    },
    {
      "part": "Size variant",
      "description": "The sm size for compact toolbars."
    }
  ],
  "dosDonts": {
    "dos": [
      "Name the group with aria-label, since items are often icon-only.",
      "Use type=single for mutually exclusive modes like text alignment.",
      "Keep groups to two to five items so every option stays visible."
    ],
    "donts": [
      "Don't use it for settings that need explanatory text; use RadioGroup or Checkbox with variant=\"card\".",
      "Don't use it to submit form choices; it is a control cluster, not a fieldset."
    ]
  },
  "related": [
    "toggle",
    "radio-group"
  ],
  "examples": [
    {
      "title": "Single selection",
      "description": "type=\"single\" behaves like a radio group: one item stays checked at a time."
    },
    {
      "title": "Multiple selection",
      "description": "type=\"multiple\" lets any combination of items stay pressed, plus a compact sm size."
    },
    {
      "title": "Segmented options",
      "description": "variant=\"segmented\" renders an options array on a pill track; a measured pill slides behind the active option."
    }
  ],
  "guidance": {
    "useWhen": "Two to five related options need quick on/off switching, such as alignment or formatting controls.",
    "avoidWhen": "Options need explanatory text or there are many of them; use RadioGroup or Checkbox with variant=\"card\", or Select instead.",
    "behavior": "Single mode keeps exactly one item checked and reports the new value; multiple mode reports the full array of pressed values. Disabled items leave the focus order and cannot be toggled.",
    "responsive": "Items wrap to the next line when the group outgrows its container."
  }
}
