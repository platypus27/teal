export default {
  "id": "marquee",
  "name": "Marquee",
  "apiNames": [
    "Marquee"
  ],
  "description": "Scrolls content horizontally in a seamless CSS-animation loop with pause-on-hover and reduced-motion support.",
  "usage": "<Marquee duration={16} pauseOnHover>\n  <StatusChip label=\"All systems operational\" />\n  <StatusChip label=\"Deploy complete\" />\n</Marquee>",
  "anatomy": [
    {
      "part": "Viewport",
      "description": "The overflow-hidden wrapper that clips the scrolling track."
    },
    {
      "part": "Track",
      "description": "The CSS-animated row translating continuously for a seamless loop."
    },
    {
      "part": "Duplicated copy",
      "description": "An aria-hidden repeat of the children that closes the wrap gap."
    }
  ],
  "dosDonts": {
    "dos": [
      "Limit it to ambient, glanceable content such as status chips or logos.",
      "Keep pauseOnHover enabled so pointer users can read the content.",
      "Label the region when the looped content carries meaning."
    ],
    "donts": [
      "Don't put critical or actionable messages in a Marquee; use Alert.",
      "Don't expect users to read long text; it is off-screen part of the time.",
      "Don't stack multiple fast marquees; the compounded motion overwhelms."
    ]
  },
  "related": [
    "alert",
    "status-dot",
    "badge"
  ],
  "examples": [
    {
      "title": "Status ticker",
      "description": "A row of live status chips loops continuously across the banner, pausing when the reader hovers it."
    },
    {
      "title": "Reverse direction",
      "description": "direction=\"right\" runs the loop the other way, useful for stacking two counter-scrolling rows."
    }
  ],
  "guidance": {
    "useWhen": "Ambient, glanceable content like logo strips, status tickers, or announcement loops that users can ignore safely.",
    "avoidWhen": "Critical messages users must read or act on; motion hides content part of the time, so use an Alert instead.",
    "behavior": "Duplicates the children for a gapless wrap, pauses on hover when pauseOnHover is set, and renders statically under prefers-reduced-motion.",
    "responsive": "Overflows are clipped by the wrapper; give it a width and the track loops regardless of content size."
  }
}
