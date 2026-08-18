export default {
  "id": "back-top",
  "name": "Back Top",
  "apiNames": [
    "BackTop"
  ],
  "description": "A floating button that appears after scrolling and returns to the top of the page.",
  "usage": "<BackTop threshold={400} />",
  "anatomy": [
    {
      "part": "Button",
      "description": "Floating circular button fixed near the bottom corner, revealed past the scroll threshold."
    },
    {
      "part": "Icon",
      "description": "Up arrow hidden from assistive technology; the button carries its own accessible label."
    }
  ],
  "dosDonts": {
    "dos": [
      "Set the threshold to roughly one viewport of scrolling.",
      "Keep it clear of other floating controls like chat widgets."
    ],
    "donts": [
      "Don't show it on short pages where it adds noise.",
      "Don't place it inside a nested scroll container it cannot observe."
    ]
  },
  "related": [
    "floating-action-button",
    "scroll-area",
    "anchor-nav"
  ],
  "examples": [
    {
      "title": "Scroll recovery",
      "description": "Appears past the threshold and honors reduced motion when scrolling back up."
    },
    {
      "title": "Custom threshold",
      "description": "Lower the threshold on short pages so the control still appears."
    }
  ],
  "guidance": {
    "useWhen": "Pages grow long enough that returning to the top is tedious.",
    "avoidWhen": "The page is short or has its own scroll container.",
    "behavior": "Appears past the threshold and scrolls smoothly unless reduced motion is preferred.",
    "responsive": "The floating position clears content on all viewport sizes."
  }
}
