# AGENTS.md

Guidance for AI agents and contributors working in the Teal repository.
Teal is the Kryv Labs shared React design system, published to npm as
`@kryv/teal` and documented at <https://teal.kryvlabs.com>.

## Stack

- npm workspaces on Node 24 (`engines` pins `>=24 <25`; npm >= 11.5.1)
- `packages/teal` — the published package: TypeScript React components in
  `src/`, interface tests in `test/` (vitest + Testing Library)
- `apps/docs` — the documentation site (React + Vite + React Router): demos in
  `src/demos/`, content data in `src/data/`, Playwright browser tests in
  `tests/`

## Commands

```bash
npm install
npm run verify          # lint + typecheck + unit tests + check:generated +
                        # registry validation + both builds + pack verify
npm run check:generated # fail if generated artifacts are stale
npm run generate --workspace @kryv/teal-docs   # regenerate docs artifacts
npm run dev --workspace @kryv/teal-docs        # local docs site
```

CI additionally runs the Playwright browser matrix and Lighthouse on pull
requests; WebKit needs `npx playwright install-deps` on Linux.

## Conventions

- Generated files are never hand-edited. Anything marked generated
  (`packages/teal/src/tokens.css`, `apps/docs/src/generated/`,
  `apps/docs/public/llms*.txt`) is produced by a generate script — change the
  source and regenerate (`npm run check:generated` must stay green).
- One component per file in `packages/teal/src`, flat named exports via the
  `src/index.ts` barrel; no `X.Item` dot-notation sub-components.
- Component props are documented with JSDoc — the docs site's interface tables
  are generated from them.
- Every module ships TypeScript declarations, keyboard interaction support, and
  visible focus states; new modules must meet the same bar.
- Design decisions are recorded as ADRs in `docs/adr/`.
- Commit messages follow `<action>: <description>` (for example
  `fix(docs): correct module count in README`).

## Releases

Releases use [Changesets](https://github.com/changesets/changesets). Add a
changeset for any user-facing change to `@kryv/teal`:

```bash
npx changeset
```

The Changesets GitHub Action versions, builds, and publishes to npm with
provenance. The docs site's Changelog page is generated from
`packages/teal/CHANGELOG.md`.
