export default {
  "id": "floating-toolbar",
  "name": "Floating Toolbar",
  "apiNames": [
    "FloatingToolbar"
  ],
  "description": "A floating contextual toolbar that appears near a selection or anchored element, with roving tabindex and arrow-key navigation.",
  "usage": "<FloatingToolbar open={hasSelection} className=\"left-1/2 top-2 -translate-x-1/2\">\n  <button aria-label=\"Bold\"><Bold /></button>\n  <button aria-label=\"Italic\"><Italic /></button>\n  <button aria-label=\"Underline\"><Underline /></button>\n</FloatingToolbar>",
  "anatomy": [
    {
      "part": "Toolbar",
      "description": "Floating toolbar surface positioned by the caller near its anchor."
    },
    {
      "part": "Controls",
      "description": "Caller-supplied buttons reached with arrow keys through a roving tabindex."
    }
  ],
  "dosDonts": {
    "dos": [
      "Render it only while its context exists; pass open={hasSelection}.",
      "Label every icon-only button with aria-label."
    ],
    "donts": [
      "Don't use it for always-visible controls; use Toolbar.",
      "Don't trap focus; it stays a single tab stop with arrow-key movement."
    ]
  },
  "related": [
    "toolbar",
    "menu",
    "dock"
  ],
  "examples": [
    {
      "title": "Selection formatting",
      "description": "Anchored above highlighted text with the classic bold, italic, and underline controls."
    },
    {
      "title": "Custom action set",
      "description": "Any buttons work inside; the toolbar manages focus movement across whatever controls it contains."
    }
  ],
  "guidance": {
    "useWhen": "Actions apply to a transient context such as a text selection or a hovered row and should appear right next to it.",
    "avoidWhen": "The controls are always visible in a fixed region of the screen; use Toolbar instead and skip the positioning.",
    "behavior": "Renders nothing while open is false; when shown it is a single tab stop whose controls are reached with arrow keys, Home, and End, skipping disabled controls.",
    "responsive": "Positioning comes from className or style, so the anchor logic decides placement; keep it inside the viewport near the selection."
  }
}
