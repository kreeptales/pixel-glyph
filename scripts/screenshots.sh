#!/usr/bin/env bash
# Captures the README screenshots from the deployed docs site with headless Chrome.
# Usage: scripts/screenshots.sh [base-url]
set -euo pipefail

BASE="${1:-https://kreeptales-pixel-glyph.evilld94.workers.dev}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/docs/screenshots"
CHROME="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
# Chrome enforces a minimum window width, so the phone shot uses Playwright's headless shell (no minimum).
HEADLESS_SHELL="${HEADLESS_SHELL:-$(ls "$LOCALAPPDATA"/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-win64/chrome-headless-shell.exe 2>/dev/null | tail -1)}"
mkdir -p "$OUT"

shoot() { # binary name url width height [extra flags]
  local bin="$1" name="$2" url="$3" w="$4" h="$5"
  shift 5
  "$bin" --headless --hide-scrollbars --disable-gpu --virtual-time-budget=6000 "$@" \
    --window-size="$w,$h" --screenshot="$(cygpath -w "$OUT/$name.png" 2>/dev/null || echo "$OUT/$name.png")" "$url" 2>&1 | grep -i "written" || true
}

shoot "$CHROME" intro "$BASE/#intro" 1280 900
shoot "$CHROME" playground "$BASE/#playground" 1280 900
shoot "$HEADLESS_SHELL" mobile "$BASE/#intro" 390 844 --force-device-scale-factor=2
