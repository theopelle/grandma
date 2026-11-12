# Right answers for the made-up test pages

The three pages in `tests/pages/` are made up, with problems planted on purpose, so the right answers are known exactly. The release checklist (`RELEASE-CHECKLIST.md`) compares Grandma against this file.

Word counts were set by counting the page text by hand (a plain word count of the text, outside the Grandma scripts), not by running the scripts. If you change a page, count again and update this file in the same commit.

**Never show this file to the Grandma runs being tested.** The report runs must not know the answers.

## How to compare

- **Reading-effort level and result:** exactly right.
- **Word counts:** within 10% of the number here. For counts under 30, within 3 words (10% of 4 words is less than one word).
- **Planted problems:** every one must be in the report, in any wording, as long as it is clearly the same problem. Extra problems are fine, as long as they are true.
- **Screens down** depends on the browser and fonts, so it is shown as a range and only checked loosely.

## Page A: Riverside Food Festival

`tests/pages/food-festival.html` · a landing page

**Mission for the report runs:** "Can she find the ticket price?" · desktop

| | Right answer |
|---|---|
| Result | ⚠️ **Made it, with effort** |
| Reading effort | ●●●○ **3, Too much to read** (380 words before the price, not in skim text) |
| Clicks | 0 if she scrolls, 1 if she clicks "Discover more" (a jump link down the same page). Both are fine. |
| Word count | 380 if she scrolls from the top; 368 if she clicks "Discover more" (9 skim words to the button, then 359 from "Our story"). Both are level 3. |

**Planted problems (all must be in the report):**
1. **The price is buried.** "A day ticket costs €18" sits about 380 words down, in the middle of the "Our story" text, with no heading and no bold.
2. **The only button says "Discover more".** It says nothing about tickets or the price.
3. **A wall of text.** Five long paragraphs under one heading, with no bold and no subheadings, so skimming does not help.

Not planted, fine either way: the orange button's white text is a little light (3:1).

**Numbers (`headless.cjs`, desktop 1280x800 and mobile 390x844, same counts on both):**

| Answer phrase | found | inSkim | wordsBefore | skimWordsBefore | screensDown | Level |
|---|---|---|---|---|---|---|
| "€18" | yes | no | 380 | 13 | 1 to 1.5 desktop, 1.5 to 2.5 mobile | 3 |
| "14 June" | yes | yes (big text, 26 px) | 4 | 4 | under 1 | 1 |
| "Parking" | no | | wordsOnPage 425 | skimWordsOnPage 13 | | 4 |
| "Discover more" | yes | yes (button) | 19 | 9 | under 1 | 1 |
| "€18" on `food-festival.html#story` (after the jump link) | yes, `countedFrom` "#story" | no | 359 | 2 | | 3 |

Extract: `buttons` = ["Discover more"]; `bold` = none; `headings` include "H1: Riverside Food Festival", "H2: Our story", and "BIG: Saturday 14 June · Riverside Park".

## Page B: Bright Path free workshop

`tests/pages/coaching-workshop.html` · a landing page with a sign-up form

**Mission for the report runs:** "Can she sign up for the free workshop?" · desktop

| | Right answer |
|---|---|
| Result | ⚠️ **Made it, with effort** (she reaches the form and its button, but the main button did not help her and the form is confusing) |
| Reading effort | ●●○○ **2, Had to read some** (68 skim words before the "Free workshop" headline) |
| Clicks | 0 or 1 ("Explore" only jumps down the same page) |

**Planted problems (all must be in the report):**
1. **The main button says "Explore".** It does not say sign up, or anything about the workshop.
2. **The form has no labels, only gray hint text inside the boxes** ("Your name", "Email"), which disappears when she starts typing.
3. **The form button says "Submit"** instead of what happens ("Save my seat").

Not planted, fine to mention: the email box is a plain text box (phones show the wrong keyboard); "Unlock your potential" is a vague headline.

**Numbers (desktop and mobile, same counts on both):**

| Answer phrase | found | inSkim | wordsBefore | skimWordsBefore | screensDown | Level |
|---|---|---|---|---|---|---|
| "Free workshop" | yes | yes (headline) | 150 | 68 | 1 to 1.5 desktop, 1 to 2 mobile | 2 |

Extract: `buttons` = ["Explore", "Submit"]; `forms` = one form, 2 fields, both `[NO LABEL]` with placeholders "Your name" and "Email", both type `text`, submit "Submit"; `bold` = the 4 bold sentences.

## Page C: Harbour Lights concert email

`tests/pages/concert-email.html` · an email preview, built with tables like a real marketing email

**Mission for the report runs:** "Can she find the concert date in this email?" · desktop · give it as an email preview link

| | Right answer |
|---|---|
| Result | ⚠️ **Made it, with effort** |
| Reading effort | ●●○○ **2, Had to read some** (93 words before the date, not in skim text) |
| Clicks | 0 |

**Planted problems (all must be in the report):**
1. **The date is not bold and not in a headline.** "Friday 9 October at 19:00" sits in the middle of the second paragraph.
2. **The body text is light gray and hard to read** (1.9:1, should be at least 4.5:1).
3. **The headline "You're invited" does not say what or when.**

**Numbers (desktop and mobile, same counts on both):**

| Answer phrase | found | inSkim | wordsBefore | skimWordsBefore | screensDown | Level |
|---|---|---|---|---|---|---|
| "9 October" | yes | no | 93 | 4 | under 1 | 2 |
| "Book your seat" | yes | yes (email button: the color is on the table cell) | 128 | 4 | under 1 | 1 |

Extract: `buttons` = ["Book your seat"]; `headings` = ["BIG: You're invited"]; `bold` = ["HARBOUR LIGHTS"] (bold by style); `contrast.lowContrastCount` at least 3, worst ratio about 1.9.

This page also guards against an old bug: before v1.3, email buttons (color on the table cell), email headlines (big text without a heading tag), and bold set by style were missed, so "Book your seat" counted as 128 plain words instead of 4 skim words.
