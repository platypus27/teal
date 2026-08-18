export default {
  "id": "card",
  "name": "Card",
  "apiNames": [
    "Card",
    "CardHeader",
    "CardTitle",
    "CardDescription",
    "CardContent",
    "CardFooter"
  ],
  "description": "A structural surface for related content without ambiguous interactive behavior.",
  "usage": "<Card>\n  <CardHeader>\n    <CardTitle>Security report</CardTitle>\n    <CardDescription>Updated five minutes ago</CardDescription>\n  </CardHeader>\n  <CardContent>No critical findings were detected.</CardContent>\n</Card>",
  "anatomy": [
    {
      "part": "CardHeader",
      "description": "The heading block holding CardTitle and CardDescription."
    },
    {
      "part": "CardContent",
      "description": "The main body region of the card."
    },
    {
      "part": "CardFooter",
      "description": "The trailing region for metadata or secondary actions."
    }
  ],
  "dosDonts": {
    "dos": [
      "Compose with the header, content, and footer parts so spacing rhythm stays consistent.",
      "Set the polymorphic as prop (article, section, li) to fit the page outline.",
      "Keep one clear topic per card."
    ],
    "donts": [
      "Don't make the whole card clickable when it also contains links or buttons.",
      "Don't wrap every section in a card just for decoration.",
      "Don't bury the page's primary action inside a card footer."
    ]
  },
  "related": [
    "launcher-card",
    "expandable-card"
  ],
  "examples": [
    {
      "title": "Composition",
      "description": "Cards compose header, content, and footer regions with consistent rhythm."
    },
    {
      "title": "Summary with footer action",
      "description": "A weekly summary card pairing a two-line header with a secondary footer action."
    },
    {
      "title": "Header with title and actions",
      "description": "The title and actions props render a compact header row without composing the header subcomponents."
    },
    {
      "title": "Glass variant",
      "description": "variant=\"glass\" applies the frosted-glass treatment with on-surface text, for content floating over imagery or color."
    },
    {
      "title": "Report summary",
      "description": "Use a card to group a short summary and one related action."
    }
  ],
  "guidance": {
    "useWhen": "Related content needs a structural surface.",
    "avoidWhen": "A card is being used only to decorate every section or hide a primary action.",
    "behavior": "Card is non-interactive by default and accepts an explicit polymorphic element.",
    "responsive": "Use compact padding and let card content define its width."
  }
}
