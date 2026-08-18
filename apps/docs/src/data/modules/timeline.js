export default {
  "id": "timeline",
  "name": "Timeline",
  "apiNames": [
    "Timeline"
  ],
  "description": "A vertical activity feed with tone dots, connectors, and timestamps.",
  "usage": "<Timeline\n  items={[\n    { id: '1', title: 'Deploy finished', timestamp: '2 min ago', tone: 'success' },\n  ]}\n/>",
  "anatomy": [
    {
      "part": "Rail",
      "description": "Fixed-width left column holding the dots and connectors; hidden from assistive technology."
    },
    {
      "part": "Tone dot",
      "description": "Colored marker per item: neutral, primary, success, warning, or danger."
    },
    {
      "part": "Connector",
      "description": "Hairline linking an item to the next; skipped after the last item."
    },
    {
      "part": "Content",
      "description": "Title, optional description, and timestamp stacked per entry inside an ordered list."
    }
  ],
  "dosDonts": {
    "dos": [
      "Order items chronologically and give each a stable id.",
      "Use tone dots to mark outcomes, such as success for a finished deploy."
    ],
    "donts": [
      "Don't use Timeline for unordered peer items; use a plain List.",
      "Don't rely on the dot color alone; the title must state the outcome."
    ]
  },
  "related": [
    "activity-feed",
    "list",
    "status-dot"
  ],
  "examples": [
    {
      "title": "Activity feed",
      "description": "Tone dots mark event semantics; connectors link the sequence."
    },
    {
      "title": "Event tones",
      "description": "Use success and warning tones to mark outcomes in a feed."
    }
  ],
  "guidance": {
    "useWhen": "Events form a chronological feed.",
    "avoidWhen": "Items are peers without time order; use a plain list.",
    "behavior": "Tone dots carry semantics; connectors skip the last item.",
    "responsive": "Content wraps while the rail stays fixed width."
  }
}
