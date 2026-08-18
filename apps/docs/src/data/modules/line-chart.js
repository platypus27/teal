export default {
  "id": "line-chart",
  "name": "Line Chart",
  "apiNames": [
    "LineChart"
  ],
  "description": "Multi-series SVG line chart with axis ticks, focusable points, simple or custom tooltips, a legend, and a built-in accessible data table. type=\"area\" fills under each series, with adjustable fill opacity and a stacked mode for part-to-whole trends.",
  "usage": "<LineChart\n  label=\"Revenue and costs per month\"\n  labels={['Jan', 'Feb', 'Mar', 'Apr']}\n  series={[\n    { name: 'Revenue', data: [42, 55, 48, 61] },\n    { name: 'Costs', data: [30, 34, 32, 38] },\n  ]}\n/>",
  "anatomy": [
    {
      "part": "Axes and grid",
      "description": "Y ticks from a nice-number scale (baseline includes zero unless all values are negative); x ticks from the category labels."
    },
    {
      "part": "Series line",
      "description": "One polyline per series in a palette or custom color."
    },
    {
      "part": "Point markers",
      "description": "Focusable circles that enlarge on hover or focus and show a title or renderTooltip content."
    },
    {
      "part": "Legend and data table",
      "description": "Color-keyed legend below the chart plus a toggleable, visually hidden data table."
    }
  ],
  "dosDonts": {
    "dos": [
      "Keep it to about four series so lines stay distinguishable.",
      "Use renderTooltip when values need units or formatting beyond the default title.",
      "Write the label as the chart's takeaway; it is the SVG accessible name."
    ],
    "donts": [
      "Don't use it for unordered category comparisons; use BarChart.",
      "Don't disable showPoints when keyboard users must read values; the points are the tab stops.",
      "Don't exceed a dozen x labels; they collide at small widths."
    ]
  },
  "related": [
    "sparkline",
    "chart-container"
  ],
  "examples": [
    {
      "title": "Multi-series with legend",
      "description": "Each series gets a palette color, a legend entry, and focusable points with simple title tooltips; axes and grid lines come from shared primitives."
    },
    {
      "title": "Custom tooltip",
      "description": "renderTooltip replaces the simple title with a floating tooltip fed the hovered or focused point, its series, and its coordinates."
    },
    {
      "title": "Single series area",
      "description": "type=\"area\" adds a translucent fill under the line to emphasize volume over time; opacity controls how much of the grid shows through."
    },
    {
      "title": "Stacked area series",
      "description": "stacked accumulates area series on top of each other so the top edge reads as the total; tooltips and the data table keep the raw per-series values."
    }
  ],
  "guidance": {
    "useWhen": "Showing trends over ordered categories or time for one or more series, where the shape of change matters more than individual values. Use type=\"area\" when magnitude or cumulative volume should be emphasized, with stacked for parts of a changing total.",
    "avoidWhen": "Comparing discrete categories where lengths read better than slopes; use a BarChart, or a Sparkline for an inline glanceable trend.",
    "behavior": "Points are hoverable and keyboard-focusable; hovering or focusing a point enlarges it and shows either a simple SVG title or the renderTooltip content. The y axis always includes zero unless every value is negative. When type=\"area\" is stacked, points sit at their cumulative position while tooltips and the data table report raw values.",
    "responsive": "The SVG scales down proportionally with its container while the legend and data table wrap below; keep label counts small on narrow screens."
  }
}
