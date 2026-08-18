export default {
  "id": "pie-chart",
  "name": "Pie Chart",
  "apiNames": [
    "PieChart"
  ],
  "description": "SVG pie and donut chart with keyboard-focusable segments, percentage labels, a legend, and a built-in accessible data table.",
  "usage": "<PieChart\n  label=\"Budget share per department\"\n  data={[\n    { name: 'Engineering', value: 45 },\n    { name: 'Design', value: 20 },\n    { name: 'Marketing', value: 25 },\n  ]}\n  innerRadius={0.6}\n/>",
  "anatomy": [
    {
      "part": "Segment",
      "description": "Focusable path per positive value, sweeping clockwise from the top."
    },
    {
      "part": "Percentage label",
      "description": "Text drawn on segments of five percent or larger, hidden from assistive tech."
    },
    {
      "part": "Donut hole",
      "description": "innerRadius carves the center out as a fraction of the outer radius."
    },
    {
      "part": "Legend and data table",
      "description": "Color-keyed legend plus a toggleable, visually hidden table of values and shares."
    }
  ],
  "dosDonts": {
    "dos": [
      "Limit it to about five segments; merge the tail into 'Other'.",
      "Order segments meaningfully, largest first, since the sweep starts at the top.",
      "Keep the legend or labels visible so every segment is named."
    ],
    "donts": [
      "Don't compare similar-sized values; angles deceive, so use BarChart.",
      "Don't pass zero or negative values expecting a slice; they are skipped.",
      "Don't stack multiple pies for comparison; use a stacked BarChart or Table."
    ]
  },
  "related": [
    "bar-chart",
    "chart-container",
    "gauge-chart"
  ],
  "examples": [
    {
      "title": "Pie with labels and legend",
      "description": "Segments are drawn clockwise from the top with percentage labels on any slice large enough to fit them, plus a color-keyed legend."
    },
    {
      "title": "Donut",
      "description": "innerRadius sets the hole as a fraction of the outer radius, turning the pie into a donut while keeping the same labels and keyboard support."
    }
  ],
  "guidance": {
    "useWhen": "Showing a small set of parts that make up a whole, where rough proportions matter more than exact comparison.",
    "avoidWhen": "Comparing more than about five segments or values of similar size; angles are hard to judge, so use a BarChart instead.",
    "behavior": "Segments are tab stops and arrow keys cycle focus between them with Home and End jumping to the first and last; each segment announces its name, value, and percentage. Non-positive values are skipped.",
    "responsive": "The square SVG scales down proportionally with its container while the legend wraps below; percentage labels drop off segments under five percent."
  }
}
