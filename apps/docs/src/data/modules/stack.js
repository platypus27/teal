export default {
  "id": "stack",
  "name": "Stack",
  "apiNames": [
    "Stack"
  ],
  "imports": [
    "Stack",
    "Badge"
  ],
  "description": "A flex primitive that stacks children along one axis with consistent spacing and alignment.",
  "usage": "<Stack direction=\"row\" gap={4} align=\"center\">\n  <Badge variant=\"success\">Ready</Badge>\n  <Badge>Paused</Badge>\n</Stack>",
  "anatomy": [
    {
      "part": "Container",
      "description": "A flex root that lays children out along one axis; direction defaults to column."
    },
    {
      "part": "Gap",
      "description": "Even spacing between children; numbers follow the spacing scale (n × 0.25rem), strings pass through as CSS lengths."
    },
    {
      "part": "Alignment",
      "description": "align and justify map to cross-axis and main-axis flexbox values."
    },
    {
      "part": "Wrap",
      "description": "An optional flag that lets a row flow onto multiple lines."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use numeric gaps from the spacing scale so the rhythm stays consistent with the rest of the UI.",
      "Combine wrap with direction=\"row\" for toolbars and tag rows that must survive narrow widths.",
      "Nest Stacks to compose simple two-axis layouts before reaching for Grid."
    ],
    "donts": [
      "Don't use Stack for two-dimensional track layouts; use Grid or Columns.",
      "Don't space children with margin utilities; set gap on the Stack so spacing stays uniform.",
      "Don't expect equal-width cells; Stack children size to their content."
    ]
  },
  "related": [
    "flex",
    "grid",
    "box"
  ],
  "examples": [
    {
      "title": "Axis and spacing",
      "description": "Numeric gaps follow the spacing scale; direction, align, justify, and wrap map to flexbox."
    },
    {
      "title": "Vertical rhythm",
      "description": "The default column direction stacks header, content, and footer blocks with even spacing."
    },
    {
      "title": "Wrapping rows",
      "description": "wrap lets a row flow onto multiple lines on narrow screens."
    }
  ],
  "guidance": {
    "useWhen": "Children flow along one axis with even spacing, from toolbar rows to page-level vertical rhythm.",
    "avoidWhen": "The layout needs two-dimensional tracks or equal-width cells; use Grid or Columns.",
    "behavior": "Numeric gaps follow the spacing scale (n × 0.25rem); direction, align, justify and wrap map straight to flexbox, and the as prop can swap the rendered element.",
    "responsive": "Combine wrap with row direction so toolbars reflow onto multiple lines; switch direction per breakpoint through responsive classes."
  }
}
