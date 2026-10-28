#!/usr/bin/env bash
# Downloads the Wikimedia Commons images listed in scripts/media-list.txt (local-name|Commons file title).
# Licences/authors are recorded in src/data/media.ts. Throttled to respect Commons rate limits.
set -u
cd "$(dirname "$0")/.."
mkdir -p public/media/raw
while IFS='|' read -r name title; do
  [ -z "$name" ] && continue
  out="public/media/raw/$name.jpg"
  [ -s "$out" ] && continue
  enc=$(node -e 'process.stdout.write(encodeURIComponent(process.argv[1].replace(/ /g,"_")))' "$title")
  curl -sL --max-time 60 -A "ChelseaDigitalExperience/1.0 (portfolio demo)" -o "$out" "https://commons.wikimedia.org/wiki/Special:FilePath/$enc?width=1920"
  echo "$name $(wc -c < "$out")"
  sleep 3
done < scripts/media-list.txt
