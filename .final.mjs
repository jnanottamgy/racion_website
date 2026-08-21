import { chromium } from 'playwright';
const OUT='/tmp/claude-0/-home-user-racion-website/349519e7-8101-55bc-80bd-4ba871ddc5f0/scratchpad/shots';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport:{width:1600,height:1000} });
await p.goto('http://localhost:3227/systems', { waitUntil:'load', timeout:60000 });
await p.waitForTimeout(1500); await p.evaluate(()=>window.scrollTo(0,900)); await p.waitForTimeout(1200);
await p.screenshot({ path:`${OUT}/final-systems.png` });
await p.goto('http://localhost:3227/configurator', { waitUntil:'load', timeout:60000 });
await p.waitForTimeout(1500); await p.evaluate(()=>window.scrollTo(0,600)); await p.waitForTimeout(1200);
await p.screenshot({ path:`${OUT}/final-planner.png` });
// og image
await p.goto('http://localhost:3227/opengraph-image', { waitUntil:'load', timeout:60000 });
await p.waitForTimeout(1500);
await p.screenshot({ path:`${OUT}/final-og.png` });
console.log('done');
await b.close();
