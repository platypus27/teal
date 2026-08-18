export default {
  "id": "tree-select",
  "name": "Tree Select",
  "apiNames": [
    "TreeSelect"
  ],
  "description": "A single-select control whose popover shows an expandable, typeahead-enabled tree of options; display=\"columns\" walks the hierarchy one column per level.",
  "usage": "<TreeSelect\n  label=\"Office\"\n  options={[\n    { value: 'emea', label: 'EMEA', children: [{ value: 'berlin', label: 'Berlin' }] },\n    { value: 'singapore', label: 'Singapore' },\n  ]}\n  onValueChange={(value) => undefined}\n/>",
  "anatomy": [
    {
      "part": "Trigger",
      "description": "A combobox-styled button showing the selected leaf's label."
    },
    {
      "part": "Tree popover",
      "description": "A tree of options with typeahead, matching the trigger width and scrolling vertically."
    },
    {
      "part": "Branch node",
      "description": "An expandable group with a chevron; it only expands or collapses, never commits."
    },
    {
      "part": "Leaf node",
      "description": "A terminal item that commits its value, closes the popover, and shows a check when selected."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use it when intermediate grouping aids orientation, like regions or org units.",
      "Pre-expand the ancestors of a controlled value so the selection is visible on open.",
      "Keep disabled nodes visible so users see what exists but is unavailable."
    ],
    "donts": [
      "Don't use it for flat or small option sets; use Select.",
      "Don't make branch nodes selectable; set display=\"columns\" if drilling should scan faster."
    ]
  },
  "related": [
    "select",
    "tree-view"
  ],
  "examples": [
    {
      "title": "Basic tree select",
      "description": "Branches expand and collapse; only leaf nodes commit the selection."
    },
    {
      "title": "Controlled with pre-expanded branches",
      "description": "A controlled value is revealed and highlighted on open; disabled nodes stay visible but cannot be chosen."
    },
    {
      "title": "Columns display",
      "description": "display=\"columns\" renders one labelled column per level; choosing a leaf commits the full path of values."
    }
  ],
  "guidance": {
    "useWhen": "Users pick one value from a hierarchy where intermediate grouping helps orientation, such as regions, folders, or org units.",
    "avoidWhen": "The option set is flat or small — use Select; if the user needs to drill through many levels, display=\"columns\" scans faster.",
    "behavior": "Branch nodes only expand or collapse; leaf nodes commit a single value, close the popover, and render their label in the trigger.",
    "responsive": "The popover matches the trigger width and the tree scrolls vertically; deep levels indent rather than widen the control."
  }
}
