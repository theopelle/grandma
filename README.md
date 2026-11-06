# Grandma

> "Your grandma is currently visiting your website. Guess how well that goes..."

A Claude skill that checks if a web page, a screenshot, or a marketing email works for people with limited IT skills: readers who are impatient, skim, and never read every word.

Grandma reports back in her own voice. Her friend Jerry (mid-50s, good with computers, "very handsome") adds a plain-English list of fixes that you can paste anywhere, and can rewrite the copy for you.

## Why it works

Claude reads every word perfectly, but real visitors don't. Asking an AI to "pretend to skim" makes the test too easy. So this skill pulls out **only** the headlines, **only** the bold text, or **only** the buttons, and judges each one on its own, as if the rest of the page did not exist. Contrast, loading time, and form fields are measured, not guessed.

## What it checks

- **First look:** From the first screen only, can you tell what this is, who it's for, and what to do? Are pop-ups in the way? How long did the page take to show up?
- **Headlines:** Can you answer the key questions from the headlines alone?
- **Bold text:** Do the bold words carry the key facts?
- **Lazy reader:** Does reading only 30% of the text (headlines and first sentences) still work?
- **Finding it:** How many words does she have to read before she finds each answer? Rated 1 to 4: found it quickly, had to read some, too much to read, I gave up.
- **Buttons:** Is there one clear main button, and do the labels say what happens next?
- **Forms:** Field count, missing labels, unclear required fields, and weak submit buttons. Forms are never submitted.
- **Easy to read:** Text size, measured contrast (WCAG), and tap targets on mobile.
- **Plain words:** Jargon, long sentences, and idioms that second-language readers may miss.
- **Inbox** (emails): Would you open it, based on the sender, subject line, and preview text?
- **Images off** (emails): Does the message still work when images are blocked?

## How to use

| You type | You get |
|---|---|
| `/grandma example.com` | A full check with a score out of 10 |
| `/grandma can she find how to buy a ticket on example.com?` | A mission: her path, where she got stuck, whether she made it, and how much she had to read |
| `/grandma example.com, only headlines and buttons` | Only the checks you picked |
| `/grandma compare example.com and other.com: can she find the price?` | Her favourite of the two, why it works better, what the other one does better, and what to change on yours |
| `/grandma full compare of example.com and other.com` | The same comparison across every check, with a score for each |
| `/grandma` + an attached screenshot | A check of any interface: page, app, form, or slide |
| `/grandma` + an email screenshot, or the email HTML | An email check |
| `Jerry, rewrite it` | New headlines, buttons, and form labels, ready to paste |
| `answer in normal English` | The same report without the grandma voice, ready to share |

You can also add context to any request: the main action, your readers' top questions, the device (desktop or mobile), and your audience.

See [examples/example-report.md](examples/example-report.md) for a sample report.

## Install

**Claude apps (web, desktop):**

1. Download the `grandma` folder and zip it.
2. In Claude, go to **Customize > Skills**, click **+**, then **Create skill > Upload a skill**.
3. Upload the ZIP file.

**Claude Code:** copy the `grandma` folder into `~/.claude/skills/`.

## Requirements

- **Web pages:** Claude needs a browser tool, such as Claude in Chrome or Claude's built-in browser. Without one, Grandma runs the text checks only.
- **Screenshots:** work anywhere.
- **Emails from your email tool:** need a connector for that tool (for example HubSpot or Mailchimp). You can also paste the HTML or attach a screenshot.

## Safety

Grandma never submits forms, buys anything, logs in, or types personal data. She only reads pages and takes screenshots.

## Limits

- Loading times are measured from Claude's browser, so they depend on the connection. Treat them as a rough signal.
- Screenshot results are estimates. Contrast and sizes can't be measured from an image.
- This is a quick, low-cost check. It does not replace testing with real users.

## Contributing

Ideas and fixes are welcome. Please open an issue or a pull request. Keep the skill simple: every new check makes reports slower and longer.

## Licence

[MIT](LICENSE)
