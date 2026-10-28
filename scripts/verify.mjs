import {chromium} from 'playwright-chromium';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {executablePath} from './browser.mjs';
await mkdir('artifacts/browser',{recursive:true});
const browser=await chromium.launch({executablePath,headless:true});
const context=await browser.newContext({viewport:{width:1920,height:1080},serviceWorkers:'block'});
const external=[],errors=[],failures=[];
await context.route('**/*',route=>{const u=new URL(route.request().url());if(!['127.0.0.1','localhost'].includes(u.hostname)){external.push(u.href);return route.abort();}return route.continue();});
context.on('page',p=>{p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)failures.push(`${r.status()} ${r.url()}`);});});
const page=await context.newPage();
for(let n=1;n<=4;n++){
 await page.goto(`http://127.0.0.1:4173/${n}`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(250);
 await page.screenshot({path:`artifacts/browser/slide-${n}.png`});
 assert.equal(await page.locator('.slidev-page:visible video').count(),0);
}
const qa=await context.newPage();await qa.goto('http://127.0.0.1:4174/1',{waitUntil:'networkidle'});
const video=qa.locator('video').first();await video.waitFor();
await qa.waitForFunction(()=>document.querySelector('video')?.readyState>=2);
assert.equal(await video.evaluate(v=>v.paused&&!v.autoplay&&v.controls),true,'manual controls, initially paused');
// A real pointer click on native Chrome controls starts playback.
await qa.screenshot({path:'artifacts/browser/video-before.png'});
let box=await video.boundingBox();await qa.mouse.click(box.x+52,box.y+box.height-47);
await qa.waitForFunction(()=>{const v=document.querySelector('video');return !v.paused&&v.currentTime>.2});
await qa.mouse.click(box.x+52,box.y+box.height-47);assert.equal(await video.evaluate(v=>v.paused),true,'native pause control');
await video.evaluate(v=>{v.preload='auto';v.load()});
await qa.waitForFunction(()=>{const v=document.querySelector('video');return v.buffered.length>0&&v.buffered.end(v.buffered.length-1)>=v.duration-.1});
await context.setOffline(true);
await qa.mouse.click(box.x+52,box.y+box.height-47);
await qa.waitForFunction(()=>{const v=document.querySelector('video');return !v.paused&&v.currentTime>.2});
await qa.mouse.click(box.x+52,box.y+box.height-47);
await video.evaluate(v=>{v.currentTime=3});await qa.waitForTimeout(200);
assert.equal(await video.evaluate(v=>v.currentTime>=3),true,'offline seek');
await qa.screenshot({path:'artifacts/browser/video-check.png'});
await context.setOffline(false);
await qa.goto('http://127.0.0.1:4174/2',{waitUntil:'networkidle'});await qa.screenshot({path:'artifacts/browser/code-check.png'});
// Navigation leaves video paused.
assert.equal(await qa.locator('video').first().evaluate(v=>v.paused),true);
const range=await context.request.get('http://127.0.0.1:4174/videos/playback-check.mp4',{headers:{Range:'bytes=0-99'}});assert.equal(range.status(),206);assert.equal((await range.body()).length,100);
const presenter=await context.newPage();await presenter.goto('http://127.0.0.1:4173/presenter/1',{waitUntil:'networkidle'});await presenter.screenshot({path:'artifacts/browser/presenter.png'});
assert.deepEqual(external,[],'no external requests');assert.deepEqual(errors,[],'no page errors');assert.deepEqual(failures,[],'no failed HTTP responses');
await writeFile('artifacts/verification.json',JSON.stringify({date:new Date().toISOString(),browser:await browser.version(),viewport:'1920x1080',slides:4,external,errors,failures,manualPlayPause:true,offlineBufferedPlayback:true,offlineSeek:true,range206:true,osNetworkDisabled:false},null,2));
await writeFile('artifacts/contact-sheet.html',`<!doctype html><meta charset="utf-8"><title>4-slide visual review</title><style>body{background:#151b17;color:white;font:20px sans-serif}main{display:grid;grid-template-columns:1fr 1fr;gap:20px}img{width:100%}</style><h1>4-slide prototype</h1><main>${[1,2,3,4].map(n=>`<figure><img src="browser/slide-${n}.png"><figcaption>${n}</figcaption></figure>`).join('')}</main>`);
await browser.close();console.log('PASS: 4 slides, external network blocked, native controls, offline buffered MP4 playback, seek, range, code layout');
