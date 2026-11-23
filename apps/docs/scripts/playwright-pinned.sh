#!/usr/bin/env bash
# playwright-pinned.sh - run a command inside the pinned Playwright image.
#
#   apps/docs/scripts/playwright-pinned.sh [-e NAME]... -- <command...>
#
# Example (the docs browser gate; add --update-snapshots after the command's
# own `--` to regenerate its baselines in this same environment):
#   apps/docs/scripts/playwright-pinned.sh -- npm run test:e2e -w @kryv/teal-docs
#
# The repository is mounted at the same absolute path it has on the host, so
# relative paths in config and specs stay valid. The image's own Node is used,
# except on GitHub Actions where the runner's Node (the version setup-node
# installed, which the repository's engines field requires) is mounted
# read-only. Files are written as the calling user. Works on a hosted runner
# and on a developer machine with Docker. See
# apps/docs/scripts/playwright-image.env. TZ and LANG are pinned so date,
# time, and locale sensitive rendering cannot drift between machines.

set -euo pipefail

root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../.." && pwd)"
# shellcheck source=playwright-image.env
. "$root/apps/docs/scripts/playwright-image.env"

pass=()
while [ "$#" -gt 0 ]; do
  case "$1" in
    -e) pass+=(-e "${2:?-e needs a variable name}"); shift 2 ;;
    --) shift; break ;;
    *) echo "playwright-pinned: usage: $0 [-e NAME]... -- <command...>" >&2; exit 2 ;;
  esac
done
[ "$#" -gt 0 ] || { echo "playwright-pinned: no command given" >&2; exit 2; }

# npm may hoist @playwright/test to the workspace root or keep it in the
# consuming workspace (npm 12 keeps single-consumer workspace devDependencies
# local), so probe both locations. Never fail the pipeline: this check must
# produce the friendly error below, not die on sed's exit status.
installed=""
for candidate in \
  "$root/node_modules/@playwright/test/package.json" \
  "$root/apps/docs/node_modules/@playwright/test/package.json"
do
  [ -f "$candidate" ] || continue
  installed="$(sed -n 's/^[[:space:]]*"version": "\([^"]*\)".*$/\1/p' "$candidate" 2>/dev/null | head -n 1 || true)"
  [ -n "$installed" ] && break
done
[ -n "$installed" ] || { echo "playwright-pinned: run npm ci first (node_modules/@playwright/test is missing)" >&2; exit 1; }
if [ "$installed" != "$PLAYWRIGHT_VERSION" ]; then
  echo "playwright-pinned: @playwright/test $installed is installed but the pinned image is Playwright $PLAYWRIGHT_VERSION; update apps/docs/scripts/playwright-image.env and the @playwright/test devDependency, then regenerate the baselines" >&2
  exit 1
fi

docker_args=(
  run --rm --init --ipc=host --network host
  --user "$(id -u):$(id -g)"
  -e HOME=/tmp -e CI=1 -e TZ=UTC -e LANG=C.UTF-8 -e LC_ALL=C.UTF-8
  -v "$root:$root" -w "$PWD"
)
if [ "${GITHUB_ACTIONS:-}" = true ]; then
  node_dir="$(dirname -- "$(dirname -- "$(command -v node)")")"
  docker_args+=(-v "$node_dir:$node_dir:ro" -e "PATH=$node_dir/bin:/usr/local/bin:/usr/bin:/bin")
fi

exec docker "${docker_args[@]}" "${pass[@]}" "$PLAYWRIGHT_IMAGE" "$@"
