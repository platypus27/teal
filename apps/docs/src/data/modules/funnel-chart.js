export default {
  "id": "funnel-chart",
  "name": "Funnel Chart",
  "apiNames": [
    "FunnelChart"
  ],
  "description": "SVG funnel of stages whose widths follow their values, with stage-to-stage conversion percentages.",
  "usage": "<FunnelChart\n  aria-label=\"Signup conversion funnel\"\n  stages={[\n    { name: \"Visited\", value: 10000 },\n    { name: \"Signed up\", value: 3200 },\n    { name: \"Paid\", value: 480 },\n  ]}\n/>",
  "anatomy": [
    {
      "part": "Stage band",
      "description": "Trapezoid whose top width scales to the stage value, fading lighter down the funnel."
    },
    {
      "part": "Stage label",
      "description": "Stage name and value centered inside each band."
    },
    {
      "part": "Conversion label",
      "description": "Stage-to-stage percentage in the gap between bands; hide with showPercentages."
    }
  ],
  "dosDonts": {
    "dos": [
      "Order stages from widest to narrowest; the metaphor assumes a shrinking pipeline.",
      "Write the aria-label as the takeaway, like 'Signup funnel converts 5% of visitors'.",
      "Keep it to three to six stages so the bands stay legible."
    ],
    "donts": [
      "Don't plot unordered categories; use BarChart or Table instead.",
      "Don't use it for parts of a whole; use PieChart.",
      "Don't compare two funnels without aligning stage counts and scales."
    ]
  },
  "related": [
    "bar-chart",
    "pie-chart",
    "chart-container"
  ],
  "examples": [
    {
      "title": "Conversion funnel",
      "description": "Classic four-stage signup funnel with conversion labels between stages."
    },
    {
      "title": "Long pipeline",
      "description": "A taller five-stage hiring pipeline showing the funnel scales to more stages."
    }
  ],
  "guidance": {
    "useWhen": "You need to show drop-off across an ordered pipeline, such as signups, checkouts, or hiring stages.",
    "avoidWhen": "Values are not strictly sequential stages; use a Meter, Stat, or Table instead.",
    "behavior": "Purely presentational: band widths scale to each stage value, each band carries a native title tooltip, and conversion percentages can be hidden with showPercentages.",
    "responsive": "Renders at the given width and height; reduce width at narrow viewports or wrap it in a scrollable container."
  }
}
