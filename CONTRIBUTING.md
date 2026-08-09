# Contributing to Teal

Teal is the Kryv Labs shared React design system. Contributions are welcome,
but the catalog grows deliberately: product behavior stays in products, and a
recipe is promoted into the package only after two Kryv products need the same
behavior. See [ROADMAP.md](ROADMAP.md).

## Setup

Use Node 24.19.0 and npm 11.19.0 exactly, then install from the lockfile:

```bash
npm ci
npm run verify
```

`npm run verify` builds Teal before downstream typechecks, then runs lint,
typecheck, unit and production-integrity tests, dependency audit, generated
output checks, both workspace builds, package lifecycle validation, and packed
React 18/19 consumer verification. Pull requests also run the four Playwright
projects, locked Lighthouse, and the production-image scan and smoke gate.

## Workspace layout

- `packages/teal` - the published `@kryv/teal` package. TypeScript source in
  `src/`, interface tests in `test/` (vitest + Testing Library).
- `apps/docs` - the documentation site. React + Vite, with demos in
  `src/demos/`, content data in `src/data/`, and Playwright browser tests in
  `tests/`.

## Making changes

- Every module ships TypeScript declarations, keyboard interaction support, and
  visible focus states. New modules must meet the same bar.
- Document component props with JSDoc comments - they feed the generated
  interface tables on the docs site.
- Add or update a demo in `apps/docs/src/demos/` for any behavior change so it
  is covered by the accessibility and visual-regression suites.
- Commit messages follow `<action>: <description>` (for example
  `add: Popover playground`).

## Browser tests

```bash
npm run install:browser --workspace @kryv/teal-docs -- chromium
npm run test:e2e --workspace @kryv/teal-docs -- --project=chromium
```

Chromium, mobile-chromium, and Firefox run everywhere. WebKit requires extra
system libraries on Linux. Install it with the locked local CLI:

```bash
npm run install:browser --workspace @kryv/teal-docs -- --with-deps webkit
```

## Releases

Releases use [Changesets](https://github.com/changesets/changesets). Add a
changeset for any user-facing change to `@kryv/teal`:

```bash
npm run changeset
```

The release notes on the docs site's Changelog page are generated from
`packages/teal/CHANGELOG.md`.

Release planning, version PR creation, and trusted publishing use separate
least-privilege jobs. The publishing job performs the full package verification
again, retains that exact tarball, reopens it at the publishing boundary, and
publishes only that validated file. Do not invoke `npm run publish:package`
outside the protected trusted-publishing job.

## License

By contributing, you agree that your contributions are licensed under the MIT
License.
