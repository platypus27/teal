#!/bin/sh
# Runs at container start (nginx image executes /docker-entrypoint.d/*.sh).
# Copies this image's docs build into the versions volume and regenerates the
# root index listing, so rebuilt images accumulate releases instead of
# replacing them.
set -eu

HTML_ROOT=/usr/share/nginx/html
VERSION="$(cat /opt/docs-dist/version.txt)"
TARGET="$HTML_ROOT/$VERSION"

mkdir -p "$HTML_ROOT"
rm -rf "$TARGET.new"
cp -r "/opt/docs-dist/$VERSION" "$TARGET.new"
rm -rf "$TARGET"
mv "$TARGET.new" "$TARGET"

latest="$(ls -1 "$HTML_ROOT" | grep -E '^[0-9]+\.[0-9]+\.[0-9]+$' | sort -V | tail -1)"
{
  printf '<!doctype html><html lang="en"><head><meta charset="utf-8">'
  printf '<title>Teal documentation</title>'
  printf '<meta http-equiv="refresh" content="0; url=/%s/">\n' "$latest"
  printf '<style>body{font-family:system-ui,sans-serif;max-width:30rem;margin:4rem auto;padding:0 1rem}li{margin:.4rem 0}</style>'
  printf '</head><body><h1>Teal documentation</h1><p>Pick a version:</p><ul>'
  for v in $(ls -1 "$HTML_ROOT" | grep -E '^[0-9]+\.[0-9]+\.[0-9]+$' | sort -Vr); do
    printf '<li><a href="/%s/">%s%s</a></li>\n' "$v" "$v" "$([ "$v" = "$latest" ] && printf ' (latest)')"
  done
  printf '</ul></body></html>\n'
} > "$HTML_ROOT/index.html"
