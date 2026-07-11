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

## Tailwind integration

Tailwind is not required to render Teal modules. Tailwind 3 applications can
extend `@kryv/teal/tailwind-preset` to use the semantic token utilities
(`bg-surface-container`, `text-on-surface-variant`, `border-outline-variant`,
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

Colors are CSS custom properties, so dark mode is one class on a parent
element:

```js
document.documentElement.classList.toggle('dark')
```

## Modules

Twenty typed modules across seven groups:

- **Actions** - Button, IconButton
- **Forms** - Field, Input, TextArea, Select, Checkbox, Switch
- **Surfaces** - Card, Badge
- **Overlays** - Dialog, Tooltip, Menu, Popover
- **Feedback** - Toast, EmptyState, Spinner, Progress, Skeleton, LoadingState
- **Navigation** - Tabs, Pagination, PageHeader
- **Data** - Table, Separator

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
