export default {
  "id": "calendar",
  "name": "Calendar",
  "apiNames": [
    "Calendar"
  ],
  "description": "A month grid for picking a single date with bounds and disabled days.",
  "usage": "const [date, setDate] = useState(new Date())\n\n<Calendar value={date} onSelect={setDate} />",
  "anatomy": [
    {
      "part": "Month header",
      "description": "Previous and next IconButtons around an aria-live month-and-year label that announces navigation."
    },
    {
      "part": "Weekday row",
      "description": "Locale narrow weekday names, aria-hidden so only the day buttons are read."
    },
    {
      "part": "Day grid",
      "description": "Forty-two day buttons covering six weeks; outside-month days are dimmed and out-of-bounds days are disabled."
    },
    {
      "part": "Selection and today",
      "description": "The selected day exposes aria-pressed; today exposes aria-current=\"date\" with a primary ring."
    }
  ],
  "dosDonts": {
    "dos": [
      "Set min and max for booking-style flows so out-of-range days render disabled.",
      "Control visibleMonth when the calendar must sync with external navigation.",
      "Explain the disabling rule nearby when disabledDates rejects days."
    ],
    "donts": [
      "Don't use Calendar for ranges; use DatePicker with selection=\"range\".",
      "Don't run expensive work in disabledDates; it runs once per rendered day."
    ]
  },
  "related": [
    "date-picker"
  ],
  "examples": [
    {
      "title": "Date grid",
      "description": "min, max, and disabledDates constrain selection; the month label announces changes."
    },
    {
      "title": "Bounded range",
      "description": "min and max constrain selection to the next thirty days; out-of-range days render disabled."
    }
  ],
  "guidance": {
    "useWhen": "Users pick a single date from a month grid, optionally bounded by min, max, or a disabledDates predicate.",
    "avoidWhen": "The user needs a range or a field with a popover; use DatePicker.",
    "behavior": "Days are buttons with aria-pressed for the selection and aria-current=\"date\" for today; the aria-live month label announces navigation, and the visible month can be controlled.",
    "responsive": "The grid keeps a fixed seven-column width; place it in a popover or panel on small screens."
  }
}
