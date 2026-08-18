export default {
  "id": "carousel",
  "name": "Carousel",
  "apiNames": [
    "Carousel",
    "CarouselSlide"
  ],
  "description": "A scroll-snap carousel with previous and next controls, dot indicators, and arrow-key support.",
  "usage": "<Carousel label=\"Featured reports\">\n  <ReportCard title=\"Q1 security\" />\n  <ReportCard title=\"Q2 reliability\" />\n</Carousel>",
  "anatomy": [
    {
      "part": "Track",
      "description": "The scroll-snap container that pages one slide at a time."
    },
    {
      "part": "Slide",
      "description": "Each child laid out as a full-width snap stop, labelled with its position in the set."
    },
    {
      "part": "Previous and next buttons",
      "description": "The paging controls; disabled at the ends unless loop is set."
    },
    {
      "part": "Dot indicators",
      "description": "Compact page buttons with 24px touch targets that jump straight to a slide."
    }
  ],
  "dosDonts": {
    "dos": [
      "Name the collection with the label prop so the region is announced properly.",
      "Use loop for short sets that should cycle endlessly.",
      "Keep slide content simple; each slide is a full snap stop."
    ],
    "donts": [
      "Don't hide critical unique content on the last slide only.",
      "Don't auto-advance slides; readers control the pacing.",
      "Don't nest the carousel inside another scroll-snap container."
    ]
  },
  "related": [
    "image-viewer",
    "scroll-area",
    "pagination"
  ],
  "examples": [
    {
      "title": "Paged content",
      "description": "Slides announce their position; loop wraps around at the ends."
    },
    {
      "title": "Looping set",
      "description": "loop keeps previous and next enabled by wrapping around at the ends."
    }
  ],
  "guidance": {
    "useWhen": "Peer items page through a bounded region.",
    "avoidWhen": "All content should be visible at once; use Grid.",
    "behavior": "Scroll-snap track with buttons, compact dots with 24px touch targets, and arrow keys; slides announce their position.",
    "responsive": "Slides take full track width; keep content readable at mobile widths."
  }
}
