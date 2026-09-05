# ADR-0002: The publish pipeline must build before packing or publishing

- Status: Accepted
- Date: 2026-09-05

## Context

The `@kryv/teal` 0.5.0 and 0.5.1 tarballs shipped to npm without `dist/`.
The Changesets release job in CI ran `changeset publish` without building the
library first, so `main`, `types`, and every `exports` target pointed at files
that did not exist in the tarball. Consumers installing those versions could
not resolve the package at all.

## Decision

Every route that produces or publishes a tarball must build first:

- The CI release job builds `@kryv/teal` before running `changeset publish`.
- `packages/teal` defines `prepublishOnly`, so `npm publish` (from any
  directory, local or CI) regenerates `dist/` first.
- Packed-tarball verification (`npm run pack:verify`) remains part of the
  verification suite so a tarball missing expected files fails before it can
  ship.

## Consequences

- A missing-`dist/` release can no longer recur, regardless of which publish
  path is used.
- Publishing takes slightly longer because the build is always redone; the
  package is small enough that this is negligible.
- The incident is detectable, not just preventable: pack verification catches
  tarball-content regressions at PR time.
