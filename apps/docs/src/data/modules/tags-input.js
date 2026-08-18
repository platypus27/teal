export default {
  "id": "tags-input",
  "name": "Tags Input",
  "apiNames": [
    "TagsInput"
  ],
  "description": "A token entry field that turns typed text into removable chips.",
  "usage": "const [tags, setTags] = useState(['design'])\n\n<TagsInput label=\"Add label\" value={tags} onChange={setTags} placeholder=\"Add a label…\" />",
  "anatomy": [
    {
      "part": "Field",
      "description": "The container hosting the committed chips and the draft input."
    },
    {
      "part": "Chips",
      "description": "Committed tokens with individual remove actions."
    },
    {
      "part": "Draft input",
      "description": "The inline text field where the next tag is typed."
    }
  ],
  "dosDonts": {
    "dos": [
      "Commit on Enter and comma so both habits work.",
      "Set max when the backend caps the list, and say so nearby.",
      "Keep tokens to one or two words so chips stay scannable."
    ],
    "donts": [
      "Don't use it for a fixed option set; use Combobox with multiple.",
      "Don't commit empty or whitespace-only tags.",
      "Don't expect fuzzy dedupe; exact duplicates are ignored, so normalize case before commit if needed."
    ]
  },
  "related": [
    "chip",
    "input",
    "combobox"
  ],
  "examples": [
    {
      "title": "Token entry",
      "description": "Enter or comma commits a tag; Backspace on an empty draft removes the last one."
    },
    {
      "title": "Capped list",
      "description": "max limits the reviewer list to three entries and the cap is stated nearby."
    }
  ],
  "guidance": {
    "useWhen": "A field collects an open-ended list of short tokens.",
    "avoidWhen": "Values come from a fixed set; use Combobox with multiple.",
    "behavior": "Enter or comma commits; duplicates are ignored and chips remove individually.",
    "responsive": "Chips wrap inside the field as the list grows."
  }
}
