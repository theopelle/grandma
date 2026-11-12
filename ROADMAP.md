# Roadmap

Agreed on 12 November 2026. One focused improvement per release, each tested in Cowork before the next one starts.

| Step | What | Status |
|---|---|---|
| v1.3 | Trust: test pages and a release checklist | In progress (started 12 Nov 2026) |
| v1.4 | Company mode, shipped for one company (NBF) | Planned |
| Rollout | NBF team: demo and launch checklist | Planned |
| v1.5 | Several clients, for agencies and freelancers | Planned |
| Launch | LinkedIn post | Planned |

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

## v1.4: Company mode

- **No setup needed:** Jerry matches the voice of the page or email he is fixing.
- **Brand skill installed** (for example a tone-of-voice skill): Jerry uses it.
- **"Set me up for your company":** a fifth menu option. Grandma reads the company's website, or 2 or 3 pages or emails it chooses, and drafts a profile: voice, readers, main actions, and words to avoid. The user corrects it, and she hands back a company version of the skill as a ZIP, ready to upload and share.
- **The push:** after a rewrite with no brand info, the tip line offers the setup.
- **Profiles stay private.** In Claude Code they live in the skill folder and are git-ignored. The public repo has only an example profile for a made-up company.
- **Profiles live in a folder from day one,** ready for several clients (v1.5). v1.4 ships with one company.
- **To check while building:** whether Grandma can make the ZIP in Cowork. If not, she gives the profile as text to paste into a file.

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
