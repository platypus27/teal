export default {
  "id": "avatar-group",
  "name": "Avatar Group",
  "apiNames": [
    "AvatarGroup"
  ],
  "description": "An overlapping identity stack with an overflow count.",
  "usage": "<AvatarGroup names={[\"Avery Chen\", \"Morgan Reyes\", \"Riley Okafor\"]} />",
  "anatomy": [
    {
      "part": "Avatar stack",
      "description": "Overlapping Avatars with a surface ring keeping each identity separate."
    },
    {
      "part": "Overflow bubble",
      "description": "A +N count for hidden members, aria-hidden because the group label already names everyone."
    },
    {
      "part": "Group label",
      "description": "role=\"group\" with an aria-label joining every name, so overflowed members are still announced."
    }
  ],
  "dosDonts": {
    "dos": [
      "Lower max in dense contexts like table rows so the stack stays compact.",
      "Order names by relevance; the tail collapses into the overflow bubble."
    ],
    "donts": [
      "Don't repeat the member list next to the group; the accessible label already exposes it.",
      "Don't use a group for a single identity; use Avatar."
    ]
  },
  "related": [
    "avatar",
    "list",
    "tooltip"
  ],
  "examples": [
    {
      "title": "Overflow",
      "description": "Past max, a +N bubble summarizes the rest; the group label lists everyone."
    },
    {
      "title": "Compact overflow",
      "description": "size=\"sm\" with a low max collapses the rest into a small +N bubble."
    },
    {
      "title": "Compact stacks",
      "description": "Use the small size and a lower max inside table rows."
    }
  ],
  "guidance": {
    "useWhen": "Several identities belong to one row or card.",
    "avoidWhen": "One identity needs emphasis; use Avatar.",
    "behavior": "Overflow collapses into a +N bubble; the group label names everyone.",
    "responsive": "Lower max in dense contexts like tables."
  }
}
