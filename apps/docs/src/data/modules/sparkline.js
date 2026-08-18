export default {
  "id": "sparkline",
  "name": "Sparkline",
  "apiNames": [
    "Sparkline"
  ],
  "description": "A tiny inline trend chart in line, area, or bar form with an accessible summary.",
  "usage": "<Sparkline aria-label=\"Sign-ups trending up\" data={[4, 8, 6, 12, 9, 14]} variant=\"area\" />",
  "anatomy": [
    {
      "part": "Trend shape",
      "description": "A line, filled area, or one bar per data point, drawn in the primary color and scaled to the data's min/max range."
    },
    {
      "part": "Accessible label",
      "description": "role=\"img\" carrying the required aria-label that summarizes the trend."
    },
    {
      "part": "Hidden summary",
      "description": "Visually hidden text stating the min, max, and last values."
    }
  ],
  "dosDonts": {
    "dos": [
      "Write an aria-label that states the takeaway, like \"Sign-ups trending up\".",
      "Use the bar variant for discrete counts such as deploys per day.",
      "Pair with a Stat when the exact current figure matters."
    ],
    "donts": [
      "Don't plot multiple series in one sparkline; use LineChart instead.",
      "Don't use it where users need exact values or axes; it is a glanceable trend only."
    ]
  },
  "related": [
    "stat",
    "line-chart",
    "meter"
  ],
  "examples": [
    {
      "title": "Trends at a glance",
      "description": "role=\"img\" carries the label; a visually hidden min, max, and last summary backs it up."
    },
    {
      "title": "Bars and falling trends",
      "description": "The bar variant suits discrete daily counts; the area variant reads well for a falling trend."
    }
  ],
  "guidance": {
    "useWhen": "A compact trend belongs inline next to a metric, in a table cell, or inside a Stat.",
    "avoidWhen": "Users need exact values, axes, or several series; use LineChart or BarChart.",
    "behavior": "Values scale to the data's min/max range; a flat series centers the line and a single value renders a dot.",
    "responsive": "Fixed pixel width and height by design; size it to the slot it accompanies."
  }
}
