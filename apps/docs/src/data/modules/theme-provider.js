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
  "description": "Owns the ecosystem-wide theme preference (light, dark, system) and the active named palette, applies the dark class and data-palette attribute to the document root, and persists both choices to localStorage.",
  "usage": "<ThemeProvider palette=\"garden\">\n  <App />\n</ThemeProvider>\n\nfunction ThemeControl() {\n  const { choice, resolved, setChoice, palette, setPalette } = useTheme()\n  return (\n    <Button onClick={() => setPalette(palette === 'garden' ? 'safari' : 'garden')}>\n      {choice} {palette}\n    </Button>\n  )\n}",
  "anatomy": [
    {
      "part": "ThemeProvider",
      "description": "Wraps the application once, reads the stored choice (default storage key kryv:theme) and palette (default kryv:palette), subscribes to prefers-color-scheme, and keeps the document root's dark class and data-palette attribute in sync. safari is the default palette and removes the attribute."
    },
    {
      "part": "useTheme",
      "description": "Hook returning { choice, resolved, setChoice, palette, setPalette }; choice is the stored 3-way preference, resolved is the effective light or dark, and palette is the active named palette applied via data-palette."
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
      "Keep mode and palette separate: choice picks light, dark, or system while palette picks the named token override set.",
      "Keep the default storage keys so the choice and palette follow the person across the ecosystem."
    ],
    "donts": [
      "Don't implement a parallel per-app theme store; the provider replaces those.",
      "Don't toggle the dark class or set data-palette directly alongside the provider; the two will fight.",
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
      "title": "Named palette and custom storage keys",
      "description": "palette, paletteStorageKey, storageKey, and defaultChoice are configurable; setPalette applies data-palette and both choices persist across reloads."
    }
  ],
  "guidance": {
    "useWhen": "Every Kryv application: the provider is the single owner of the light/dark/system preference, the active named palette, and the document's dark class and data-palette contract.",
    "avoidWhen": "Nothing else should own theme state; static pages without theming or palettes can skip it.",
    "behavior": "On mount the stored choice and palette win, then defaultChoice (system by default) and the palette prop (safari by default); system tracks prefers-color-scheme live, choice is applied as the dark class, palette is applied as data-palette (safari removes it), and every change is persisted to localStorage. Storage and matchMedia are guarded, so SSR and older engines render light without crashing.",
    "responsive": "No visual footprint of its own."
  }
}
