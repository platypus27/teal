export default {
  "id": "separator",
  "name": "Separator",
  "apiNames": [
    "Separator"
  ],
  "description": "A semantic or decorative divider for related content.",
  "usage": "<Separator />",
  "anatomy": [
    {
      "part": "Horizontal rule",
      "description": "A full-width 1px hairline in the outline-variant color for stacking contexts."
    },
    {
      "part": "Vertical rule",
      "description": "A full-height 1px hairline for inline groups such as toolbars and metadata rows."
    }
  ],
  "dosDonts": {
    "dos": [
      "Keep the default decorative behavior unless the break marks a true content boundary.",
      "Use orientation=\"vertical\" between items in a row, with a parent that has a defined height."
    ],
    "donts": [
      "Don't stack separators back to back; one hairline is enough between two sections.",
      "Don't use separators as a general spacing tool; prefer layout gaps and padding."
    ]
  },
  "related": [
    "list",
    "toolbar",
    "card"
  ],
  "examples": [
    {
      "title": "Content divider",
      "description": "Separator renders a horizontal rule that can be decorative or semantic."
    },
    {
      "title": "Inline divider",
      "description": "orientation=\"vertical\" splits items in a row, such as metadata in a toolbar."
    },
    {
      "title": "Vertical grouping",
      "description": "Use a vertical separator only when adjacent controls form one horizontal group."
    }
  ],
  "guidance": {
    "useWhen": "Adjacent sections need a subtle visual break, such as between groups in a settings page.",
    "avoidWhen": "Spacing alone would do, or the boundary deserves a heading instead.",
    "behavior": "Decorative by default; pass decorative={false} for a semantic rule and orientation=\"vertical\" for inline groups.",
    "responsive": "Horizontal rules stretch to their container; vertical ones need a parent with a defined height."
  }
}
