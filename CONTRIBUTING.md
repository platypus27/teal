# Contributing to Teal

Teal is the Kryv Labs shared React design system. Contributions are welcome,
but the catalog grows deliberately: product behavior stays in products, and a
recipe is promoted into the package only after two Kryv products need the same
behavior. See [ROADMAP.md](ROADMAP.md).

## Setup

```bash
npm install
npm run verify
```

`npm run verify` runs lint, typecheck, unit and browser tests, both workspace
builds, and a pack dry-run of the published artifact. It must pass before a
change is merged.

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
cd apps/docs
npx playwright test
```

Chromium, mobile-chromium, and Firefox run everywhere. WebKit requires extra
system libraries on Linux (`npx playwright install-deps` on Debian/Ubuntu); it
runs in CI.

## Releases

Releases use [Changesets](https://github.com/changesets/changesets). Add a
changeset for any user-facing change to `@kryv/teal`:

```bash
npx changeset
```

The release notes on the docs site's Changelog page are generated from
`packages/teal/CHANGELOG.md`.

## License

By contributing, you agree that your contributions are licensed under the MIT
License.
