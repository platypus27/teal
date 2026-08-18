export default {
  "id": "box",
  "name": "Box",
  "apiNames": [
    "Box"
  ],
  "description": "The lowest-level layout primitive: a polymorphic box with spacing props, leaving surfaces and colors to className.",
  "usage": "<Box\n  p={4}\n  className=\"teal-u-rounded-xl teal-u-bg-surface-container\"\n>\n  Content\n</Box>",
  "anatomy": [
    {
      "part": "Element",
      "description": "The rendered tag; div by default, swapped through the as prop."
    },
    {
      "part": "Spacing props",
      "description": "Padding and margin shorthands that follow the spacing scale; axis values override the all-sides value."
    },
    {
      "part": "Surface",
      "description": "Colors, radius and shadows arrive through className tokens, not Box props."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use the as prop to give the wrapper a meaningful landmark or grouping element.",
      "Reach for Box for one-off spacing wrappers instead of writing a bespoke utility class.",
      "Apply surface and color tokens through className utilities."
    ],
    "donts": [
      "Don't arrange multiple children with Box; Flex or Stack expresses that intent.",
      "Don't combine Box margins with a parent's gap; the spacing doubles up.",
      "Don't use Box where a named component like Card or Section already exists."
    ]
  },
  "related": [
    "flex",
    "stack",
    "container"
  ],
  "examples": [
    {
      "title": "Spacing and surface",
      "description": "Numeric padding follows the spacing scale while surface tokens arrive through className."
    },
    {
      "title": "Semantic element",
      "description": "The as prop swaps the rendered tag, here a centered section with per-axis spacing."
    }
  ],
  "guidance": {
    "useWhen": "You need a one-off wrapper with spacing and surface styling and want to avoid writing a bespoke class.",
    "avoidWhen": "You are arranging multiple children along an axis; Flex or Stack expresses that intent better.",
    "behavior": "Box renders no styling of its own beyond the spacing props; axis values (px, py, mx, my) override the all-sides value.",
    "responsive": "Spacing props are static; combine Box with responsive Tailwind classes for breakpoint-dependent layouts."
  }
}
