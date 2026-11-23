# 0013. Docs visual baselines are produced and verified in one pinned Playwright image

Date: 2026-11-23

## Status

Accepted

## Context

The docs browser suite's `toHaveScreenshot` baselines only matched the
machine that captured them. A developer running the suite on their own
machine rendered different pixels from CI: different OS fonts and
fontconfig, a different Chromium build (a host install versus the runner's
`npx playwright install`), and host timezone and locale. The suite papered
over this with per-test `maxDiffPixels` allowances, CI-only retries, and
comments treating cross-machine raster drift as a fact of life, and a host
without webkit or firefox installed could not run the matrix at all.

Kryv Home fixed the same class of bug on 2026-11-23: every visual gate runs
in one digest-pinned `mcr.microsoft.com/playwright` image, locally and in
CI, through one wrapper script, with baselines regenerated inside that same
image (home `scripts/playwright-pinned.sh`, `scripts/playwright-image.env`).

## Decision

- `apps/docs/scripts/playwright-image.env` pins `PLAYWRIGHT_VERSION` and a
  digest-locked `mcr.microsoft.com/playwright` image. The version must
  equal the locked `@playwright/test` devDependency (the image carries that
  exact Playwright's browsers); the digest pins the image bytes. Teal pins
  the same image bytes as Home (Playwright 1.62.0), whose image ships Node
  24.18.0, inside Teal's engines range (`>=24.15.0 <25`); the newer
  1.65.x image ships Node 26, outside it.
- `apps/docs/scripts/playwright-pinned.sh` runs any command in that image:
  the repository is mounted at the same absolute path, files are written as
  the calling user, `TZ=UTC` and `LANG`/`LC_ALL=C.UTF-8` pin locale and
  timezone, and on GitHub Actions the runner's Node (the engines version)
  is mounted read-only. It refuses to run when the installed
  `@playwright/test` differs from the pinned version.
- Every run of the docs browser suite, locally and in CI, goes through the
  wrapper; CI's browser job no longer installs browsers on the runner. CI
  mounts the runner's Node exactly as Home does.
- Baselines are regenerated only inside the image
  (`... playwright-pinned.sh -- npm run test:e2e -w @kryv/teal-docs -- --update-snapshots`).
  Playwright's config also pins `timezoneId: 'UTC'` and `locale: 'en-US'`
  on the context so even a direct host run renders dates and locale text
  identically.
- Retries stay disabled (`retries: 0`). A retry in a reproducible
  environment can only mask a real failure; flakes are fixed at their cause.
  Thresholds are never loosened to absorb a drift. The suite runs two
  workers with a 15s expect window: the pinned image renders through
  SwiftShader, and four parallel software-rendered pages push first paint
  past the default 5s window (Kryv Home uses the same numbers for the same
  reason).
- `apps/docs/scripts/playwright-pinned.test.mjs` guards the pin (digest
  form, lockfile agreement), the wrapper's docker invocation, and the CI
  wiring, so the pin cannot silently rot.

## Consequences

- One baseline set serves every machine: a developer's laptop, a shared
  host, and any CI runner render identical pixels, so a baseline diff means
  the UI changed, full stop.
- Moving Playwright means updating the version, the image digest, and the
  `@playwright/test` devDependency together, then regenerating every
  baseline in the image and reviewing the diffs.
- First container run on a machine pulls ~3.5 GB; the image is otherwise
  cached between Home and Teal runs since both pin the same bytes.
