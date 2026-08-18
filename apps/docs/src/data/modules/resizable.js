export default {
  "id": "resizable",
  "name": "Resizable",
  "apiNames": [
    "ResizablePanelGroup",
    "ResizablePanel",
    "ResizableHandle"
  ],
  "imports": [
    "ResizablePanelGroup",
    "ResizablePanel",
    "ResizableHandle"
  ],
  "description": "Pointer- and keyboard-resizable panes with percentage sizing and double-click reset.",
  "usage": "<ResizablePanelGroup direction=\"horizontal\">\n  <ResizablePanel defaultSize={30}>Sidebar</ResizablePanel>\n  <ResizableHandle />\n  <ResizablePanel>Content</ResizablePanel>\n</ResizablePanelGroup>",
  "anatomy": [
    {
      "part": "Panel group",
      "description": "Owns the direction and distributes percentage sizes across its panels."
    },
    {
      "part": "Panel",
      "description": "A sized region with defaultSize plus minSize and maxSize clamps in percent."
    },
    {
      "part": "Handle",
      "description": "The separator between two panels; drags with the pointer, steps with arrow keys, and resets on double-click."
    }
  ],
  "dosDonts": {
    "dos": [
      "Set minSize on every panel so a pane can never crush its content.",
      "Keep panel content scrollable so small sizes stay usable.",
      "Use direction=\"vertical\" for stacked summary-and-detail splits."
    ],
    "donts": [
      "Don't make a layout resizable without a real user need; fixed layouts are simpler and have fewer focus stops.",
      "Don't pack many panels into one group; nest groups for complex shells instead.",
      "Don't remove the handle from the tab order; it is the keyboard user's only way to resize."
    ]
  },
  "related": [
    "app-shell",
    "scroll-area"
  ],
  "examples": [
    {
      "title": "Split panes",
      "description": "The handle exposes separator semantics with arrow-key steps and aria-valuenow."
    },
    {
      "title": "Vertical split",
      "description": "direction=\"vertical\" stacks panes top to bottom with the same drag and keyboard behavior."
    },
    {
      "title": "Vertical stacks",
      "description": "direction=\"vertical\" splits panes top to bottom with the same handle behavior."
    }
  ],
  "guidance": {
    "useWhen": "Users genuinely benefit from adjusting the split between panes, such as sidebar-and-content consoles.",
    "avoidWhen": "The layout is fixed or the split is decorative; unneeded interaction adds focus stops and complexity.",
    "behavior": "Handles drag with the pointer, step by a percentage with arrow keys, and reset on double-click; sizes are percentages clamped by minSize and maxSize.",
    "responsive": "Set minSize so panes stay usable on narrow screens, and consider locking the split below a breakpoint."
  }
}
