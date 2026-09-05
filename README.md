# Teal

Kryv Labs shared React design system. Teal provides typed React modules,
semantic design tokens, compiled styles, and a documentation site with live
examples, interactive playgrounds, and generated interface tables.

Documentation: <https://teal.kryvlabs.com> — getting started, [foundations](https://teal.kryvlabs.com/foundations), [recipes](https://teal.kryvlabs.com/recipes), and the generated [changelog](https://teal.kryvlabs.com/changelog).

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

Twenty-six documented module pages across seven groups: Button and IconButton;
Field, Input, TextArea, Select, Checkbox, Switch; Card, Badge, and Accordion;
Dialog, Tooltip, Menu, and Popover; Toast, EmptyState, loading, and Alert; Tabs,
Pagination, PageHeader, VerticalNav, TopBar, and Breadcrumb; Table, Separator,
and Avatar.

## Workspace

- `packages/teal`: published package - tokens, source, compiled styles, and interface tests
- `apps/docs`: documentation site - live examples, interactive playgrounds, generated interface tables, keyboard documentation, recipes, and browser tests

## Documentation

- [CONTRIBUTING.md](CONTRIBUTING.md) - contribution process, workspace layout, and the change bar
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - workspace and package structure, docs data pipeline
- [docs/OPERATIONS.md](docs/OPERATIONS.md) - dev setup, docs site, release and publish operations
- [docs/TESTING.md](docs/TESTING.md) - how to run checks, tests, builds, and generated-output verification
- [docs/SECURITY.md](docs/SECURITY.md) - supported versions and private vulnerability reporting
- [docs/ROADMAP.md](docs/ROADMAP.md) - shipped milestones and demand-led catalog plan
- [docs/API.md](docs/API.md) - where the generated module API reference is published
- [packages/teal/CHANGELOG.md](packages/teal/CHANGELOG.md) - generated release notes for `@kryv/teal`
- [docs/archive/](docs/archive/) - superseded plans and specs, kept for reference

## Development

```bash
npm install
npm run verify
```

`npm run verify` runs lint, typecheck, unit tests, generated-output checks, both
workspace builds, and packed React consumer verification. Pull requests also
run the four Playwright projects and Lighthouse in CI.

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
