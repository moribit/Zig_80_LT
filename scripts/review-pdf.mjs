import {execFileSync,spawn} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright-chromium';
import {executablePath} from './browser.mjs';
import assert from 'node:assert/strict';
const {count}=JSON.parse(await readFile('docs/deck.json','utf8'));
const media=JSON.parse(await readFile('config/media.json','utf8'));
const videoSlides=new Set(Object.values(media).filter(m=>m.kind==='video'&&m.src).map(m=>m.slide));
await mkdir('artifacts/pdf-review',{recursive:true});
execFileSync('pdftoppm',['-scale-to','1100','-png','artifacts/zig80-lt.pdf','artifacts/pdf-review/slide'],{stdio:'inherit'});
const child=spawn(process.execPath,['scripts/serve.mjs','artifacts','0']);
const app=spawn(process.execPath,['scripts/serve.mjs',process.env.VERIFY_DIST||'dist','0']);
const appOriginPromise=new Promise((resolve,reject)=>{app.once('error',reject);app.stdout.on('data',d=>{const m=String(d).match(/http:\/\/127\.0\.0\.1:\d+/);if(m)resolve(m[0]);});});
let browser;
try{
 const origin=await new Promise((resolve,reject)=>{child.once('error',reject);child.stdout.on('data',d=>{const m=String(d).match(/http:\/\/127\.0\.0\.1:\d+/);if(m)resolve(m[0]);});});
 browser=await chromium.launch({executablePath,headless:true});const page=await browser.newPage();await page.goto(origin);
 // PDF intentionally omits native video controls. Compare its poster against
 // a separate browser reference with only those controls hidden; retain the
 // normal screenshots and playback tests from verify.mjs unchanged.
 const appOrigin=await appOriginPromise;
 const reference=await browser.newPage({viewport:{width:1920,height:1080}});
 for(const n of videoSlides){
  await reference.goto(`${appOrigin}/${n}`,{waitUntil:'networkidle'});await reference.evaluate(()=>document.fonts.ready);
  const video=reference.locator('.slidev-page:visible video');await video.evaluate(v=>{v.controls=false});
  await reference.screenshot({path:`artifacts/pdf-review/browser-${n}.png`});
 }
 await reference.close();
 const report=[];
 for(let n=1;n<=count;n++){
  const delta=await page.evaluate(async({origin,n,videoReference})=>{
   const load=src=>new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=src;});
   const a=await load(`${origin}/pdf-review/slide-${String(n).padStart(2,'0')}.png`),b=await load(videoReference?`${origin}/pdf-review/browser-${n}.png`:`${origin}/browser/slide-${n}.png`);
   const canvas=document.createElement('canvas');canvas.width=a.width;canvas.height=a.height;
   const ctx=canvas.getContext('2d');ctx.drawImage(a,0,0);const x=ctx.getImageData(0,0,a.width,a.height).data;
   ctx.clearRect(0,0,a.width,a.height);ctx.drawImage(b,0,0,a.width,a.height);const y=ctx.getImageData(0,0,a.width,a.height).data;
   let sum=0;for(let k=0;k<x.length;k+=4)sum+=Math.abs(x[k]-y[k])+Math.abs(x[k+1]-y[k+1])+Math.abs(x[k+2]-y[k+2]);
   return Math.round(sum/(a.width*a.height*3)*1000)/1000;
  },{origin,n,videoReference:videoSlides.has(n)});report.push({slide:n,meanChannelDifference:delta,...(videoSlides.has(n)?{reference:'browser poster with native controls hidden'}:{})});
 }
 await writeFile('artifacts/pdf-comparison.json',JSON.stringify(report,null,2));
 // This catches missing blocks/pages; human review is still required.
 assert.ok(report.every(r=>r.meanChannelDifference<8),'PDF/browser difference needs review');
 console.log(`PASS: ${count} PDF pages rendered; maximum mean RGB difference ${Math.max(...report.map(r=>r.meanChannelDifference))}/255`);
}finally{await browser?.close();child.kill();app.kill();}
