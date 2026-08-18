export default {
  "id": "code-block",
  "name": "Code Block",
  "apiNames": [
    "CodeBlock"
  ],
  "description": "A code panel with a language label, optional line numbers, and copy-to-clipboard.",
  "usage": "<CodeBlock language=\"bash\" code=\"npm install @kryv/teal\" />",
  "anatomy": [
    {
      "part": "Language label",
      "description": "The header tag naming the language of the snippet."
    },
    {
      "part": "Code",
      "description": "The preformatted, horizontally scrolling content with optional line numbers."
    },
    {
      "part": "Copy button",
      "description": "The clipboard action that confirms with a check icon for two seconds."
    }
  ],
  "dosDonts": {
    "dos": [
      "Set the language so readers know what they are looking at.",
      "Turn on line numbers for longer snippets people will reference.",
      "Keep snippets self-contained and runnable."
    ],
    "donts": [
      "Don't paste secrets, tokens, or real credentials into examples.",
      "Don't use a code block for a single identifier in prose; use inline code."
    ]
  },
  "related": [
    "kbd",
    "markdown-view",
    "log-viewer"
  ],
  "examples": [
    {
      "title": "Copy affordance",
      "description": "The copy button confirms with a check icon for two seconds."
    },
    {
      "title": "Line numbers",
      "description": "Enable line numbers for walkthroughs that reference specific lines."
    }
  ],
  "guidance": {
    "useWhen": "Code or commands should be readable and copyable.",
    "avoidWhen": "A single identifier in prose; use inline code styling.",
    "behavior": "The copy action confirms with an icon swap and announces via its label; long code regions are keyboard focusable.",
    "responsive": "Long lines scroll horizontally instead of wrapping."
  }
}
