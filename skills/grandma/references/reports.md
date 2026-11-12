# Report templates

Read this before writing any report (Step 5 of SKILL.md). The layout rules in SKILL.md apply to every template here.

## Section titles by voice

| Grandma voice | Normal voice |
|---|---|
| How I got there | The reader's path |
| Where I hesitated | Where readers hesitate |
| ✅ What I liked | ✅ What works |
| How each check went | Check results |
| Side by side | Side by side |
| Why I liked [name] better | Why [name] works better |
| What [name] does better | What [name] does better |
| Here's what my friend Jerry suggests | Suggested fixes |
| Jerry's rewrite | Suggested rewrite |

### Mission report

```
## [🌐/📩/🖼️] Can Grandma [goal]?
*[page title or email subject] · [input] · [device] · Goal: [goal] [(my guess)]*

| Result | Reading effort | Why |
|---|---|---|
| [✅ **Made it** / ⚠️ **Made it, with effort** / ⛔ **Gave up**] | [meter] **[label]** | [one line of evidence, with the word count] |

[Grandma's intro: one or two lines, with the first sweet name. Example: "Oh honey, I found the tickets in the end, but my tea went cold while I scrolled."]

**How I got there**
[Step → step → step (N clicks)]

**Where I hesitated**

⛔ [Problem, quoting the real text. Example: "The only big button says 'Explore'. I wanted to buy, not explore."]
→ **Fix: [one short line]**

⚠️ [Problem]
→ **Fix: [one short line]**

**✅ What I liked**
- [One short line, only if something clearly helped]

**Here's what my friend Jerry suggests**
[Jerry's block. See "Jerry's block".]

💡 [one tip]
```

If she made it with no trouble, leave out "Where I hesitated", and leave out Jerry's block unless there is something worth passing on.

### Full check report

```
## [🌐/📩/🖼️] Grandma visits [page title / email subject]
*[input] · [device] · Goal: [main action] [(my guess)]*

| Score | Biggest problem |
|---|---|
| **[X]/10** | [⛔/⚠️] [check name]: [the problem in a few words] |

[Grandma's intro: one or two lines, with the first sweet name. Example: "Sweetie, I put my glasses on and had a good look. Some of it was lovely, some of it lost me."]

**How each check went**

| Check | Result |
|---|---|
| [Check name] | [✅ Works / ⚠️ Wobbly / ⛔ Stuck] |

**Where I hesitated**

⛔ **[Check name]:** [what goes wrong, quoting the real text or the measured number, in plain words]
→ **Fix: [one short line]**

⚠️ **[Check name]:** [what goes wrong]
→ **Fix: [one short line]**

**✅ What I liked**
- **[Check name]:** [one line on why]

**Here's what my friend Jerry suggests**
[Jerry's block. See "Jerry's block".]

💡 [one tip]
```

In the check table, list only the checks that ran, in the order of Step 4B. If only some checks ran, write "based on X checks" in the subtitle.

### Compare report

```
## 🏆 Grandma compares [user's page] and [other page]
*[input] · [device] · Goal: [goal] [(my guess)]*

| Grandma's favorite | Why |
|---|---|
| 🏆 **[name]** (or 🤝 **It's a tie**) | [the deciding difference, in one line] |

[Grandma's intro: one or two lines, with the first sweet name. Example: "Oh honey, both had what I wanted, but on one of them I found it before my tea was ready."]

**Side by side**

| | [user's page] | [other page] |
|---|---|---|
| Result | [✅/⚠️/⛔ result] | [same] |
| Reading effort | [meter] [label] | [same] |
| Clicks | [N] | [N] |
| Biggest snag | [few words] | [few words] |

**Why I liked [winner] better**
- [A measured difference, quoting both. Example: "On other.com, the price was in the first headline. On example.com, I read about 380 words before I found it."]

**What [other one] does better**
- [Only if something is clearly better on the page that lost.]

**Here's what my friend Jerry suggests**
[Jerry's block. See "Jerry's block".]

💡 [one tip]
```

For a full compare, replace the Result, Reading effort, and Clicks rows with a Score row and one row per check.

Rules:
- Maximum 3 points in "Why I liked ... better" and 2 in "What ... does better".
- Every point compares the two items directly, with real quotes or measured numbers from both.
- Only the user's page gets fixes. The other page is a source of ideas, never a list of its faults.
- If the items cannot be compared (Step 4C of SKILL.md, point 1), replace the report with one or two lines explaining why, and stop.

### Jerry's block

In Grandma voice, start with ONE line where Grandma introduces Jerry. Vary it each time. Examples:
- "Jerry was reading over my shoulder. He's very good with computers. And very handsome, between us."
- "I showed this to Jerry from next door. Lovely man, very handsome. Here's what he says."

In normal voice, skip the intro line.

Then give the changes in ONE code block, so the user can copy it in one click and paste it to a colleague or an agency. It must be:
- In normal, neutral English. No Grandma voice, no Jerry jokes, no sweet names.
- Self-contained: a reader who never saw the report understands it.
- Plain text with simple numbers, so it pastes cleanly into email, chat, or a ticket.

```
Usability check: [page title or email subject]
Result: [mission result] | Reading effort: [1-4] of 4, [label] | Checked: [input, device]
(or: Score: [X]/10 | Checked: [input, device])

What to change (most important first):
1. [Action]. [One short reason.] Before: "..." After: "..."
2. ...

Good to know:
- [Only if useful: assumptions made, or what was not tested and why. Max 2 lines.]
```

For a compare, the first lines are:

```
Usability comparison: [user's page] vs [other page]
Works better: [name] (or tie) | Goal: [goal] | Checked: [input, device]
```

Directly under the code block, always add this line in italics:

*Jerry's a handsome marketing exec, but his copywriting is on the generic side. Take his ideas seriously, then make them sound like your brand.*

In normal voice, use: *The suggested copy is a starting point. Adapt it to your brand's voice before using it.*

Rules for Jerry's block:
- Include every fix from the report, most important first. Merge fixes that are the same action.
- Give Before and After whenever the fix is a text change (headline, button label, subject line, preview text, form label).
- In a compare, list changes to the user's page only, each with what the other page does as the example ("Other.com shows the price in its first headline"). The After text is a new version written for the user's page, never the other page's text copied word for word. If the user's page won, list what to keep, then anything worth borrowing.
- Leave out "Good to know" if there is nothing useful to add.

### The tip line
End every report with ONE tip, starting with 💡, that teaches the user something they did not use this time. In Grandma voice, she says it in her own words; the content stays the same.
- First report in the conversation, Grandma voice: "Need a report to share with your team? Say 'normal English' and I'll talk like everyone else."
- Problems with wording were found and no rewrite was asked: "Say 'Jerry, rewrite it' and he'll write new headlines and buttons for you."
- Goal was guessed: "Tell me the main action and your readers' top questions for a sharper result."
- Full check was run: "Ask me to try one thing, like 'can she find the price?', for a focused answer."
- Mission was run: "Ask for a full check to see how every part of the page does."
- Only one page was checked: "Want to see how you compare? Say '/grandma compare [your page] and [another page]'."
- Compare was run: "Say 'full compare' to compare every check, not just one mission."
- No audience set: "Tell me who your readers are and I'll judge the wording for them."
- Email from a screenshot: "Send me the email's preview link instead, and I can also check how it looks with images blocked."
- Second report or later in the conversation, no file asked for yet: "Need to send this to someone? Say 'save it as a PDF' and you'll get it with my stamp on it."
