export default {
  "id": "calendar-heatmap",
  "name": "Calendar Heatmap",
  "apiNames": [
    "CalendarHeatmap"
  ],
  "description": "GitHub-style year calendar heatmap with weeks-by-weekday cells, a 0–4 level color scale, and month labels.",
  "usage": "<CalendarHeatmap\n  aria-label=\"Commit activity in 2025\"\n  year={2025}\n  data={[{ date: \"2025-03-14\", level: 3 }]}\n/>",
  "anatomy": [
    {
      "part": "Day cells",
      "description": "One rect per day of the year, filled by a 0–4 level and carrying a title tooltip with the date and level."
    },
    {
      "part": "Week columns",
      "description": "Days arranged as weeks-by-weekday in the GitHub style, growing left to right."
    },
    {
      "part": "Month labels",
      "description": "Text labels above the columns where each new month starts."
    },
    {
      "part": "Accessible summary",
      "description": "role=\"img\" with the aria-label, backed by a visually hidden active-day count."
    }
  ],
  "dosDonts": {
    "dos": [
      "Pass ISO date strings; days without an entry fall back to level 0.",
      "Wrap the heatmap in a horizontally scrollable container on narrow screens.",
      "Use it for one year's daily activity such as commits, deploys, or streaks."
    ],
    "donts": [
      "Don't use it for an arbitrary two-dimensional matrix; use Heatmap.",
      "Don't invent levels beyond 0–4; the color scale is fixed."
    ]
  },
  "related": [
    "heatmap",
    "calendar",
    "sparkline"
  ],
  "examples": [
    {
      "title": "Year of activity",
      "description": "A full year grid with deterministic activity levels and per-day tooltips."
    },
    {
      "title": "Leap year",
      "description": "The same view for a leap year, showing the grid adapts to 366 days."
    }
  ],
  "guidance": {
    "useWhen": "You need a daily activity overview for a whole year, such as commits, deploys, or streaks.",
    "avoidWhen": "You need a two-dimensional matrix with custom row labels; use Heatmap instead.",
    "behavior": "Purely presentational: missing dates render as level 0, levels clamp to 0–4, and every day cell carries a native title tooltip.",
    "responsive": "The year grid is intrinsically wide; wrap it in a horizontally scrollable container at narrow widths."
  }
}
