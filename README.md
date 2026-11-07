# Grandma

> "Your grandma is currently visiting your website. Guess how well that goes..."

A Claude skill that checks if a landing page, a marketing email, or a screenshot works for people with limited IT skills: readers who are impatient, skim, and never read every word.

Grandma reports back in her own voice. Her friend Jerry (mid-50s, good with computers, "very handsome") adds a list of fixes you can paste to your team or agency, and can rewrite the copy for you.

## What can Grandma do?

Type `/grandma` with a link, and she'll ask what you'd like. Or say it straight away:

| What you want | Example | What you get |
|---|---|---|
| **Check it** | `/grandma full check of example.com` | A score out of 10, how each part did, and what to fix |
| **Try one thing** | `/grandma can she find the price on example.com?` | Whether she made it, the path she took, and how much she had to read |
| **Compare it** | `/grandma compare example.com and other.com: can she find the price?` | Her favourite, why, what the other one does better, and what to change on yours |
| **Rewrite it** | `Jerry, rewrite it` | New headlines, buttons, and email subject lines, ready to paste |

It works with:
- **Web pages:** paste the link.
- **Emails:** paste the email's preview link (the "view in browser" or share-preview link from your email tool). You can also attach a screenshot, or paste the HTML.
- **Screenshots** of anything: a page, an app, a form, or a slide.

Good to know:
- **Sharing with your team?** Say `answer in normal English` for the same report without the grandma voice.
- **For a sharper result,** tell her the main action (buy a ticket, register), your readers' top questions, and who your readers are.
- **Only some checks?** Name them: `/grandma example.com, only headlines and buttons`.

See [examples/example-report.md](examples/example-report.md) for a sample report.

## What the report looks like

- **The verdict first:** a small table with the result, or the score, and the reason in one line.
- **Reading effort** as a meter: ●○○○ Found it quickly, ●●○○ Had to read some, ●●●○ Too much to read, ●●●● I gave up.
- **Her path** in one line: `Home → "Get your ticket" → Ticket page (1 click)`.
- **Each problem with its fix in bold** right under it. ⛔ blocked her, ⚠️ slowed her down.
- **Jerry's list of changes** in one box, ready to copy. (Jerry's copywriting is on the generic side: make his ideas sound like your brand.)

## Why it works

Claude reads every word perfectly, but real visitors don't. Asking an AI to "pretend to skim" makes the test too easy. So this skill pulls out **only** the headlines, **only** the bold text, or **only** the buttons, and judges each one on its own, as if the rest of the page did not exist. Reading effort, contrast, loading time, and form fields are measured, not guessed.

## What it checks

- **First look:** From the first screen only, can you tell what this is, who it's for, and what to do? Are pop-ups in the way? How long did the page take to show up?
- **Headlines:** Can you answer the key questions from the headlines alone?
- **Bold text:** Do the bold words carry the key facts?
- **Lazy reader:** Does reading only 30% of the text (headlines and first sentences) still work?
- **Finding it:** How many words does she have to read before she finds each answer?
- **Buttons:** Is there one clear main button, and do the labels say what happens next?
- **Forms:** Number of fields, missing labels, unclear required fields, and weak submit buttons. Forms are never submitted.
- **Easy to read:** Text size, how readable the text colors are (measured), and button size on phones.
- **Plain words:** Jargon, long sentences, and idioms that second-language readers may miss.
- **Inbox** (emails): Would you open it, based on the sender, subject line, and preview text?
- **Images off** (emails): Does the message still work when images are blocked?

## Install

**Claude apps (web, desktop):**

1. Download the `grandma` folder and zip it.
2. In Claude, go to **Customize > Skills**, click **+**, then **Create skill > Upload a skill**.
3. Upload the ZIP file.

**Claude Code:** copy the `grandma` folder into `~/.claude/skills/`.

## Requirements

- **Web pages and email preview links:** Claude needs a browser tool, such as Claude in Chrome or Claude's built-in browser. Without one, Grandma runs the text checks only.
- **Screenshots:** work anywhere.
- **Emails from your email tool:** a connector for that tool (for example HubSpot or Mailchimp) lets Grandma find the email by name. A preview link or a screenshot works without one.

## Safety

Grandma never submits forms, buys anything, logs in, or types personal data. She only reads pages and takes screenshots.

## Limits

- Loading times are measured from Claude's browser, so they depend on the connection. Treat them as a rough signal.
- Screenshot results are estimates. Colors and sizes can't be measured from an image.
- This is a quick, low-cost check. It does not replace testing with real users.

## Contributing

Ideas and fixes are welcome. Please open an issue or a pull request. Keep the skill simple: every new check makes reports slower and longer.

## Licence

[MIT](LICENSE)
