export default {
  "id": "rating",
  "name": "Rating",
  "apiNames": [
    "Rating"
  ],
  "description": "A star rating input with radio semantics, arrow keys, and a read-only display mode.",
  "usage": "<Rating label=\"Rate this report\" defaultValue={3} onChange={(value) => undefined} />",
  "anatomy": [
    {
      "part": "Group",
      "description": "role=\"radiogroup\" container named by the label prop; owns the arrow-key handling."
    },
    {
      "part": "Star buttons",
      "description": "One role=\"radio\" button per star with aria-checked; only the checked star stays in the tab order."
    },
    {
      "part": "Read-only display",
      "description": "Static stars rendered as role=\"img\" with an \"x out of y stars\" label when readOnly is set."
    }
  ],
  "dosDonts": {
    "dos": [
      "Name the group with label, such as \"Rate this report\".",
      "Use readOnly for review summaries so scores display without entering the tab order."
    ],
    "donts": [
      "Don't use Rating for arbitrary numeric input; use Slider or NumberInput.",
      "Don't change max away from five without a reason; users expect a familiar scale."
    ]
  },
  "related": [
    "slider",
    "radio-group",
    "number-input"
  ],
  "examples": [
    {
      "title": "Interactive rating",
      "description": "Stars behave as a radiogroup with roving tab index; arrows move and select."
    },
    {
      "title": "Read-only display",
      "description": "readOnly renders static stars with an img role for review summaries."
    }
  ],
  "guidance": {
    "useWhen": "Users score something on a small fixed scale.",
    "avoidWhen": "The input is numeric but not a rating; use Slider or NumberInput.",
    "behavior": "Stars form a radiogroup with roving tab index and arrow-key selection.",
    "responsive": "Pick a size per context; the inline group never wraps."
  }
}
