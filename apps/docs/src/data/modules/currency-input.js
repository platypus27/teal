export default {
  "id": "currency-input",
  "name": "Currency Input",
  "apiNames": [
    "CurrencyInput"
  ],
  "description": "A numeric amount field with a leading currency symbol that formats the value with Intl.NumberFormat on blur.",
  "usage": "<CurrencyInput\n  label=\"Invoice total\"\n  currency=\"USD\"\n  locale=\"en-US\"\n  defaultValue={1234.5}\n  onChange={(amount) => console.log(amount)}\n/>",
  "anatomy": [
    {
      "part": "Label",
      "description": "The visible label associated with the amount field."
    },
    {
      "part": "Currency symbol",
      "description": "A fixed-width leading addon derived from the currency code; decorative and hidden from assistive technology."
    },
    {
      "part": "Amount input",
      "description": "A decimal text field that emits the parsed number and reformats with Intl.NumberFormat on blur."
    },
    {
      "part": "Help or error text",
      "description": "Optional description, for example the min and max limits, linked with aria-describedby."
    }
  ],
  "dosDonts": {
    "dos": [
      "Set the currency and locale from the user's account, not the server's location.",
      "Clamp with min and max when a budget or limit exists, and say so in the description.",
      "Store the emitted number, not the formatted display string."
    ],
    "donts": [
      "Don't use it for values without a currency; use NumberInput.",
      "Don't use one field for multi-currency entry; pair a currency Select with the amount."
    ]
  },
  "related": [
    "number-input",
    "masked-input",
    "input-group"
  ],
  "examples": [
    {
      "title": "Currency and locale",
      "description": "The symbol and fraction digits follow the currency code, while grouping and separators follow the locale."
    },
    {
      "title": "Clamped budget",
      "description": "min and max clamp the committed amount on blur, and a description explains the limits."
    }
  ],
  "guidance": {
    "useWhen": "The user enters a monetary amount in a known currency, such as prices, budgets, or invoice totals.",
    "avoidWhen": "The value is a plain number without a currency; use NumberInput instead. For multi-currency entry, pair a Select with NumberInput.",
    "behavior": "Emits the parsed number on every edit (undefined when emptied) and formats the display with Intl.NumberFormat on blur, clamping to min/max.",
    "responsive": "The field stretches to fill its container; the leading symbol addon stays a fixed width."
  }
}
