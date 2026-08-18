export default {
  "id": "chart-container",
  "name": "Chart Container",
  "apiNames": [
    "ChartContainer",
    "ChartAxis",
    "ChartGrid",
    "ChartLegend"
  ],
  "description": "Accessible SVG frame for hand-rolled charts with an aria-label summary, a toggleable screen-reader data table, and reusable axis, grid, and legend primitives.",
  "usage": "<ChartContainer\n  label=\"Visits per weekday\"\n  columns={[\n    { key: 'day', label: 'Day' },\n    { key: 'visits', label: 'Visits' },\n  ]}\n  data={rows}\n>\n  <ChartGrid positions={[40, 90, 140]} start={44} end={404} />\n  <ChartAxis orientation=\"x\" offset={190} start={44} end={404} ticks={ticks} />\n</ChartContainer>",
  "anatomy": [
    {
      "part": "Labelled SVG",
      "description": "The role=\"img\" frame named by the label prop, scaling with its viewBox."
    },
    {
      "part": "Chart content",
      "description": "Whatever SVG children you draw inside the frame."
    },
    {
      "part": "Axis, grid, and legend primitives",
      "description": "ChartAxis, ChartGrid, and ChartLegend, all aria-hidden so only the summary and table carry information."
    },
    {
      "part": "Data table",
      "description": "A visually hidden table built from columns and data, revealed by a toggle button exposing aria-expanded."
    }
  ],
  "dosDonts": {
    "dos": [
      "Write the label as the chart's takeaway, not just its type.",
      "Always pass columns and data so screen-reader users get the exact values.",
      "Reuse ChartAxis, ChartGrid, and ChartLegend so bespoke charts match the built-in ones."
    ],
    "donts": [
      "Don't hand-roll a chart type the library already ships; use LineChart, BarChart, or PieChart.",
      "Don't put unlabeled interactive elements inside the SVG."
    ]
  },
  "related": [
    "line-chart",
    "bar-chart"
  ],
  "examples": [
    {
      "title": "Custom chart content",
      "description": "Any SVG markup can be drawn inside the frame; the container supplies the accessible summary and the hidden data table with its toggle."
    },
    {
      "title": "Axis, grid, and legend primitives",
      "description": "ChartAxis, ChartGrid, and ChartLegend compose inside the container so bespoke charts share the same ticks, gridlines, and swatches as the built-in charts."
    }
  ],
  "guidance": {
    "useWhen": "You are building a chart type the library does not ship, or you want full control over the SVG while keeping an accessible summary and data table.",
    "avoidWhen": "A standard line, area, bar, or pie chart fits the data; use LineChart, BarChart, or PieChart, which wrap this container already.",
    "behavior": "Renders the SVG with role=\"img\" and the label as its accessible name; the data table stays visually hidden for screen readers until the toggle reveals it, and its visibility can be controlled.",
    "responsive": "The SVG scales down with max-width while keeping its viewBox proportions; the data table and legend wrap below the chart on narrow screens."
  }
}
