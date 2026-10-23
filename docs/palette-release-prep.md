# Palette release preparation: `@kryv/teal` 1.3.0

Status: prepared, owner-gated. Date: 2026-10-23. Branch
`chore/teal-palette-release-prep`. Nothing in this document publishes, pushes,
deploys, or edits Home. The package version in the repository remains 1.2.0
until the Changesets version PR runs; the change input is
`.changeset/named-palettes.md`.

Related: [ADR-0010](adr/0010-named-palettes-data-palette.md),
[OPERATIONS.md](OPERATIONS.md) (release pipeline),
[TESTING.md](TESTING.md) (gates), and the package
[README](../packages/teal/README.md).

## 1. Capability verification

### ThemeProvider API

Source: `packages/teal/src/ThemeProvider.tsx` (merged on `master` at
`ed35280`).

- New optional props: `palette?: string` (mount fallback, default `safari`)
  and `paletteStorageKey?: string` (default `kryv:palette`).
- Extended context: `palette: string` and
  `setPalette: (palette: string) => void`, alongside the unchanged
  `choice`, `resolved`, and `setChoice`.
- State order: stored value from `paletteStorageKey`, then the `palette`
  prop, then `safari`. Unknown stored strings are passed through verbatim.
- Effect: `palette !== 'safari'` sets
  `document.documentElement.dataset.palette`; `safari` deletes the attribute.
- `setPalette` applies the value immediately, persists it to localStorage,
  and republishes it through context. Mode logic and document `dark` class
  behavior are unchanged.

### Palettes and tokens

Source: `packages/teal/token-source.mjs` and generated
`packages/teal/src/tokens.css`.

The supported set is `safari` plus `garden`. `safari` is not an override
entry: it is the default token set with no attribute. `garden` overrides only
two tokens in each mode and inherits the rest:

| Mode | Token | `garden` value |
| --- | --- | --- |
| light | `teal-color-surface` | `rgb(250 249 244)` |
| light | `teal-color-primary` | `rgb(27 94 32)` |
| dark | `teal-color-surface` | `rgb(22 28 24)` |
| dark | `teal-color-primary` | `rgb(129 199 132)` |

Generated selectors:

```css
:root:not(.dark)[data-palette='garden'] { /* light overrides */ }
html.dark[data-palette='garden'] { /* dark overrides */ }
```

Evidence:

- Default rendering unchanged: the `:root` and `html.dark` blocks in the
  current `tokens.css` are byte-identical to the published 1.2.0
  `dist/tokens.css`; the only difference is the appended 245-character
  garden block.
- WCAG gate: `test/tokens.test.ts` runs 18 garden contrast probes (nine per
  mode) over the default tokens plus the overrides, including primary on
  primary/10 and primary/15 tints over both background and surface. Every
  probe is at least 4.5. Light minimum 5.39 (primary on a 15 percent tint
  over surface); dark minimum 6.36 (primary on a 15 percent tint over
  surface).
- Garden was deliberately darkened from the mockup primary so composed tints
  stay AA; the rationale is recorded in ADR-0010 and the token source
  comment.

### Packaged artifact evidence

Local build and gates (branch tip):

| Gate | Result | Exit |
| --- | --- | --- |
| `npm run test:unit` | 173 files, 1291 tests passed | 0 |
| `npm run lint --workspace @kryv/teal` | 0 problems | 0 |
| `npm run typecheck --workspace @kryv/teal` | clean | 0 |
| `npm run check:generated` | generated artifacts current | 0 |
| `npm run build --workspace @kryv/teal` | dist built | 0 |
| `npm run check:size --workspace @kryv/teal` | js 511033/560000, largest 14776/18000, styles.css 69315/75000 | 0 |
| `npm run pack:verify` | dry-run pack plus scratch consumer verified `@kryv/teal@1.2.0` | 0 |

`npm pack` into a temp directory produced `kryv-teal-1.2.0.tgz` (718 KiB,
938 entries) with the expected published layout: `dist/` JavaScript,
declarations and maps, `dist/tokens.css`, `dist/styles.css`,
`dist/tailwind.preset.js`, `src/tokens.json`, and the package README.

Tarball inspection:

- `dist/ThemeProvider.d.ts` declares `palette?: string`,
  `paletteStorageKey?: string`, `palette: string`, and
  `setPalette: (palette: string) => void`.
- `dist/tokens.css` contains `:root:not(.dark)[data-palette='garden']` and
  `html.dark[data-palette='garden']`.
- `dist/index.js` exports `ThemeProvider` and `useTheme`, and a runtime ESM
  import of the built module resolves both exports.
