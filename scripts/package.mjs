import {cp,mkdir,writeFile,readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const run=(...args)=>execFileSync('npm',args,{stdio:'inherit'});
run('run','build');run('run','export');
await mkdir('portable',{recursive:true});
await cp('dist','portable/dist',{recursive:true,force:true});
await cp('artifacts/zig80-lt.pdf','portable/zig80-lt.pdf');
await cp('public/videos','portable/videos',{recursive:true,force:true});
await cp('scripts/serve.mjs','portable/serve.mjs');
await writeFile('portable/START.txt',`Zig_80 LT / browser + PDF + standalone MP4

1. Install Node.js 22 or newer in advance. No npm install is needed.
2. In this folder: node serve.mjs dist 4173
3. Open http://127.0.0.1:4173/1 in current Chrome.
4. Keep this server running; do not open index.html with file://.

Backup: zig80-lt.pdf (video cannot play in PDF).
Standalone videos: videos/. playback-check.mp4 is a synthetic test, NOT hardware footage.
Real hardware photo/video assets are pending.
PPTX is not a supported presentation format.
`);
await cp('README.md','portable/README-source.md');
await mkdir('portable/licenses',{recursive:true});
for(const [name,file] of [['noto-sans-jp','node_modules/@fontsource-variable/noto-sans-jp/LICENSE'],['ibm-plex-mono','node_modules/@fontsource/ibm-plex-mono/LICENSE']])await cp(file,`portable/licenses/${name}.txt`);
execFileSync('tar',['-czf','artifacts/zig80-lt-portable.tar.gz','portable'],{stdio:'inherit'});
const source=['README.md','.gitignore','.npmrc','package.json','package-lock.json','tsconfig.json','env.d.ts','slides.md','outline.md','media-check.md','styles','layouts','components','public','scripts','docs'];
execFileSync('tar',['-czf','artifacts/zig80-lt-source.tar.gz',...source],{stdio:'inherit'});
console.log('artifacts/zig80-lt-portable.tar.gz + artifacts/zig80-lt-source.tar.gz');
