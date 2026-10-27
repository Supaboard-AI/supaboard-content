import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {uploadOnce} from '../../../tools/spaces.mjs';
const root=new URL('../',import.meta.url);
const files={'hero.webp':'image/webp','time-vs-accuracy.png':'image/png','accuracy-by-agent.png':'image/png','question-difficulty.png':'image/png'};
const result={};
for(const [name,type] of Object.entries(files)){
 const bytes=readFileSync(new URL('website/'+name,root));
 const asset=await uploadOnce('blog/ai-data-analytics-benchmark',bytes,{ext:'.'+name.split('.').at(-1),contentType:type});
 const response=await fetch(asset.url);
 if(!response.ok)throw new Error('Asset readback failed: '+response.status);
 const received=Buffer.from(await response.arrayBuffer());
 const digest=b=>createHash('sha256').update(b).digest('hex');
 if(digest(received)!==digest(bytes))throw new Error('Asset hash mismatch');
 result[name]={...asset,sha256:digest(bytes),bytes:bytes.length,verified:true};
 console.log(name,asset.url,'verified');
}
writeFileSync(new URL('research/publication-assets.json',root),JSON.stringify(result,null,2)+'\n');
