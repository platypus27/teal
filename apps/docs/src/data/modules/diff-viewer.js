export default {
  "id": "diff-viewer",
  "name": "Diff Viewer",
  "apiNames": [
    "DiffViewer"
  ],
  "description": "Line-based diff view with added/removed/context coloring, a +/- gutter, and old/new line numbers.",
  "usage": "<DiffViewer\n  label=\"config.js changes\"\n  oldValue={before}\n  newValue={after}\n/>",
  "anatomy": [
    {
      "part": "Line number gutters",
      "description": "Dual old/new columns; a number appears only on lines that exist in that version."
    },
    {
      "part": "Change marker",
      "description": "+ / - / space sign column, tinted per line type and hidden from assistive tech."
    },
    {
      "part": "Line content",
      "description": "Monospace code line with a row tint per type and a visually hidden Added/Removed/Unchanged prefix."
    }
  ],
  "dosDonts": {
    "dos": [
      "Pass hunks when the diff already comes from git or a server instead of re-diffing strings.",
      "Give the label the file or change name, like 'config.js changes', so the group is usefully named.",
      "Leave lineNumbers on for anything longer than a handful of lines."
    ],
    "donts": [
      "Don't use it as an editor; it is a read-only review surface.",
      "Don't drop all context lines; unchanged lines are what frame the change.",
      "Don't diff very large files inline; summarize and link out past a few hundred lines."
    ]
  },
  "related": [
    "code-block",
    "json-viewer",
    "log-viewer"
  ],
  "examples": [
    {
      "title": "From two strings",
      "description": "Computes the line diff itself from oldValue and newValue, including dual line-number gutters."
    },
    {
      "title": "Pre-computed hunks",
      "description": "Accepts explicit add/remove/context lines, useful when the diff comes from git or a server."
    }
  ],
  "guidance": {
    "useWhen": "A config change, file edit, or generated output needs a compact before/after review inline in the page.",
    "avoidWhen": "Users must edit or comment on individual lines; use a full code review surface instead.",
    "behavior": "Given oldValue/newValue it computes a line-level LCS diff; given hunks it renders them verbatim. Added lines are tinted primary, removed lines error, and screen readers hear an Added/Removed/Unchanged prefix per line.",
    "responsive": "Scrolls horizontally within its bordered pane so long lines never break the layout."
  }
}
