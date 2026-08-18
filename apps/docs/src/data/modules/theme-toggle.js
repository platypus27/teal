export default {
  "id": "theme-toggle",
  "name": "Theme Toggle",
  "apiNames": [
    "ThemeToggle"
  ],
  "description": "An icon button that toggles the dark class on the document root and reports its state.",
  "usage": "<ThemeToggle onChange={(theme) => persistTheme(theme)} />",
  "anatomy": [
    {
      "part": "Toggle button",
      "description": "The icon button exposing aria-pressed for the current theme."
    },
    {
      "part": "Theme icon",
      "description": "The sun/moon icon that swaps with the active theme; decorative, not the state carrier."
    }
  ],
  "dosDonts": {
    "dos": [
      "Persist the reported theme through onChange so the choice survives reloads.",
      "Initialize from the system preference when no choice is stored.",
      "Keep one toggle in a consistent location, typically the top bar."
    ],
    "donts": [
      "Don't render several toggles that can disagree about the document state.",
      "Don't toggle theme without updating the dark class contract your styles rely on.",
      "Don't bury the toggle in a menu where theme switching is frequent."
    ]
  },
  "related": [
    "top-bar",
    "switch",
    "button"
  ],
  "examples": [
    {
      "title": "Light and dark",
      "description": "aria-pressed reflects the current theme; persisting the choice stays with the app."
    },
    {
      "title": "Persisted preference",
      "description": "onChange reports the new theme so the app shell can store it."
    },
    {
      "title": "Persisting choice",
      "description": "Store the theme in onChange and reapply the class on load."
    }
  ],
  "guidance": {
    "useWhen": "The app offers a light and dark theme switch.",
    "avoidWhen": "Theme follows the system only.",
    "behavior": "Toggles the dark class on the document root and reports state through aria-pressed.",
    "responsive": "Icon-sized control fits any header."
  }
}
