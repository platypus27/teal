# @kryv/teal

Kryv Labs shared React design system. Teal provides typed React modules,
semantic design tokens, and compiled styles for Kryv applications.

## Install

```bash
npm install @kryv/teal
```

Requires React 18 or 19. Works with any package manager (npm, pnpm, yarn, bun)
and any modern ESM bundler.

## Quick start

Import the compiled styles once in your application entrypoint:

```js
import '@kryv/teal/styles.css'
```

The optional base stylesheet applies Teal typography, body colors, selection,
and scrollbar defaults:

```js
import '@kryv/teal/base.css'
```

Use modules from the package root:

```jsx
import { Button, Field, Input } from '@kryv/teal'

export function WorkspaceForm() {
  return (
    <form>
      <Field label="Workspace name" required>
        <Input placeholder="acme-ops" />
      </Field>
      <Button type="submit">Save changes</Button>
    </form>
  )
}
```

## Optional Tailwind integration

Tailwind is not required to render Teal modules. Tailwind 3 applications can
extend `@kryv/teal/tailwind-preset` to use the semantic token utilities
(`bg-teal-surface-container`, `text-teal-on-surface-variant`, `border-teal-outline-variant`,
and friends) in their own markup:

```js
// tailwind.config.js
import tealPreset from '@kryv/teal/tailwind-preset'

export default {
  presets: [tealPreset],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
}
```

## Fonts and theming

Teal pairs Manrope (body) with Plus Jakarta Sans (headline). Load them once:

```html
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap" rel="stylesheet" />
```

Colors and the supported shape, border, focus, and elevation hooks are CSS
custom properties. Dark mode is one class on the document element:

```js
document.documentElement.classList.toggle('dark')
```

The complete supported token list is documented at
[teal.kryvlabs.com/foundations](https://teal.kryvlabs.com/foundations).

## Bundle and styling model

The JavaScript ships as one ES module per component, so your bundler parses and
tree-shakes only what you import; `"use client"` is present on every module for
React Server Component consumers. Styles are intentionally different:
`styles.css` is a single ~64 KB precompiled stylesheet (tokens included)
covering the whole library, and importing it once is the supported path.

A per-component CSS split is not shipped because the component classes are
Tailwind utilities compiled under a private `teal-u-` prefix at publish time —
keeping them in one file is what lets the compiled output stay small, ordered,
and free of Tailwind build requirements for consumers. At ~10 KB gzipped the
monolith is smaller than most per-component alternatives once an app uses more
than a handful of modules. If you need to trim further, import `tokens.css`
alone and rely on the optional Tailwind preset instead.

## Modules

168 documented modules across eleven groups — Actions, Forms, Pickers,
Surfaces, Overlays, Feedback, Navigation, Data, Charts, Layout, and Utilities —
each with live examples, a generated props table, and accessibility notes at
[teal.kryvlabs.com](https://teal.kryvlabs.com).

Every module ships TypeScript declarations, keyboard interaction support, and
visible focus states. Complex interactions (Select, Dialog, Toast, and others)
are built on Radix primitives; Lucide provides the SVG icons.

## Documentation

The full documentation site - live examples, interactive playgrounds, generated
interface tables, keyboard documentation, and recipes - lives in the
[apps/docs workspace](https://github.com/platypus27/teal/tree/master/apps/docs)
and can be served with `docker compose up --build`.

## License

MIT - Copyright (c) 2026 Kryv Labs
