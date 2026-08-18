export default {
  "id": "rich-text-editor",
  "name": "Rich Text Editor",
  "apiNames": [
    "RichTextEditor"
  ],
  "description": "A lightweight markdown editor whose toolbar formats the textarea selection, with an optional live preview pane.",
  "usage": "<RichTextEditor\n  label=\"Release notes\"\n  preview\n  defaultValue=\"## Highlights\n\n- Faster sync for **large workspaces**\"\n  onChange={(value) => undefined}\n/>",
  "anatomy": [
    {
      "part": "Toolbar",
      "description": "A labelled toolbar of format actions that wrap the current selection with markdown syntax."
    },
    {
      "part": "Textarea",
      "description": "The plain-text editing surface; the markdown source is the value."
    },
    {
      "part": "Preview pane",
      "description": "An optional labelled region rendering headings, lists, links, and inline marks as you type."
    },
    {
      "part": "Label",
      "description": "The visible label associated with the textarea."
    }
  ],
  "dosDonts": {
    "dos": [
      "Turn on the preview for long-form writing like release notes or docs.",
      "Store the markdown output as-is so it stays portable.",
      "Keep the default toolbar; it covers the marks the preview renders."
    ],
    "donts": [
      "Don't promise WYSIWYG behavior; editing stays in plain markdown.",
      "Don't use it for short plain answers; a TextArea is lighter."
    ]
  },
  "related": [
    "markdown-view",
    "input",
    "mention-input"
  ],
  "examples": [
    {
      "title": "Markdown toolbar",
      "description": "Bold, italic, heading, list, and link actions wrap the current selection with markdown syntax and restore the selection."
    },
    {
      "title": "Live preview",
      "description": "The preview pane renders headings, lists, links, and inline marks next to the textarea as you type."
    }
  ],
  "guidance": {
    "useWhen": "Users write formatted long-form text that should stay portable markdown, such as release notes, docs, or issue descriptions.",
    "avoidWhen": "Users expect WYSIWYG editing of rich content — that requires a contentEditable framework; for short plain answers use TextArea.",
    "behavior": "Editing stays in a plain textarea; toolbar actions toggle markdown markers around the selection or at the start of the selected lines and keep the selection usable afterwards.",
    "responsive": "The toolbar wraps within the editor width; the preview pane stacks below the textarea on narrow screens and sits beside it from md up."
  }
}
