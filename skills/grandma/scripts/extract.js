// Grandma: extract headlines, bold text, buttons, skim text, text size, contrast, timing, and forms.
// Run the whole file in the page with the browser's JavaScript tool. It never changes or submits anything.
(() => {
  const vis = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && s.opacity !== '0'; };
  const txt = el => (el.innerText || el.value || el.getAttribute('aria-label') || el.title || '').replace(/\s+/g, ' ').trim();
  const root = document.querySelector('main') || document.body;
  const words = s => s.split(/\s+/).filter(Boolean).length;

  // Elements with their own text (not only text inside child tags).
  const ownText = el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
  const outside = 'nav,header,footer,aside,[role=navigation],h1,h2,h3,h4,button,a';

  // Headlines: heading tags, plus big text (24 px or more) without them, as emails and page builders often do.
  const big = [...root.querySelectorAll('body *')].filter(el => ownText(el) && !el.closest(outside + ',script,style')
    && parseFloat(getComputedStyle(el).fontSize) >= 24 && vis(el)).map(el => `BIG: ${txt(el)}`).filter(h => /\p{L}{2}/u.test(h.slice(5)));
  const headings = [...document.querySelectorAll('h1,h2,h3,h4')].filter(vis)
    .map(h => `${h.tagName}: ${txt(h)}`).filter(h => h.length > 4).concat(big);

  // Bold: bold tags, plus text made bold with styles (font-weight 600 or more), as emails often do.
  // For text bold by style, take only the element's own text, not the text of everything inside it.
  const ownOnly = el => [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join(' ').replace(/\s+/g, ' ').trim();
  const bold = [...root.querySelectorAll('strong,b,mark')].filter(vis)
    .filter(el => !el.closest('nav,header,footer,button,a')).map(txt)
    .concat([...root.querySelectorAll('body *')].filter(el => ownText(el) && !el.closest(outside + ',strong,b,mark,script,style')
      && parseInt(getComputedStyle(el).fontWeight) >= 600 && parseFloat(getComputedStyle(el).fontSize) < 24 && vis(el)).map(ownOnly))
    .filter(Boolean);

  // A link looks like a button if its own box, a box around it holding only the link (email buttons put the
  // color on the table cell), or a box inside it, has a border or a background that differs from what is behind it.
  const solid = c => c && c !== 'transparent' && !/rgba\(.*,\s*0\)$/.test(c);
  const bgBehind = el => { for (let e = el; e; e = e.parentElement) { const c = getComputedStyle(e).backgroundColor; if (solid(c)) return c; }
    return 'rgb(255, 255, 255)'; };
  const buttonBox = el => {
    if (el.matches('button,[role=button],input[type=submit],input[type=button]')) return el;
    if (el.tagName !== 'A') return null;
    if (/btn|button|cta/i.test(el.getAttribute('class') || '')) return el;
    const t = el.innerText.trim(); if (!t) return null;
    const looks = e => { const s = getComputedStyle(e); return /btn|button|cta/i.test(e.getAttribute('class') || '') ||
      parseFloat(s.borderTopWidth) > 0 || (solid(s.backgroundColor) && s.backgroundColor !== bgBehind(e.parentElement)); };
    for (let e = el, i = 0; e && i < 3 && e.innerText.trim() === t; e = e.parentElement, i++) if (looks(e)) return e;
    // Some email builders put the colored box inside the link instead.
    return [...el.querySelectorAll('*')].find(e => e.innerText.trim() === t && looks(e)) || null;
  };
  // A link address that is a leftover placeholder (like "[link]") or empty: the button goes nowhere.
  // Links with no address at all, or "#", are usually page controls (tabs, "show more"), so they are not flagged.
  const badHref = a => { if (a.tagName !== 'A' || !a.hasAttribute('href')) return undefined; const h = a.getAttribute('href').trim();
    return !h || /[\[\]{}<>]|^(link|url|linkki)$/i.test(h) ? h || '(empty)' : undefined; };
  const buttons = [...document.querySelectorAll('a,button,[role=button],input')].filter(vis)
    .map(b => [b, buttonBox(b)]).filter(([, box]) => box)
    .map(([b, box]) => { const r = box.getBoundingClientRect();
      return { label: txt(b) || '[NO TEXT LABEL]', aboveFold: r.top < innerHeight, brokenLink: badHref(b),
        bg: getComputedStyle(box).backgroundColor, size: `${Math.round(r.width)}x${Math.round(r.height)}` }; });

  const totalWords = words(root.innerText);
  const budget = Math.round(totalWords * 0.3);
  const skim = []; let used = 0;
  for (const el of root.querySelectorAll('h1,h2,h3,h4,p,li')) {
    if (!vis(el) || el.closest('nav,footer')) continue;
    let t = txt(el); if (!t) continue;
    if (!/^H/.test(el.tagName)) t = (t.match(/^.*?[.!?](\s|$)/) || [t])[0].trim();
    if (used + words(t) > budget) break;
    skim.push(t); used += words(t);
  }

  const sizes = [...root.querySelectorAll('p,li')].filter(vis)
    .map(el => parseFloat(getComputedStyle(el).fontSize)).sort((a, b) => a - b);
  const median = sizes.length ? sizes[Math.floor(sizes.length / 2)] : null;
  const smallText = sizes.filter(s => s < 14).length;

  // Contrast (WCAG ratio). Background is found by walking up to the first solid color.
  const rgb = c => (c.match(/[\d.]+/g) || []).map(Number);
  const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const bgOf = el => { for (let e = el; e; e = e.parentElement) { const s = getComputedStyle(e);
      if (s.backgroundImage !== 'none') return null; const c = rgb(s.backgroundColor);
      if (c.length >= 3 && (c[3] === undefined || c[3] > 0.9)) return c; } return [255, 255, 255]; };
  const lowContrast = []; let checked = 0, onImage = 0;
  for (const el of document.querySelectorAll('p,li,h1,h2,h3,h4,a,button,label,span,td')) {
    if (!vis(el) || ![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
    const s = getComputedStyle(el); const bg = bgOf(el); if (!bg) { onImage++; continue; }
    checked++;
    const a = lum(rgb(s.color)), b = lum(bg); const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const size = parseFloat(s.fontSize); const large = size >= 24 || (size >= 18.66 && parseInt(s.fontWeight) >= 700);
    if (ratio < (large ? 3 : 4.5)) lowContrast.push({ text: txt(el).slice(0, 60), ratio: +ratio.toFixed(2), sizePx: size });
  }
  lowContrast.sort((x, y) => x.ratio - y.ratio);

  // Load time, as measured from this browser.
  const nav = performance.getEntriesByType('navigation')[0];
  const fcp = performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint');
  const timing = { firstContentSec: fcp ? +(fcp.startTime / 1000).toFixed(1) : null,
    fullyLoadedSec: nav && nav.loadEventEnd ? +(nav.loadEventEnd / 1000).toFixed(1) : null };

  // Forms (never submitted).
  const labelOf = f => { if (f.labels && f.labels.length) return txt(f.labels[0]);
    const by = f.getAttribute('aria-labelledby');
    if (by) return by.split(' ').map(id => { const e = document.getElementById(id); return e ? txt(e) : ''; }).join(' ').trim();
    return f.getAttribute('aria-label') || ''; };
  const forms = [...document.querySelectorAll('form')].filter(vis).map(fm => {
    const fields = [...fm.querySelectorAll('input,select,textarea')].filter(vis)
      .filter(f => !['hidden', 'submit', 'button', 'image', 'reset'].includes(f.type))
      .map(f => ({ label: labelOf(f) || '[NO LABEL]', placeholder: f.placeholder || '', type: f.type || f.tagName.toLowerCase(),
        required: f.required || f.getAttribute('aria-required') === 'true' }));
    const submit = [...fm.querySelectorAll('button,input[type=submit]')].filter(vis).map(txt)[0] || '[NO SUBMIT BUTTON FOUND]';
    return { fieldCount: fields.length, fields: fields.slice(0, 25), submit,
      captcha: !!fm.querySelector('iframe[src*="captcha"], .g-recaptcha, .h-captcha, [class*="captcha"]') };
  }).filter(f => f.fieldCount > 0);

  return JSON.stringify({ title: document.title, totalWords, headings: headings.slice(0, 60),
    bold: bold.slice(0, 60), buttons: buttons.slice(0, 60), skim, skimWords: used,
    bodyFontMedianPx: median, paragraphsUnder14px: smallText,
    contrast: { textChecked: checked, textOnImages: onImage, lowContrastCount: lowContrast.length, worst: lowContrast.slice(0, 5) },
    timing, forms: forms.slice(0, 5), viewport: `${innerWidth}x${innerHeight}` });
})()
