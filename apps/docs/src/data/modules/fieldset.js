export default {
  "id": "fieldset",
  "name": "Fieldset",
  "apiNames": [
    "Fieldset"
  ],
  "imports": [
    "Fieldset",
    "Field",
    "Input"
  ],
  "description": "A semantic fieldset/legend group for related fields, with optional help text linked to the whole group.",
  "usage": "<Fieldset legend=\"Shipping address\">\n  <Field label=\"Street\" required>\n    <Input />\n  </Field>\n</Fieldset>",
  "anatomy": [
    {
      "part": "Fieldset",
      "description": "The native grouping element; setting disabled on it disables every control inside."
    },
    {
      "part": "Legend",
      "description": "Names the group so screen readers announce it when focus enters any field."
    },
    {
      "part": "Description",
      "description": "Optional help text for the whole group, linked with aria-describedby."
    },
    {
      "part": "Children",
      "description": "The related Fields or controls, laid out in a single-column grid by default."
    }
  ],
  "dosDonts": {
    "dos": [
      "Group controls that together answer one question, like an address block.",
      "Keep the legend short; it is repeated before every field inside.",
      "Nest Field components inside so labels and errors still work per control."
    ],
    "donts": [
      "Don't wrap a single control in a Fieldset; Field alone is enough.",
      "Don't use Fieldset as a visual card for unrelated content; use Card."
    ]
  },
  "related": [
    "field",
    "form",
    "card"
  ],
  "examples": [
    {
      "title": "Grouping fields",
      "description": "Related Fields sit under one legend so the group is announced as a unit."
    },
    {
      "title": "Group description",
      "description": "Help text below the legend is linked to the fieldset with aria-describedby."
    }
  ],
  "guidance": {
    "useWhen": "Several controls together answer one question, such as an address block or a set of related checkboxes.",
    "avoidWhen": "A single labeled control is enough; use Field on its own instead.",
    "behavior": "The legend names the group for assistive technology; the disabled attribute disables every control inside, as native fieldsets do.",
    "responsive": "Children lay out in a single-column grid; add your own grid classes inside for multi-column rows."
  }
}
