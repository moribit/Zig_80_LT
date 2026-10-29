import {chromium} from 'playwright-chromium';
import {spawn} from 'node:child_process';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {executablePath} from './browser.mjs';

const deck=JSON.parse(await readFile('docs/deck.json','utf8'));
const media=JSON.parse(await readFile('config/media.json','utf8'));
const remote=process.env.PAGES_URL;
const folder=`artifacts/pages-${remote?'live':'local'}`;
await mkdir(folder,{recursive:true});
let server,browser;
try{
 let base=remote;
 if(!base){
  server=spawn(process.execPath,['scripts/serve.mjs','dist-pages','0','/Zig_80_LT/']);
  base=await new Promise((resolve,reject)=>{server.once('error',reject);server.stdout.on('data',d=>{const m=String(d).match(/http:\/\/127\.0\.0\.1:\d+/);if(m)resolve(m[0]+'/Zig_80_LT/');});});
 }
 if(!base.endsWith('/'))base+='/';
 const allowedOrigin=new URL(base).origin;
 browser=await chromium.launch({executablePath,headless:true});
 const context=await browser.newContext({viewport:{width:1920,height:1080},serviceWorkers:'block'});
 const errors=[],failed=[],external=[];
 await context.route('**/*',route=>{
  const u=new URL(route.request().url());
  if(u.origin!==allowedOrigin){external.push(u.href);return route.abort();}
  return route.continue();
 });
 const page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`)});
 await page.goto(base,{waitUntil:'networkidle'});
 const url=n=>`${base}#/${n}${n>=deck.appendixStart?'?appendix=1':''}`;
 for(const s of deck.slides){
  await page.goto(url(s.number),{waitUntil:'networkidle'});
  await page.locator('.slidev-page:visible h1').first().waitFor();
  for(let attempt=0;attempt<50;attempt++){
   if((await page.locator('.slidev-page:visible h1').first().textContent()).replace(/\s/g,'')===s.title.replace(/\s/g,''))break;
   await page.waitForTimeout(100);
  }
  await page.evaluate(()=>document.fonts.ready);
  const slide=page.locator('.slidev-page:visible .slidev-layout').first();
  assert.equal((await slide.locator('h1').innerText()).replace(/\s/g,''),s.title.replace(/\s/g,''));
  assert.equal(await slide.locator('[data-asset="gemma"]').count(),s.number===deck.revealSlide?1:0);
  const photos=await slide.locator('img.real-photo').evaluateAll(imgs=>imgs.map(i=>({src:i.src,ok:i.complete&&i.naturalWidth>0})));
  for(const photo of photos){assert.ok(photo.ok);assert.ok(photo.src.startsWith(base+'photos/'));}
  if([1,2,3,7,19,23,26,27,44].includes(s.number))await page.screenshot({path:`${folder}/slide-${s.number}.png`});
 }
 // Direct links and reloads must be served with HTTP 200 on GitHub Pages.
 for(const n of [3,deck.revealSlide,deck.appendixStart,deck.count]){
  await page.goto(url(n));const response=await page.reload({waitUntil:'networkidle'});
  assert.equal(response.status(),200);
  assert.equal((await page.locator('.slidev-page:visible h1').first().innerText()).replace(/\s/g,''),deck.slides[n-1].title.replace(/\s/g,''));
 }
 await page.goto(url(deck.mainCount),{waitUntil:'networkidle'});await page.keyboard.press('ArrowRight');await page.waitForTimeout(100);
 assert.equal(new URL(page.url()).hash,`#/${deck.mainCount}`);
 await page.getByRole('link',{name:`${deck.appendixStart} — メモリ`,exact:true}).click();
 await page.waitForURL(`**#/${deck.appendixStart}?appendix=1`);
 const videos={};
 for(const [key,item] of Object.entries(media).filter(([,m])=>m.kind==='video'&&m.src)){
  await page.goto(url(item.slide),{waitUntil:'networkidle'});
  const video=page.locator(`.slidev-page:visible [data-asset="${key}"] video`);
  await video.evaluate(v=>{v.preload='auto';v.load()});
  for(let attempt=0;attempt<100&&!(await video.evaluate(v=>v.readyState>=2));attempt++)await page.waitForTimeout(100);
  assert.equal(await video.evaluate(v=>v.controls&&!v.autoplay&&v.paused&&v.readyState>=2),true);
  assert.equal(await video.evaluate(v=>v.currentSrc),new URL(item.src.slice(1),base).href);
  assert.equal(await video.evaluate(v=>v.poster),new URL(item.poster.slice(1),base).href);
  const box=await video.boundingBox(),scale=box.width/await video.evaluate(v=>v.clientWidth);
  const toggle=()=>page.mouse.click(box.x+24*scale,box.y+box.height-48*scale);
  await toggle();
  let playing=false;
  for(let attempt=0;attempt<50&&!playing;attempt++){await page.waitForTimeout(100);playing=await video.evaluate(v=>!v.paused&&v.currentTime>.1);}
  assert.ok(playing,`${key}: native manual play`);await toggle();assert.equal(await video.evaluate(v=>v.paused),true);
  videos[key]={slide:item.slide,manualPlayPause:true,correctBase:true};
 }
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.deepEqual(external,[]);
 await writeFile(`${folder}/report.json`,JSON.stringify({date:new Date().toISOString(),url:base,slides:deck.count,directReload200:true,mainEndStops:true,appendixLink:true,videos,errors,failed,external},null,2));
 console.log(`PASS: ${base} — ${deck.count} slides, photos, direct reloads, Appendix, both videos, no errors/external dependencies`);
}finally{await browser?.close();server?.kill();}
