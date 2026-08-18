export default {
  "id": "highlight-text",
  "name": "Highlight Text",
  "apiNames": [
    "HighlightText"
  ],
  "description": "Wraps every case-insensitive match of a query in a styled mark element.",
  "usage": "<HighlightText\n  text=\"Audit report for Q3\"\n  query=\"report\"\n/>",
  "anatomy": [
    {
      "part": "Base text",
      "description": "The original string, split around each match with casing preserved."
    },
    {
      "part": "Match marks",
      "description": "Each case-insensitive match wrapped in a styled mark element."
    }
  ],
  "dosDonts": {
    "dos": [
      "Pass the raw user query; regex characters are treated as literal text.",
      "Highlight the same query across every result row so matches scan consistently.",
      "Keep the mark styling prominent enough to notice in dense lists."
    ],
    "donts": [
      "Don't use it for rich or nested markup; it operates on plain strings.",
      "Don't render it when the query is empty; nothing gets marked anyway.",
      "Don't reimplement per-field split logic; reuse the component wherever matches are shown."
    ]
  },
  "related": [
    "input",
    "combobox",
    "truncated-text"
  ],
  "examples": [
    {
      "title": "Inline highlight",
      "description": "Highlights a term inside a sentence, preserving the original casing of each match."
    },
    {
      "title": "Search results",
      "description": "Applies the highlight across a list of result titles so the typed query stands out in every row."
    }
  ],
  "guidance": {
    "useWhen": "Search, filter, or find-in-page UIs need to show why a result matched by highlighting the query inside the text.",
    "avoidWhen": "There is no query to emphasize, or the text is rich content; use plain text or a typography component instead.",
    "behavior": "Matches case-insensitively, treats regex characters in the query as literal text, preserves the full original string, and renders nothing marked when the query is empty.",
    "responsive": "Renders an inline span that flows with surrounding text at any width."
  }
}
