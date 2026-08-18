export default {
  "id": "stat",
  "name": "Stat",
  "apiNames": [
    "Stat"
  ],
  "description": "A labeled metric with a trend delta and optional supporting content.",
  "usage": "<Stat\n  label=\"Monthly recurring revenue\"\n  value=\"$48.2k\"\n  delta={{ direction: 'up', value: '+12.4%' }}\n  description=\"vs. previous month\"\n/>",
  "anatomy": [
    {
      "part": "Label",
      "description": "Small muted text naming the metric."
    },
    {
      "part": "Value",
      "description": "The large figure in tabular numerals so updates don't shift layout."
    },
    {
      "part": "Delta",
      "description": "Trend icon plus change text; direction picks the icon and default tone unless tone overrides it."
    },
    {
      "part": "Supporting content",
      "description": "Optional description line or children such as a Sparkline below the value."
    }
  ],
  "dosDonts": {
    "dos": [
      "Pair the delta with a time reference like \"vs. previous month\" in the description.",
      "Override the delta tone when a downward trend is good news, such as falling incidents.",
      "Pass a Sparkline as children to show the trend behind the number."
    ],
    "donts": [
      "Don't rely on delta color alone; the direction prefix is what screen readers announce.",
      "Don't compare many categories with stats; use a chart or Table."
    ]
  },
  "related": [
    "sparkline",
    "meter",
    "loading"
  ],
  "examples": [
    {
      "title": "Trend delta",
      "description": "Direction picks the icon and default tone; assistive technology hears an explicit up or down prefix."
    },
    {
      "title": "With sparkline",
      "description": "Children render below the value, so a Sparkline can show the trend behind the delta."
    }
  ],
  "guidance": {
    "useWhen": "A dashboard surfaces one key metric with its trend at a glance.",
    "avoidWhen": "The data needs comparison across many categories; use a chart or Table.",
    "behavior": "The delta direction picks the icon and default tone — up is success, down is danger, flat is neutral — and tone overrides it when the semantics differ.",
    "responsive": "Value and delta wrap at the baseline on narrow widths; supporting content stacks below."
  }
}
