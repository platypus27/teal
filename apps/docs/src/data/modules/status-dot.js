export default {
  "id": "status-dot",
  "name": "Status Dot",
  "apiNames": [
    "StatusDot"
  ],
  "description": "A small colored dot with an optional text label for compact entity status; pass pulse for live presence or ongoing activity.",
  "usage": "<StatusDot\n  variant=\"success\"\n  label=\"Online\"\n/>",
  "anatomy": [
    {
      "part": "Dot",
      "description": "Small colored marker with variant and size options; aria-hidden. In pulse mode it renders as a ping ring over a solid dot, both aria-hidden."
    },
    {
      "part": "Label",
      "description": "Optional visible text that carries the status meaning; in pulse mode it becomes the aria-label on the role=\"status\" element (default \"Live\")."
    }
  ],
  "dosDonts": {
    "dos": [
      "Pair the dot with a text label so color is never the only signal.",
      "Use the success, warning, and danger variants for health-style readouts.",
      "Pass pulse with a label that says what is live, such as \"3 editors online\"."
    ],
    "donts": [
      "Don't use a bare dot for a status users must act on; use Alert.",
      "Don't animate a static status dot; reserve pulse for live activity."
    ]
  },
  "related": [
    "health-indicator",
    "badge",
    "network-status"
  ],
  "examples": [
    {
      "title": "Labeled statuses",
      "description": "Dots paired with text labels for scanable inline status in lists and headers."
    },
    {
      "title": "Semantic variants",
      "description": "The success, warning, and danger variants for health-style readouts."
    },
    {
      "title": "Live pulse",
      "description": "Pulse mode for live presence or streaming activity, announced via an accessible label."
    }
  ],
  "guidance": {
    "useWhen": "You need a compact, glanceable status marker next to an entity name, for example in tables or list rows.",
    "avoidWhen": "The status needs more explanation or an action; use Alert instead.",
    "behavior": "Purely presentational: the dot is hidden from assistive technology and the visible label carries the meaning. With pulse it renders role=\"status\" with the label as aria-label and animates a ping ring, disabled under prefers-reduced-motion.",
    "responsive": "Stays inline and shrinks to content; the label truncates with the surrounding layout."
  }
}
