export default {
  "id": "visually-hidden",
  "name": "Visually Hidden",
  "apiNames": [
    "VisuallyHidden"
  ],
  "imports": [
    "VisuallyHidden"
  ],
  "description": "Hides content visually while keeping it available to assistive technology.",
  "usage": "<button type=\"button\">\n  <Trash aria-hidden=\"true\" />\n  <VisuallyHidden>Delete report</VisuallyHidden>\n</button>",
  "anatomy": [
    {
      "part": "Clipped wrapper",
      "description": "The span that applies the 1px clip styles, removing content from view without display: none."
    },
    {
      "part": "Hidden content",
      "description": "The text or nodes that stay in the accessibility tree and are announced by screen readers."
    }
  ],
  "dosDonts": {
    "dos": [
      "Label icon-only buttons with VisuallyHidden text instead of relying on title attributes.",
      "Add context such as \"(opens in a new tab)\" to links whose behavior is not obvious from the text.",
      "Keep the hidden text short and equivalent to what a sighted user infers visually."
    ],
    "donts": [
      "Don't place focusable elements inside; a focus target nobody can see strands sighted keyboard users.",
      "Don't use it to hide content that should appear at larger screens; use responsive utilities instead.",
      "Don't duplicate text already announced through an aria-label on the same element."
    ]
  },
  "related": [
    "announcer",
    "button",
    "tooltip"
  ],
  "examples": [
    {
      "title": "Screen-reader text",
      "description": "Use for extra context that would clutter the visual design."
    },
    {
      "title": "New-tab context",
      "description": "Appends \"(opens in a new tab)\" to a link so the behavior is announced without cluttering the visible link text."
    },
    {
      "title": "Extra context",
      "description": "Add location or status context to links whose visible text stays short."
    }
  ],
  "guidance": {
    "useWhen": "Assistive technology needs context the visual design omits.",
    "avoidWhen": "The text should be visible; show it instead.",
    "behavior": "Content stays in the accessibility tree without layout impact.",
    "responsive": "No visual footprint at any viewport."
  }
}
