# Production release integrity design

Date: 2026-08-07

Status: Approved for implementation

## Problem statement

`@kryv/teal@0.4.1` is published with exports that point into `dist/`, but its
registry tarball contains no `dist/` files. A clean consumer fails with
`ERR_MODULE_NOT_FOUND` for `dist/index.js`.

The package records Git commit
`3eb164f51270be4a947dbcfeea938e5cb2d60cab`. The corresponding successful
release run built and verified the package in the Quality job, then started a
new Release runner that ran only `npm ci` before direct `npm publish`. Build
outputs never cross runner boundaries, and the Release runner did not rebuild
them. The publish log lists 103 package files, all metadata or source files,
and no `dist/` files.

Current `master` is
`a65fbb02b3965715cc241e3cdc3aad7b6ccc546c`. Its push run was cancelled after
Chromium visual drift and WebKit cancellation. PR 33 is based on that exact
commit and ends at `4ecb63715f918ff5000af6cd408a9ecac176cfe8` with all substantive
hosted checks green. PR 33 contains six total commits: five
dependency/integration commits plus one CI-identical visual baseline. It does
not fix publishing.

## Goals

- Make package creation and trusted publishing fail closed when any declared
  entry point or built distribution file is absent from the package artifact.
- Make the trusted publish job independently build and verify the exact
  tarball it publishes.
- Keep Changesets-generated versions, changelogs, tags, GitHub releases, npm
  provenance, and trusted publishing intact.
- Add lifecycle protection so ordinary direct `npm pack` and `npm publish`
  cannot silently omit `dist/`.
- Remove runtime package fetching and fragile npm 11 `exec` paths from release
  and verification commands.
- Pin GitHub Actions, build images, runtime images, and Authentik fixture images
  to reviewed immutable identities.
- Make the docs runtime non-root, least-privilege, health-checked, scanned, and
  deployable by immutable GHCR digest.
- Preserve PR 33's commits and visual baseline byte-for-byte.
- Repair the broken 0.4 line with a separately reviewed 0.4.2 maintenance
  release before declaring production readiness.

## Non-goals

- Do not publish npm packages, create GitHub releases, merge PR 33, push
  `master`, deploy docs, or mutate npm metadata during this implementation.
- Do not change visual thresholds or regenerate snapshots.
- Do not manually edit `packages/teal/CHANGELOG.md` or other generated files.
- Do not mix the 0.4.2 maintenance release into the main integrity slice.

## Selected approach

Use one exact package artifact as the trusted boundary.

The publish job will build the package in its own clean runner, create one
tarball, validate that tarball, record its package version and SHA-512 digest,
and keep it in a deterministic release-artifact directory. The Changesets
publish command will reject a missing, changed, or version-mismatched artifact
and publish that exact tarball file. It will not ask npm to repack the source
tree.

This is stronger than adding a build before direct `npm publish`, because the
validated and uploaded bytes are identical. It is also stronger than passing
an artifact from Quality, because the OIDC-authorized publish job reconstructs
and verifies the artifact independently.

## Package artifact boundary

A small package-contract module will own the following rules:

- Recursively collect file targets from `main`, `module`, `types`, and every
  condition in `exports`.
- Require every target in the exact `npm pack --json` file manifest.
- Require a non-empty `dist/` directory in the manifest.
- Require every regular file produced in local `dist/` to be present in the
  tarball manifest.
- Reject paths that escape the package or resolve to directories.
- Keep the existing declaration-map source checks, strict Publint validation,
  React 18 and React 19 installs, ESM and SSR imports, CSS export checks,
  Tailwind preset checks, compiled-browser behavior, and accessibility-related
  style assertions against the exact tarball.

The existing package verifier will gain a release mode that keeps the verified
tarball and writes a descriptor containing the tarball path, SHA-512 digest,
and full source commit. Normal verification may continue to clean up its
temporary artifact.

The publisher will not trust a descriptor's file list or package identity. It
will parse the exact tarball again, reject absolute paths, traversal, duplicate
normalized paths, symbolic links, and hard links, and read package name,
version, entry points, and exports from the archived `package/package.json`.
It will compare every archived `dist/` file byte-for-byte with the current
built `dist/`, reject missing or extra distribution files, verify the current
checkout and descriptor name the same full source commit, and recompute the
tarball digest. Only then will it invoke `npm publish` on that exact file with
public access and provenance. Its stdout will remain compatible with
Changesets' published-package discovery.

