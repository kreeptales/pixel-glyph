#!/usr/bin/env bash
# Captures the README screenshots from the deployed docs site with headless Chrome.
# Usage: scripts/screenshots.sh [base-url]
set -euo pipefail

BASE="${1:-https://kreeptales-pixel-glyph.evilld94.workers.dev}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/docs/screenshots"
CHROME="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
mkdir -p "$OUT"

shoot() { # name url width height
  "$CHROME" --headless=new --hide-scrollbars --disable-gpu --virtual-time-budget=6000 \
    --window-size="$3,$4" --screenshot="$(cygpath -w "$OUT/$1.png" 2>/dev/null || echo "$OUT/$1.png")" "$2" 2>&1 | grep -iv "devtools\|gpu\|dbus" || true
  test -s "$OUT/$1.png" && echo "wrote $1.png"
}

shoot intro "$BASE/#intro" 1280 900
shoot playground "$BASE/#playground" 1280 900
shoot mobile "$BASE/#intro" 390 844
