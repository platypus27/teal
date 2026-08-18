export default {
  "id": "prompt-dialog",
  "name": "Prompt Dialog",
  "apiNames": [
    "PromptDialog"
  ],
  "description": "A modal dialog with a single labeled input that returns the entered value on confirm.",
  "usage": "<PromptDialog\n  open={open}\n  onOpenChange={setOpen}\n  title=\"Rename report\"\n  label=\"Report name\"\n  defaultValue=\"Q3 revenue\"\n  onSubmit={(value) => rename(value)}\n/>",
  "anatomy": [
    {
      "part": "Title",
      "description": "The verb-led heading that names the dialog, like \"Rename report\"."
    },
    {
      "part": "Input",
      "description": "The single labeled text field, focused on open and optionally prefilled with defaultValue."
    },
    {
      "part": "Confirm and cancel",
      "description": "The action pair; confirm or Enter submits the value, cancel and Escape discard it."
    }
  ],
  "dosDonts": {
    "dos": [
      "Prefill defaultValue when editing an existing name so users adjust rather than retype.",
      "Use a verb-led title and a visible input label, not placeholder-only naming.",
      "Validate the submitted value in onSubmit and give feedback on empty or invalid input."
    ],
    "donts": [
      "Don't use it for multi-field or validation-heavy forms; compose Dialog with Field instead.",
      "Don't submit on behalf of the user; Enter is the only implicit submit.",
      "Don't reuse one prompt for unrelated actions; keep one intent per dialog."
    ]
  },
  "related": [
    "dialog",
    "alert-dialog",
    "field"
  ],
  "examples": [
    {
      "title": "Rename flow",
      "description": "The input is prefilled with the current value and focused on open."
    },
    {
      "title": "Create flow",
      "description": "An empty input with a placeholder collects a brand-new name."
    }
  ],
  "guidance": {
    "useWhen": "Quick single-value captures like renaming, creating folders, or tagging, where a full form would be overkill.",
    "avoidWhen": "Multiple fields or validation-heavy input; compose a Dialog with Field components instead.",
    "behavior": "Confirm (or Enter) calls onSubmit with the entered value and closes; cancel and Escape close without submitting.",
    "responsive": "A compact centered dialog capped to the viewport width with comfortable margins on small screens."
  }
}
