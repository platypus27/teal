# Teal

Kryv Labs shared React design system. Teal provides typed React modules,
semantic design tokens, compiled styles, and a documentation site with live
examples, interactive playgrounds, and generated interface tables.

Documentation: <https://teal.kryvlabs.com>

## Install

```bash
npm install @kryv/teal
```

Import the required module styles once in the application entrypoint:

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

<Field label="Workspace name" required>
  <Input />
</Field>
<Button>Save changes</Button>
```

## Supported environment

- React 18 or 19, any package manager (npm, pnpm, yarn, bun)
- Modern ESM bundler
- Tailwind is not required to render Teal modules
- Tailwind 3 applications can extend `@kryv/teal/tailwind-preset` for semantic utility classes

Teal uses Radix internally for complex interaction behavior and Lucide for SVG
icons. Radix is not part of the public interface.

## Modules

Twenty typed modules across seven groups: Button and IconButton; Field, Input,
TextArea, Select, Checkbox, Switch; Card and Badge; Dialog, Tooltip, Menu,
Popover; Toast, EmptyState, Spinner, Progress, Skeleton, LoadingState; Tabs,
Pagination, PageHeader; Table and Separator.

## Workspace

- `packages/teal`: published package - tokens, source, compiled styles, and interface tests
- `apps/docs`: documentation site - live examples, interactive playgrounds, generated interface tables, keyboard documentation, recipes, and browser tests

## Development

```bash
npm install
npm run verify
```

`npm run verify` runs lint, typecheck, tests, both workspace builds, and a
pack dry-run of the published artifact.

Run the documentation site locally:

```bash
npm run dev --workspace @kryv/teal-docs
```

Build and serve it with Docker:

```bash
docker compose up --build
```

The site is available at `http://localhost:8087`. The container restarts
automatically (`restart: unless-stopped`), so the docs stay up across reboots.
In production the container sits behind the Traefik reverse proxy, which serves
it publicly at <https://teal.kryvlabs.com> with a Cloudflare-issued TLS
certificate.

## Release policy

Teal remains pre-1.0 while its interfaces are proven across Kryv applications.
Releases use Changesets and generated release notes. Product-specific status
mappings, persistence, data queries, and domain language stay in consuming
applications.

## License

MIT - Copyright (c) 2026 Kryv Labs
