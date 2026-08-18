export default {
  "id": "scroll-shadow",
  "name": "ScrollShadow",
  "apiNames": [
    "ScrollShadow"
  ],
  "description": "A scroll container that fades the top and bottom edges to signal that more content exists in that direction.",
  "usage": "<ScrollShadow\n  className=\"max-h-64\"\n>\n  <MessageList />\n</ScrollShadow>",
  "anatomy": [
    {
      "part": "Scroll container",
      "description": "The overflowing region; the caller bounds its height through className."
    },
    {
      "part": "Top fade",
      "description": "Appears once the reader has scrolled away from the start."
    },
    {
      "part": "Bottom fade",
      "description": "Visible until the reader reaches the end, signaling more content below."
    },
    {
      "part": "Scroll state",
      "description": "A ResizeObserver and scroll listener keep the fades correct as content changes."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use it on chat panels, log viewers and long dropdown lists that overflow often.",
      "Bound the height through className so the fades have overflow to signal.",
      "Increase shadowSize on tall panels where a subtle fade gets lost."
    ],
    "donts": [
      "Don't add fades when a persistent scrollbar already communicates overflow.",
      "Don't rely on the fade alone; keyboard users must still reach every focusable item inside.",
      "Don't stack ScrollShadow with ScrollArea cues on the same region; pick one signal."
    ]
  },
  "related": [
    "scroll-area",
    "infinite-scroll",
    "list"
  ],
  "examples": [
    {
      "title": "Overflowing list",
      "description": "A bounded list shows a bottom fade until the reader scrolls, then fades both edges mid-scroll."
    },
    {
      "title": "Larger shadows",
      "description": "shadowSize deepens the fade for taller panels where a subtle cue gets lost."
    }
  ],
  "guidance": {
    "useWhen": "A bounded scrolling region should advertise that it continues, such as chat panels, dropdown lists or log viewers.",
    "avoidWhen": "The content rarely overflows or a scrollbar is always visible and sufficient; the shadows would be noise.",
    "behavior": "Shadows appear only when scrolling is possible in that direction: bottom until scrolled, top once scrolled, none at the end; a ResizeObserver keeps the state correct as content changes.",
    "responsive": "The shadows stretch to the container's width automatically; the container itself sizes via the caller's className."
  }
}
