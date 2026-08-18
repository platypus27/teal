export default {
  "id": "step-up-notice",
  "name": "Step-Up Notice",
  "apiNames": [
    "StepUpNotice"
  ],
  "imports": [
    "StepUpNotice",
    "Button"
  ],
  "description": "An inline warning that explains a required fresh verification and hosts the caller’s verification action.",
  "usage": "<StepUpNotice\n  title=\"Confirm it's you\"\n  action={<Button size=\"sm\">Verify with passkey</Button>}\n>\n  Approving a repair requires fresh verification.\n</StepUpNotice>",
  "anatomy": [
    {
      "part": "Warning surface",
      "description": "Built on Alert with the warning variant and its status semantics."
    },
    {
      "part": "Title",
      "description": "Bold lead-in naming the verification requirement."
    },
    {
      "part": "Explanation",
      "description": "Children text describing why fresh verification is required."
    },
    {
      "part": "Action",
      "description": "Caller-supplied verification control, such as a passkey Button; the notice never starts verification itself."
    },
    {
      "part": "Dismiss",
      "description": "Optional dismiss control rendered when onDismiss is passed."
    }
  ],
  "dosDonts": {
    "dos": [
      "State which action needs verification and why in the body copy.",
      "Render the caller's verification control as the action so the flow stays product-owned."
    ],
    "donts": [
      "Don't use StepUpNotice for plain warnings; use Alert.",
      "Don't make the notice dismissible when verification is mandatory to proceed."
    ]
  },
  "related": [
    "alert",
    "dialog",
    "button"
  ],
  "examples": [
    {
      "title": "Verification required",
      "description": "The action is caller-supplied; the notice never starts verification on its own."
    },
    {
      "title": "Dismissible",
      "description": "Pass onDismiss when the notice is informational rather than blocking."
    }
  ],
  "guidance": {
    "useWhen": "A sensitive action requires fresh strong authentication first.",
    "avoidWhen": "A plain warning suffices; use Alert instead.",
    "behavior": "The verification action is caller-supplied; the notice never starts or auto-submits verification.",
    "responsive": "The action wraps beneath the explanation on narrow screens."
  }
}
