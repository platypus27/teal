export default {
  "id": "loading-bar",
  "name": "Loading Bar",
  "apiNames": [
    "LoadingBar"
  ],
  "description": "A thin top-of-page progress bar with determinate and indeterminate modes.",
  "usage": "<LoadingBar\n  value={65}\n  label=\"Loading assets\"\n/>",
  "anatomy": [
    {
      "part": "Track",
      "description": "Thin 2px strip pinned to the top of the page."
    },
    {
      "part": "Fill",
      "description": "Primary bar whose width animates to the value; pulses across the track when indeterminate."
    }
  ],
  "dosDonts": {
    "dos": [
      "Use it for route transitions and page-level loads where the content stays on screen.",
      "Switch to determinate mode as soon as a measurable percentage exists."
    ],
    "donts": [
      "Don't use it for region-local waits; use LoadingState or Spinner there.",
      "Don't fake smooth increments; jump to the real value when it is known."
    ]
  },
  "related": [
    "loading",
    "blocking-overlay"
  ],
  "examples": [
    {
      "title": "Determinate",
      "description": "A known percentage pinned to the top of the page, for example while assets stream in."
    },
    {
      "title": "Indeterminate",
      "description": "A pulsing bar for route transitions where progress cannot be measured."
    }
  ],
  "guidance": {
    "useWhen": "Navigations or page-level loads need ambient progress feedback without replacing the page content.",
    "avoidWhen": "The wait is tied to one region or component; use LoadingState or Spinner there instead.",
    "behavior": "Omits aria-valuenow in indeterminate mode; clamps determinate values to 0–max and animates width changes.",
    "responsive": "Spans the full viewport width at any size; height stays a thin 2px strip."
  }
}
