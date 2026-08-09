# Teal

Kryv Labs shared React design system. Teal provides typed React modules,
semantic design tokens, compiled styles, and a documentation site with live
examples, interactive playgrounds, and generated interface tables.

Documentation: <https://teal.kryvlabs.com>

## Install

```bash
npm install @kryv/teal
```

Import the required module styles once in the application entrypoint:

```js
import '@kryv/teal/styles.css'
```

The optional base stylesheet applies Teal typography, body colors, selection,
and scrollbar defaults:

```js
import '@kryv/teal/base.css'
```

Use modules from the package root:

```jsx
import { Button, Field, Input } from '@kryv/teal'

<Field label="Workspace name" required>
  <Input />
</Field>
<Button>Save changes</Button>
```

## Supported environment

- React 18 or 19, any package manager (npm, pnpm, yarn, bun)
- Modern ESM bundler
- Tailwind is not required to render Teal modules
- Tailwind 3 applications can extend `@kryv/teal/tailwind-preset` for semantic utility classes

Teal uses Radix internally for complex interaction behavior and Lucide for SVG
icons. Radix is not part of the public interface.

## Modules

Teal has 200 documented module pages across nine groups: Actions, Forms,
Surfaces, Overlays, Feedback, Navigation, Data, Layout, and Utilities. The
generated registry and per-module records are the source of truth for the
catalog, interface reference, examples, and accessibility guidance.

## Workspace

- `packages/teal`: published package - tokens, source, compiled styles, and interface tests
- `apps/docs`: documentation site - live examples, interactive playgrounds, generated interface tables, keyboard documentation, recipes, and browser tests

## Development

Repository development is locked to Node 24.19.0 and npm 11.19.0.

```bash
npm ci
npm run verify
```

`npm run verify` runs the dependency audit, production-integrity contracts,
lint, typecheck, unit tests, generated-output checks, both workspace builds,
package lifecycle checks, and packed React 18/19 consumer verification. Pull
requests also run all four Playwright projects, locked Lighthouse, and an exact
production-image scan and smoke test in CI.

Run the documentation site locally:

```bash
npm run dev --workspace @kryv/teal-docs
```

Build and serve it with Docker:

```bash
docker compose up --build
```

The site is available at `http://localhost:8087`. The container restarts
automatically (`restart: unless-stopped`), so the docs stay up across reboots.
In production the container sits behind the Traefik reverse proxy, which serves
it publicly at <https://teal.kryvlabs.com> with a Cloudflare-issued TLS
certificate.

To reproduce the production image gate locally without touching the default
Compose project:

```bash
revision="$(git rev-parse HEAD)"
source_url="https://github.com/platypus27/teal"
docker build \
  --label "org.opencontainers.image.revision=$revision" \
  --label "org.opencontainers.image.source=$source_url" \
  -f apps/docs/Dockerfile \
  -t teal-docs:production-integrity .
npm run verify:docs-image -- \
  --image teal-docs:production-integrity \
  --revision "$(git rev-parse HEAD)" \
  --source https://github.com/platypus27/teal
```

The verifier scans a read-only Docker archive for fixable HIGH/CRITICAL
vulnerabilities and secrets, then starts a random isolated Compose project on a
dynamic loopback port and proves the running image ID and security headers.

## Release policy

Teal remains pre-1.0 while its interfaces are proven across Kryv applications.
Releases use Changesets and generated release notes. Versioning and trusted
publishing are separate least-privilege jobs. Trusted publishing rebuilds and
verifies one retained tarball, reopens that exact archive, compares every
compiled byte to the checkout, and publishes only that file. Product-specific
status mappings, persistence, data queries, and domain language stay in
consuming applications.

### Protected release operations

Protected production mutation is split from candidate creation. A protected
push to `master` runs every quality, browser, Lighthouse, and production-image
gate in `.github/workflows/pipeline.yml`. Only after those gates pass does the
`release_candidate` job retain one complete artifact closure:

- the exact npm tarball and descriptor;
- the exact documentation image archive;
- a CycloneDX SBOM and separate passing vulnerability and secret receipts;
- the reviewed deployment model and complete Git source bundle;
- the fixed production controller archive and runtime verification modules; and
- a canonical `candidate-manifest.json` that hashes every retained byte.

The hosted candidate job signs an artifact attestation for the manifest and
uploads the complete directory as
`teal-release-candidate-<run-id>-<run-attempt>`. The SHA-256 of the canonical
manifest is the candidate identity. Never approve files reconstructed from a
checkout, another run, or another manifest digest.

Production mutation is available only through
`.github/workflows/protected-release.yml`:

- `npm-publish` downloads the prior candidate onto a GitHub-hosted OIDC runner,
  verifies its protected producer attestation and complete closure, consumes
  the owner decision through an append-only Git tag, publishes only the
  retained tarball, cryptographically audits the registry signatures and SLSA
  provenance against the exact package digest, source commit, protected
  workflow, and hosted publication run, then reconciles the exact tag and
  GitHub release. A fresh publish must match the current protected run. If the
  runner stops after npm accepts the package, the candidate-and-approval tag
  permits recovery only when the exact registry bytes and prior protected
  provenance already exist. Recovery cannot publish an absent version.
