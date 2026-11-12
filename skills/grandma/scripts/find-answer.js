// Grandma: count the words before an answer, for the reading effort rating.
// Replace the text in the last line with a short, exact phrase from the answer, then run the whole file in the page.
// If the page address ends in #something (a jump link), it counts only from that spot down.
((needle) => {
  const root = document.querySelector('main') || document.body;
  const words = s => s.split(/\s+/).filter(Boolean).length;
  const skimSel = 'h1,h2,h3,h4,strong,b,mark,button,[role=button],input[type=submit],a[class*=button],a[class*=btn],a[class*=cta]';
  const n = needle.toLowerCase().replace(/\s+/g, ' ').trim();
  // A link that looks like a button: its own box, a box around it holding only the link (email buttons put
  // the color on the table cell), or a box inside it, has a border or a background that differs from what is behind it.
  const solid = c => c && c !== 'transparent' && !/rgba\(.*,\s*0\)$/.test(c);
  const bgBehind = el => { for (let e = el; e; e = e.parentElement) { const c = getComputedStyle(e).backgroundColor; if (solid(c)) return c; }
    return 'rgb(255, 255, 255)'; };
  const buttonLink = el => { const a = el.closest('a'); if (!a) return false; const t = a.innerText.trim(); if (!t) return false;
    const looks = e => { const s = getComputedStyle(e); return /btn|button|cta/i.test(e.getAttribute('class') || '') ||
      parseFloat(s.borderTopWidth) > 0 || (solid(s.backgroundColor) && s.backgroundColor !== bgBehind(e.parentElement)); };
    for (let e = a, i = 0; e && i < 3 && e.innerText.trim() === t; e = e.parentElement, i++) if (looks(e)) return true;
    return [...a.querySelectorAll('*')].some(e => e.innerText.trim() === t && looks(e)); };
  // Side menus without proper tags: a narrow, full-height panel against the left or right edge.
  const inSidePanel = el => { for (let e = el; e && e !== document.body; e = e.parentElement) {
      const r = e.getBoundingClientRect();
      if (r.width < innerWidth * 0.3 && r.height >= innerHeight * 0.8 && (r.left < 10 || r.right > innerWidth - 10)) return true; }
    return false; };
  // A jump link (an address ending in #something) lands her at that spot: count only from there.
  const start = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
  const top = start ? start.getBoundingClientRect().top + scrollY : 0;
  const from = start ? { countedFrom: location.hash } : {};
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let all = 0, skim = 0;
  for (let node; (node = walker.nextNode());) {
    if (start && !start.contains(node) && (start.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_PRECEDING)) continue;
    const el = node.parentElement;
    if (!el || el.closest('nav,aside,footer,[role=navigation],[role=complementary],script,style,noscript,template')) continue;
    const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
    if (r.width === 0 || r.height === 0 || s.visibility === 'hidden' || inSidePanel(el)) continue;
    const t = node.textContent.replace(/\s+/g, ' ').trim(); if (!t) continue;
    const inSkim = !!el.closest(skimSel) || parseFloat(s.fontSize) >= 24 || parseInt(s.fontWeight) >= 600 || buttonLink(el);
    const i = t.toLowerCase().indexOf(n);
    if (i >= 0) {
      const before = words(t.slice(0, i));
      return JSON.stringify({ found: true, inSkim, match: t.slice(0, 80), ...from,
        wordsBefore: all + before, skimWordsBefore: skim + (inSkim ? before : 0),
        screensDown: +((r.top + scrollY - top) / innerHeight).toFixed(1) });
    }
    all += words(t); if (inSkim) skim += words(t);
  }
  return JSON.stringify({ found: false, ...from, wordsOnPage: all, skimWordsOnPage: skim });
})('PASTE THE ANSWER TEXT HERE')
