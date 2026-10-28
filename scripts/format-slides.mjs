import {readFile,writeFile} from 'node:fs/promises';
import {parseSync} from '@slidev/parser';
import {format} from 'prettier';
const check=process.argv.includes('--check');
let changed=false;
for(const file of ['slides.md','appendix.md']){
 const source=await readFile(file,'utf8');
 const parsed=parseSync(source,file);
 let output=source;
 // Replace each complete raw slide so fenced code and notes remain untouched.
 for(const slide of [...parsed.slides].reverse()){
  if(!slide.content.trim())continue;
  const fences=[];
  let body=slide.content.replace(/^```[^\n]*\n[\s\S]*?^```/gm,code=>`<!--SLIDEV_CODE_${fences.push(code)-1}-->`);
  const regions=body.split(/(^# .+$)/m);
  for(let i=0;i<regions.length;i++){
   if(!regions[i].trim()||regions[i].startsWith('# '))continue;
   regions[i]='\n\n'+(await format(regions[i].trim(),{parser:'html',printWidth:100,tabWidth:2,htmlWhitespaceSensitivity:'css'})).trim()+'\n\n';
  }
  body=regions.join('').replace(/^[ \t]*<!--SLIDEV_CODE_(\d+)-->/gm,(_,n)=>'\n'+fences[n]+'\n').trim();
  // A new HTML block after a Markdown fence must start before column 4.
  // Otherwise CommonMark interprets the indented tag as a second code block.
  body=body.replace(/(^```\n)\n[ \t]+(?=<)/gm,'$1\n');
  const original=slide.raw;
  const updated=original.replace(slide.content,body);
  output=output.replace(original,updated);
 }
 output=await format(output,{filepath:file,parser:'slidev',plugins:['prettier-plugin-slidev'],printWidth:100,proseWrap:'preserve',htmlWhitespaceSensitivity:'css'});
 output=output.replace(/(^```\n)(?:\n)+[ \t]+(?=<)/gm,'$1\n');
 if(output!==source){changed=true;if(!check)await writeFile(file,output);}
 console.log(`${file}: ${output===source?'formatted':check?'needs formatting':'formatted (updated)'}`);
}
if(check&&changed)process.exitCode=1;
