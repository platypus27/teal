export default {
  "id": "grid",
  "name": "Grid",
  "apiNames": [
    "Grid"
  ],
  "imports": [
    "Grid",
    "Card"
  ],
  "description": "A grid primitive with fixed columns or responsive auto-fit tracks.",
  "usage": "<Grid minChildWidth=\"14rem\" gap={4}>\n  <Card>...</Card>\n  <Card>...</Card>\n</Grid>",
  "anatomy": [
    {
      "part": "Track container",
      "description": "A CSS grid root; children stretch to fill their cells by default."
    },
    {
      "part": "Fixed columns",
      "description": "columns pins an exact track count regardless of width."
    },
    {
      "part": "Auto-fit tracks",
      "description": "minChildWidth lets the browser add or drop tracks as the container changes size."
    },
    {
      "part": "Gap",
      "description": "Row and column spacing; numbers follow the spacing scale (n × 0.25rem), strings pass through as CSS lengths."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use minChildWidth for card collections that should reflow without any breakpoint code.",
      "Use columns when the design requires an exact track count, such as a strict three-up marketing row.",
      "Let children stretch so cards in a row share the same height."
    ],
    "donts": [
      "Don't combine columns and minChildWidth; pick one track strategy per grid.",
      "Don't use Grid for tightly packed unequal-height items; use Masonry.",
      "Don't nest a second Grid when a Stack would express the inner layout more simply."
    ]
  },
  "related": [
    "stack",
    "columns",
    "masonry"
  ],
  "examples": [
    {
      "title": "Responsive tracks",
      "description": "minChildWidth collapses columns automatically as the container narrows."
    },
    {
      "title": "Fixed column count",
      "description": "columns pins an exact track count for layouts that must hold their shape."
    }
  ],
  "guidance": {
    "useWhen": "Children distribute across columns, either a fixed track count or responsive auto-fit cards.",
    "avoidWhen": "Items flow in one line — use Stack; for tightly packed unequal heights, use Masonry.",
    "behavior": "columns pins an exact track count; minChildWidth switches to auto-fit tracks, and children stretch to fill their cells.",
    "responsive": "Auto-fit tracks collapse one by one as the container narrows, with no breakpoint code."
  }
}
