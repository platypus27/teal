export default {
  "id": "slider",
  "name": "Slider",
  "apiNames": [
    "Slider"
  ],
  "description": "A numeric value scrubber with an optional live value readout; range mode adds a second thumb for low/high pairs.",
  "usage": "<Slider label=\"Notification volume\" defaultValue={60} showValue />",
  "anatomy": [
    {
      "part": "Track",
      "description": "The rail that spans the full range."
    },
    {
      "part": "Range",
      "description": "The filled portion from the minimum up to the thumb."
    },
    {
      "part": "Thumb",
      "description": "The draggable handle exposing slider semantics and value attributes."
    },
    {
      "part": "Value readout",
      "description": "Optional live text mirror of the value, enabled with showValue."
    }
  ],
  "dosDonts": {
    "dos": [
      "Enable showValue when the exact number matters.",
      "Constrain the slider width in the layout so the track stays scannable.",
      "Pick min, max, and step that match meaningful stops for the value."
    ],
    "donts": [
      "Don't use a slider for precise entry; pair it with or use NumberInput.",
      "Don't use one for unbounded values; sliders need a known range.",
      "Don't rely on track color alone to carry meaning."
    ]
  },
  "related": [
    "number-input",
    "rating",
    "meter"
  ],
  "examples": [
    {
      "title": "Value selection",
      "description": "Pointer and keyboard both adjust the value; showValue mirrors it as text."
    },
    {
      "title": "Description and disabled",
      "description": "A described quota slider beside a disabled one that keeps its layout."
    },
    {
      "title": "Range selection",
      "description": "range adds a second thumb for a low/high pair; thumbLabels give each end an accessible name."
    },
    {
      "title": "Bounded ranges",
      "description": "Set min, max, and step when the meaningful range is narrower than 0–100."
    }
  ],
  "guidance": {
    "useWhen": "A value inside a known range is more natural to scrub than to type.",
    "avoidWhen": "Precision matters more than speed; pair with or use Input instead.",
    "behavior": "Pointer and keyboard adjust the value and showValue mirrors it live.",
    "responsive": "The track fills its container width, so constrain it in the layout."
  }
}
