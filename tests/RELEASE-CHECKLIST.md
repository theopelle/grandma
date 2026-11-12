# Release checklist

Claude runs this before every release of Grandma (every new version number), and writes the results down. A person only needs to read the results file at the end.

**A failed test blocks the release** until it is fixed, or explained in the results file (why the difference is acceptable). Don't tag or push a release with an unexplained failure.

## The test pages

| Page | Where | Public? |
|---|---|---|
| A, B, C: made-up pages with planted problems | `tests/pages/`, right answers in `tests/right-answers.md` | Yes |
| R1, R2, R3: real pages tested by hand before | listed in `tests/private/real-pages.md` | No: `tests/private/` is git-ignored, never pushed |

If `tests/private/` is missing (for example in a fresh copy from GitHub), run the made-up pages only and say so in the results.

## 0. Set up

1. Node 18 or later, and Google Chrome (or Playwright's own Chromium).
2. In a temporary work folder: `npm install playwright-core`. Every command below runs with `NODE_PATH=<work folder>/node_modules`.

## 1. Numbers: the scripts

Run from the repository folder:

```bash
NODE_PATH=<work folder>/node_modules bash tests/run-numbers.sh <output folder>
```

It runs `skills/grandma/scripts/headless.cjs` on each made-up page, on desktop (1280x800) and mobile (390x844), with the answer phrases from `tests/right-answers.md`, and prints the results. Compare every row with `tests/right-answers.md`:

- `found`, `inSkim`, and the level: exactly right.
- `wordsBefore`, `skimWordsBefore`, `wordsOnPage`, `skimWordsOnPage`: within 10% (counts under 30: within 3 words).
- The extract lines listed for each page (buttons, headings, bold, forms, contrast): the same items.
- Also open one first-look screenshot per page to check the page actually rendered.

## 2. Reports: Grandma herself

Run Grandma **twice per test page**: the 3 made-up pages and the 3 real ones, so 12 runs. Each run must be fresh: a new agent or session that has not seen `tests/right-answers.md`, the private notes, or the other run. Run them on desktop only (mobile is covered by part 1) to keep the cost down. They can run in parallel.

Give each run this request, filled in from the page's section in `tests/right-answers.md` or `tests/private/real-pages.md`:

> Use the Grandma skill in `<repo>/skills/grandma/`: read its SKILL.md and follow it exactly, as if a user had typed the request below. Use headless Chrome (playwright-core is installed: `NODE_PATH=<work folder>/node_modules`). Don't open anything in `<repo>/tests/` other than the page you're given.
>
> Request: `/grandma <mission or "full check">: <page address>`, desktop.
>
> Return the full report exactly as you would show it to the user. Then, on a last line: `NUMBERS: result=<...> | level=<1-4> | words=<word count you used> | clicks=<n> | score=<x/10 or none>`.

For the made-up pages, use `file://<repo>/tests/pages/<page>.html` as the address.

Then compare:

**Made-up pages (A, B, C), each run against `tests/right-answers.md`:**
- Result and reading-effort level: exactly right.
- The word count she used: within 10% (counts under 30: within 3 words).
- Every planted problem is in the report.

**Real pages (R1, R2, R3), run 1 against run 2:**
- Same result (or the same check results, for a full check) and the same reading-effort level.
- Scores at most 1 point apart (full checks only).
- Any known issue in the private notes (like a broken button link) is in both reports. If it is missing, count that as a failure too.

Also glance at each report for the layout rules in SKILL.md (result table first, the meter for reading effort, Jerry's block, one tip). A layout slip is not a failure, but note it.

## 3. Write down the results

- Made-up pages: `tests/results/v<version>.md` (public). One table for the numbers, one for the reports, then a list of every failure with what was fixed or why it is acceptable.
- Real pages: `tests/private/runs-<date>.md` (private). The same, without copying page text into the public file.
- In the public file, the real pages are only "R1, R2, R3" with pass or fail.

## 4. Release

Only when every test passes or every failure is explained:

1. Bump `version` in `.claude-plugin/plugin.json`.
2. Commit, with the results file.
3. **Ask Théo before pushing or tagging.** The repository is public, and pushing a `v*` tag publishes the release.
