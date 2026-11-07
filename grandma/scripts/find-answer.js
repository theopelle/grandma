// Grandma: count the words before an answer, for the reading effort rating.
// Replace the text in the last line with a short, exact phrase from the answer, then run the whole file in the page.
((needle) => {
  const root = document.querySelector('main') || document.body;
  const words = s => s.split(/\s+/).filter(Boolean).length;
  const skimSel = 'h1,h2,h3,h4,strong,b,mark,button,[role=button],input[type=submit],a[class*=button],a[class*=btn],a[class*=cta]';
  const n = needle.toLowerCase().replace(/\s+/g, ' ').trim();
  // Side menus without proper tags: a narrow, full-height panel against the left or right edge.
  const inSidePanel = el => { for (let e = el; e && e !== document.body; e = e.parentElement) {
      const r = e.getBoundingClientRect();
      if (r.width < innerWidth * 0.3 && r.height >= innerHeight * 0.8 && (r.left < 10 || r.right > innerWidth - 10)) return true; }
    return false; };
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let all = 0, skim = 0;
  for (let node; (node = walker.nextNode());) {
    const el = node.parentElement;
    if (!el || el.closest('nav,aside,footer,[role=navigation],[role=complementary],script,style,noscript,template')) continue;
    const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
    if (r.width === 0 || r.height === 0 || s.visibility === 'hidden' || inSidePanel(el)) continue;
    const t = node.textContent.replace(/\s+/g, ' ').trim(); if (!t) continue;
    const inSkim = !!el.closest(skimSel) || parseFloat(s.fontSize) >= 24;
    const i = t.toLowerCase().indexOf(n);
    if (i >= 0) {
      const before = words(t.slice(0, i));
      return JSON.stringify({ found: true, inSkim, match: t.slice(0, 80),
        wordsBefore: all + before, skimWordsBefore: skim + (inSkim ? before : 0),
        screensDown: +((r.top + scrollY) / innerHeight).toFixed(1) });
    }
    all += words(t); if (inSkim) skim += words(t);
  }
  return JSON.stringify({ found: false, wordsOnPage: all, skimWordsOnPage: skim });
})('PASTE THE ANSWER TEXT HERE')