- `docs-deploy` downloads the same prior candidate onto the dedicated
  `teal-production` runner, verifies the hosted attestation, and delegates the
  candidate to `/usr/local/libexec/kryv-teal-production-controller`. The
  runner must not have Docker-group access. The fixed root controller verifies
  the candidate again, durably consumes the owner decision, pushes the exact
  scanned image, deploys its immutable repository digest, observes runtime
  identity and health, and verifies rollback on failure. A mode-0600 deployment
  transaction is fsynced before each mutation phase. Deploy and observation
  recover an interrupted rollout under the same production lock before doing
  new work.

Configure `teal-release` and `teal-production` as protected GitHub
environments with required owner reviewers, prevent self-review, and restrict
deployment branches to protected `master`. Protect `master` with the complete
pipeline checks. Protect `refs/tags/kryv-approval/**` against update and
deletion so npm approval consumption remains durable. npm trusted publishing
must name `.github/workflows/protected-release.yml` and the `teal-release`
environment. The environment secret `TEAL_OWNER_APPROVAL_PUBLIC_KEY` contains
only the trusted Ed25519 public key. The private key stays offline with the
owner.

The checked-in trust anchor at `infra/release-owner-approval.json` is pinned to
the owner's Ed25519 public key fingerprint
`sha256:5bbbce350b985715b402c4af0b8ff88c8a50e25243f848aa4076509bb652403c`.
Rotate it only through a reviewed protected commit after the owner approves the
replacement key. The fingerprint must match the supplied or installed public
key exactly.

After downloading and independently inspecting the candidate, create a
canonical approval manifest with this exact field order:

```json
{
  "schemaVersion": 3,
  "decision": "approve",
  "owner": "kryv-owner",
  "operation": "npm-publish",
  "mutations": [
    "npm-publish-if-absent",
    "github-tag-reconcile",
    "github-release-reconcile"
  ],
  "approvalReference": "owner-controlled reference",
  "nonce": "base64-encoded 32-byte owner-generated nonce",
  "createdAt": "2026-08-07T00:00:00.000Z",
  "expiresAt": "2026-08-07T00:15:00.000Z",
  "repository": "platypus27/teal",
  "environment": "teal-release",
  "workflow": "platypus27/teal/.github/workflows/protected-release.yml",
  "ref": "refs/heads/master",
  "sourceCommit": "40-character reviewed commit",
  "sourceRunId": "candidate workflow run ID",
  "sourceRunAttempt": 1,
  "candidateSha256": "sha256 of candidate-manifest.json",
  "artifact": {
    "name": "@kryv/teal",
    "version": "version from the candidate descriptor",
    "integrity": "sha512 integrity from the candidate descriptor",
    "gitHead": "same 40-character reviewed commit"
  }
}
```

For `docs-deploy`, `mutations` is exactly `registry-push` followed by
`production-deploy`, `environment` is `teal-production`, and the artifact
object contains the exact `imageId`, `archiveSha256`, and `repository` from
the retained docs descriptor. The decision is bound to the protected mutation workflow,
protected ref, source commit, source run and attempt, candidate digest,
operation, environment, mutation set, and exact artifact.

Generate a fresh cryptographically random 32-byte nonce for every decision and
encode it as canonical base64. `expiresAt` must be after `createdAt` and no more than 15 minutes
later. Canonicalize with
`canonicalApprovalManifest` from `scripts/owner-approval.mjs`, compute the
manifest SHA-256 digest, and sign the exact UTF-8 message
`Kryv Teal protected mutation approval\n<DIGEST>\n` with the offline Ed25519
private key.

Dispatch `.github/workflows/protected-release.yml` from protected `master`
with these exact inputs:

- `operation`;
- `source_run_id` and `source_run_attempt`;
- `source_revision`;
- `candidate_sha256`;
- `approval_manifest_base64`;
- `approval_digest`; and
- `approval_signature`.

Before a docs release, build the controller archive from the reviewed candidate
source, compare its digest with the candidate manifest, and install it during a
separate root-controlled host ceremony:

```bash
node scripts/install_production_controller.mjs \
  --archive /trusted/kryv-teal-production-controller.tar \
  --archive-sha256 'sha256:<digest-from-candidate-manifest>' \
  --owner-public-key /trusted/kryv-owner-ed25519.pub.pem \
  --target-root / \
  --activate
```

The installer pins the archive, trust anchor, and owner public key; installs an
environment-clearing `flock` wrapper and narrow sudo rule for the
`teal-production-runner` group; creates the mode-0700 approval ledger and
release store; and enables the recurring observation timer. Every controller
generation is retained under `/usr/local/share/kryv-teal-production/generations`.
The fixed wrapper verifies Node v24.19.0 on every invocation and resolves the
single atomic `/usr/local/share/kryv-teal-production/current` selector. Static
systemd, sudoers, and wrapper bootstraps must remain byte-identical across an
upgrade; changed bootstraps require a separate root-reviewed migration.

A failed or incomplete candidate, attestation, environment, runner, key,
signature, replay, expiry, runtime-identity, health, or observation check leaves
the operation fail-closed. An automatic failed rollout restores and observes
the prior retained release. A planned rollback redeploys the prior retained
candidate through a fresh owner approval. No new publish, push, or deployment
is authorized from checkout state or an expired or reused decision. A durable
npm recovery tag can finish verification and reconciliation for an already
published exact version, but cannot authorize a delayed publish. No rollback is
authorized without a fresh decision for the prior retained candidate.

## License

MIT - Copyright (c) 2026 Kryv Labs
