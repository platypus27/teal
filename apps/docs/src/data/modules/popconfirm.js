export default {
  "id": "popconfirm",
  "name": "Popconfirm",
  "apiNames": [
    "Popconfirm"
  ],
  "imports": [
    "Popconfirm",
    "Button"
  ],
  "description": "A lightweight anchored confirmation for small destructive or irreversible actions.",
  "usage": "<Popconfirm\n  trigger={<Button variant=\"secondary\">Remove member</Button>}\n  title=\"Remove Avery?\"\n  message=\"They lose access to this workspace.\"\n  tone=\"danger\"\n  confirmText=\"Remove\"\n  onConfirm={() => undefined}\n/>",
  "anatomy": [
    {
      "part": "Trigger",
      "description": "The control whose action needs a quick confirmation, like \"Remove member\"."
    },
    {
      "part": "Panel",
      "description": "The popover-anchored surface that stays near the trigger without blocking the page."
    },
    {
      "part": "Title and message",
      "description": "A short question naming the target plus one line of consequence."
    },
    {
      "part": "Confirm and cancel",
      "description": "The inline choice pair; tone=\"danger\" marks irreversible confirms."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use for small row-level actions like removing a member or discarding a draft.",
      "Phrase the title as a question that names the target, like \"Remove Avery?\".",
      "Keep the message to one line of consequence."
    ],
    "donts": [
      "Don't use a popconfirm for severe or hard-to-reverse consequences; use AlertDialog.",
      "Don't stack popconfirms or open one from inside a popover.",
      "Don't use it for informational content; there is nothing to confirm."
    ]
  },
  "related": [
    "alert-dialog",
    "popover",
    "menu"
  ],
  "examples": [
    {
      "title": "Inline confirmation",
      "description": "Built on Popover, so it anchors to the trigger without taking over the page."
    },
    {
      "title": "Neutral action",
      "description": "Without tone, the confirm suits routine decisions like publishing a report."
    }
  ],
  "guidance": {
    "useWhen": "A small action benefits from confirmation without a modal.",
    "avoidWhen": "The consequence is severe; use AlertDialog.",
    "behavior": "Anchored to its trigger and dismisses on confirm, cancel, or Escape.",
    "responsive": "The panel stays within the viewport near the trigger."
  }
}