- A scratch consumer that installs the extracted tarball and imports
  `ThemeContextValue` and `ThemeProviderProps` compiles with
  `tsc --strict --noEmit` (exit 0), proving consumers see the palette API
  types.

### Registry state

Read-only registry checks at preparation time: `npm view @kryv/teal version`
returns `1.2.0`, and `npm view @kryv/teal@1.3.0 version` returns a 404. The
palette surface is therefore unpublished, the 1.3.0 version number is
available, and the capability gap is a registry state, not a missing local
change.

### Capability absent in the current Home installation

Home `main` installs `@kryv/teal` 1.2.0 (lockfile integrity pinned to the
registry tarball). In that installed package `dist/ThemeProvider.d.ts` has
zero `palette` occurrences and `dist/tokens.css` has zero `data-palette`
selectors. Home already handles that: `apps/web/src/App.tsx` renders the
`PalettePicker` only when `typeof theme.setPalette === 'function'`, and
`apps/web/src/palettePreference.ts` returns `false` without the capability,
so the current UI hides the picker instead of rendering a dead control.

## 2. Version decision

`@kryv/teal` 1.2.0 publishes a minor release, 1.3.0, through the existing
`.changeset/named-palettes.md` (already `minor`).

- Minor, not patch: the release adds new public API (`palette` and
  `setPalette` on `ThemeContextValue`, two `ThemeProvider` props) and new
  token behavior (the garden CSS blocks). Consumers need a semver-visible
  opt-in.
- Minor, not major: no existing behavior, export, prop, or token changes.
  With no palette prop or stored value, the provider renders exactly as
  before; the default token blocks are byte-identical to 1.2.0.
- Advisory: `ThemeContextValue` gains required members. A consumer that
  hand-constructs that interface instead of obtaining it from `useTheme()`
  would see a compile error on upgrade. Runtime behavior is additive, and
  provider-owned contexts are the supported pattern, so this is recorded as
  an upgrade note rather than a major. Revisit only if a real consumer
  breaks.
- Release mechanics: the Changesets release job in
  `.github/workflows/pipeline.yml` runs on pushes to `master` after the
  quality, browser, and Lighthouse jobs. It uses the action's
  `version-script: npm run release:version` (changeset version plus docs data
  regeneration and lockfile refresh) and
  `publish-script: npx changeset publish`, with
  `NPM_CONFIG_PROVENANCE: true` and `id-token: write`.

## 3. Owner publish checklist

Every item is **OWNER GATE**. No agent publishes, pushes, tags, or runs the
release workflow.

Preconditions:

1. The release-prep branch is reviewed, rebased on `master`, and merged after
   review; `.changeset/named-palettes.md` is present and the tree is clean.
2. `npm run verify` exits 0 at the version commit (lint, typecheck, unit
   tests, generated checks, registry validation, both builds, and
   `pack:verify`).
3. `npm view @kryv/teal@1.3.0 version` returns a 404, so the version is not
   already published.
4. The owner has npm publish access and the release workflow has
   `contents: write` and `id-token: write` for provenance.

Version PR:

5. Merge to `master`. The release job opens the Changesets Version Packages
   pull request: `packages/teal/package.json` becomes 1.3.0,
   `packages/teal/CHANGELOG.md` gets the generated entry, docs data and the
   lockfile are refreshed.
6. Review the version PR (exact version, changelog wording, regenerated docs
   artifacts) and merge it.

Publish:

7. The same release job detects the unpublished package with a pending
   changeset and publishes via `npx changeset publish`, then creates the
   GitHub release and tag. Provenance is attached.
8. Manual fallback, owner only, from a reviewed clean checkout:
   `npm run release:version`, then `npm run verify`, then
   `npm run publish:package`. Never run a publish from an agent session or an
   unreviewed environment.

Post-publish verification:

9. `npm view @kryv/teal version dist-tags --json` shows `1.3.0` as latest.
10. Record `npm view @kryv/teal@1.3.0 dist.integrity`.
11. Install the registry package in a clean temp project with React 18 or 19;
    confirm the import renders, the types expose `palette`/`setPalette`, and
    `tokens.css` contains both `data-palette='garden'` selectors.
12. Confirm the docs site changelog and foundations pages deploy from the
    version commit, then move Home to the follow-up in section 4.

Rollback and unpublish:

- Before publish: close or revert the version PR. No registry action.
- Broken or uninstallable tarball: do not publish another artifact at the
  same version. Within 72 hours, and only when no consumer depends on it,
  the owner may `npm unpublish @kryv/teal@1.3.0`; this destroys the
  provenance evidence, so record the incident first. Otherwise
  `npm deprecate @kryv/teal@1.3.0 "reason"` and publish a fixed 1.3.1. Never
  reuse a published version number.
