# ADR-0003: Retire the generated Authentik theming adapter

- Status: Accepted
- Date: 2026-09-05

## Context

`@kryv/teal` shipped a generated Authentik theme adapter (`@kryv/teal/authentik.css`, generated from the canonical token source, with Playwright reference fixtures) that mapped Teal semantic tokens onto Authentik `--ak-*` and PatternFly global variables. Authentik has been retired across the Kryv ecosystem, so there are no remaining supported consumers of the adapter.

## Decision

Remove the adapter entirely rather than keep it unmaintained:

- Delete the `@kryv/teal/authentik.css` export, the generator script, the
  token-source pin, and the Playwright fixture with its reference screenshots.
- Drop the "Authentik adapter" section from the docs site's Foundations page.
- Ship the removal in a patch release as an intentional breaking change,
  following the same maintainer-approved semver exception precedent as 0.5.1.

## Consequences

- No dead generated artifact or reference-fixture maintenance burden remains
  in the package and CI.
- Any consumer still branding an Authentik deployment must pin its last
  generated `authentik.css` copy locally; no replacement ships in this
  package.
- Future third-party theming adapters, if ever needed, should be evaluated as
  demand-led additions per the roadmap rather than carried speculatively.
