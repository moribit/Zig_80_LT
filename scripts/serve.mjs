import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(process.argv[2]||'dist');
const port=Number(process.argv[3]||4173);
const base=process.argv[4]||'/';
if(!base.startsWith('/')||!base.endsWith('/'))throw new Error('Base must begin and end with /');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.woff2':'font/woff2','.mp4':'video/mp4','.pdf':'application/pdf'};
const server=http.createServer(async(req,res)=>{try{
 const urlPath=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(!urlPath.startsWith(base)){res.writeHead(404).end();return;}
 const pathname='/'+urlPath.slice(base.length);
 let file=path.resolve(root,'.'+pathname);
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 try{if((await stat(file)).isDirectory())file=path.join(file,'index.html');}catch{if(path.extname(file)){res.writeHead(404).end();return;}file=path.join(root,'index.html');}
 const data=await readFile(file);const headers={'Content-Type':mime[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-cache'};
 const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
 if(range){const start=Number(range[1]),end=range[2]?Math.min(Number(range[2]),data.length-1):data.length-1;if(start> end){res.writeHead(416).end();return;}res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${data.length}`,'Content-Length':end-start+1});res.end(data.subarray(start,end+1));}
 else{res.writeHead(200,{...headers,'Content-Length':data.length});res.end(data);}
}catch{res.writeHead(500).end('Server error');}}).listen(port,'127.0.0.1',()=>console.log(`http://127.0.0.1:${server.address().port} / ${root}`));
