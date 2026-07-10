# teal

Kryv Labs shared React design system. Minimal Teal (Material 3) colour system, a Tailwind preset, and a small set of UI primitives. Extracted from `daedalus` and kept in sync with its look.

## Contents
- `tokens.css` — `:root` + `html.dark` CSS variables (the palette).
- `global.css` — `@tailwind` directives, `@layer base/components/utilities`, Material Symbols + scrollbar styling. Imports `tokens.css`.
- `tailwind.preset.js` — the `colorVar()` theme mapping, fonts (Plus Jakarta Sans / Manrope), radii, safelist.
- `ui/` — `Button, IconButton, Card/CardHeader/CardTitle/CardSubtitle, Badge, Input/Select/TextArea, Toggle, Checkbox, PageHeader, EmptyState, LoadingState`.

## Use as a git submodule (recommended)
```bash
# in the consuming app
git submodule add /mnt/fast/git-repos/teal teal   # or a git URL once hosted
git submodule update --init --remote
```

**tailwind.config.js**
```js
import tealPreset from './teal/tailwind.preset.js'
export default {
  presets: [tealPreset],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}', './teal/ui/**/*.{js,jsx}'],
}
```

**src/main.jsx (or your global CSS)**
```js
import '../teal/global.css'
```

**Any component**
```jsx
import { Button, Card, CardTitle } from '../teal/ui'
<Card><CardTitle>Hello</CardTitle><Button>Go</Button></Card>
```

## Requirements in the consuming app
- React 18+, Tailwind 3.4+.
- Load fonts **Plus Jakarta Sans** and **Manrope** (e.g. Google Fonts in `index.html`).
- Load **Material Symbols Outlined** for icons (`Toggle`, `Checkbox`, `EmptyState`, `LoadingState` use icon names).
- Dark mode: toggle the `dark` class on `<html>`.

## Updating everywhere
Edit tokens/components here, commit, then in each app:
```bash
git submodule update --remote teal
```

## Magic UI
Drop Magic UI components into `ui/magic/`, recoloured to these tokens. They are Tailwind + Framer Motion and theme through the same CSS variables.
