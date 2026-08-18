export default {
  "id": "alert-dialog",
  "name": "Alert Dialog",
  "apiNames": [
    "AlertDialog"
  ],
  "imports": [
    "AlertDialog",
    "Button"
  ],
  "description": "A blocking confirmation that holds focus until an explicit choice is made.",
  "usage": "<AlertDialog\n  trigger={<Button variant=\"danger\">Delete project</Button>}\n  title=\"Delete project?\"\n  description=\"This removes Orion and its reports permanently.\"\n  tone=\"danger\"\n  confirmText=\"Delete\"\n  onConfirm={() => undefined}\n/>",
  "anatomy": [
    {
      "part": "Trigger",
      "description": "The caller-supplied control that opens the confirmation, like a danger Button."
    },
    {
      "part": "Content",
      "description": "The blocking panel that holds focus until cancel or confirm is chosen."
    },
    {
      "part": "Title and description",
      "description": "The question and its consequence, wired as the dialog's accessible name and description."
    },
    {
      "part": "Cancel and confirm",
      "description": "The explicit choice pair; tone=\"danger\" styles the confirm action for irreversible operations."
    }
  ],
  "dosDonts": {
    "dos": [
      "State the consequence in the description, including whether it can be undone.",
      "Use tone=\"danger\" and a verb-led confirmText like \"Delete\" for irreversible actions.",
      "Keep the default focus on the safe action so keyboard users confirm deliberately."
    ],
    "donts": [
      "Don't use an alert dialog for routine or minor confirmations; use Popconfirm.",
      "Don't use generic confirm text like \"OK\"; name the action.",
      "Don't chain a second alert dialog from the confirm handler."
    ]
  },
  "related": [
    "dialog",
    "popconfirm",
    "prompt-dialog"
  ],
  "examples": [
    {
      "title": "Destructive confirmation",
      "description": "Alertdialog semantics keep focus inside; tone=\"danger\" styles the confirm action."
    },
    {
      "title": "Neutral confirmation",
      "description": "Without tone, the confirm action stays primary for blocking but non-destructive decisions like publishing."
    },
    {
      "title": "Custom actions",
      "description": "Pass actions to replace the default cancel and confirm buttons entirely."
    }
  ],
  "guidance": {
    "useWhen": "An action needs an explicit, blocking confirmation.",
    "avoidWhen": "The consequence is minor; use Popconfirm or inline feedback.",
    "behavior": "Focus stays trapped until cancel or confirm; tone styles the confirm action.",
    "responsive": "The panel caps at the viewport with its own scroll."
  }
}
