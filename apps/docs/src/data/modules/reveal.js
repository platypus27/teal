export default {
  "id": "reveal",
  "name": "Reveal",
  "apiNames": [
    "Reveal"
  ],
  "description": "Fades and slides children in when they scroll into the viewport via IntersectionObserver.",
  "usage": "<Reveal>\n  <Card title=\"Reliability\" />\n</Reveal>",
  "anatomy": [
    {
      "part": "Observed wrapper",
      "description": "The element watched by IntersectionObserver against the threshold."
    },
    {
      "part": "Revealed content",
      "description": "Children transitioning opacity and translate from data-state=\"hidden\" to \"visible\"."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use it for below-the-fold sections on long pages.",
      "Keep once enabled so content does not re-animate on every pass.",
      "Test with reduced motion; the transition is skipped automatically."
    ],
    "donts": [
      "Don't wrap above-the-fold or critical content; entrance motion just delays reading.",
      "Don't stagger so many elements that the page feels slow to assemble.",
      "Don't animate layout properties; Reveal applies only opacity and transform."
    ]
  },
  "related": [
    "presence",
    "lazy-image",
    "collapse"
  ],
  "examples": [
    {
      "title": "Reveal once",
      "description": "Cards animate in the first time they enter the viewport and stay visible afterwards."
    },
    {
      "title": "Reveal every time",
      "description": "With once={false} the animation replays whenever the element leaves and re-enters the viewport."
    }
  ],
  "guidance": {
    "useWhen": "Long pages benefit from progressive entrance motion as sections scroll into view, such as marketing or dashboard summaries.",
    "avoidWhen": "Content above the fold or critical information that must render instantly; entrance motion there just delays reading.",
    "behavior": "Exposes data-state=\"hidden\" until the observed element crosses the threshold, then data-state=\"visible\"; without IntersectionObserver support it shows content immediately, and reduced motion skips the transition.",
    "responsive": "Applies only opacity and translate transforms, so the child's own responsive layout is untouched."
  }
}
