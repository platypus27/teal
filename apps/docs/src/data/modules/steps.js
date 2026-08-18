export default {
  "id": "steps",
  "name": "Steps",
  "apiNames": [
    "Steps"
  ],
  "description": "A numbered flow indicator with done, current, and upcoming states.",
  "usage": "<Steps\n  current={1}\n  steps={[\n    { label: 'Workspace' },\n    { label: 'Members' },\n    { label: 'Review' },\n  ]}\n/>",
  "anatomy": [
    {
      "part": "Markers",
      "description": "Numbered circles that switch to a check once a step is done."
    },
    {
      "part": "Labels",
      "description": "Step names; the current step sets aria-current=\"step\"."
    },
    {
      "part": "Connectors",
      "description": "Lines between markers that fill as steps complete."
    }
  ],
  "dosDonts": {
    "dos": [
      "Provide onStepClick so people can return to completed steps.",
      "Keep step labels to short nouns."
    ],
    "donts": [
      "Don't let people jump ahead; only completed steps become clickable.",
      "Don't use it as page navigation; it tracks one flow's progress."
    ]
  },
  "related": [
    "pagination",
    "breadcrumb",
    "timeline"
  ],
  "examples": [
    {
      "title": "Flow progress",
      "description": "Completed steps can be clickable; the current step sets aria-current."
    },
    {
      "title": "Clickable completed steps",
      "description": "Allow returning to completed steps with onStepClick."
    }
  ],
  "guidance": {
    "useWhen": "A flow has a clear sequence and the user benefits from seeing progress.",
    "avoidWhen": "Steps are independent views; use Tabs or navigation.",
    "behavior": "The current step sets aria-current and completed steps can be made clickable.",
    "responsive": "Steps wrap with their labels on narrow screens; keep labels short."
  }
}
