export default {
  "id": "radar-chart",
  "name": "Radar Chart",
  "apiNames": [
    "RadarChart"
  ],
  "description": "SVG radar (spider) chart that overlays multi-series polygons across a shared set of axes.",
  "usage": "<RadarChart\n  aria-label=\"Skill profiles\"\n  axes={[\"Frontend\", \"Backend\", \"Testing\", \"DevOps\"]}\n  series={[{ name: \"Ada\", values: [5, 3, 4, 2] }]}\n/>",
  "anatomy": [
    {
      "part": "Axes",
      "description": "Spokes from the center, one per dimension, starting at the top and going clockwise."
    },
    {
      "part": "Grid rings",
      "description": "Concentric polygons marking scale steps up to the shared max."
    },
    {
      "part": "Series polygon",
      "description": "Translucent filled outline per series with a native title tooltip of its values."
    },
    {
      "part": "Axis labels",
      "description": "Dimension names placed just outside each spoke."
    }
  ],
  "dosDonts": {
    "dos": [
      "Keep axes commensurable (same units or normalized scores) and pass max explicitly.",
      "Stay at three to eight axes; labels collide beyond that.",
      "Limit it to two or three series; overlapping fills get muddy fast."
    ],
    "donts": [
      "Don't use it for precise value reading; use Table.",
      "Don't mix unnormalized units like revenue with percentages on one chart.",
      "Don't use it for time series; use LineChart."
    ]
  },
  "related": [
    "bar-chart",
    "line-chart",
    "table"
  ],
  "examples": [
    {
      "title": "Multi-series comparison",
      "description": "Two overlapping polygons make relative strengths across axes easy to compare."
    },
    {
      "title": "Single profile with fixed scale",
      "description": "One series against an explicit max with a ring per scale step."
    }
  ],
  "guidance": {
    "useWhen": "You compare multivariate profiles, such as skill matrices or product trade-offs, on a shared scale.",
    "avoidWhen": "Axes are not commensurable or you need precise value reading; use a Table or Stat list instead.",
    "behavior": "Purely presentational: values scale to the shared max (or the data max), each series polygon carries a native title tooltip, and an sr-only summary lists every value.",
    "responsive": "Renders as a fixed-size square; shrink the size prop at narrow viewports."
  }
}
