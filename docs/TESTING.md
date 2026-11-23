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
# once, so the pinned image is local:
docker pull $(cut -d= -f2 apps/docs/scripts/playwright-image.env | tail -1)

# the suite, in the pinned environment (locally and in CI):
apps/docs/scripts/playwright-pinned.sh -- npm run test:e2e -w @kryv/teal-docs

# regenerate baselines (must happen inside the same environment):
apps/docs/scripts/playwright-pinned.sh -- npm run test:e2e -w @kryv/teal-docs -- --update-snapshots
```

Playwright suite in `apps/docs/tests` across four projects: chromium,
firefox, webkit, and mobile-chromium (Pixel 7). Screenshot baselines only
match the one pinned, digest-locked Playwright image
(`apps/docs/scripts/playwright-image.env`), which carries all four browsers
and its own fonts: run the suite through
`apps/docs/scripts/playwright-pinned.sh` on any machine, never through a
host-installed browser (`npm run test:e2e` directly still works for
non-screenshot debugging, but its renders are not the baseline
environment). The suite includes axe accessibility checks and
visual-regression coverage, with the demos in `apps/docs/src/demos/`
doubling as test fixtures — any behavior change should update or add a demo
so it is covered. Retries stay disabled: fix flakes at their cause rather
than masking them.

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
