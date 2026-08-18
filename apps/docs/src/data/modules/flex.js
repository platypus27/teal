export default {
  "id": "flex",
  "name": "Flex",
  "apiNames": [
    "Flex"
  ],
  "description": "A flex container primitive with direction, gap, alignment and distribution props; defaults to a horizontal row.",
  "usage": "<Flex\n  gap={3}\n  align=\"center\"\n  justify=\"between\"\n>\n  <span>Label</span>\n  <Button>Action</Button>\n</Flex>",
  "anatomy": [
    {
      "part": "Flex container",
      "description": "A display-flex root; direction defaults to row."
    },
    {
      "part": "Direction",
      "description": "row, row-reverse, column or column-reverse along the main axis."
    },
    {
      "part": "Alignment and distribution",
      "description": "align and justify map to align-items and justify-content."
    },
    {
      "part": "Wrap",
      "description": "Lets rows flow onto multiple lines when space runs out."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use justify=\"between\" for label-plus-action toolbar rows.",
      "Enable wrap for tag rows and button groups that must survive narrow widths.",
      "Use the as prop when the grouping has semantics, such as nav or a list."
    ],
    "donts": [
      "Don't use Flex for a plain evenly spaced stack; Stack is the more specific choice.",
      "Don't reverse the direction when that would make visual order contradict the DOM reading order.",
      "Don't duplicate the gap with margins on children."
    ]
  },
  "related": [
    "stack",
    "grid",
    "box"
  ],
  "examples": [
    {
      "title": "Row with distribution",
      "description": "Children spread across the row with wrapping enabled, the common toolbar and tag-row shape."
    },
    {
      "title": "Column direction",
      "description": "The same container stacks children vertically with consistent gaps and start alignment."
    }
  ],
  "guidance": {
    "useWhen": "Children need one-dimensional arrangement with control over direction, wrapping, alignment and distribution.",
    "avoidWhen": "You only need an evenly spaced vertical or horizontal stack; Stack is the simpler, more specific choice.",
    "behavior": "Flex maps props to flexbox values and merges any caller className and style, so one-off overrides stay possible.",
    "responsive": "Wrap lets rows collapse onto multiple lines; pair with responsive classes when direction itself must change per breakpoint."
  }
}
