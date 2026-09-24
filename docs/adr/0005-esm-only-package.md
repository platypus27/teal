# ADR-0005: Ship the package as ESM-only

- Status: Accepted
- Date: 2026-09-24

## Context

`@kryv/teal` publishes only ES modules: the exports map exposes a single
`import` condition with no `default` fallback, no CJS build is produced, and
`publint --strict` passes on that shape in CI. A CommonJS consumer that calls
`require('@kryv/teal')` gets a hard `ERR_REQUIRE_ESM`-style failure rather than
a working (but dual-format-compromised) build.

Producing dual builds would double the release surface, force the per-module
output to be duplicated, and reintroduce the CJS tree-shaking penalties the
per-module ESM build just removed.

## Decision

ESM-only is the supported and documented contract.

- The exports map stays `import`-condition-only; no `require` or `default`
  condition will be added for the JavaScript entry points.
- Jest consumers must transform ESM dependencies or migrate to Vitest (the
  stack this repository tests with); this is a documented consequence, not a
  supported-compatibility target.
- Node's ESM support is stable, every bundler in use resolves ESM, and Node 22+
  can `require()` synchronous ESM graphs, which softens the legacy gap without
  a dual build.

## Consequences

- One build, one set of source maps, one verification pipeline; the pack
  checks keep asserting the single-format shape.
- Consumers on CJS-only toolchains (legacy Jest, older Webpack without ESM
  support) must wrap or migrate; their failure is immediate and legible rather
  than silently degraded.
- If a consumer segment with a hard CJS requirement appears, the decision to
  revisit belongs in a new ADR with the consumer evidence attached.
