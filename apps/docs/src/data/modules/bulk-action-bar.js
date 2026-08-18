export default {
  "id": "bulk-action-bar",
  "name": "Bulk Action Bar",
  "apiNames": [
    "BulkActionBar"
  ],
  "description": "A bar that appears when list or table rows are selected, announcing the selection count and offering bulk actions.",
  "usage": "<BulkActionBar count={selected.length} onClear={clearSelection}>\n  <Button variant=\"secondary\" size=\"sm\">Archive</Button>\n  <Button variant=\"danger\" size=\"sm\">Delete</Button>\n</BulkActionBar>",
  "anatomy": [
    {
      "part": "Count",
      "description": "The selection total, announced politely through a live region as it changes."
    },
    {
      "part": "Actions",
      "description": "The bulk operations applied to every selected row at once."
    },
    {
      "part": "Clear",
      "description": "The control that resets the selection; the bar unmounts itself at zero."
    }
  ],
  "dosDonts": {
    "dos": [
      "Offer only actions that are safe to apply to many rows at once.",
      "Pair destructive bulk actions with a confirmation step.",
      "Keep labels to two or three short words on narrow screens."
    ],
    "donts": [
      "Don't render the bar with an empty selection; it handles that itself.",
      "Don't put row-specific navigation or links in the bar."
    ]
  },
  "related": [
    "action-bar",
    "table",
    "checkbox"
  ],
  "examples": [
    {
      "title": "Selection actions",
      "description": "Shows the selected row count alongside destructive and neutral bulk actions with a clear button."
    },
    {
      "title": "Clearing the selection",
      "description": "The bar unmounts itself when the count drops to zero, so the list returns to its idle state."
    }
  ],
  "guidance": {
    "useWhen": "A list or table supports multi-select and the same action must apply to every selected row at once.",
    "avoidWhen": "Only one row is ever acted on; use row-level buttons or a Menu in context mode instead.",
    "behavior": "Renders nothing while count is 0; the count is announced politely as it changes, and onClear resets the selection.",
    "responsive": "Actions flex to fill the bar; on narrow widths keep bulk actions to two or three short labels."
  }
}
