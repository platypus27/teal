export default {
  "id": "section",
  "name": "Section",
  "apiNames": [
    "Section"
  ],
  "description": "A semantic page section with vertical rhythm spacing and an optional centered container wrap.",
  "usage": "<Section\n  container\n  spacing=\"md\"\n>\n  <h2>Release notes</h2>\n</Section>",
  "anatomy": [
    {
      "part": "Section element",
      "description": "A semantic section landmark wrapping one topical block of the page."
    },
    {
      "part": "Rhythm spacing",
      "description": "Vertical padding in sm, md or lg steps; none removes it for flush stacking."
    },
    {
      "part": "Container wrap",
      "description": "An optional centered Container around the children, enabled with the container prop."
    }
  ],
  "dosDonts": {
    "dos": [
      "Give each Section a heading, and name it with aria-labelledby when the page has several.",
      "Use the container prop on content pages so sections align to the same centered column.",
      "Use spacing=\"none\" for flush-stacked bands such as heroes and full-bleed media."
    ],
    "donts": [
      "Don't use Section for tiny groupings inside a component; it is a page-level landmark.",
      "Don't nest a Container inside a contained Section; the width cap doubles up.",
      "Don't render sections without headings; unnamed landmarks are noise for screen-reader navigation."
    ]
  },
  "related": [
    "container",
    "page-header",
    "stack"
  ],
  "examples": [
    {
      "title": "Contained section",
      "description": "Children are wrapped in a centered Container while the section supplies medium vertical rhythm."
    },
    {
      "title": "Rhythm variants",
      "description": "sm and lg spacing tighten or loosen the vertical beat; none removes it for flush stacking."
    }
  ],
  "guidance": {
    "useWhen": "A page is composed of stacked topical blocks that need consistent vertical spacing and optional centering.",
    "avoidWhen": "The block already sits inside a Container or needs custom padding; compose Container directly instead.",
    "behavior": "Section always renders a section element and only wraps children in a Container when the container prop is set.",
    "responsive": "The inner Container keeps its responsive side padding, so contained sections stay readable at any width."
  }
}
