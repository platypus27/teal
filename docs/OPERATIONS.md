# Operations

Development environment, release, and publish operations for the Teal
workspace. For the contribution workflow and change bar, see
[CONTRIBUTING.md](../CONTRIBUTING.md); for check and test details, see
[TESTING.md](TESTING.md).

## Requirements

- Node `>=24 <25` and npm `>=11.5.1` (enforced by `engines` and
  `.node-version`).

## Local setup

```bash
npm install
npm run verify
```

`npm run verify` is the full local gate: lint, typecheck, unit tests,
generated-output checks, registry validation, both workspace builds, and
packed React consumer verification.

## Documentation site

Run the site locally during development:

```bash
npm run dev --workspace @kryv/teal-docs
```

Build and serve it with Docker:

```bash
docker compose up --build
```

The site is available at `http://localhost:8087`. The container restarts
automatically (`restart: unless-stopped`). In production the container sits
behind the Traefik reverse proxy, which serves it publicly at
<https://teal.kryvlabs.com> with a Cloudflare-issued TLS certificate.

## Release pipeline

Releases use [Changesets](https://github.com/changesets/changesets):

1. Add a changeset for every user-facing change to `@kryv/teal`
   (`npx changeset`).
2. `npm run release:version` applies version bumps, regenerates the docs
   data, and refreshes the lockfile. Changesets opens the version PR with
   generated changelog entries.
3. `npm run publish:package` publishes `@kryv/teal` to the npm registry with
   public access and provenance.

Before publishing, verify the packed artifact:

```bash
npm run pack:verify
```

`pack:verify` dry-runs `npm pack` (`pack:check`) and then installs the packed
tarball into a scratch React consumer (`verify:package`) to prove the
published artifact works.

## Continuous integration

The GitHub Actions pipeline runs on pull requests: a quality job (lint,
package build, typecheck, unit tests, generated checks, full build,
`pack:verify`), a Playwright matrix across four browser projects, and a
Lighthouse job. A release job publishes the package, and a deploy job builds
and rolls out the documentation image.

## Release policy

Teal remains pre-1.0 while its interfaces are proven across Kryv
applications. Product-specific status mappings, persistence, data queries,
and domain language stay in consuming applications; see
[ROADMAP.md](ROADMAP.md) for where the catalog is headed.
