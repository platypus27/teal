export default {
  "id": "json-viewer",
  "name": "JSON Viewer",
  "apiNames": [
    "JsonViewer"
  ],
  "description": "Collapsible JSON tree with type-colored values, key-count summaries, and optional hover copy-path buttons.",
  "usage": "<JsonViewer\n  data={{ name: \"teal\", version: 5, tags: [\"design\", \"system\"] }}\n  copyable\n  defaultExpandedDepth={2}\n/>",
  "anatomy": [
    {
      "part": "Node toggle",
      "description": "Chevron button that expands or collapses an object or array, with aria-expanded."
    },
    {
      "part": "Key and value",
      "description": "Property name with a type-colored primitive: string, number, boolean, or null."
    },
    {
      "part": "Container summary",
      "description": "Collapsed nodes show a key or item count, like '{3 keys}'."
    },
    {
      "part": "Copy path button",
      "description": "Hover-revealed button that copies the node's JSON path to the clipboard."
    }
  ],
  "dosDonts": {
    "dos": [
      "Set defaultExpandedDepth so large payloads stay scannable on first render.",
      "Enable copyable when users report paths back, such as debugging configurations.",
      "Name the payload in the label, like 'Webhook payload'."
    ],
    "donts": [
      "Don't use it as an editor; it is read-only inspection.",
      "Don't render secrets you would not show as plain text; values display verbatim.",
      "Don't use it for streaming output; use LogViewer."
    ]
  },
  "related": [
    "code-block",
    "diff-viewer",
    "tree-view"
  ],
  "examples": [
    {
      "title": "Collapsible tree",
      "description": "Renders the root expanded and nested objects collapsed with per-node toggles and type-colored values."
    },
    {
      "title": "Copyable paths",
      "description": "Enables hover copy buttons that put the node's JSON path (like $.author.name) on the clipboard."
    }
  ],
  "guidance": {
    "useWhen": "API responses, configuration objects, or webhook payloads need to be inspectable without leaving the page.",
    "avoidWhen": "The user must edit the JSON rather than read it; use a code editor or form instead.",
    "behavior": "Nodes start expanded down to defaultExpandedDepth; toggling a container shows a summary of its key or item count while collapsed, and copyable adds a path-copy button to every row.",
    "responsive": "Scrolls horizontally inside its bordered pane when deeply nested lines exceed the available width."
  }
}
