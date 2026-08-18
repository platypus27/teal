export default {
  "id": "meter",
  "name": "Meter",
  "apiNames": [
    "Meter"
  ],
  "description": "A scalar gauge for a known range with optimum-zone coloring.",
  "usage": "<Meter label=\"Storage used\" value={72} low={60} high={85} optimum={20} />",
  "anatomy": [
    {
      "part": "Label and readout",
      "description": "Heading text and formatted value on one row; the label names the meter through aria-labelledby."
    },
    {
      "part": "Track",
      "description": "Rounded container bar that holds the fill."
    },
    {
      "part": "Zone fill",
      "description": "Colored fill whose tone maps the value against low, high, and optimum into neutral, success, warning, or danger."
    }
  ],
  "dosDonts": {
    "dos": [
      "Set low, high, and optimum together so the zone colors mean something.",
      "Use formatValue for units such as GB; it also feeds the accessible value text."
    ],
    "donts": [
      "Don't use Meter for task completion; use Progress.",
      "Don't pass only one or two thresholds; without all three the fill stays neutral."
    ]
  },
  "related": [
    "loading",
    "stat"
  ],
  "examples": [
    {
      "title": "Zones",
      "description": "low, high, and optimum map the value onto neutral, success, warning, and danger fills."
    },
    {
      "title": "Custom formatting",
      "description": "formatValue renders units such as GB in the readout and the accessible value text."
    }
  ],
  "guidance": {
    "useWhen": "A quantity within a known range needs a glanceable gauge.",
    "avoidWhen": "Progress toward completing a task is shown; use Progress.",
    "behavior": "role=\"meter\" carries min, max, and now; zones color the fill from low, high, and optimum.",
    "responsive": "The track fills its container, so constrain width in the layout."
  }
}
