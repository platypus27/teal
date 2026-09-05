# Testing

How to run Teal's checks, tests, and builds. For release and publish
operations, see [OPERATIONS.md](OPERATIONS.md).

## Full gate

```bash
npm run verify
```

Runs, in order: lint, typecheck, unit tests, generated-output checks,
registry validation, both workspace builds, and packed React consumer
verification. This is the same quality gate CI runs, minus the browser
matrix and Lighthouse.

## Lint and typecheck

```bash
npm run lint       # eslint, both workspaces, zero warnings allowed
npm run typecheck  # tsc --noEmit per workspace
```

## Unit tests

```bash
npm run test:unit
```

vitest + Testing Library + jest-axe interface tests in `packages/teal/test`.
They cover component behavior, form composition, SSR, and accessibility
rules for every module.

## Browser tests

```bash
npm run test:e2e
```

Playwright suite in `apps/docs/tests` across four projects: chromium,
firefox, webkit, and mobile-chromium (Pixel 7). Chromium, mobile-chromium,
and firefox run everywhere; webkit needs extra system libraries on Linux
(`npx playwright install-deps` on Debian/Ubuntu) and always runs in CI. The
suite includes axe accessibility checks and visual-regression coverage, with
the demos in `apps/docs/src/demos/` doubling as test fixtures — any behavior
change should update or add a demo so it is covered.

## Generated output

```bash
npm run check:generated
```

Fails if any checked-in generated file is stale:

- design tokens (`packages/teal/scripts/generate-tokens.mjs`)
- `apps/docs/src/generated/api.json` (props tables from react-docgen)
- `apps/docs/src/generated/changelog.json` (parsed package changelog)
- the module registry (`validate:registry` in `@kryv/teal-docs`)
- `apps/docs/public/llms.txt` and `llms-full.txt`

Regenerate everything with `npm run generate --workspace @kryv/teal-docs`
(plus `npm run generate:tokens` for tokens), then commit the results.

## Builds and package verification

```bash
npm run build        # @kryv/teal, then @kryv/teal-docs
npm run pack:verify  # dry-run npm pack + scratch React consumer install
```

`pack:verify` proves the published tarball imports and renders in a real
React consumer before anything reaches the registry.

## Continuous integration

Pull requests run the quality job, the Playwright matrix per project, and a
Lighthouse performance/accessibility audit against the built docs site.
