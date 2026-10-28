import {cp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const run=(...args)=>execFileSync('npm',args,{stdio:'inherit'});
run('run','check:content');run('run','build');run('run','export');
// portable/ is generated output. Recreate it to avoid bundling stale chunks/media.
await rm('portable',{recursive:true,force:true});
await mkdir('portable',{recursive:true});
await cp('dist','portable/dist',{recursive:true});
await cp('artifacts/zig80-lt.pdf','portable/zig80-lt.pdf');
await cp('public/videos','portable/videos',{recursive:true});
await cp('scripts/serve.mjs','portable/serve.mjs');
const deck=JSON.parse(await readFile('docs/deck.json','utf8'));
const media=JSON.parse(await readFile('config/media.json','utf8'));
const index=Object.entries(media).filter(([,v])=>v.kind==='video').map(([key,v])=>({asset:key,slide:v.slide,title:v.title,available:!!v.src,standalone:v.src?`videos/${v.src.split('/').pop()}`:null,planned:`videos/${key}.mp4`}));
await writeFile('portable/media-index.json',JSON.stringify(index,null,2));
await writeFile('portable/START.txt',`Zig_80 LT / 本編${deck.mainCount}枚＋Appendix${deck.count-deck.mainCount}枚 / HTML + PDF + 独立MP4

1. Node.js 22.12以上を事前に用意。npm installは不要です。
2. このフォルダーで node serve.mjs dist 4173 を実行。
3. Chromeで http://127.0.0.1:4173/1 を開きます。
4. サーバーを起動したまま発表。file://で直接開かないでください。

バックアップ: zig80-lt.pdf（PDFで動画は再生できません）。
動画対応: media-index.json。素材未提供のMP4は同梱できません。
hello=${media.hello.slide}枚目 / orbital=${media.orbital.slide}枚目 / gemma=${media.gemma.slide}枚目のみ。
本編最終${deck.mainCount}枚目で通常進行は停止。Appendixは索引リンクから選択。
playback-check.mp4は合成テスト専用、実機映像ではありません。
PPTXは本番形式として使用しません。
公開HTMLは発表者ノートを除去しています。手元の原稿は開発ソースのslides.md。
`);
await cp('README.md','portable/README-source.md');
await cp('docs/assets.md','portable/ASSETS.md');
await mkdir('portable/licenses',{recursive:true});
for(const [name,file] of [['noto-sans-jp','node_modules/@fontsource-variable/noto-sans-jp/LICENSE'],['ibm-plex-mono','node_modules/@fontsource/ibm-plex-mono/LICENSE']])await cp(file,`portable/licenses/${name}.txt`);
execFileSync('tar',['-czf','artifacts/zig80-lt-portable.tar.gz','portable'],{stdio:'inherit'});
const source=['README.md','.gitignore','.npmrc','package.json','package-lock.json','tsconfig.json','env.d.ts','slides.md','appendix.md','.prettierrc.json','outline.md','media-check.md','styles','layouts','setup','components','config','public','scripts','docs'];
execFileSync('tar',['-czf','artifacts/zig80-lt-source.tar.gz',...source],{stdio:'inherit'});
console.log('artifacts/zig80-lt-portable.tar.gz + artifacts/zig80-lt-source.tar.gz');
