import { chromium } from 'playwright';
const OUT='/tmp/claude-0/-home-user-racion-website/349519e7-8101-55bc-80bd-4ba871ddc5f0/scratchpad/plates';

const browser = await chromium.launch({
  executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-lcd-text']
});
// 1.5x on a 1600x1000 viewport → 2400x1500 plates. Software rendering cannot
// finish a 3200x2000 frame inside any reasonable capture window.
const page = await browser.newPage({ viewport:{width:1600,height:1000}, deviceScaleFactor:1.5 });
await page.goto('http://localhost:3303/?render=full', { waitUntil:'load', timeout:120000 });
await page.waitForTimeout(15000);

// Strip every DOM layer so the capture is the canvas alone.
await page.addStyleTag({ content: `
  #narrative, header, footer, .grain { opacity: 0 !important; pointer-events: none !important; }
  body { background: #0c0710 !important; }
` });

const centres = await page.evaluate(() => {
  const o=[]; document.querySelectorAll('[data-beat]').forEach(el =>
    o.push(Math.round(el.getBoundingClientRect().top+window.scrollY+el.offsetHeight/2-window.innerHeight/2)));
  return o;
});

const PLATES = [
  { beat: 7, name: 'court-lit' },       // finished court under the rig
  { beat: 3, name: 'framework' },       // interlocked half-laps, close
  { beat: 6, name: 'lighting' },        // looking up at the fixtures
  { beat: 0, name: 'court-hero' },      // the staged wide
];

for (const p of PLATES) {
  const t0 = Date.now();
  await page.evaluate(v => window.__raceon.scrollTo(Math.max(0,v)), centres[p.beat]);
  await page.waitForTimeout(22000);
  await page.screenshot({ path: `${OUT}/${p.name}.png`, timeout: 240000, animations: 'disabled' });
  const d = await page.evaluate(()=>{const s=window.__raceon.state;return {asm:+s.assembly.toFixed(2),lit:+s.lights.toFixed(2),cam:window.__raceon.camera.pos};});
  console.log(`${p.name}  ${((Date.now()-t0)/1000).toFixed(0)}s  ${JSON.stringify(d)}`);
}
await browser.close();
