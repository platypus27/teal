export default {
  "id": "list",
  "name": "List",
  "apiNames": [
    "List",
    "ListItem"
  ],
  "description": "A vertical item list with leading and trailing slots, secondary text, and a dense mode.",
  "usage": "<List>\n  <ListItem leading={<Folder />} title=\"Reports\" secondary=\"12 files\" trailing=\"2 GB\" />\n  <ListItem title=\"Archive\" onClick={() => undefined} />\n</List>",
  "anatomy": [
    {
      "part": "Leading slot",
      "description": "An icon or avatar rendered before the text at a fixed width."
    },
    {
      "part": "Text block",
      "description": "A semibold title with an optional muted secondary line; both truncate."
    },
    {
      "part": "Trailing slot",
      "description": "Metadata or an action pinned to the end of the row."
    },
    {
      "part": "Row",
      "description": "A hairline-separated li that becomes a full-width button when onClick is set."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use onClick rows instead of small inline buttons so the whole row is the target.",
      "Switch on dense in side panels and other space-tight contexts.",
      "Keep secondary text to one short line; it truncates beyond that."
    ],
    "donts": [
      "Don't nest additional interactive elements inside an onClick row.",
      "Don't use List for site navigation; use a navigation component with a nav landmark."
    ]
  },
  "related": [
    "table",
    "tree-view",
    "menu"
  ],
  "examples": [
    {
      "title": "Slots and actions",
      "description": "onClick turns the row into a button; dense tightens every item."
    },
    {
      "title": "Dense actions",
      "description": "A dense list of clickable rows for compact file or settings pickers."
    },
    {
      "title": "Dense lists",
      "description": "Use dense inside popovers and panels where vertical space is tight."
    }
  ],
  "guidance": {
    "useWhen": "A vertical set of items carries icons, secondary text, or trailing metadata, like files or settings entries.",
    "avoidWhen": "The items are navigation; use a navigation component. Records needing columns fit Table better.",
    "behavior": "onClick turns the whole row into a button; dense reduces the vertical padding of every item.",
    "responsive": "Titles and secondary text truncate while leading and trailing slots stay pinned."
  }
}
