export default {
  "id": "color-picker",
  "name": "Color Picker",
  "apiNames": [
    "ColorPicker"
  ],
  "description": "A swatch trigger with preset colors and a validated hex field.",
  "usage": "<ColorPicker label=\"Brand color\" defaultValue=\"#006a6c\" onChange={(value) => undefined} />",
  "anatomy": [
    {
      "part": "Trigger",
      "description": "The swatch button that shows the current color and opens the panel."
    },
    {
      "part": "Preset grid",
      "description": "Named swatches that commit immediately on activation."
    },
    {
      "part": "Hex field",
      "description": "The validated input that normalizes #rgb and #rrggbb on Enter or blur."
    }
  ],
  "dosDonts": {
    "dos": [
      "Name presets so each choice is announced by more than its color.",
      "Curate presets to the palette users should actually pick from.",
      "Accept typed hex when brand precision matters."
    ],
    "donts": [
      "Don't use it as a theme editor; it is a single-value picker.",
      "Don't rely on the swatch alone; keep the value text visible for verification.",
      "Don't reject shorthand hex; normalize it instead of erroring."
    ]
  },
  "related": [
    "input",
    "popover",
    "field"
  ],
  "examples": [
    {
      "title": "Presets and hex",
      "description": "Presets commit immediately; the hex field normalizes #rgb and #rrggbb on Enter or blur."
    },
    {
      "title": "Live preview",
      "description": "A controlled value mirrored on a swatch so the picked color previews in context."
    },
    {
      "title": "Controlled color",
      "description": "Pair value with onChange when the color drives other UI."
    }
  ],
  "guidance": {
    "useWhen": "The user picks a color from presets or a hex value.",
    "avoidWhen": "A full design-token editor is required.",
    "behavior": "Presets commit immediately; hex input validates and normalizes on Enter or blur.",
    "responsive": "The trigger fits toolbars; the panel caps at the preset grid width."
  }
}
