export default {
  "id": "lazy-image",
  "name": "Lazy Image",
  "apiNames": [
    "LazyImage"
  ],
  "description": "Defers an image request until it nears the viewport, showing a placeholder and fading the image in on load.",
  "usage": "<LazyImage\n  src=\"/charts/signups.png\"\n  alt=\"Bar chart of quarterly signups\"\n  width={640}\n  height={360}\n/>",
  "anatomy": [
    {
      "part": "Wrapper",
      "description": "The sized box observed against the rootMargin threshold."
    },
    {
      "part": "Placeholder",
      "description": "A pulsing surface, or any custom node, holding layout until the image loads."
    },
    {
      "part": "Image",
      "description": "The img whose src is requested only near the viewport, fading in via data-state."
    }
  ],
  "dosDonts": {
    "dos": [
      "Pass width and height so the layout is reserved and the page does not shift.",
      "Write meaningful alt text; it applies as soon as the img mounts.",
      "Use a custom placeholder that hints at the incoming content."
    ],
    "donts": [
      "Don't lazy-load hero or above-the-fold images; they should render immediately.",
      "Don't set rootMargin so large that every image loads up front.",
      "Don't use it for icons and decorative graphics; a plain img is simpler."
    ]
  },
  "related": [
    "image-viewer",
    "aspect-ratio",
    "loading"
  ],
  "examples": [
    {
      "title": "Default placeholder",
      "description": "A pulsing surface holds the layout until the image scrolls near the viewport and finishes loading."
    },
    {
      "title": "Custom placeholder",
      "description": "Any React node can stand in for the image, such as a branded blur-up or an explanatory caption."
    }
  ],
  "guidance": {
    "useWhen": "Image-heavy pages where most media sits below the fold, such as galleries, dashboards, or documentation.",
    "avoidWhen": "Hero or above-the-fold images that should render immediately; a plain img with fetchpriority is a better fit.",
    "behavior": "Requests src only when the wrapper crosses the rootMargin threshold, keeps data-state from idle through loading to loaded, and loads immediately without IntersectionObserver.",
    "responsive": "Accepts explicit width and height; pass percentages through style and the image fills the wrapper with object-fit cover."
  }
}
