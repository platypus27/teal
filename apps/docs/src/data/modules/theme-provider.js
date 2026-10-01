export default {
  "id": "theme-provider",
  "name": "Theme Provider",
  "apiNames": [
    "ThemeProvider"
  ],
  "imports": [
    "ThemeProvider",
    "ThemeToggle",
    "useTheme"
  ],
  "description": "Owns the ecosystem-wide 3-way theme preference (light, dark, system), applies the dark class to the document root, and persists the choice to localStorage.",
  "usage": "<ThemeProvider>\n  <App />\n</ThemeProvider>\n\nfunction ThemeControl() {\n  const { choice, resolved, setChoice } = useTheme()\n  return <Button onClick={() => setChoice(resolved === 'dark' ? 'light' : 'dark')}>{choice}</Button>\n}",
  "anatomy": [
    {
      "part": "ThemeProvider",
      "description": "Wraps the application once, reads the stored choice (default storage key kryv:theme), subscribes to prefers-color-scheme, and keeps the document root's dark class in sync with the resolved theme."
    },
    {
      "part": "useTheme",
      "description": "Hook returning { choice, resolved, setChoice }; choice is the stored 3-way preference, resolved is the effective light or dark."
    },
    {
      "part": "ThemeToggle",
      "description": "Rendered inside a provider it becomes controlled, flipping the stored choice between explicit light and dark instead of touching the document itself."
    }
  ],
  "dosDonts": {
    "dos": [
      "Mount one ThemeProvider per application, near the root, before any component reads useTheme.",
      "Read resolved for anything that needs the effective theme, such as chart palettes or map tiles.",
      "Keep the default storage key so the choice follows the person across the ecosystem."
    ],
    "donts": [
      "Don't implement a parallel per-app theme store; the provider replaces those.",
      "Don't toggle the dark class directly alongside the provider; the two will fight.",
      "Don't call useTheme outside a provider; it throws on purpose."
    ]
  },
  "related": [
    "theme-toggle",
    "ecosystem-shell"
  ],
  "examples": [
    {
      "title": "Provider with a 3-way chooser",
      "description": "useTheme exposes the stored choice and the resolved theme; ThemeToggle inside the provider flips the stored choice."
    },
    {
      "title": "Custom storage key",
      "description": "storageKey and defaultChoice are configurable; the choice persists across reloads."
    }
  ],
  "guidance": {
    "useWhen": "Every Kryv application: the provider is the single owner of the light/dark/system preference and the document's dark class contract.",
    "avoidWhen": "Nothing else should own theme state; static pages without theming can skip it.",
    "behavior": "On mount the stored choice wins, then defaultChoice (system by default); system tracks prefers-color-scheme live, and every change is applied to document.documentElement and persisted to localStorage. Storage and matchMedia are guarded, so SSR and older engines render light without crashing.",
    "responsive": "No visual footprint of its own."
  }
}
