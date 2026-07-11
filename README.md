# Teal

Kryv Labs shared React design system. Teal provides typed React modules, semantic design tokens, compiled styles, and a responsive documentation site.

## Install

```bash
npm install @kryv/teal
```

Import the required module styles once in the application entrypoint:

```js
import '@kryv/teal/styles.css'
```

The optional base stylesheet applies Teal typography, body colors, selection, and scrollbar defaults:

```js
import '@kryv/teal/base.css'
```

Use modules from the package root:

```jsx
import { Button, Field, Input } from '@kryv/teal'

<Field label="Workspace name" required>
  <Input />
</Field>
<Button>Save changes</Button>
```

## Supported environment

- React 18 or 19
- Modern ESM bundler
- Tailwind is not required to render Teal modules
- Current Tailwind 3 applications can use `@kryv/teal/tailwind-preset` for semantic utility classes

Teal uses Radix internally for complex interaction behavior and Lucide for SVG icons. Radix is not part of the public interface.

## Workspace

- `packages/teal`: published package, tokens, source, and interface tests
- `apps/docs`: routed documentation, live examples, generated interface tables, and browser tests

## Development

```bash
npm install
npm run verify
```

Run the documentation site locally:

```bash
npm run dev --workspace @kryv/teal-docs
```

Build and serve it with Docker:

```bash
docker compose up --build
```

The site is available at `http://localhost:8087`.

## Release policy

Teal remains pre-1.0 while its interfaces are proven across Kryv applications. Releases use Changesets and generated release notes. Product-specific status mappings, persistence, data queries, and domain language stay in consuming applications.
