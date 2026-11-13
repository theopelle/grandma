#!/bin/bash
# Grandma release check, part A (numbers): run headless.cjs on each made-up test page,
# on desktop and mobile, and print the numbers to compare with tests/right-answers.md.
#
# Usage: NODE_PATH=<folder>/node_modules bash tests/run-numbers.sh <output folder>
# Needs playwright-core in NODE_PATH and Google Chrome (or Playwright's Chromium).
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
script="$here/../skills/grandma/scripts/headless.cjs"
out="${1:?Give an output folder, for example /tmp/grandma-test}"
mkdir -p "$out"

run() { # page width height phrases...
  local page="$1" w="$2" h="$3"; shift 3
  local name; name="$(printf %s "$page" | sed 's/\.html//; s/#/-/')-$w"
  node "$script" "file://$here/pages/$page" "$w" "$h" "$out/$name" "$@" > "$out/$name.json"
  node -e '
    const d = require(process.argv[1]); const e = d.extract;
    console.log(`\n== ${process.argv[2]} (${d.viewport})`);
    for (const f of d.finds) console.log("  find", JSON.stringify(f));
    console.log("  popups", JSON.stringify({ atFirstLook: d.popups.atFirstLook, later: d.popups.afterWaitAndScroll.map(p => `${p.text.slice(0, 30)} (${p.where}${p.appearedLater ? ", appeared later" : ""})`), coveredButtons: d.popups.coveredButtons }));
    console.log("  buttons", JSON.stringify(e.buttons.map(b => b.label)));
    console.log("  bold", JSON.stringify(e.bold));
    console.log("  lowContrastCount", e.contrast.lowContrastCount, "worst", JSON.stringify(e.contrast.worst.slice(0, 2)));
    console.log("  bodyFontMedianPx", e.bodyFontMedianPx, "forms", JSON.stringify(e.forms));
  ' "$out/$name.json" "$name"
}

for size in "1280 800" "390 844"; do
  read -r w h <<< "$size"
  run food-festival.html "$w" "$h" "€18" "14 June" "Parking" "Discover more"
  run "food-festival.html#story" "$w" "$h" "€18"
  run coaching-workshop.html "$w" "$h" "Free workshop"
  run concert-email.html "$w" "$h" "9 October" "Book your seat"
  run chat-popup.html "$w" "$h" "2890" "490 €" "Buy tickets"
done
