export default {
  "id": "markdown-view",
  "name": "Markdown View",
  "apiNames": [
    "MarkdownView"
  ],
  "description": "Renders a safe markdown subset — headings, emphasis, links, lists, code, and quotes — as teal-styled elements with no raw HTML.",
  "usage": "<MarkdownView\n  content={\"## Release notes\\n\\nShips the **parser rewrite**.\\n\\n- Faster tokens\\n- Inline `diff`\"}\n/>",
  "anatomy": [
    {
      "part": "Headings",
      "description": "Markdown levels 1-6 mapped onto the teal type scale."
    },
    {
      "part": "Inline formatting",
      "description": "Bold, italic, inline code, and sanitized links inside paragraphs, quotes, and list items."
    },
    {
      "part": "Lists and quotes",
      "description": "Disc and decimal lists plus a primary-bordered blockquote."
    },
    {
      "part": "Code blocks",
      "description": "Fenced blocks rendered verbatim in a horizontally scrolling pre."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use it for trusted, simple CMS or user content like release notes and comments.",
      "Test the exact markdown authors write; the parser covers a deliberate subset.",
      "Prefer it over dangerouslySetInnerHTML; raw HTML never renders as markup."
    ],
    "donts": [
      "Don't feed it full GFM (tables, footnotes, task lists); unsupported syntax shows as plain text.",
      "Don't rely on link schemes beyond http(s), mailto, root-relative, or hash; others render as text.",
      "Don't use it as an editor; pair a composer with this display-only renderer."
    ]
  },
  "related": [
    "rich-text-editor",
    "code-block",
    "link"
  ],
  "examples": [
    {
      "title": "Prose content",
      "description": "Headings, bold and italic text, lists, a blockquote, and a safe link rendered with teal typography."
    },
    {
      "title": "Code and sanitizing",
      "description": "Fenced code blocks render verbatim, and raw HTML in the source shows up as literal text rather than markup."
    }
  ],
  "guidance": {
    "useWhen": "User- or CMS-authored markdown (release notes, comments, doc snippets) needs lightweight rendering without a dependency.",
    "avoidWhen": "Full CommonMark/GFM fidelity (tables, footnotes, nested emphasis) is required; use a dedicated markdown pipeline instead.",
    "behavior": "Parses a hand-rolled subset — headings, bold, italic, links, lists, inline code, fenced code blocks, blockquotes, and rules — and never renders raw HTML; links only get an href for http(s), mailto, root-relative, or hash targets.",
    "responsive": "Flows as a single column of block elements; long code blocks scroll horizontally inside their container."
  }
}
