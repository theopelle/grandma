// Grandma: open a page in a clean headless browser (no cookies, no logins), take screenshots,
// and run extract.js and find-answer.js on it. It never submits forms or logs in.
//
// Usage: node headless.cjs <url> <width> <height> <output-folder> ["answer phrase" ...]
//   Desktop: 1280 800. Mobile: 390 844.
// Needs the playwright-core (or playwright) package, found through NODE_PATH.
// Uses the installed Google Chrome if there is one, otherwise Playwright's own Chromium.
const fs = require('fs');
const path = require('path');
const pw = (() => { try { return require('playwright'); } catch { return require('playwright-core'); } })();

(async () => {
  const [url, w = '1280', h = '800', out = '.', ...needles] = process.argv.slice(2);
  if (!url) throw new Error('Usage: node headless.cjs <url> <width> <height> <output-folder> ["answer phrase" ...]');
  fs.mkdirSync(out, { recursive: true });

  let browser;
  try { browser = await pw.chromium.launch({ channel: 'chrome' }); } catch { browser = await pw.chromium.launch(); }
  const mobile = Number(w) < 768;
  const context = await browser.newContext({
    ...(mobile ? pw.devices['Pixel 7'] : {}),
    viewport: { width: Number(w), height: Number(h) },
  });
  const page = await context.newPage();
  const response = await page.goto(url, { waitUntil: 'load', timeout: 45000 });
  await page.waitForTimeout(2500);

  // First look: the screen exactly as a first-time visitor sees it, banners and all.
  const firstLook = path.join(out, `first-look-${w}.png`);
  await page.screenshot({ path: firstLook });

  // Then dismiss a cookie banner with its most privacy-friendly button, if one is found.
  const banner = await page.evaluate(() => {
    const re = /^(only (necessary|essential)|necessary only|use necessary cookies only|reject( all)?|decline( all)?|deny( all)?|vain välttämättömät|hylkää( kaikki)?)\b/i;
    const b = [...document.querySelectorAll('button,[role=button],a')]
      .find(e => re.test((e.innerText || '').trim()) && e.getBoundingClientRect().width > 0);
    if (!b) return null;
    b.click();
    return (b.innerText || '').trim();
  });
  if (banner) await page.waitForTimeout(1500);

  const script = name => fs.readFileSync(path.join(__dirname, name), 'utf8');
  const extract = JSON.parse(await page.evaluate(script('extract.js')));
  const finder = script('find-answer.js');
  const finds = [];
  for (const needle of needles) {
    finds.push({ needle, ...JSON.parse(await page.evaluate(finder.replace("'PASTE THE ANSWER TEXT HERE'", JSON.stringify(needle)))) });
  }

  // Links, so a mission can continue by opening the next page with this script.
  const links = await page.evaluate(() => [...document.querySelectorAll('a[href]')]
    .filter(a => a.getBoundingClientRect().width > 0)
    .map(a => { const raw = (a.getAttribute('href') || '').trim();
      // Flag leftover placeholders (like "[link]"): the browser turns them into a normal-looking address.
      const broken = !raw || /[\[\]{}<>]|^(link|url|linkki)$/i.test(raw);
      return { text: (a.innerText || a.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 80), href: a.href,
        ...(broken ? { brokenLink: raw || '(empty)' } : {}) }; })
    .filter(l => l.text).slice(0, 150));

  const fullPage = path.join(out, `page-${w}.png`);
  await page.screenshot({ path: fullPage, fullPage: true });

  console.log(JSON.stringify({
    url: page.url(), status: response && response.status(), viewport: `${w}x${h}`, browser: `${browser.version()}`,
    screenshots: { firstLook, fullPage },
    cookieBanner: banner ? `dismissed with "${banner}"` : 'none found: check the first-look screenshot',
    extract, finds, links,
  }, null, 1));
  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
