export default {
  "id": "copy-button",
  "name": "Copy Button",
  "apiNames": [
    "CopyButton"
  ],
  "description": "A button that copies a value to the clipboard and confirms with an icon swap and live feedback.",
  "usage": "<CopyButton value=\"npm install @kryv/teal\" />",
  "anatomy": [
    {
      "part": "Trigger button",
      "description": "The native button that performs the clipboard write; renders as a full button or icon-only."
    },
    {
      "part": "State icon",
      "description": "The copy icon that briefly swaps to a check after a successful copy."
    },
    {
      "part": "Label",
      "description": "The visible text (accessible name in iconOnly mode) that switches to copiedLabel on success."
    },
    {
      "part": "Live region",
      "description": "A visually hidden role=\"status\" region that announces the copy result."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use iconOnly next to code snippets and identifiers in dense rows.",
      "Set label and copiedLabel to name the specific value, like \"Copy API key\".",
      "Trim whitespace from the value before passing it so pastes are exact."
    ],
    "donts": [
      "Don't use it for editable text; use an Input with a copy action instead.",
      "Don't label it generically \"Copy\" when several copy buttons share a row.",
      "Don't copy secrets silently; make clear in the label what lands on the clipboard."
    ]
  },
  "related": [
    "code-block",
    "input",
    "button"
  ],
  "examples": [
    {
      "title": "Copy feedback",
      "description": "The label swaps to the copied text briefly and announces through a hidden live region."
    },
    {
      "title": "Icon-only copy",
      "description": "iconOnly fits next to inline code; the label prop becomes the accessible name."
    },
    {
      "title": "Icon-only copy",
      "description": "iconOnly fits copy actions inside table rows and code headers."
    }
  ],
  "guidance": {
    "useWhen": "A value such as a command or id is copied often.",
    "avoidWhen": "The value is editable; use an Input with a copy recipe.",
    "behavior": "Clipboard failures still give feedback; a hidden live region announces the copy.",
    "responsive": "iconOnly mode fits dense rows and headers."
  }
}
