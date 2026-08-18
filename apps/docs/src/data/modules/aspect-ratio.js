export default {
  "id": "aspect-ratio",
  "name": "Aspect Ratio",
  "apiNames": [
    "AspectRatio"
  ],
  "description": "Keeps media or content at a consistent width-to-height ratio.",
  "usage": "<AspectRatio ratio={16 / 9}>\n  <img src=\"/charts/usage.png\" alt=\"Weekly usage chart\" />\n</AspectRatio>",
  "anatomy": [
    {
      "part": "Ratio box",
      "description": "Reserves the width-to-height ratio before content loads, preventing layout shift."
    },
    {
      "part": "Content",
      "description": "The media or element that fills the box and is clipped with rounded corners."
    }
  ],
  "dosDonts": {
    "dos": [
      "Pick the ratio from the media itself: 16/9 for video, 1/1 for avatars and map tiles, 4/3 for photos.",
      "Reserve space for media that has not loaded yet so the page does not jump.",
      "Give images real alt text; the ratio wrapper is purely presentational."
    ],
    "donts": [
      "Don't force a ratio on text or mixed content that should size naturally.",
      "Don't set fixed heights inside; the ratio owns the height and the content gets clipped.",
      "Don't crop dashboards or charts without checking how the ratio cuts them at narrow widths."
    ]
  },
  "related": [
    "lazy-image",
    "card",
    "grid"
  ],
  "examples": [
    {
      "title": "Consistent media",
      "description": "The box holds its ratio while content stays clipped with rounded corners."
    },
    {
      "title": "Square media",
      "description": "ratio={1} holds square thumbnails such as avatar crops and map tiles."
    },
    {
      "title": "Media placeholders",
      "description": "Reserve space for media that has not loaded to avoid layout shift."
    }
  ],
  "guidance": {
    "useWhen": "Media or embeds must hold a consistent shape across widths, like 16/9 video or square thumbnails.",
    "avoidWhen": "Text or mixed content should size naturally; forcing a ratio clips or starves it.",
    "behavior": "The wrapper reserves the ratio before content loads, preventing layout shift, and clips overflow with rounded corners.",
    "responsive": "The box scales with its container while holding the ratio, so no per-breakpoint sizing is needed."
  }
}
