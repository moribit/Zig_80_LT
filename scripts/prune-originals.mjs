import {readdir,rm} from 'node:fs/promises';
const root=process.argv[2];
if(!['dist','dist-qa','dist-pages'].includes(root))throw new Error('Only generated build directories are allowed');
for(const folder of ['photos','videos']){
 for(const name of await readdir(`${root}/${folder}`)){
  if(/\.(heic|mov)$/i.test(name))await rm(`${root}/${folder}/${name}`);
 }
}
