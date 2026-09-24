# ADR-0004: Keep theming class-based and explicit about system preference

- Status: Accepted
- Date: 2026-09-24

## Context

Teal themes through CSS custom properties: light values on `:root`, dark values
under `html.dark`, both generated from the canonical token source. The tokens
also set `color-scheme` (`light` on `:root`, `dark` on `html.dark`) so native
form controls, scrollbars, and UA widgets match the active theme.

The library ships no automatic `prefers-color-scheme` behavior: without the
`dark` class, apps render light regardless of the operating system setting.
Consumers currently opt into dark mode by toggling the class themselves (the
docs site does this with a localStorage-backed toggle seeded from the media
query). Several consumers have asked whether the library should follow the OS
automatically instead.

## Decision

Keep dark mode opt-in via the `html.dark` class; do not add automatic
`prefers-color-scheme` switching to the library default.

- Automatic flipping would change the rendered appearance of every existing
  consumer without a code change — a visual breaking change disguised as a
  patch, and inconsistent with the explicit-toggle contract the docs document.
- Consumers who want system-following behavior add one rule to their own CSS,
  which keeps the choice (and any "light-only" escape hatch) in their hands:

  ```css
  @media (prefers-color-scheme: dark) {
    html:not(.light) {
      color-scheme: dark;
      /* paste the html.dark block from @kryv/teal/tokens.css here, or
         duplicate it at build time from the generated token source */
    }
  }
  ```

- `color-scheme` stays paired with the token blocks in the generated
  `tokens.css` so UA widgets never disagree with the component palette.

## Consequences

- Consumers see no behavior change on upgrade; light-until-toggled remains the
  contract.
- System-preference support is opt-in, copy-paste, and per-consumer.
- If a future major release wants automatic dark mode, this ADR is the record
  of why it was not done implicitly.
