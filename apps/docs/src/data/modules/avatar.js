export default {
  "id": "avatar",
  "name": "Avatar",
  "apiNames": [
    "Avatar"
  ],
  "description": "A compact identity image with initials and icon fallbacks.",
  "usage": "<Avatar src=\"/users/avery.png\" name=\"Avery Chen\" />\n<Avatar name=\"Morgan\" size=\"sm\" />",
  "anatomy": [
    {
      "part": "Image",
      "description": "The photo shown when src loads; alt text defaults to the name."
    },
    {
      "part": "Initials fallback",
      "description": "Up to two uppercase letters derived from name when there is no image or the image fails to load."
    },
    {
      "part": "Icon fallback",
      "description": "A generic user glyph shown when neither src nor name is available."
    }
  ],
  "dosDonts": {
    "dos": [
      "Always pass name so the initials fallback and default alt text work.",
      "Pass alt=\"\" when the avatar repeats a name already shown next to it.",
      "Use AvatarGroup when several identities share one slot."
    ],
    "donts": [
      "Don't rely on the image always loading; a failed src swaps to initials by design.",
      "Don't make the avatar itself interactive; wrap it in a button or link if it must act."
    ]
  },
  "related": [
    "avatar-group",
    "list",
    "comment-thread"
  ],
  "examples": [
    {
      "title": "Sizes",
      "description": "Three sizes share the same image and initials fallback behavior."
    },
    {
      "title": "Fallback chain",
      "description": "Without src the initials render; without a name the generic user icon takes over."
    }
  ],
  "guidance": {
    "useWhen": "A person or entity needs a compact visual identity in lists, comments, or headers.",
    "avoidWhen": "The image is content rather than identity; use a plain img or LazyImage.",
    "behavior": "Falls back from image to two-letter initials to a generic user icon; a failed image load swaps to initials, and alt defaults to the name.",
    "responsive": "Fixed sm, md, and lg sizes; use sm in dense rows and lg in profile headers."
  }
}
