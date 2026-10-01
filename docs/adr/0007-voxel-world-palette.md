# ADR-0007: Adopt the voxel-world palette for Teal 1.0

- Status: Accepted
- Date: 2026-10-01

## Context

The redesign-2026 program ran Phase 0 as throwaway mockups in
`home/mockups/redesign-2026` (see its `NOTES.md`). The owner reviewed the
candidates on 2026-09-30 → 2026-10-01 and captured the answers:

- **Worlds**: three approved, not one — open safari, open garden, and
  archipelago. All three share a single token/chrome layer, so the design
  language must be world-agnostic; the front door can offer world-switching
  rather than committing to one scene. The two island variants were rejected.
- **Subdomains stay**: each product keeps its own subdomain and gains a
  per-product accent color; the shared chrome does not flatten product
  identity.
- **Design language**: the token set in the mockups' `shared.js` — warm cream
  glass over sky by day, deep teal glass by night, the voxel bevel shadow,
  per-product accents (home teal / photos blossom / yang amber / trict coral /
  twinkle violet), Plus Jakarta Sans + Manrope, radii 10/14/20/28, one ease
  curve — is the brief for `@kryv/teal` 1.0.

Teal's previous palette ("Minimal Teal": white surfaces, cool teal ink,
12px radii, 150/200ms motion) could not express that brief, and the token
generator had no way to emit per-theme values for non-color tokens such as
shadows.

## Decision

Revalue the existing Material-style tokens in
`packages/teal/token-source.mjs` to the voxel-world palette, keeping every
existing token name so components pick up the new look purely through CSS
variables and `teal-u-*` utilities:

- **Surfaces** move from white/cool-gray to warm cream glass day
  (`surface` `#fcf7ea`, sunken containers `#f7f0de`, chips `#fcfaf0` over a
  `#f7edd4` background) and deep teal glass night (`#0d1e26` family over a
  near-black teal background).
- **Ink** moves to soft green-black day (`#22423a`, variant `#4c6a60`) and
  pale mint night (`#dcefe6`, variant `#93b3a8`).
- **Primary** stays teal (`#0f6a6c` day / `#2dd4bf` night); secondary and the
  fixed/container families keep their roles.
- **Status**: success → `tertiary` (`#2e7d4f`/`#4ade80`), error →
  (`#b3372b`/`#ff7a6b`), warning revalued to `#865914`/`#f5b14c` — the day
  value is darkened from the mockup amber `#b97b1e` because the mockup value
  reaches only ~2.9:1 text contrast on tinted chips; the WCAG AA contrast
  tests are the contract and were not weakened. New `teal-color-stale`
  (`#717d6f`/`#6b7a70`) covers the fourth status dot.
- **New per-product accents** `teal-color-product-{home,photos,yang,trict,twinkle}`
  give each subdomain its identity color in both themes. They are decorative
  roles and are intentionally not added to `contrastPairs`.
- **Radii** revalue to the 10/14/20/28 scale: control 0.875rem, surface
  1.25rem, nested stays `calc(control - 0.25rem)` (0.625rem), new
  `radius-xl` 1.75rem, pill unchanged.
- **Motion**: fast revalued 150ms → 160ms; new `motion-med` 320ms,
  `motion-slow` 600ms, and `motion-ease` `cubic-bezier(0.22, 1, 0.36, 1)`;
  `motion-standard` 200ms stays for existing small transitions.
- **Shadow**: new theme-aware `teal-shadow-voxel` (inset top highlight +
  deep ambient drop). To support it, shared tokens may now be declared as
  `{ light, dark }` objects; the generator emits the light value in `:root`
  and the dark value in `html.dark`, generically for any shared token.
- **Borders** revalue to warm umber day (`outline` `#7a5a30`, variant a warm
  sand) and cool sea-glass night, matching the mockup border hues at full
  strength (the mockup's alpha compositing still comes from
  `border-subtle`/`border-strong`).

## Consequences

- Every Teal consumer reskins on upgrade with no component API change; this
  is still a major visual break, so the changeset marks `@kryv/teal` for a
  major bump toward 1.0.
- The AA contrast suites (`test/tokens.test.ts`, a11y tests) pass unchanged in
  structure — only the expected token count and the theming-hook list were
  extended for the new tokens.
- `tailwind.preset.js` gains `teal-xl` radius, `teal-voxel` shadow, motion
  durations, and the voxel ease; the docs Foundations page lists the new
  swatches and hooks.
- Remaining redesign work (EcosystemShell, ThemeProvider, SettingsShell,
  world scenes) builds on these tokens in later steps; this ADR covers the
  token layer only.
