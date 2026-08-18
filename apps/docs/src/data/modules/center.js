export default {
  "id": "center",
  "name": "Center",
  "apiNames": [
    "Center"
  ],
  "description": "Centers children horizontally and vertically inside their box, with an inline option for flow content.",
  "usage": "<Center\n  className=\"h-40\"\n>\n  <Spinner />\n</Center>",
  "anatomy": [
    {
      "part": "Center box",
      "description": "A flex container with both axes centered; its size comes from the caller's className."
    },
    {
      "part": "Inline option",
      "description": "Switches to inline-flex so the box shrinks to its content inside running text."
    },
    {
      "part": "Child",
      "description": "The single element or cluster being centered, such as a spinner or empty-state graphic."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use it for empty states and loading spinners inside bounded areas.",
      "Give the area a height through className so the centering is visible.",
      "Use the inline option to center badges or icons within a line of text."
    ],
    "donts": [
      "Don't use Center to arrange several children with spacing; use Flex or Stack.",
      "Don't center long-form content; keep body text left-aligned for readability.",
      "Don't add alignment utilities on the child that fight the centering."
    ]
  },
  "related": [
    "empty-state",
    "box",
    "flex"
  ],
  "examples": [
    {
      "title": "Block centering",
      "description": "A fixed-height area centers a single child on both axes, the classic empty or loading state box."
    },
    {
      "title": "Inline centering",
      "description": "The inline option shrinks the box to its content so badges center inside running text."
    }
  ],
  "guidance": {
    "useWhen": "A single child or cluster must sit exactly in the middle of a bounded area, such as an empty-state panel.",
    "avoidWhen": "You are arranging several children with spacing or distribution; Flex covers that without manual classes.",
    "behavior": "Center only applies display flex with both alignments; sizing comes from the caller's className.",
    "responsive": "Centering is intrinsic and adapts to whatever size the parent gives the box at each breakpoint."
  }
}
