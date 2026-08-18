export default {
  "id": "date-picker",
  "name": "Date Picker",
  "apiNames": [
    "DatePicker"
  ],
  "description": "A date field with a keyboard-navigable popover: day, month, year, or datetime modes, plus two-click range selection.",
  "usage": "<DatePicker label=\"Start date\" onValueChange={(date) => undefined} />",
  "anatomy": [
    {
      "part": "Field",
      "description": "The button-like input showing the formatted date."
    },
    {
      "part": "Calendar popover",
      "description": "The month grid with full keyboard navigation."
    },
    {
      "part": "Month navigation",
      "description": "Previous and next buttons around an announced month label."
    },
    {
      "part": "Day cells",
      "description": "Grid buttons bounded by the min and max dates."
    }
  ],
  "dosDonts": {
    "dos": [
      "Set minDate and maxDate when only a planning window is valid.",
      "Explain what the date drives, like a milestone, in the description.",
      "Keep the caller-owned value as a Date, not a string."
    ],
    "donts": [
      "Don't stack two pickers for a range; set selection=\"range\".",
      "Don't expect free-typed input; the calendar is the parser.",
      "Don't disable dates silently; state the valid window in the description."
    ]
  },
  "related": [
    "calendar",
    "time-picker"
  ],
  "examples": [
    {
      "title": "Calendar selection",
      "description": "Arrows move between days, Enter selects, min and max bound the range."
    },
    {
      "title": "Bounded planning window",
      "description": "minDate and maxDate limit picking to the current sprint window."
    },
    {
      "title": "Month mode",
      "description": "mode=\"month\" shows twelve months with a year stepper and commits the first of the chosen month."
    },
    {
      "title": "Year mode",
      "description": "mode=\"year\" pages years by decade and commits January 1 of the chosen year."
    },
    {
      "title": "Date and time",
      "description": "mode=\"datetime\" pairs the day grid with time fields; the popover stays open until Done."
    },
    {
      "title": "Range selection",
      "description": "selection=\"range\" turns two clicks into {from, to}, with presets and a connected band between the endpoints."
    }
  ],
  "guidance": {
    "useWhen": "Users pick a calendar date, month, year, timestamp, or date range.",
    "avoidWhen": "The value is free-form text; use Input.",
    "behavior": "mode switches the popover between day, month, year, and datetime panels; selection=\"range\" turns two clicks into {from, to} with presets and a connected band.",
    "responsive": "The popover collision-handles; the field keeps its layout width."
  }
}
