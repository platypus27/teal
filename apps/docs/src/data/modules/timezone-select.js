export default {
  "id": "timezone-select",
  "name": "Timezone Select",
  "apiNames": [
    "TimezoneSelect"
  ],
  "description": "A searchable select over a curated set of IANA timezones with UTC offset labels.",
  "usage": "<TimezoneSelect\n  label=\"Workspace time zone\"\n  value={zone}\n  onValueChange={setZone}\n/>",
  "anatomy": [
    {
      "part": "Combobox input",
      "description": "The filterable field, built on Combobox, that shows the chosen city with its UTC offset."
    },
    {
      "part": "Option list",
      "description": "Roughly thirty curated IANA zones, each labeled with its current offset."
    },
    {
      "part": "Selected value",
      "description": "The IANA zone id, such as Europe/Berlin, emitted for direct storage."
    }
  ],
  "dosDonts": {
    "dos": [
      "Store the IANA id, not the offset; offsets change with daylight saving.",
      "Default to the detected zone so most users never open the list.",
      "Keep offsets visible to disambiguate cities that share a name."
    ],
    "donts": [
      "Don't use it when the full IANA database is required; build on Combobox with custom options.",
      "Don't sort or label zones by fixed offsets; labels follow the current offset."
    ]
  },
  "related": [
    "combobox",
    "select",
    "date-picker"
  ],
  "examples": [
    {
      "title": "Searchable timezone list",
      "description": "Typing a city name filters roughly thirty common IANA zones, each labeled with its current UTC offset."
    },
    {
      "title": "Controlled selection",
      "description": "The value is the IANA zone id, so it can be stored directly and shown back to the user."
    }
  ],
  "guidance": {
    "useWhen": "People schedule or display times across regions and need a recognizable zone with its offset visible.",
    "avoidWhen": "The full IANA database is required; this curated list covers common zones, so build on Combobox with custom options instead.",
    "behavior": "Filtering matches the city label, selection reports the IANA zone id, and the input shows the city with its UTC offset.",
    "responsive": "The input fills its container and the option list overlays below it at the same width."
  }
}
