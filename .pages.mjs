import { chromium } from 'playwright';
const OUT='/tmp/claude-0/-home-user-racion-website/349519e7-8101-55bc-80bd-4ba871ddc5f0/scratchpad/shots';
const browser = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
const page = await browser.newPage({ viewport:{width:1600,height:1000} });
const errs=[]; page.on('pageerror',e=>errs.push(e.message));
for (const [name, url] of [['configurator','/configurator'],['systems','/systems'],['projects','/projects'],['lighting','/lighting'],['contact','/contact'],['about','/about'],['process','/process']]) {
  await page.goto('http://localhost:3223'+url, { waitUntil:'load', timeout:60000 });
  await page.waitForTimeout(2200);
  await page.screenshot({ path:`${OUT}/page-${name}.png` });
  console.log('shot', name);
}
// mobile check
const m = await browser.newPage({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:2 });
await m.goto('http://localhost:3223/configurator', { waitUntil:'load', timeout:60000 });
await m.waitForTimeout(2000);
await m.screenshot({ path:`${OUT}/mobile-configurator.png` });
await m.goto('http://localhost:3223/', { waitUntil:'load', timeout:60000 });
await m.waitForTimeout(2500);
await m.screenshot({ path:`${OUT}/mobile-home.png` });
console.log('ERRORS:', errs.slice(0,5).join(' | ')||'none');
await browser.close();
