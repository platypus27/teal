export default {
  "id": "time-picker",
  "name": "Time Picker",
  "apiNames": [
    "TimePicker"
  ],
  "description": "A segmented hour and minute field with 12- and 24-hour cycles.",
  "usage": "<TimePicker label=\"Start time\" defaultValue=\"09:30\" onChange={(value) => undefined} />",
  "anatomy": [
    {
      "part": "Group",
      "description": "The labeled container with group semantics around the segments."
    },
    {
      "part": "Hour field",
      "description": "The clamped hour segment labeled Hour."
    },
    {
      "part": "Minute field",
      "description": "The clamped minute segment labeled Minutes."
    },
    {
      "part": "Period toggle",
      "description": "The AM/PM switch shown with the 12-hour cycle."
    }
  ],
  "dosDonts": {
    "dos": [
      "Match hourCycle to the audience's locale.",
      "Bind a string value like 09:30 and let the segments clamp while typing.",
      "Pair with DatePicker; its datetime mode covers full timestamps."
    ],
    "donts": [
      "Don't use it for durations; use NumberInput with a unit.",
      "Don't use it for time zones; pair with TimezoneSelect.",
      "Don't prefill the current time unless now is a sensible default."
    ]
  },
  "related": [
    "date-picker",
    "timezone-select",
    "number-input"
  ],
  "examples": [
    {
      "title": "Segmented time",
      "description": "Fields clamp as you type; the 12-hour cycle adds an AM/PM toggle."
    },
    {
      "title": "12-hour clock",
      "description": "hourCycle={12} swaps the hour range and adds an AM/PM toggle."
    }
  ],
  "guidance": {
    "useWhen": "The user enters a time of day.",
    "avoidWhen": "A date or a date range is needed; use DatePicker.",
    "behavior": "Hour and minute fields clamp while typing; the 12-hour cycle adds a period toggle.",
    "responsive": "The segmented group stays inline and fits compact forms."
  }
}
