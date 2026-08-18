export default {
  "id": "action-sheet",
  "name": "Action Sheet",
  "apiNames": [
    "ActionSheet"
  ],
  "description": "An iOS-style bottom sheet listing actions with a destructive option and a separated cancel button.",
  "usage": "<ActionSheet\n  open={open}\n  onOpenChange={setOpen}\n  title=\"Report options\"\n  actions={[\n    { label: 'Duplicate' },\n    { label: 'Delete', destructive: true },\n  ]}\n/>",
  "anatomy": [
    {
      "part": "Title",
      "description": "Optional heading that names the action set and the sheet's accessible name."
    },
    {
      "part": "Action list",
      "description": "The stacked actions; each fires its onSelect and closes the sheet."
    },
    {
      "part": "Destructive action",
      "description": "An action marked destructive, rendered in the error color."
    },
    {
      "part": "Cancel button",
      "description": "A visually separated button below the list that closes without selecting."
    }
  ],
  "dosDonts": {
    "dos": [
      "Keep the list to a handful of actions that all apply to the same object.",
      "Mark irreversible actions destructive so they render in the error color.",
      "Prefer it on touch layouts where bottom-anchored actions sit in the thumb zone."
    ],
    "donts": [
      "Don't put forms or rich content inside; use Dialog with placement=\"bottom\" and custom children.",
      "Don't use it as a desktop action menu; use Menu instead.",
      "Don't hide the only safe exit; the cancel button is always visible."
    ]
  },
  "related": [
    "dialog",
    "menu",
    "alert-dialog"
  ],
  "examples": [
    {
      "title": "Action list",
      "description": "A stack of related actions with a cancel button visually separated below."
    },
    {
      "title": "Destructive action",
      "description": "Destructive actions render in the error color so irreversible choices stand out."
    }
  ],
  "guidance": {
    "useWhen": "A small set of page-level actions on touch layouts, especially when one of them is destructive.",
    "avoidWhen": "Rich forms or navigation menus; use Dialog with placement=\"bottom\" and custom content or Menu instead.",
    "behavior": "Choosing an action fires its onSelect and closes the sheet; cancel closes without selecting anything.",
    "responsive": "Stays full width with comfortable touch targets, capped and centered on wide screens."
  }
}
