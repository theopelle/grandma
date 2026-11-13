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

// In the page: everything fixed on top of the page (cookie boxes, chat boxes, pop-ups), except a header bar along the top.
const floating = () => {
  const vw = innerWidth, vh = innerHeight, out = [];
  for (const el of document.querySelectorAll('body *')) {
    const s = getComputedStyle(el);
    if (s.position !== 'fixed' || s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0) continue;
    const r = el.getBoundingClientRect();
    if (r.width * r.height < vw * vh * 0.015 || r.bottom <= 0 || r.top >= vh || r.right <= 0 || r.left >= vw) continue;
    if (r.top <= 5 && r.height < 160 && r.width > vw * 0.9) continue;
    if (out.some(o => o.contains(el))) continue;
    out.push(el);
  }
  return out;
};
const describe = el => { const f = el.tagName === 'IFRAME' ? el : el.querySelector('iframe');
  const t = (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 80);
  return t || (f && (f.title || (f.src && new URL(f.src, location.href).hostname))) || el.getAttribute('aria-label') || '[no text]'; };
// In the page: what fixed element (pop-up, chat box, banner) covers the element with this text, if any.
const coveredBy = needle => {
  const n = needle.toLowerCase();
  const els = [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && (e.innerText || e.value || '').toLowerCase().includes(n); });
  const el = els.find(e => !els.some(o => o !== e && e.contains(o)));
  if (!el) return null;
  const r = el.getBoundingClientRect();
  for (const [x, y] of [[0.5, 0.5], [0.15, 0.5], [0.85, 0.5]]) {
    const hit = document.elementFromPoint(r.left + r.width * x, r.top + r.height * y);
    if (!hit || el.contains(hit) || hit.contains(el)) continue;
    for (let e = hit; e && e !== document.body; e = e.parentElement)
      if (getComputedStyle(e).position === 'fixed') {
        const t = (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 80);
        const f = e.tagName === 'IFRAME' ? e : e.querySelector('iframe');
        return t || (f && (f.title || (f.src && new URL(f.src, location.href).hostname))) || '[no text]'; }
  }
  return null;
};

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
  const loadedAt = Date.now();
  await page.waitForTimeout(2500);

  // First look: the screen exactly as a first-time visitor sees it, banners and all.
  const firstLook = path.join(out, `first-look-${w}.png`);
  await page.screenshot({ path: firstLook });
  const atFirstLook = await page.evaluate(`(() => { const describe = ${describe}; const floating = ${floating};
    return floating().map(el => { el.dataset.grandmaSeen = '1'; return describe(el); }); })()`);

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

  // Pop-ups and chat boxes often appear after a few seconds or while scrolling: scroll through the page,
  // wait, and come back to the top before measuring anything else.
  const steps = await page.evaluate(() => Math.min(30, Math.ceil(document.documentElement.scrollHeight / innerHeight)));
  for (let i = 1; i <= steps; i++) { await page.evaluate(i => scrollTo(0, i * innerHeight * 0.9), i); await page.waitForTimeout(300); }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(Math.max(1000, 7000 - (Date.now() - loadedAt)));
  const afterWait = path.join(out, `after-wait-${w}.png`);
  await page.screenshot({ path: afterWait });
  const popups = await page.evaluate(`(() => { const describe = ${describe}; const floating = ${floating};
    return floating().map(el => { const r = el.getBoundingClientRect();
      return { text: describe(el), appearedLater: !el.dataset.grandmaSeen,
        where: (r.top + r.height / 2 < innerHeight / 3 ? 'top' : r.top + r.height / 2 > innerHeight * 2 / 3 ? 'bottom' : 'middle') + ' ' +
          (r.left + r.width / 2 < innerWidth / 3 ? 'left' : r.left + r.width / 2 > innerWidth * 2 / 3 ? 'right' : 'center'),
        screenShare: +((Math.min(r.right, innerWidth) - Math.max(r.left, 0)) * (Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) / (innerWidth * innerHeight)).toFixed(2) }; }); })()`);

  const script = name => fs.readFileSync(path.join(__dirname, name), 'utf8');
  const extract = JSON.parse(await page.evaluate(script('extract.js')));
  const finder = script('find-answer.js');
  const finds = [];
  for (const needle of needles) {
    finds.push({ needle, ...JSON.parse(await page.evaluate(finder.replace("'PASTE THE ANSWER TEXT HERE'", JSON.stringify(needle)))) });
  }

  // Scrolling down, she first sees the answer near the bottom of the screen, where chat boxes sit; then in the middle.
  const cover = async (needle, block) => {
    if (block) { await page.evaluate(([n, block]) => { const els = [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && (e.innerText || e.value || '').toLowerCase().includes(n.toLowerCase()); });
      const el = els.find(e => !els.some(o => o !== e && e.contains(o)));
      if (el) { el.scrollIntoView({ block: 'center' }); if (block === 'end') scrollBy(0, el.getBoundingClientRect().bottom - innerHeight * 0.92); } }, [needle, block]);
      await page.waitForTimeout(400); }
    return page.evaluate(`(${coveredBy})(${JSON.stringify(needle)})`);
  };
  await page.evaluate(() => scrollTo(0, 0));
  const coveredButtons = [];
  for (const b of extract.buttons.filter(b => b.aboveFold).slice(0, 10)) {
    const by = await cover(b.label, null); if (by) coveredButtons.push({ button: b.label, coveredBy: by }); }
  for (const f of finds) if (f.found) {
    const mid = await cover(f.needle, 'center'), low = mid || await cover(f.needle, 'end');
    if (mid) f.coveredBy = { by: mid, when: 'even in the middle of the screen' };
    else if (low) f.coveredBy = { by: low, when: 'when it first appears at the bottom of the screen' }; }
  await page.evaluate(() => scrollTo(0, 0));

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
    screenshots: { firstLook, afterWait, fullPage },
    cookieBanner: banner ? `dismissed with "${banner}"` : 'none found: check the first-look screenshot',
    popups: { atFirstLook, afterWaitAndScroll: popups, coveredButtons },
    extract, finds, links,
  }, null, 1));
  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
