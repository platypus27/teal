export default {
  "id": "form-error-summary",
  "name": "Form Error Summary",
  "apiNames": [
    "FormErrorSummary"
  ],
  "description": "A top-of-form alert that lists validation errors as anchor links which focus the offending field.",
  "usage": "<FormErrorSummary\n  errors={[\n    { fieldId: \"email\", label: \"Email\", message: \"Enter a valid email address.\" },\n  ]}\n/>",
  "anatomy": [
    {
      "part": "Alert container",
      "description": "A role=alert region, so new validation failures are announced as soon as it renders."
    },
    {
      "part": "Heading",
      "description": "A customizable title summarizing the failure count or context."
    },
    {
      "part": "Error list",
      "description": "Anchor links, one per error, whose targets are the offending field ids."
    },
    {
      "part": "Icon",
      "description": "A decorative alert icon; the message text carries the meaning."
    }
  ],
  "dosDonts": {
    "dos": [
      "Place it at the top of the form and move focus there after a failed submit.",
      "Keep each link's message identical to the error shown at its field.",
      "Pass real field ids so activating a link focuses the control."
    ],
    "donts": [
      "Don't render it for a single inline error; the field message is enough.",
      "Don't link to fields that are hidden or disabled on the current step."
    ]
  },
  "related": [
    "form",
    "field",
    "alert"
  ],
  "examples": [
    {
      "title": "Multiple field errors",
      "description": "Each error becomes a link whose target is the field id, so activating it moves focus straight to the control."
    },
    {
      "title": "Single error with custom title",
      "description": "The heading can be tailored to the error count or form context while the linking behavior stays the same."
    }
  ],
  "guidance": {
    "useWhen": "Long or complex forms submit server- or client-side validation failures that users must locate quickly.",
    "avoidWhen": "A single visible field fails inline; the Field error message alone is enough and a summary would repeat it.",
    "behavior": "Activating an error link prevents navigation and focuses the element with the matching id, adding tabindex=-1 first when it is not naturally focusable. Renders nothing when the errors list is empty.",
    "responsive": "The summary stacks its icon, heading, and link list at any width within the form container."
  }
}
