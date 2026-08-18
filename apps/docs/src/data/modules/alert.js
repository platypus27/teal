export default {
  "id": "alert",
  "name": "Alert",
  "apiNames": [
    "Alert"
  ],
  "imports": [
    "Alert",
    "Button"
  ],
  "description": "An inline feedback surface with semantic variants, an optional title, and dismissal; appearance renders it as a raised surface, a page-level banner strip, or a presentational callout.",
  "usage": "<Alert variant=\"warning\" title=\"Payment method expiring\">\n  The workspace card ends in 04/25. Update billing details to avoid interruption.\n</Alert>",
  "anatomy": [
    {
      "part": "Variant icon",
      "description": "Decorative severity glyph, hidden from assistive technology; not rendered for the banner appearance."
    },
    {
      "part": "Title",
      "description": "Optional bold lead-in naming the condition."
    },
    {
      "part": "Body",
      "description": "The explanatory message; wraps within the surface."
    },
    {
      "part": "Action",
      "description": "Caller-supplied trailing control, such as a Button."
    },
    {
      "part": "Dismiss",
      "description": "Optional labeled IconButton rendered when onDismiss is passed."
    }
  ],
  "dosDonts": {
    "dos": [
      "Keep the alert mounted until the condition resolves or the user dismisses it.",
      "Use the danger variant for failures that need immediate attention; it announces assertively.",
      "Use appearance=\"banner\" for workspace-wide conditions and appearance=\"callout\" for quiet guidance that should not announce itself."
    ],
    "donts": [
      "Don't use Alert for brief confirmations; use Toast instead.",
      "Don't rely on the icon or color alone; the text must carry the meaning."
    ]
  },
  "related": [
    "offline-banner",
    "toast",
    "step-up-notice"
  ],
  "examples": [
    {
      "title": "Variants",
      "description": "Semantic variants pair a standard icon with a matching surface treatment."
    },
    {
      "title": "Dismissible",
      "description": "Pass onDismiss to render a close button for feedback the user can clear."
    },
    {
      "title": "Banner appearance",
      "description": "appearance=\"banner\" renders a full-width page-level strip with an optional trailing action."
    },
    {
      "title": "Callout appearance",
      "description": "appearance=\"callout\" stays in the reading flow with a left accent bar; pass accent={false} to hide it."
    }
  ],
  "guidance": {
    "useWhen": "Feedback must stay visible in context until it is read or dismissed.",
    "avoidWhen": "A brief confirmation is enough; use a toast for transient feedback.",
    "behavior": "Danger renders role=\"alert\" for immediate announcement; other variants render role=\"status\". appearance=\"callout\" renders no live region and stays in the reading flow.",
    "responsive": "Let the body text wrap and keep the title to a short phrase."
  }
}