## Lifecycle defense

The package `prepack` lifecycle will:

1. Build from source.
2. Ask npm for the exact dry-run pack manifest with lifecycle scripts disabled
   only for that nested inspection.
3. Run the same entry-point and `dist/` contract.

Npm runs `prepack` for both `npm pack` and `npm publish`. A contract failure
exits nonzero and aborts the command. The official trusted path remains
stronger because it validates and publishes the same retained tarball.

Package tooling will use locked npm scripts or resolved local CLI modules.
Workflow `npx` fetches and verifier `npm exec` calls will be removed. LHCI will
be a direct locked dependency. Node will be pinned to the current Node 24 LTS
patch and npm to a reviewed npm 11 patch across version files, package metadata,
local verification, and CI.

## Trusted workflow architecture

Release planning, versioning, and publishing will be separate jobs after the
quality, browser, Lighthouse, and production-image gates.

- Release planning has read-only contents permission. Registry errors other
  than a confirmed missing version fail closed.
- Versioning runs only when Changesets exist. It has contents and pull-request
  write permissions, no OIDC permission, and uses Changesets `commitMode:
  github-api` so checkout credentials remain disabled.
- Publishing runs only when the repository version is not published and no
  Changesets remain. It has contents write permission for the expected tag and
  GitHub release plus OIDC for npm provenance, but no pull-request write
  permission. It installs locked dependencies and Chromium, independently
  builds and verifies the retained exact tarball, then invokes Changesets with
  the exact-tarball publish command.

All checkouts use `persist-credentials: false`. Every action reference is a
full 40-character commit SHA. The selected current Node 24 generations are:

- `actions/checkout` v7.0.1 at
  `3d3c42e5aac5ba805825da76410c181273ba90b1`
- `actions/setup-node` v7.0.0 at
  `820762786026740c76f36085b0efc47a31fe5020`
- `changesets/action` v1.9.0 at
  `3841a0683d3cfa6dae0f9bb335290003010fe3f0`
- `docker/login-action` v4.6.0 at
  `dbcb813823bdd20940b903addbd779551569679f`
- `docker/build-push-action` v7.3.0 at
  `53b7df96c91f9c12dcc8a07bcb9ccacbed38856a`

Jobs will have explicit timeouts. Pull-request work may cancel stale runs,
while versioning, publishing, and an active production deployment will not be
cancelled midway through mutation.

## Docs image contract

Every Dockerfile `FROM` will use an exact version and multi-platform digest.
The initial reviewed candidates are:

- `node:24.19.0-alpine3.24@sha256:d32cdf619f63fe0471182d08996dd516c6275bb5fd31ae06e55a570bd9e1ad43`
- `nginxinc/nginx-unprivileged:1.30.4-alpine3.24@sha256:44e36330f74d4f3a1d4e222acca9e23b401fb87811a7597024502bb759c4dd49`

The final image will run as the image's unprivileged user and listen on port
8080. The nginx configuration will retain the current CSP and security headers
and expose a deterministic health endpoint.

Compose will keep loopback-only host publication and the
`TEAL_DOCS_IMAGE` override. It will use an unprivileged internal port, a
read-only root filesystem, `cap_drop: [ALL]`, `no-new-privileges`, bounded
tmpfs mounts for required writable paths, and a health check. It will not set
`pull_policy: never`, because production must be able to pull the selected
immutable GHCR digest.

A production-image job will build and load a commit-specific candidate, save
that exact image to a Docker archive, and scan the archive for secrets and
fixable HIGH or CRITICAL vulnerabilities. The digest-pinned scanner will run
with a read-only root filesystem, all capabilities dropped, no-new-privileges,
and no Docker socket mount. The same candidate will be smoke tested for health
and required headers under hardened Compose settings.

The verifier will create a unique disposable Compose project and a generated
configuration with a dynamically allocated loopback host port. It will never
reuse the repository's default project, service container, or port, and its
cleanup will target only that unique project. Both verification and deployment
will use `--no-build` so the selected image cannot be replaced from source.

