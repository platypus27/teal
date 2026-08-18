export default {
  "id": "focus-trap",
  "name": "Focus Trap",
  "apiNames": [
    "FocusTrap"
  ],
  "description": "Keeps Tab and Shift+Tab focus cycling within a container and restores focus when deactivated.",
  "usage": "<FocusTrap active={isEditing}>\n  <Input aria-label=\"Project name\" />\n  <Button>Save</Button>\n</FocusTrap>",
  "anatomy": [
    {
      "part": "Trap container",
      "description": "The div that listens for Tab and queries its own focusable descendants."
    },
    {
      "part": "Trapped content",
      "description": "The focusable children cycled by Tab and Shift+Tab while the trap is active."
    }
  ],
  "dosDonts": {
    "dos": [
      "Activate the trap only while the modal region is open.",
      "Keep the default focus restoration so focus returns to the trigger on release.",
      "Guarantee at least one focusable element inside the trap."
    ],
    "donts": [
      "Don't trap focus in normal page flow; keyboard users get stranded.",
      "Don't run two active traps at once; coordinate which region owns focus.",
      "Don't use it as a substitute for Dialog's full modal semantics."
    ]
  },
  "related": [
    "dialog",
    "portal"
  ],
  "examples": [
    {
      "title": "Toggleable trap",
      "description": "Activate the trap around a panel; Tab cycles through its controls and focus returns to the toggle when released."
    },
    {
      "title": "Always-on trap",
      "description": "A permanently trapped region such as an embedded modal pane or a guided form."
    }
  ],
  "guidance": {
    "useWhen": "A transient modal region — a dialog, drawer, or edit mode — must keep keyboard focus inside until it is dismissed.",
    "avoidWhen": "The content is part of the normal page flow; trapping focus there would strand keyboard users. Use a plain container instead.",
    "behavior": "While active, Tab on the last focusable element wraps to the first and Shift+Tab wraps the other way; with no focusable children Tab is suppressed entirely.",
    "responsive": "Renders a plain div with no intrinsic layout, so the trapped region adapts to whatever container styles you apply."
  }
}