- If `latest` must point back at the last good release,
  `npm dist-tag add @kryv/teal@1.2.0 latest` is owner-only; a later fixed
  publish moves `latest` forward again.
- Consumer rollback: pin `@kryv/teal` to 1.2.0 until the fixed version is
  live. Rendering with no palette props is unchanged, so a pin is a
  dependency-only rollback.
- Git rollback: revert the version commit and tag, and record the incident in
  the GitHub release notes.

## 4. Home integration follow-up (prepared, not applied)

Home already contains the integration behind the capability gate; the
follow-up activates it. Do not apply this in the Teal repository.

Dependency:

- `home/apps/web/package.json`: change `@kryv/teal` from `^1.2.0` to
  `^1.3.0`; run `npm install` and commit the refreshed `package-lock.json`.
- `home/apps/server/package.json` stays at `^1.0.0`; the server does not use
  palette APIs.
- Verify the installed `node_modules/@kryv/teal/package.json` version and that
  its `dist/ThemeProvider.d.ts` exposes the palette fields before changing
  the web code.

Capability-gated picker:

- Keep the runtime guard. Current `App.tsx` hides the picker unless
  `typeof theme.setPalette === 'function'`; keep that behavior so a stale
  lockfile or older resolution can never render a working-looking control
  that silently does nothing. A clearly disabled alternative is acceptable
  but hiding is the current, tested behavior.
- After the bump, replace the structural cast and its stale 1.2.0 comments
  with the typed `ThemeContextValue`; keep the runtime capability check as a
  defensive guard, not as the type contract.
- Add a regression test for the capability-absent path: a provider-shaped
  context without `setPalette` renders no palette picker (or a clearly
  disabled one if the product later chooses that).

Account preference flow:

- On sign-in, the existing preference read calls `applyAccountPalette` with
  the stored value; allowed values are applied through `setPalette`, unknown
  or missing values are ignored, and a palette picked locally this session
  wins over an in-flight read.
- A pick is optimistic: `setPalette` runs first, then
  `PUT /api/preferences { key: 'palette', value }`; a failed or rejected
  write restores the previous palette.
- The server `ALLOWED.palette` set accepts `safari` and `garden` and rejects
  other values. No contract or schema change is needed.

Tests and verification:

- `apps/web/src/palettePreference.test.ts`: allowed values applied, unknown
  and non-string ignored, capability absent returns false, optimistic write
  and rollback.
- `apps/web/src/PalettePicker.test.tsx`: both options, selection, single
  change event, current-option click ignored.
- New `App` integration test with the real Teal `ThemeProvider`: garden sets
  `data-palette`, safari removes it, localStorage receives the choice, and a
  capability-absent context hides the picker.
- `apps/server/test/preferences.test.js`: palette accepted and unknown
  rejected (already covered in the palette preference task).
- Gates: `cd home/apps/web && npm test && npm run lint && npm run build`;
  `cd home/apps/server && npm test`; `cd home && python3 -m unittest
  discover -s tests -v`.
- Browser checks after activation, desktop and mobile: light and dark; safari
  and garden; reduced motion; reload keeps the local palette; a second
  browser profile applies the account palette after sign-in; the picker is
  absent or clearly disabled when the installed Teal is forced back to
  1.2.0.

Home patch note (not applied): the only expected source edits are
`apps/web/package.json`, `package-lock.json`, the `App.tsx` cast and
comments, and the capability docs/tests above. Home's server preference API
and contracts do not change.

## 5. Palette set drift check

| Source | Supported names |
| --- | --- |
| Teal `token-source.mjs` (garden overrides plus implicit safari default) | `safari`, `garden` |
| Home web `ALLOWED_PALETTES` (`palettePreference.ts`) | `safari`, `garden` |
| Home server `ALLOWED.palette` (`preferences.js`) | `safari`, `garden` |

There is no name drift today. The same list is maintained in three places,
which is the drift risk: adding a palette requires a coordinated change in
the Teal token source plus regeneration and the WCAG gate, a minor changeset,
both Home lists, and their tests. Record this procedure with the palette
release notes. A future additive export such as `PALETTE_NAMES` from Teal
would let Home derive the list, but it would widen this release beyond the
already-merged surface and is deferred.

## 6. Non-claims

This branch is a local release preparation. It does not publish, push, tag,
deploy, or change any registry dist-tag, and it does not edit Home. The
package version remains 1.2.0 until the owner runs the Changeset release
flow, the tarball evidence was produced only in a local temp directory, and
no production acceptance is claimed.
