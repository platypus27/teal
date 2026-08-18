export default {
  "id": "loading",
  "name": "Loading",
  "apiNames": [
    "LoadingState",
    "Spinner",
    "Skeleton",
    "Progress"
  ],
  "imports": [
    "Spinner",
    "Progress",
    "Skeleton",
    "LoadingState"
  ],
  "description": "Named progress and loading treatments for local, skeleton, and full-surface states.",
  "usage": "<Spinner label=\"Saving\" />\n<Progress label=\"Import progress\" value={64} />\n<Skeleton className=\"h-4 w-40\" />\n<LoadingState label=\"Loading reports\" />",
  "anatomy": [
    {
      "part": "Spinner",
      "description": "role=\"status\" glyph with an accessible label for local, short waits."
    },
    {
      "part": "Progress",
      "description": "Determinate bar that exposes aria-valuenow for measurable work."
    },
    {
      "part": "Skeleton",
      "description": "aria-hidden placeholder block that reserves the shape of incoming content."
    },
    {
      "part": "LoadingState",
      "description": "Centered role=\"status\" treatment that stands in for a whole region or panel."
    }
  ],
  "dosDonts": {
    "dos": [
      "Match the treatment to the wait: Skeleton when the layout is known, Progress when it is measurable.",
      "Give Spinner and LoadingState a label that names the work, such as \"Saving\"."
    ],
    "donts": [
      "Don't show a spinner for operations that usually resolve instantly; it reads as flicker.",
      "Don't layer Skeleton and Spinner over the same region at once."
    ]
  },
  "related": [
    "loading-bar",
    "blocking-overlay",
    "meter"
  ],
  "examples": [
    {
      "title": "Loading treatments",
      "description": "Spinner and Progress for active work, Skeleton for layout placeholders, LoadingState for regions."
    },
    {
      "title": "Skeleton composition",
      "description": "Skeleton blocks mirror the shape of the incoming content."
    },
    {
      "title": "Radial progress",
      "description": "shape=\"circle\" gives Progress a compact radial treatment; omit value for a spinning indeterminate arc."
    },
    {
      "title": "Skeleton region",
      "description": "Reserve the eventual layout with Skeleton when content shape is known."
    }
  ],
  "guidance": {
    "useWhen": "Users need feedback while content or work is in progress.",
    "avoidWhen": "The operation is instant or no meaningful progress exists.",
    "behavior": "Use Spinner for local work, Skeleton for layout, and Progress for measurable work.",
    "responsive": "Prefer local indicators so small screens retain useful content."
  }
}
