# 0012. Docs browser suite and dev server reserve ports per run

Date: 2026-11-20

## Status

Accepted

## Context

The docs app pinned every server to 5173: `vite` dev, `vite preview` for the
Playwright webServer, and all four project baseURLs. On the shared
development host, where several agents run Teal and Home suites at the same
time, the second run failed on a busy port (the preview used `--strictPort`)
or attached to the first run's server. Teal had no port story of its own, and
inventing a different one per repo would only move the collision.

## Decision

- `apps/docs/scripts/e2e-ports.mjs` reserves free loopback ports per run,
  adapted from kryv-home's proven `scripts/e2e-ports.mjs` (see Home
  ADR-0043). Candidates come from 20000-32000 minus the kernel's ephemeral
  range and are proven bindable on `127.0.0.1` and `::1`; each reservation is
  also claimed in a per-user registry of owner-stamped marker files so a port
  released before its server binds cannot be stolen, and stale claims from
  dead owners are reclaimed under a per-port lock. The registry directory is
  the same one Home uses (`$XDG_RUNTIME_DIR/kryv-e2e-ports`, overridable
  with `KRYV_E2E_PORT_REGISTRY`), so Teal and Home runs allocate from one
  pool and never claim each other's ports.
- `playwright.config.js` resolves its port with `runPort('TEAL_DOCS_E2E_PORT')`
  at config load. The first evaluation (the runner) reserves and publishes
  the port; Playwright re-evaluates the config in every worker with the
  runner's environment, and the webServer command inherits it, so the
  preview server, `baseURL`, and the specs always agree. Setting
  `TEAL_DOCS_E2E_PORT` explicitly pins a port (validated, not claimed).
- The dev server keeps 5173 as its default but no longer hard-fails when the
  port is busy: `strictPort` stays off unless `TEAL_DOCS_PORT` is set, in
  which case the pinned port is enforced. A pinned dev port fails loudly
  instead of silently serving elsewhere.

## Consequences

- Any number of docs suites and dev servers run concurrently on the shared
  host from one checkout or several worktrees; nothing serializes on 5173.
- Agents (or sandboxes) that cannot see the default registry point
  `KRYV_E2E_PORT_REGISTRY` at a shared directory, exactly as Home runs do.
- A hand-run `npm run dev` still starts at 5173 when free, matching
  documented muscle memory; only collisions auto-bump.
