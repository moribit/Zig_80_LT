import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';
const deck=JSON.parse(await readFile('docs/deck.json','utf8'));
const manifest=JSON.parse(await readFile('config/media.json','utf8'));
const source=await readFile('slides.md','utf8');
const outline=await readFile('outline.md','utf8');
const notes=[...source.matchAll(/<!--([\s\S]*?)-->/g)].map(m=>m[1]);
assert.equal(notes.length,deck.count,'speaker notes on every slide');
for(const note of notes)for(const field of ['伝えること:','前からのつながり:','技術補足:','次への導入:','出典:'])assert.ok(note.includes(field),field);
assert.equal((source.match(/<SlideFooter /g)||[]).length,deck.slides.filter(s=>!s.messageOnly).length);
const chunks=source.split(/\n---\nlayout:/);
assert.equal(chunks.length,deck.count);
for(const [i,chunk] of chunks.entries()){
 const heading=chunk.match(/^# (.+)$/m)?.[1].replace(/<br\s*\/?>/g,'');
 assert.equal(heading,deck.slides[i].title,`slide ${i+1} title matches metadata`);
 assert.ok(outline.includes(`| ${i+1} | ${heading} | ${deck.slides[i].purpose} |`),`slide ${i+1} outline`);
 assert.ok(chunk.includes(`伝えること: ${deck.slides[i].purpose}`),`slide ${i+1} speaker purpose`);
 if(deck.slides[i].messageOnly){
  const visible=chunk.split('<!--')[0].split(/\n---\n/).at(-1).trim();
  assert.equal(visible,`# ${heading}`,`slide ${i+1} message only`);
 }else assert.ok(chunk.includes(`:number="${i+1}"`),`slide ${i+1} footer order`);
}
for(const [key,item] of Object.entries(manifest)){
 assert.equal(chunks.filter(s=>s.includes(`asset="${key}"`)).length,1,`${key}: once`);
 assert.ok(chunks[item.slide-1].includes(`asset="${key}"`),`${key}: assigned slide`);
 if(item.src){assert.ok(item.src.startsWith(item.kind==='video'?'/videos/':'/photos/'));await access('public'+item.src);if(item.kind==='video'){assert.ok(item.src.endsWith('.mp4'));assert.ok(item.poster,'video print poster');await access('public'+item.poster);}}
}
assert.equal(manifest.gemma.slide,deck.revealSlide);
assert.equal(manifest.manual.slide,6);assert.equal(manifest.connection.slide,8);
assert.ok(!deck.slides.some(s=>s.title==='今回の開発目標'));
assert.deepEqual(deck.slides.filter(s=>s.messageOnly).map(s=>s.number),[5,7]);
assert.ok(!source.includes('playback-check.mp4'),'synthetic QA movie excluded from main');
assert.ok(!source.includes('appleuser634'),'canonical URLs in slide notes');


assert.equal(deck.mainCount + deck.slides.filter(s=>s.chapter===6).length,deck.count);
assert.equal(deck.appendixStart,deck.mainCount+1);
assert.ok(deck.revealSlide<deck.mainCount);
const visibleMain=chunks.slice(0,deck.mainCount).map(s=>s.split('<!--')[0]).join('\n');
assert.ok(!/Watchdog|watchdog|CRC|ACK|NAK|16 cycle/.test(visibleMain),'protocol details stay in appendix');
console.log(`PASS: ${deck.count} slides, five-part notes, media mapping and final reveal`);
