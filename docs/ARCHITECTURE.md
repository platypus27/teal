# Architecture

Teal is an npm workspace with two packages: the published `@kryv/teal` design
system and the documentation site that renders it.

## Workspace layout

- `packages/teal` - the published `@kryv/teal` package. TypeScript source in
  `src/` (one file per module), compiled styles, and interface tests in
  `test/` (vitest + Testing Library).
- `apps/docs` - the documentation site. React + Vite, with demos in
  `src/demos/`, content data in `src/data/`, generated data in
  `src/generated/`, and Playwright browser tests in `tests/`.

## Package structure

- Every module is a typed React component in `src/<Module>.tsx`, exported from
  the package root. JSDoc comments on props feed the generated interface
  tables on the docs site.
- Styles compile to `dist/styles.css` (required), `dist/base.css` (optional
  document defaults), and `dist/tokens.css`. A `tailwind-preset` export lets
  Tailwind 3 applications map Teal's semantic tokens to utility classes.
- Design tokens are generated from source data by
  `scripts/generate-tokens.mjs` (`npm run generate:tokens`).
- Radix primitives provide complex interaction behavior (dialogs, menus,
  selects, tooltips) and Lucide provides SVG icons. Neither is part of the
  public interface.
- ESM-only build with TypeScript declarations; React 18 and 19 are peer
  dependencies.

## Docs site data flow

The site renders from a module registry plus generated data:

1. `src/data/module-meta.js` lists every module, its group, examples, and
   keyboard documentation.
2. `scripts/generate-api.mjs` runs react-docgen-typescript over the package
   source to produce `src/generated/api.json` (props and interfaces).
3. `scripts/generate-changelog.mjs` parses `packages/teal/CHANGELOG.md` into
   `src/generated/changelog.json`.
4. `scripts/generate-llms.mjs` emits `public/llms.txt` and
   `public/llms-full.txt` for LLM consumption.

All generated files are checked into the repository and verified by
`npm run check:generated`, so the registry, generated data, and the published
site cannot drift apart. See [TESTING.md](TESTING.md) for how to regenerate
and verify them, and [API.md](API.md) for where the module API reference is
published.
