export default {
  "id": "bar-chart",
  "name": "Bar Chart",
  "apiNames": [
    "BarChart"
  ],
  "description": "Grouped SVG bar chart with vertical or horizontal bars, optional value labels, a legend, and a built-in accessible data table.",
  "usage": "<BarChart\n  label=\"Revenue and costs per quarter\"\n  labels={['Q1', 'Q2', 'Q3', 'Q4']}\n  series={[\n    { name: 'Revenue', data: [42, 55, 48, 61] },\n    { name: 'Costs', data: [30, 34, 32, 38] },\n  ]}\n  showValues\n/>",
  "anatomy": [
    {
      "part": "Chart frame",
      "description": "The shared container with the accessible summary and the hidden data table behind a toggle."
    },
    {
      "part": "Bar groups",
      "description": "One group per category with side-by-side bars per series, starting from a zero baseline."
    },
    {
      "part": "Value labels",
      "description": "Optional exact values above each bar, or at the end of the bar in horizontal mode."
    },
    {
      "part": "Legend",
      "description": "Palette swatches naming each series below the chart."
    }
  ],
  "dosDonts": {
    "dos": [
      "Switch to orientation=\"horizontal\" when category names are long.",
      "Turn on showValues when exact numbers matter more than the visual comparison.",
      "Keep the legend visible whenever there is more than one series."
    ],
    "donts": [
      "Don't plot many ordered categories; a LineChart reads better as a trend.",
      "Don't rely on bar color alone to identify series; the legend and tooltips carry the names."
    ]
  },
  "related": [
    "line-chart",
    "chart-container"
  ],
  "examples": [
    {
      "title": "Grouped vertical bars",
      "description": "Multiple series render side-by-side per category with palette colors, a legend, and optional value labels above each bar."
    },
    {
      "title": "Horizontal bars",
      "description": "orientation=\"horizontal\" swaps the axes so long category names read comfortably and values label the end of each bar."
    }
  ],
  "guidance": {
    "useWhen": "Comparing discrete categories against each other, especially with a few series per category or when exact values deserve labels.",
    "avoidWhen": "Showing a continuous trend over many ordered points; a LineChart reads better as categories multiply.",
    "behavior": "Bars start from a zero baseline, carry a simple title tooltip with series, category, and value, and group evenly within each category band; horizontal mode mirrors the same data.",
    "responsive": "The SVG scales down proportionally; horizontal orientation is the better fit when category labels are long or screens are narrow."
  }
}
