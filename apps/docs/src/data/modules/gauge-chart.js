export default {
  "id": "gauge-chart",
  "name": "Gauge Chart",
  "apiNames": [
    "GaugeChart"
  ],
  "description": "Semicircle SVG gauge with min/max scale, threshold zones, and a centered value label.",
  "usage": "<GaugeChart\n  aria-label=\"Latency score\"\n  value={64}\n  label=\"Latency score\"\n  thresholds={[{ upTo: 50 }, { upTo: 80 }, { upTo: 100 }]}\n/>",
  "anatomy": [
    {
      "part": "Track",
      "description": "Semicircular arc showing the full min–max scale, split into threshold zones when provided."
    },
    {
      "part": "Value arc",
      "description": "Filled arc clamped to the scale and colored by the active threshold zone."
    },
    {
      "part": "Scale labels",
      "description": "Min and max values printed at the arc ends."
    },
    {
      "part": "Value readout",
      "description": "Raw value and optional caption centered beneath the arc."
    }
  ],
  "dosDonts": {
    "dos": [
      "Label threshold zones so the accessible summary can name them.",
      "Keep the scale honest: min and max should bound the realistic values.",
      "Pair with a Stat when the exact number matters more than the zone."
    ],
    "donts": [
      "Don't compare several KPIs with a row of gauges; use BarChart or a Stat list.",
      "Don't exceed three or four zones; more become indistinguishable along the arc.",
      "Don't rely on zone color alone for status; the caption should carry the meaning."
    ]
  },
  "related": [
    "meter",
    "loading",
    "stat"
  ],
  "examples": [
    {
      "title": "Threshold zones",
      "description": "Value arc colored by the active zone, with the zones drawn along the track."
    },
    {
      "title": "Plain and custom scales",
      "description": "A zoneless gauge plus a gauge with a custom min/max range."
    }
  ],
  "guidance": {
    "useWhen": "You need a single KPI against a known scale with qualitative zones, such as latency scores or capacity.",
    "avoidWhen": "You compare several values or trends; use Stat, Meter, or Sparkline instead.",
    "behavior": "Purely presentational: the value arc clamps to the min–max range while the center text always shows the raw value.",
    "responsive": "Renders at the given width and height; shrink width at narrow viewports since the radius derives from it."
  }
}