The production deployment job will repeat archive scan and smoke checks on its
exact candidate before push, resolve the pushed repository digest, and deploy
`ghcr.io/.../teal-docs@sha256:...`. The remote rollout will capture the
previous immutable repository digest, pull the new digest, start it with
`--no-build`, and prove the running container's image ID and configured image
reference resolve to the pushed digest. A failed proof or health check will
roll back with `--no-build` to the previously captured immutable digest.

The initial scanner candidate is
`aquasec/trivy:0.73.0@sha256:7cced7cae583819fc7806d4cbc0dbbc7cad18b99f7d3e235192e6da8c091045c`.

## Authentik fixture contract

The fixture services will use exact version and digest identities:

- `postgres:16.14-alpine3.24@sha256:57c72fd2a128e416c7fcc499958864df5301e940bca0a56f58fddf30ffc07777`
- `redis:7.4.10-alpine3.21@sha256:e7723ff73d963f5cc6d9c4643ea3d989527a402a319239054e9472a7fb9219a2`
- `ghcr.io/goauthentik/server:2026.5.6@sha256:ed120caf710ccf82ef0026f0bc74e51615bc95ebff228a7a2d6fc60c441c3868`
  for both server and worker

Static contract tests will reject floating tags or malformed digests. The
existing fixture behavior remains disposable and loopback-bound.

## PR 33 integration

After the spec gate, merge `origin/dep-integration` into the isolated feature
branch. Preserve all six PR 33 commits, including the visual baseline blob,
exactly. Do not squash, rewrite, regenerate, or adjust its snapshots or
thresholds.

Release-integrity changes will be implemented in later commits so review can
separate the already-green dependency baseline from new behavior.

## Broken 0.4.1 remediation

The maintenance repair is a separate protected slice after the main integrity
machinery passes Standards and Spec review.

Create `release/0.4.x` from reviewed commit
`b268455`, backport only the reviewed release-integrity machinery, and add a
patch Changeset. Changesets will generate version 0.4.2 and its changelog. The
maintenance commit must pass the complete hosted quality, browser, Lighthouse,
package, image, and security gates before a separately authorized trusted
publish.

Required release evidence includes:

- Exact reviewed source and release commit SHAs.
- Hosted gate URLs and conclusions.
- Generated version and changelog diff.
- Tarball SHA-512, file manifest, all export checks, and clean React 18 and 19
  consumers.
- npm trusted-publishing provenance and Sigstore transparency entry.
- Registry `gitHead`, package integrity, expected version tag, and GitHub
  release tied to the reviewed commit.

Only after 0.4.2 is verified should 0.4.1 be deprecated with a message directing
consumers to 0.4.2 or 0.5.0. The final state after both releases must place
`latest` at verified 0.5.0 while a fresh `^0.4.1` resolution selects verified
0.4.2. Any intermediate `latest` value is temporary evidence, not the final
acceptance state.

No registry, tag, release, deprecation, or hosted deployment mutation is
authorized in the current implementation slice.

## Test and review strategy

Implementation starts with failing public contract tests for:

- Missing declared exports and missing `dist/` entries in a pack manifest.
- A clean `npm pack` lifecycle producing a complete package.
- Exact retained-artifact version and digest validation before publish.
- Release job isolation, build-and-verify ordering, permissions, action pins,
  checkout credential handling, timeouts, and concurrency.
- Locked local Playwright and Lighthouse execution without runtime fetches.
- Exact Dockerfile and fixture image identities.
- Non-root runtime, port, health, security headers, immutable image binding,
  and Compose hardening.

After red-green-refactor, run:

- The complete Node 24 `npm run verify` gate.
- Package lifecycle and retained-artifact tests from a clean tree.
- Chromium, mobile Chromium, Firefox, and WebKit browser projects without
  threshold or snapshot changes.
- Docs image build, vulnerability scan, secret scan, hardened runtime smoke,
  header checks, and health checks.
- Authentik fixture configuration validation.
- `git diff --check` and repository secret scanning.
- Mandatory two-axis Standards and Spec review.

No push, publish, release, registry mutation, docs deployment, or PR merge will
occur without explicit parent direction after this evidence is reviewed.
