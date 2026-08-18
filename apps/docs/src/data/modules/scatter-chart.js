export default {
  "id": "scatter-chart",
  "name": "Scatter Chart",
  "apiNames": [
    "ScatterChart"
  ],
  "description": "Hand-rolled SVG scatter plot with x/y axes, multi-series dots, and optional size encoding.",
  "usage": "<ScatterChart\n  aria-label=\"Latency by payload size\"\n  series={[{ name: \"Baseline\", data: [{ x: 12, y: 40 }, { x: 24, y: 55 }] }]}\n  xAxisLabel=\"Payload (KB)\"\n  yAxisLabel=\"Latency (ms)\"\n/>",
  "anatomy": [
    {
      "part": "Axes",
      "description": "X and Y lines with min/max tick labels and optional axis captions."
    },
    {
      "part": "Point",
      "description": "Palette-colored dot per data point with a tooltip of its x, y or a custom label."
    },
    {
      "part": "Size encoding",
      "description": "Optional mapping of a third value to dot radius via sizeEncoding."
    }
  ],
  "dosDonts": {
    "dos": [
      "Add xAxisLabel and yAxisLabel with units; bare min/max ticks lack context.",
      "Provide point labels when individual points represent named entities.",
      "Keep it to two or three series so the color groups stay readable."
    ],
    "donts": [
      "Don't use it for ordered time trends; LineChart connects the dots better.",
      "Don't enable sizeEncoding without explaining nearby what the radius means.",
      "Don't plot thousands of points; it is one SVG node per dot."
    ]
  },
  "related": [
    "line-chart",
    "chart-container",
    "heatmap"
  ],
  "examples": [
    {
      "title": "Multi-series comparison",
      "description": "Two series plotted against shared axes with palette-colored dots and per-point tooltips."
    },
    {
      "title": "Size-encoded bubbles",
      "description": "A third numeric dimension mapped to dot radius via the sizeEncoding prop."
    }
  ],
  "guidance": {
    "useWhen": "You need to show correlation or distribution between two numeric variables, optionally weighted by a third.",
    "avoidWhen": "Values are categorical or time-ordered trends; use Sparkline or Table instead.",
    "behavior": "Purely presentational: axes scale to the data domain, each dot carries a native title tooltip, and an sr-only summary lists the series.",
    "responsive": "Renders at the given width and height; wrap it in a horizontally scrollable container at narrow widths."
  }
}
