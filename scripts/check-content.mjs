import {readFile,access} from 'node:fs/promises';
import {resolve} from 'node:path';
import {load,parseSync} from '@slidev/parser/fs';
import assert from 'node:assert/strict';
const deck=JSON.parse(await readFile('docs/deck.json','utf8'));
const manifest=JSON.parse(await readFile('config/media.json','utf8'));
const main=await readFile('slides.md','utf8');
const appendix=await readFile('appendix.md','utf8');
const outline=await readFile('outline.md','utf8');
const root=process.cwd();
const {slides}=await load({roots:[root],userRoot:root,allowedRoots:[root]},resolve('slides.md'));
assert.equal(slides.length,deck.count);
assert.equal(parseSync(main,'slides.md').slides.filter(s=>s.content.trim()).length,deck.mainCount);
assert.equal(parseSync(appendix,'appendix.md').slides.length,deck.count-deck.mainCount);
assert.ok(main.includes('src: ./appendix.md'),'Appendix is included from its own file');
for(const [i,slide] of slides.entries()){
 const heading=slide.content.match(/^# (.+)$/m)?.[1].replace(/<br\s*\/?>/g,'');
 assert.equal(heading,deck.slides[i].title,`slide ${i+1} title`);
 assert.ok(outline.includes(`| ${i+1} | ${heading} | ${deck.slides[i].purpose} |`),`slide ${i+1} outline`);
 for(const field of ['伝えること:','前からのつながり:','技術補足:','次への導入:','出典:'])assert.ok(slide.note?.includes(field),`${i+1}: ${field}`);
 assert.ok(slide.note.includes(`伝えること: ${deck.slides[i].purpose}`));
 if(deck.slides[i].messageOnly){
  assert.equal(slide.content.trim(),`# ${slide.content.match(/^# (.+)$/m)[1]}`,'message contains only heading');
 }else assert.ok(slide.content.includes(`:number="${i+1}"`),`slide ${i+1} footer`);
 if(i>=deck.mainCount){
  assert.equal(slide.source.filepath,resolve('appendix.md'));
  assert.equal(slide.frontmatter.hideInToc,true);
  assert.ok(slide.content.includes('chapter="Appendix"'));
 }
}
for(const [key,item] of Object.entries(manifest)){
 assert.equal(slides.filter(s=>s.content.includes(`asset="${key}"`)).length,1,`${key}: once`);
 assert.ok(slides[item.slide-1].content.includes(`asset="${key}"`),`${key}: assigned page`);
 if(item.src){assert.ok(item.src.startsWith(item.kind==='video'?'/videos/':'/photos/'));await access('public'+item.src);if(item.kind==='video'){assert.ok(item.src.endsWith('.mp4'));assert.ok(item.poster);await access('public'+item.poster);}}
}
assert.equal(manifest.gemma.slide,deck.revealSlide);
assert.equal(deck.appendixStart,deck.mainCount+1);
assert.equal(deck.mainCount+deck.slides.filter(s=>s.chapter===6).length,deck.count);
assert.ok(deck.revealSlide<deck.mainCount);
assert.ok(!/playback-check\.mp4|appleuser634/.test(main+appendix));
assert.ok(!/Watchdog|watchdog|CRC|ACK|NAK|16 cycle/.test(slides.slice(0,deck.mainCount).map(s=>s.content).join('\n')));
console.log(`PASS: ${deck.mainCount} main + ${deck.count-deck.mainCount} Appendix = ${deck.count} slides, notes, media and reveal`);
