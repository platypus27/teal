# Roadmap

The `docs/` showcase ships first. The items below are the planned follow-ups, roughly in order.

## 1. Monorepo conversion (publish prerequisite)
Move the library surface into `library/` and convert the repo to an npm workspace:

- `library/` ← `ui/`, `tokens.css`, `global.css`, `tailwind.preset.js`, `package.json`.
- `docs/` stays as a workspace.
- Root becomes a private workspace root (`workspaces: ["library", "docs"]`).
- Rename/scope the package to **`@kryv/teal`** (the unscoped `teal` name is almost certainly taken on npm — confirm availability at publish time).
- Flip `docs` imports from relative `../../../ui` to the publish path `@kryv/teal/ui` (mechanical find/replace in `docs/src`).

> Breaking change for submodule consumers (e.g. `daedalus`) — only do this when ready to publish.

## 2. Publish-readiness
- Correct `exports` / `files` / `types` / `publishConfig: { access: 'public' }` / `sideEffects: ['**/*.css']` in `library/package.json`.
- `npm -w @kryv/teal pack --dry-run` shows only library files (no `docs/`).
- Decide whether to ship source (current) or add a build step (tsup/vite) emitting `dist/` for consumers that can't transpile `node_modules` JSX.

## 3. First publish
- `npm publish --access public` from `library/` (requires an npm login).

## 4. Migrate `daedalus`
- Switch `daedalus` from `git submodule` + `../teal/ui` to `npm install @kryv/teal` + `@kryv/teal/ui`; update its Tailwind `content` glob and preset import. Separate repo — its own small plan.

## Future enhancements
- Hosting (GitHub Pages / Vercel) + `react-router` + SPA fallback (real, shareable URLs).
- Real **Blocks** (copy-paste compositions built from the primitives).
- **Charts** (needs a chart library or hand-built SVG).
- MDX/docgen-authored pages so props tables are derived from `ui/index.d.ts` instead of hand-mirrored.
- Syntax highlighting in `CodeBlock`.
- Responsive sidebar (collapse on small screens).
- Storybook, visual-regression tests, CI.

## Maintenance / migration
- On its next `git submodule update --remote`, `daedalus` must `npm install clsx tailwind-merge` — teal now imports them in `ui/cn.js`.
- Delete the deprecated `@layer components` classes (`.card`, `.card-hover`, `.btn-primary`, `.btn-secondary`, `.input-field`) from `global.css` once `daedalus` is confirmed not to use them (or has migrated to npm). Until then they are kept aligned to the React modules, which are the single source of truth.

