export default {
  "id": "dialog",
  "name": "Dialog",
  "apiNames": [
    "Dialog"
  ],
  "description": "A modal surface that owns focus management, naming, dismissal, and scroll locking; placement renders it centered, fullscreen, as a left/right drawer, or as a bottom sheet.",
  "usage": "const [open, setOpen] = useState(false)\n\n<Button onClick={() => setOpen(true)}>Open dialog</Button>\n<Dialog\n  open={open}\n  onOpenChange={setOpen}\n  title=\"Archive project?\"\n  description=\"The project can be restored later.\"\n>\n  <p>Project Orion will leave the active workspace.</p>\n</Dialog>",
  "anatomy": [
    {
      "part": "Trigger",
      "description": "The control that opens the dialog, usually a Button; callers own it."
    },
    {
      "part": "Scrim",
      "description": "The dimmed backdrop that blocks the page and dismisses on click."
    },
    {
      "part": "Content",
      "description": "The modal surface that traps focus and carries the title, description, and children."
    },
    {
      "part": "Title and description",
      "description": "Header text wired to aria-labelledby and aria-describedby automatically."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use a verb-led title that states the outcome, like \"Archive project?\".",
      "Keep the content short; move long forms into a dedicated page or placement=\"fullscreen\".",
      "Restore focus to the trigger when the dialog closes (built in)."
    ],
    "donts": [
      "Don't stack a second dialog on top of an open one.",
      "Don't use a dialog for destructive confirmations; use AlertDialog.",
      "Don't hide required information behind the scrim dismissal."
    ]
  },
  "related": [
    "alert-dialog",
    "action-sheet",
    "popover"
  ],
  "examples": [
    {
      "title": "Confirmation",
      "description": "Dialog traps focus, restores it on close, and dismisses with Escape or the scrim."
    },
    {
      "title": "Form dialog",
      "description": "size=\"lg\" gives a short form room; Field wraps each Input with a label and description."
    },
    {
      "title": "Destructive confirmation",
      "description": "Use a danger action only when the consequence is clear and reversible where possible."
    },
    {
      "title": "Long-form task",
      "description": "For focused tasks, keep the title visible and let the dialog body own its scroll."
    },
    {
      "title": "Fullscreen task",
      "description": "placement=\"fullscreen\" fills the viewport with a sticky header, scrollable body, and footer actions."
    },
    {
      "title": "Drawer panel",
      "description": "placement=\"right\" (or \"left\") slides a panel in from the edge; width sets its size."
    },
    {
      "title": "Bottom sheet",
      "description": "placement=\"bottom\" rises from the thumb zone; snap=\"half\" keeps page context visible."
    },
    {
      "title": "Full-height sheet",
      "description": "snap=\"full\" gives long content like pickers the full viewport height."
    }
  ],
  "guidance": {
    "useWhen": "A decision or focused task must temporarily block the page.",
    "avoidWhen": "The content can be inline or handled by a popover.",
    "behavior": "Focus is trapped, Escape dismisses, and focus returns to the trigger, for every placement.",
    "responsive": "placement=\"bottom\" snaps to half or full viewport height; the left and right placements size with the width prop, and placement=\"fullscreen\" always fills the viewport."
  }
}
