# Authentik visual contract fixture

Disposable Authentik (pinned `ghcr.io/goauthentik/server:2026.5.6`) used to
verify the generated `@kryv/teal/authentik.css` adapter against real flows.

## Run

```bash
npm run fixture:authentik   # compose up + apply brand adapter + create flows
npm run capture:authentik   # recapture snapshots/ (25 PNGs)
npm run fixture:authentik:down
```

`setup.mjs` applies `src/authentik.css` as the default brand's
`branding_custom_css` and installs a dark fixture flow background (flow chrome
text is light by design, so the background asset must stay dark).
`setup-flows.mjs` creates the fixture user, an identification-only recovery
flow, an always-ask consent provider/application, and a deny-policy
application. Bootstrap credentials in `docker-compose.yml` are fixture-only
values for the throwaway local stack.

## Contract

`snapshots/` holds the reviewed reference set: login, WebAuthn, recovery,
consent, and denial, each in light and dark at desktop and phone widths, plus
a reduced-motion desktop capture. Regenerate and review on any token or
Authentik version change, and before upgrading `authentikVersion` in
`packages/teal/authentik-source.mjs`.

The WebAuthn capture stubs `navigator.credentials` so the stage stays on its
honest waiting surface; headless Chromium cannot complete a real ceremony.
