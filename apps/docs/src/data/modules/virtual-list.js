export default {
  "id": "virtual-list",
  "name": "Virtual List",
  "apiNames": [
    "VirtualList"
  ],
  "description": "Renders only the visible slice of a large fixed-height list, keeping thousands of rows scrolling smoothly.",
  "usage": "<VirtualList\n  items={people}\n  itemHeight={36}\n  height={320}\n  label=\"Teammates\"\n  renderItem={(person) => <Row>{person.name}</Row>}\n/>",
  "anatomy": [
    {
      "part": "Viewport",
      "description": "The fixed-height scroll container that also serves as a keyboard tab stop."
    },
    {
      "part": "Spacer",
      "description": "The full-height sizer that keeps the scrollbar honest for the entire item count."
    },
    {
      "part": "Rendered window",
      "description": "The visible rows plus overscan, each reporting aria-posinset and aria-setsize."
    }
  ],
  "dosDonts": {
    "dos": [
      "Give the list a label and an explicit pixel height.",
      "Keep row heights fixed; itemHeight is a guarantee, not a hint.",
      "Use the index from renderItem for stable keys."
    ],
    "donts": [
      "Don't virtualize short lists; below a few dozen rows plain rendering is cheaper.",
      "Don't expect find-in-page or skip links to reach unmounted rows.",
      "Don't put expanding or variable-height rows inside."
    ]
  },
  "related": [
    "infinite-scroll",
    "table",
    "scroll-area"
  ],
  "examples": [
    {
      "title": "Compact roster",
      "description": "Five hundred rows scroll instantly because only the viewport window plus overscan is mounted in the DOM."
    },
    {
      "title": "Rich rows",
      "description": "renderItem receives the item and index, so rows can mix metadata, avatars, and actions freely."
    }
  ],
  "guidance": {
    "useWhen": "Lists of hundreds or thousands of equally-sized rows where mounting every row would slow the page down.",
    "avoidWhen": "Short lists, rows of varying height, or content that must be findable with browser find-in-page; use a plain List instead.",
    "behavior": "Guarantees a fixed itemHeight per row, renders overscan rows around the viewport, and reports aria-setsize and aria-posinset for the virtual window.",
    "responsive": "Takes an explicit pixel height; wrap it in a flexible container and compute the height if it must track the viewport."
  }
}
