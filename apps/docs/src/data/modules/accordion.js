export default {
  "id": "accordion",
  "name": "Accordion",
  "apiNames": [
    "Accordion"
  ],
  "description": "A stacked disclosure list with single and multi-open modes driven by a compact item interface.",
  "usage": "<Accordion\n  defaultValue=\"sign-in\"\n  items={[\n    { value: 'sign-in', title: 'Sign-in notifications', content: 'Get alerted when a new device signs in.' },\n    { value: 'sessions', title: 'Active sessions', content: 'Review and revoke sessions.' },\n  ]}\n/>",
  "anatomy": [
    {
      "part": "Item",
      "description": "One disclosure unit, keyed by a unique value."
    },
    {
      "part": "Trigger",
      "description": "The header button with the title and chevron, exposing aria-expanded."
    },
    {
      "part": "Content",
      "description": "The panel revealed while the item is open."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use single-open mode for settings groups that are read one at a time.",
      "Switch to multiple mode when readers compare sections side by side.",
      "Keep titles short so triggers stay on one line."
    ],
    "donts": [
      "Don't hide required form fields inside collapsed items.",
      "Don't use an accordion when all content must be visible at once.",
      "Don't nest accordions inside accordion content."
    ]
  },
  "related": [
    "expandable-card",
    "tabs",
    "card"
  ],
  "examples": [
    {
      "title": "Single-open",
      "description": "At most one item is open, and the open item can be collapsed again."
    },
    {
      "title": "Multi-open and disabled",
      "description": "multiple allows any number of open items; disabled items cannot be toggled."
    }
  ],
  "guidance": {
    "useWhen": "Sections of related content should be progressively disclosed.",
    "avoidWhen": "All content must be visible at once or sections are compared side by side.",
    "behavior": "Single mode keeps at most one item open and is collapsible; multiple mode opens any number.",
    "responsive": "Keep titles short so triggers stay on one line."
  }
}
