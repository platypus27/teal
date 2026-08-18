export default {
  "id": "number-ticker",
  "name": "Number Ticker",
  "apiNames": [
    "NumberTicker"
  ],
  "description": "Animates a number toward its target with a requestAnimationFrame count-up and a pluggable formatter.",
  "usage": "<NumberTicker\n  value={revenue}\n  duration={1200}\n  formatter={(v) => currency.format(v)}\n/>",
  "anatomy": [
    {
      "part": "Value readout",
      "description": "The inline span with tabular numerals rendering each animation frame."
    },
    {
      "part": "Formatted output",
      "description": "The formatter prop shapes every frame, such as whole-dollar currency."
    }
  ],
  "dosDonts": {
    "dos": [
      "Format every frame with the formatter prop, for example as currency.",
      "Keep the count-up near a second so it reads as a flourish, not a wait.",
      "Pair the number with a static label so the value has meaning."
    ],
    "donts": [
      "Don't animate values that update many times per second.",
      "Don't use it in dense tables; render the formatted value directly.",
      "Don't rely on the animation for comprehension; reduced-motion users see the final value instantly."
    ]
  },
  "related": [
    "stat",
    "countdown-timer",
    "meter"
  ],
  "examples": [
    {
      "title": "Live counter",
      "description": "A stat eases up from zero on mount and counts smoothly to each new value as data arrives."
    },
    {
      "title": "Formatted currency",
      "description": "The formatter prop shapes every intermediate frame, here as whole-dollar US currency."
    }
  ],
  "guidance": {
    "useWhen": "Dashboard stats and KPIs where a short count-up draws attention to a fresh value.",
    "avoidWhen": "Values that change many times per second or dense tables of numbers; render the formatted value directly to avoid motion noise.",
    "behavior": "Eases from the current displayed value to the new target over duration, calls onComplete at the end, and jumps instantly under prefers-reduced-motion.",
    "responsive": "An inline span with tabular numerals; sizing and layout come entirely from the parent."
  }
}
