# Roadmap

Agreed on 12 November 2026. One focused improvement per release, each tested in Cowork before the next one starts.

| Step | What | Status |
|---|---|---|
| v1.3 | Trust: test pages and a release checklist | Shipped 12 Nov 2026 (v1.3.0) |
| v1.3.1 | Version number inside the skill | Shipped 13 Nov 2026 (v1.3.1) |
| v1.3.2 | Fixes from the Cowork test: private window, chat pop-ups, cookie boxes no longer blocking | In progress (started 13 Nov 2026) |
| v1.4 | Company mode, shipped for one company (NBF), plus an update check for ZIP users | Next, after v1.3.2 |
| Rollout | NBF team: demo and launch checklist | Planned |
| v1.5 | Several clients, for agencies and freelancers | Planned |
| Launch | LinkedIn post | Planned |

## Every release

1. Raise the version in `.claude-plugin/plugin.json` (and in the skill itself, from v1.3.1).
2. Push.
3. Add a matching tag (vX.Y.Z), so GitHub builds the release ZIP.
4. Tell people, including asking the NBF admin to upload the new ZIP for the team.

## Goals

- **For everyone, through a company mode.** The core stays general; any company can switch on its own brand. NBF is the first company to use it.
- **Fix the two weak spots:** trust (are her verdicts consistent?) and awareness (only a few people know she exists).
- **Keep her simple.** Every new check makes reports slower and longer.

## v1.3: Trust

- **About 6 test pages:**
  - **3 made-up pages** with problems planted on purpose (for example a price about 400 words down, an "Explore" button, light gray text), so the right answers are known exactly. Public, in `tests/`.
  - **3 real pages** already tested by hand (an event page, an event email preview, and a comparable event's site). Private: kept in a folder that is never pushed to GitHub.
- **A file of right answers** for the made-up pages: reading-effort level, result, word counts, and the planted problems.
- **Passing:**
  - Made-up pages: reading-effort level and result exactly right, word counts within 10%, and every planted problem in the report.
  - Real pages: two runs give the same result and reading-effort level, and scores at most 1 point apart.
- **One AI-led release checklist** covers both the numbers (run `headless.cjs`, compare with the right-answers file) and the reports (run Grandma twice per page, compare).
- **A failed test** blocks the release until it is fixed or explained.

**Shipped 12 Nov 2026 as v1.3.0.** Checked against the pass rules on 13 Nov: all met (full results in `tests/results/v1.3.0.md`).
- Made-up pages: result and reading effort right in every run, word counts within 4%, every planted problem found. On page A, the "wall of text" problem was merged into the price point instead of getting its own point; counted as found.
- Real pages: two failures on the NBF 2027 page, both fixed by new rules, then runs agreed. The email's two scores were 6 and 7 (allowed).
- New rules that came out of it: reading effort counts from where a jump link lands; "Made it" needs reading effort 1 and nothing blocking (a cookie box over the main button counts as blocking).
- Still to do: the release runs were done by Claude in Claude Code, not in Cowork. Test v1.3 in Cowork before v1.4 starts.
- **Decision, 13 Nov 2026:** the skill gets a version number inside its own file, so "Which version do you have?" gets a clear answer in Cowork (the first Cowork test couldn't tell). Every release updates it. Comes as v1.3.1.
- **Cowork test, 13 Nov 2026: passed.** The email scored 7/10 and the "[linkki]" placeholder was flagged. On the NBF 2027 page, both runs agreed (Made it, reading effort 1, about 27 words, counted from where the jump link lands). One gap: the Cowork browser remembered cookies from earlier visits, so Grandma never saw the cookie box a first-time visitor gets, and the new cookie rule could not be tested there. Only one of the two runs said so.
- **Decision, 13 Nov 2026 (for v1.3.2):** Grandma opens every page in a fresh private window, like a first-time visitor. If a setup can't do that, nothing changes (no extra warnings). Chat pop-ups get flagged when they land on top of something that matters, for example the chat box covering the First Class price on the NBF site.
- **Decision, 13 Nov 2026 (for v1.3.2):** cookie boxes no longer count as blocking. People accept or decline them within seconds, so Grandma closes one like a real visitor and moves on: it does not change the result and does not need a warning. Only a cookie box she cannot close gets flagged. This replaces the v1.3 rule that a cookie box over the main button is blocking.

## v1.4: Company mode

- **No setup needed:** Jerry matches the voice of the page or email he is fixing.
- **Brand skill installed** (for example a tone-of-voice skill): Jerry uses it.
- **"Set me up for your company":** a fifth menu option. Grandma reads the company's website, or 2 or 3 pages or emails it chooses, and drafts a profile: voice, readers, main actions, and words to avoid. The user corrects it, and she hands back a company version of the skill as a ZIP, ready to upload and share.
- **The push:** after a rewrite with no brand info, the tip line offers the setup.
- **Profiles stay private.** In Claude Code they live in the skill folder and are git-ignored. The public repo has only an example profile for a made-up company.
- **Profiles live in a folder from day one,** ready for several clients (v1.5). v1.4 ships with one company.
- **To check while building:** whether Grandma can make the ZIP in Cowork. If not, she gives the profile as text to paste into a file.
- **Update check for ZIP users (decision, 13 Nov 2026).** People who uploaded Grandma as a ZIP (Cowork, claude.ai, a company's Claude) never get updates by themselves. So when she has internet access, Grandma compares her own version with the latest GitHub release. If a newer one is out, her tip line says so, for example: "A newer Grandma is out (v1.4). Download it at github.com/theopelle/grandma/releases/latest." If she can't check, she says nothing. Claude Code plugin users don't need this: they get updates through the plugin.

## Rollout at NBF

- Grandma is already added for the whole team by the admin.
- A 10-minute live demo on a real upcoming page or email.
- "Run /grandma" goes on the team's checklist before launching a page or sending an email.
- The team's first findings become material for the LinkedIn post.

## v1.5: Several clients (agencies and freelancers)

- One profile per client, each with that client's web addresses.
- Grandma picks the profile from the page's address, and asks "Which client is this for?" (with a "none" option) only when nothing matches.
- One profile per report, named in the subtitle ("Profile: Client A"). One client's words, readers, or examples never appear in another client's report.
- An agency gets one ZIP holding all its clients' profiles.
- Find an agency or freelancer to test it.

## Launch

- LinkedIn post, after v1.4 and the NBF rollout, with company mode as the headline ("set her up for your own brand in 5 minutes").
