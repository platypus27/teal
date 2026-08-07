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

Twenty-six documented module pages across seven groups: Button and IconButton;
Field, Input, TextArea, Select, Checkbox, Switch; Card, Badge, and Accordion;
Dialog, Tooltip, Menu, and Popover; Toast, EmptyState, loading, and Alert; Tabs,
Pagination, PageHeader, VerticalNav, TopBar, and Breadcrumb; Table, Separator,
and Avatar.

## Workspace

- `packages/teal`: published package - tokens, source, compiled styles, and interface tests
- `apps/docs`: documentation site - live examples, interactive playgrounds, generated interface tables, keyboard documentation, recipes, and browser tests

## Development

Repository development is locked to Node 24.19.0 and npm 11.19.0.

```bash
npm ci
npm run verify
```

`npm run verify` runs the dependency audit, production-integrity contracts,
lint, typecheck, unit tests, generated-output checks, both workspace builds,
package lifecycle checks, and packed React 18/19 consumer verification. Pull
requests also run all four Playwright projects, locked Lighthouse, and an exact
production-image scan and smoke test in CI.

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

To reproduce the production image gate locally without touching the default
Compose project:

```bash
docker build -f apps/docs/Dockerfile -t teal-docs:production-integrity .
npm run verify:docs-image -- --image teal-docs:production-integrity
```

The verifier scans a read-only Docker archive for fixable HIGH/CRITICAL
vulnerabilities and secrets, then starts a random isolated Compose project on a
dynamic loopback port and proves the running image ID and security headers.

## Release policy

Teal remains pre-1.0 while its interfaces are proven across Kryv applications.
Releases use Changesets and generated release notes. Versioning and trusted
publishing are separate least-privilege jobs. Trusted publishing rebuilds and
verifies one retained tarball, reopens that exact archive, compares every
compiled byte to the checkout, and publishes only that file. Product-specific
status mappings, persistence, data queries, and domain language stay in
consuming applications.

## License

MIT - Copyright (c) 2026 Kryv Labs
