import {execFileSync} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {executablePath} from './browser.mjs';
const format=process.argv[2]||'pdf';
await mkdir('artifacts',{recursive:true});
execFileSync(process.execPath,['node_modules/@slidev/cli/bin/slidev.mjs','export','slides.md','--format',format,'--output',format==='pdf'?'artifacts/zig80-lt.pdf':'artifacts/thumbnails','--executable-path',executablePath,'--wait','1000'],{stdio:'inherit'});
