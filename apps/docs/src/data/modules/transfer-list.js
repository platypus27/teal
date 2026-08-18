export default {
  "id": "transfer-list",
  "name": "Transfer List",
  "apiNames": [
    "TransferList"
  ],
  "description": "A dual listbox that moves options between an available list and a chosen list with buttons or the keyboard.",
  "usage": "<TransferList\n  sourceLabel=\"Available\"\n  targetLabel=\"Selected\"\n  options={[\n    { value: 'design', label: 'Design' },\n    { value: 'engineering', label: 'Engineering' },\n  ]}\n  onValueChange={(values) => undefined}\n/>",
  "anatomy": [
    {
      "part": "Source listbox",
      "description": "The available options, a multiselectable listbox named by sourceLabel."
    },
    {
      "part": "Target listbox",
      "description": "The chosen options, whose values are the component's value."
    },
    {
      "part": "Move buttons",
      "description": "Arrow buttons labelled from the list names; Enter moves the selection too."
    },
    {
      "part": "Option rows",
      "description": "Clickable, keyboard-selectable rows; moved items stay selected for an immediate send-back."
    }
  ],
  "dosDonts": {
    "dos": [
      "Name both lists for the domain, such as Available roles and Granted roles.",
      "Use it when seeing both states side by side helps, like permissions or skills.",
      "Keep option values stable so moved items keep their original order."
    ],
    "donts": [
      "Don't use it for a handful of options; checkboxes or a Combobox with multiple are lighter.",
      "Don't expect reordering within the target list; order follows the source."
    ]
  },
  "related": [
    "combobox",
    "checkbox",
    "list"
  ],
  "examples": [
    {
      "title": "Uncontrolled transfer",
      "description": "Click options to select them, then move them with the arrow buttons or Enter."
    },
    {
      "title": "Controlled with custom labels",
      "description": "A controlled value seeds the target list and renames both listboxes for the domain."
    }
  ],
  "guidance": {
    "useWhen": "The user builds a set from a larger pool and benefits from seeing both states side by side, such as permissions or team skills.",
    "avoidWhen": "Only a handful of options exist — checkboxes or a Combobox with multiple are lighter; ordering within the chosen set is not supported.",
    "behavior": "value always reflects the target list; moves preserve the original option order, and moved items stay selected so they can be sent back immediately.",
    "responsive": "Both lists flex to share the available width; on narrow screens give the group a min width or stack it in a scrollable container."
  }
}
