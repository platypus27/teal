export default {
  "id": "tabs",
  "name": "Tabs",
  "apiNames": [
    "Tabs"
  ],
  "description": "Keyboard-navigable content switching through a compact item interface.",
  "usage": "<Tabs\n  aria-label=\"Account sections\"\n  defaultValue=\"profile\"\n  items={[\n    { value: 'profile', label: 'Profile', content: <ProfilePanel /> },\n    { value: 'billing', label: 'Billing', content: <BillingPanel /> },\n  ]}\n/>",
  "anatomy": [
    {
      "part": "Tab list",
      "description": "The tablist row that owns arrow-key movement between tabs."
    },
    {
      "part": "Tab",
      "description": "Each trigger; the selected one sets aria-selected and drives the visible panel."
    },
    {
      "part": "Tab panel",
      "description": "The content region labelled by its tab, shown one at a time."
    }
  ],
  "dosDonts": {
    "dos": [
      "Keep tab labels to one or two words.",
      "Set defaultValue so a sensible panel is visible on first render.",
      "Control selection with value and onValueChange when a route or parent owns it."
    ],
    "donts": [
      "Don't use tabs to navigate between routes; use Sub Nav so links stay links.",
      "Don't nest a tab list inside another tab panel.",
      "Don't use tabs for a sequential flow; use Steps."
    ]
  },
  "related": [
    "sub-nav",
    "toggle-group",
    "accordion"
  ],
  "examples": [
    {
      "title": "Sections",
      "description": "Tabs follow the ARIA authoring practices keyboard pattern out of the box."
    },
    {
      "title": "Profile sections",
      "description": "Use tabs for peer views that share the same route context."
    },
    {
      "title": "Responsive tab list",
      "description": "Long tab labels remain reachable through horizontal scrolling.",
      "demo": "tabs-responsive"
    }
  ],
  "guidance": {
    "useWhen": "Related views share a context and users switch between them.",
    "avoidWhen": "Views need independent URLs or a long sequence of steps.",
    "behavior": "Arrow keys move between tabs and the active panel is announced.",
    "responsive": "Allow tab labels to scroll rather than wrap into ambiguous rows."
  }
}
