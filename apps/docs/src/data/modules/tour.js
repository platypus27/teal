export default {
  "id": "tour",
  "name": "Tour",
  "apiNames": [
    "Tour"
  ],
  "imports": [
    "Tour",
    "Button"
  ],
  "description": "A guided walkthrough that highlights target elements step by step.",
  "usage": "const [open, setOpen] = useState(false)\n\n<Tour\n  open={open}\n  onOpenChange={setOpen}\n  steps={[\n    { target: '#search-field', title: 'Search everything', content: 'Find projects and people from one field.' },\n  ]}\n/>",
  "anatomy": [
    {
      "part": "Step target",
      "description": "A CSS selector the step anchors to; the target scrolls into view and gets highlighted."
    },
    {
      "part": "Step card",
      "description": "The floating panel with the step's title and content, positioned by the optional placement."
    },
    {
      "part": "Progress controls",
      "description": "Back, next, and skip actions that walk the steps or end the tour early."
    }
  ],
  "dosDonts": {
    "dos": [
      "Keep tours to a handful of steps that each name a benefit, not just a control.",
      "Use onFinish to record completion so the tour doesn't replay on every visit.",
      "Choose stable selectors for targets; a missing target falls back to a centered dialog."
    ],
    "donts": [
      "Don't tour every feature at once; split introductions by context.",
      "Don't use a tour for a persistent single-control hint; use Tooltip.",
      "Don't put required setup inside a tour; users can skip it."
    ]
  },
  "related": [
    "tooltip",
    "dialog",
    "popover"
  ],
  "examples": [
    {
      "title": "Onboarding steps",
      "description": "Each step anchors to a selector; missing targets fall back to a centered dialog."
    },
    {
      "title": "Single-step change highlight",
      "description": "A one-step tour with placement points returning users at a relocated feature."
    },
    {
      "title": "Placement",
      "description": "Use placement=\"top\" when the step target sits near the bottom of the viewport."
    }
  ],
  "guidance": {
    "useWhen": "New users need a guided introduction to key areas.",
    "avoidWhen": "The hint is local to one control; use Tooltip.",
    "behavior": "Steps anchor to selectors, Escape or Skip closes, and missing targets center the dialog.",
    "responsive": "Steps scroll targets into view; keep step content short."
  }
}
