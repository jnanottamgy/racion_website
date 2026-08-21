import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
const page = await browser.newPage({ viewport:{width:1440,height:900} });
const problems = [];
for (const url of ['/', '/systems', '/lighting', '/projects', '/process', '/about', '/contact', '/configurator']) {
  await page.goto('http://localhost:3224'+url, { waitUntil:'load', timeout:60000 });
  await page.waitForTimeout(1400);
  const r = await page.evaluate(() => {
    const out = { headings: [], imgNoAlt: 0, btnNoName: 0, linkNoName: 0, h1: 0, landmarks: {} };
    document.querySelectorAll('h1,h2,h3,h4').forEach(h => out.headings.push(+h.tagName[1]));
    out.h1 = document.querySelectorAll('h1').length;
    document.querySelectorAll('img').forEach(i => { if (i.alt === null || i.alt === undefined) out.imgNoAlt++; });
    document.querySelectorAll('button').forEach(b => {
      const n = (b.textContent||'').trim() || b.getAttribute('aria-label');
      if (!n) out.btnNoName++;
    });
    document.querySelectorAll('a').forEach(a => {
      const n = (a.textContent||'').trim() || a.getAttribute('aria-label');
      if (!n) out.linkNoName++;
    });
    out.landmarks = {
      main: document.querySelectorAll('main').length,
      header: document.querySelectorAll('header').length,
      footer: document.querySelectorAll('footer').length,
      nav: document.querySelectorAll('nav').length,
    };
    out.title = document.title;
    out.lang = document.documentElement.lang;
    // heading order jumps
    let prev = 0, jumps = 0;
    for (const lvl of out.headings) { if (prev && lvl > prev + 1) jumps++; prev = lvl; }
    out.headingJumps = jumps;
    return out;
  });
  const issues = [];
  if (r.h1 !== 1) issues.push(`h1 count=${r.h1}`);
  if (r.imgNoAlt) issues.push(`imgs missing alt=${r.imgNoAlt}`);
  if (r.btnNoName) issues.push(`buttons unnamed=${r.btnNoName}`);
  if (r.linkNoName) issues.push(`links unnamed=${r.linkNoName}`);
  if (r.headingJumps) issues.push(`heading level jumps=${r.headingJumps}`);
  if (r.landmarks.main !== 1) issues.push(`main=${r.landmarks.main}`);
  if (!r.lang) issues.push('no lang');
  console.log(`${url.padEnd(15)} ${issues.length ? '⚠ '+issues.join(', ') : 'ok'}   "${r.title.slice(0,52)}"`);
  if (issues.length) problems.push(url);
}
console.log(problems.length ? '\nPAGES WITH ISSUES: '+problems.join(', ') : '\nAll pages clean');
await browser.close();
