import {chromium} from 'playwright-chromium';
import {mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {executablePath} from './browser.mjs';
const deck=JSON.parse(await readFile('docs/deck.json','utf8'));
const manifest=JSON.parse(await readFile('config/media.json','utf8'));
const servers=[];
async function serve(root){
 const child=spawn(process.execPath,['scripts/serve.mjs',root,'0'],{stdio:['ignore','pipe','pipe']});servers.push(child);
 return new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',code=>{if(code)reject(new Error(`server exited ${code}`))});child.stdout.on('data',d=>{const match=String(d).match(/http:\/\/127\.0\.0\.1:\d+/);if(match)resolve(match[0]);});});
}
await mkdir('artifacts/browser',{recursive:true});
let browser;
try{
 const mainOrigin=await serve(process.env.VERIFY_DIST||'dist');const qaOrigin=await serve('dist-qa');
 browser=await chromium.launch({executablePath,headless:true});
 const context=await browser.newContext({viewport:{width:1920,height:1080},serviceWorkers:'block'});
 const external=[],errors=[],consoleErrors=[],failures=[],layoutIssues=[],contrastIssues=[];
 await context.route('**/*',route=>{const u=new URL(route.request().url());if(!['127.0.0.1','localhost'].includes(u.hostname)){external.push(u.href);return route.abort();}return route.continue();});
 context.on('page',p=>{p.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)failures.push(`${r.status()} ${r.url()}`);});});
 const page=await context.newPage();
 for(let n=1;n<=deck.count;n++){
  await page.goto(`${mainOrigin}/${n}`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(100);
  const slide=page.locator('.slidev-page:visible .slidev-layout').first();
  await slide.waitFor();await page.screenshot({path:`artifacts/browser/slide-${n}.png`});
  const issues=await slide.evaluate(root=>{
   const r=root.getBoundingClientRect(),footer=root.querySelector('.deck-footer')?.getBoundingClientRect();
   return [...root.querySelectorAll('h1,h2,p,pre,figure,table,.flow-step,.node,.log-extract,.address-map,.vram-map')].flatMap(el=>{
    const b=el.getBoundingClientRect();if(!b.width||!b.height)return [];
    const label=el.textContent.trim().slice(0,65);
    const column=el.closest('.split > div,.photo-grid > div');
    if(column&&['P','H2'].includes(el.tagName)){const range=document.createRange();range.selectNodeContents(el);const textBox=range.getBoundingClientRect(),col=column.getBoundingClientRect();if(textBox.right>col.right+3)return [`column width: ${label}`];}
    const out=[];
    if(b.left<r.left-2||b.right>r.right+2||b.top<r.top-2||b.bottom>r.bottom+2)out.push(`canvas: ${label}`);
    if(footer&&b.bottom>footer.top-5&&b.top<footer.bottom)out.push(`footer: ${label}`);
    if(el.tagName==='PRE'&&el.scrollWidth>el.clientWidth+2)out.push(`code width: ${label}`);
    return out;
   });
  });
  layoutIssues.push(...issues.map(issue=>({slide:n,issue})));
  const colors=await slide.evaluate(root=>{const c=getComputedStyle(root);return [c.backgroundColor,c.color];});
  if(colors[0]!=='rgb(255, 255, 255)'||colors[1]!=='rgb(23, 23, 23)')contrastIssues.push({slide:n,colors});
  if(deck.slides[n-1].messageOnly){
   const text=await slide.innerText();
   assert.equal(text.trim(),deck.slides[n-1].title,'message contains only its sentence');
   assert.equal(await slide.locator('footer,figure,img,svg,video').count(),0,'no message decorations');
   const geometry=await slide.evaluate(root=>{const r=root.getBoundingClientRect(),h=root.querySelector('h1'),b=h.getBoundingClientRect();return {dx:Math.abs((r.left+r.right-b.left-b.right)/2),dy:Math.abs((r.top+r.bottom-b.top-b.bottom)/2),font:parseFloat(getComputedStyle(h).fontSize),color:getComputedStyle(h).color};});
   assert.ok(geometry.dx<3&&geometry.dy<3&&geometry.font>=50,'message centered and large');
   assert.equal(geometry.color,'rgb(23, 23, 23)');
  }
  const gemma=slide.locator('[data-asset="gemma"]');
  assert.equal(await gemma.count(),n===deck.revealSlide?1:0,'final chat only on its assigned slide');
 }
 // The normal next key must stop at the main ending in both presentation modes.
 for(const prefix of ['', '/presenter']){
  await page.goto(`${mainOrigin}${prefix}/${deck.mainCount}`,{waitUntil:'networkidle'});
  await page.keyboard.press('ArrowRight');await page.waitForTimeout(150);
  assert.equal(new URL(page.url()).pathname,`${prefix}/${deck.mainCount}`,'main ending stops normal advance');
 }
 await page.goto(`${mainOrigin}/${deck.mainCount}`,{waitUntil:'networkidle'});
 await page.getByRole('link',{name:`${deck.appendixStart} — メモリ`,exact:true}).click();
 await page.waitForURL(`**/${deck.appendixStart}?appendix=1`);
 assert.ok(await page.locator('.slidev-page:visible h1').first().textContent(),'appendix link navigates');
 // All appendix URLs were independently rendered above; test returning to the ending.
 await page.goto(`${mainOrigin}/${deck.mainCount}`,{waitUntil:'networkidle'});
 const qa=await context.newPage();await qa.goto(`${qaOrigin}/1`,{waitUntil:'networkidle'});
 const video=qa.locator('video').first();await video.waitFor();
 await qa.waitForFunction(()=>document.querySelector('video')?.readyState>=2);
 assert.equal(await video.evaluate(v=>v.paused&&!v.autoplay&&v.controls),true);
 await qa.screenshot({path:'artifacts/browser/video-before.png'});
 const box=await video.boundingBox();
 const toggle=()=>qa.mouse.click(box.x+52,box.y+box.height-47);
 await toggle();await qa.waitForFunction(()=>{const v=document.querySelector('video');return !v.paused&&v.currentTime>.2});
 await toggle();assert.equal(await video.evaluate(v=>v.paused),true);
 await video.evaluate(v=>{v.preload='auto';v.load()});
 await qa.waitForFunction(()=>{const v=document.querySelector('video');return v.buffered.length>0&&v.buffered.end(v.buffered.length-1)>=v.duration-.1});
 await context.setOffline(true);await toggle();
 await qa.waitForFunction(()=>{const v=document.querySelector('video');return !v.paused&&v.currentTime>.2});
 await toggle();await video.evaluate(v=>{v.currentTime=3});await qa.waitForTimeout(200);
 assert.equal(await video.evaluate(v=>v.currentTime>=3),true);
 await qa.screenshot({path:'artifacts/browser/video-check.png'});await context.setOffline(false);
 await qa.goto(`${qaOrigin}/2`,{waitUntil:'networkidle'});await qa.screenshot({path:'artifacts/browser/code-check.png'});
 assert.equal(await qa.locator('video').first().evaluate(v=>v.paused),true);
 const range=await context.request.get(`${qaOrigin}/videos/playback-check.mp4`,{headers:{Range:'bytes=0-99'}});assert.equal(range.status(),206);assert.equal((await range.body()).length,100);
 const presenter=await context.newPage();await presenter.goto(`${mainOrigin}/presenter/1`,{waitUntil:'networkidle'});await presenter.screenshot({path:'artifacts/browser/presenter.png'});
 const report={date:new Date().toISOString(),browser:await browser.version(),viewport:'1920x1080',root:process.env.VERIFY_DIST||'dist',slides:deck.count,external,errors,consoleErrors,failures,layoutIssues,contrastIssues,appendixNavigation:{directPages:true,indexLink:true,mainEndStops:true,presenterEndStops:true},syntheticQa:{manualPlayPause:true,offlineBufferedPlayback:true,offlineSeek:true,range206:true},hardwareMedia:Object.fromEntries(Object.entries(manifest).map(([key,item])=>[key,{slide:item.slide,provided:!!item.src,playbackVerified:false}])),osNetworkDisabled:false};
 await writeFile('artifacts/verification.json',JSON.stringify(report,null,2));
 await writeFile('artifacts/contact-sheet.html',`<!doctype html><html lang="ja"><meta charset="utf-8"><title>Zig_80 LT 全${deck.count}枚</title><style>body{background:#ffffff;color:#171717;font:18px sans-serif;margin:24px}main{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}figure{margin:0}img{width:100%;border:1px solid #e5e7eb}figcaption{margin:8px 0 16px;line-height:1.5}h2{margin-top:40px}</style><h1>Zig_80 LT / ${deck.count}枚の視覚レビュー</h1>${Object.entries(deck.chapters).map(([ch,name])=>`<h2>${Number(ch)===6 ? name : `第${ch}章 ${name}`}</h2><main>${deck.slides.filter(s=>s.chapter===Number(ch)).map(s=>`<figure><a href="browser/slide-${s.number}.png"><img src="browser/slide-${s.number}.png" alt="${s.title}"></a><figcaption>${s.number}. ${s.title}</figcaption></figure>`).join('')}</main>`).join('')}</html>`);
 const artifactOrigin=await serve('artifacts');
 const review=await context.newPage();await review.goto(`${artifactOrigin}/contact-sheet.html`,{waitUntil:'networkidle'});await review.screenshot({path:'artifacts/contact-sheet.png',fullPage:true});
 for(const ch of Object.keys(deck.chapters)){
  await review.goto(`${artifactOrigin}/contact-sheet.html`,{waitUntil:'networkidle'});
  await review.evaluate(ch=>{document.querySelectorAll('h2').forEach((h,i)=>{if(i+1!==Number(ch)){h.style.display='none';h.nextElementSibling.style.display='none';}});},ch);
  await review.screenshot({path:`artifacts/chapter-${ch}.png`,fullPage:true});
 }
 assert.deepEqual(external,[],'no external requests');assert.deepEqual(errors,[],'no page errors');assert.deepEqual(consoleErrors,[],'no browser console errors');assert.deepEqual(failures,[],'no failed HTTP');assert.deepEqual(layoutIssues,[],'no canvas/footer/code overflow');assert.deepEqual(contrastIssues,[],'white background and black body text');
 console.log(`PASS: ${deck.count} slides, notes/reveal policy, external network blocked, synthetic MP4 native controls and buffered offline playback. Hardware footage NOT verified.`);
}finally{await browser?.close();for(const child of servers)child.kill();}
