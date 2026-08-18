export default {
  "id": "empty-state",
  "name": "Empty State",
  "apiNames": [
    "EmptyState"
  ],
  "imports": [
    "EmptyState",
    "Button"
  ],
  "description": "An explanatory empty result with an optional action and SVG icon.",
  "usage": "<EmptyState\n  title=\"No reports\"\n  description=\"Create a report to begin tracking results.\"\n  action={<Button>Create report</Button>}\n/>",
  "anatomy": [
    {
      "part": "Icon well",
      "description": "Rounded container holding a decorative SVG icon; hidden from assistive technology."
    },
    {
      "part": "Title",
      "description": "Heading naming the empty condition; renders h3 by default and adjusts with titleAs."
    },
    {
      "part": "Description",
      "description": "Short explanation of why the surface is empty and what happens next."
    },
    {
      "part": "Action",
      "description": "Caller-supplied next step, usually a single primary Button."
    }
  ],
  "dosDonts": {
    "dos": [
      "Lead with what happened, then offer one clear next action.",
      "Distinguish a first-run empty surface from a filtered no-results state in the copy."
    ],
    "donts": [
      "Don't use an empty state while content is still loading; use Skeleton or LoadingState.",
      "Don't stack several competing actions under one empty state."
    ]
  },
  "related": [
    "loading",
    "alert"
  ],
  "examples": [
    {
      "title": "First-run",
      "description": "Pair a short explanation with a single primary action."
    },
    {
      "title": "Filtered empty result",
      "description": "Explain that filters produced no results and offer a way to adjust them."
    },
    {
      "title": "Status outcomes",
      "description": "Pass status to show a standard icon and tint for success, error, warning, info, or HTTP outcomes like 404."
    }
  ],
  "guidance": {
    "useWhen": "A product surface has no results or has not been configured.",
    "avoidWhen": "Content is merely loading or filtered temporarily.",
    "behavior": "Explain what happened and give one clear next action when useful.",
    "responsive": "Keep the message readable and center the action beneath it."
  }
}
