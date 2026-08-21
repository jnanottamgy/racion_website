import { chromium } from 'playwright';
const OUT='/tmp/claude-0/-home-user-racion-website/349519e7-8101-55bc-80bd-4ba871ddc5f0/scratchpad/shots';
const browser = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
const page = await browser.newPage({ viewport:{width:1600,height:1000} });
await page.goto('http://localhost:3223/configurator', { waitUntil:'load' });
await page.waitForTimeout(1500);
await page.evaluate(()=>window.scrollTo(0,700));
await page.waitForTimeout(1200);
await page.screenshot({ path:`${OUT}/page-configurator-plan.png` });
// fill hall dims to exercise the fit check
await page.fill('input[aria-label="Hall length in metres"]','20');
await page.fill('input[aria-label="Hall width in metres"]','26');
await page.waitForTimeout(800);
await page.evaluate(()=>window.scrollTo(0,400));
await page.waitForTimeout(800);
await page.screenshot({ path:`${OUT}/page-configurator-fit.png` });
console.log('done');
await browser.close();
