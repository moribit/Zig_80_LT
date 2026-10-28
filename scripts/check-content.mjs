import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';
const deck=JSON.parse(await readFile('docs/deck.json','utf8'));
const manifest=JSON.parse(await readFile('config/media.json','utf8'));
const source=await readFile('slides.md','utf8');
const notes=[...source.matchAll(/<!--([\s\S]*?)-->/g)].map(m=>m[1]);
assert.equal(notes.length,deck.count,'speaker notes on every slide');
for(const note of notes)for(const field of ['伝えること:','前からのつながり:','技術補足:','次への導入:','出典:'])assert.ok(note.includes(field),field);
assert.equal((source.match(/<SlideFooter /g)||[]).length,deck.count);
const chunks=source.split(/\n---\nlayout:/);
assert.equal(chunks.length,deck.count);
for(const [key,item] of Object.entries(manifest)){
 assert.equal(chunks.filter(s=>s.includes(`asset="${key}"`)).length,1,`${key}: once`);
 assert.ok(chunks[item.slide-1].includes(`asset="${key}"`),`${key}: assigned slide`);
 if(item.src){assert.ok(item.src.startsWith(item.kind==='video'?'/videos/':'/photos/'));await access('public'+item.src);if(item.kind==='video'){assert.ok(item.src.endsWith('.mp4'));assert.ok(item.poster,'video print poster');await access('public'+item.poster);}}
}
assert.equal(manifest.gemma.slide,deck.revealSlide);
assert.ok(!source.includes('playback-check.mp4'),'synthetic QA movie excluded from main');
assert.ok(!source.includes('appleuser634'),'canonical URLs in slide notes');
console.log(`PASS: ${deck.count} slides, five-part notes, media mapping and final reveal`);
