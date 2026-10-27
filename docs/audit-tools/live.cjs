const fs=require('fs');
const path=require('path');
const {inspect,out,pages}=require('./inventory.cjs');
const base='https://www.milestonementalhealth.com';
async function get(url) {
 try {const start=Date.now(); const r=await fetch(url,{signal:AbortSignal.timeout(25000)});const body=await r.text();return {url,status:r.status,finalUrl:r.url,headers:Object.fromEntries(r.headers),elapsedMs:Date.now()-start,bytes:Buffer.byteLength(body),body};}
 catch(e){return {url,error:e.message};}
}
(async()=>{
 const results=[];
 for(const p of pages){const r=await get(base+'/'+(p.file==='index.html'?'':p.file));if(r.body){r.page=inspect(r.body,p.file);fs.mkdirSync(path.join(out,'live'),{recursive:true});fs.writeFileSync(path.join(out,'live',p.file),r.body);delete r.body;}results.push(r);console.log(p.file,r.status,r.page?.title[0]);}
 for(const u of ['/index.html','/robots.txt','/sitemap.xml','/audit-nonexistent-20261027','/css/milestone-home.min.css','/css/milestone-pages.css','/css/styles.css','/js/scripts.js','/dist/index.html','http://www.milestonementalhealth.com/','https://milestonementalhealth.com/']){const r=await get(u.startsWith('http')?u:base+u);if(!u.endsWith('html')&&!u.includes('css')&&!u.includes('js'))r.excerpt=r.body?.slice(0,4000);delete r.body;results.push(r);console.log(u,r.status,r.finalUrl);}
 const external=[...new Set(pages.flatMap(p=>p.refs).filter(x=>x.tag==='a'&&/^https?:/.test(x.ref)&&!x.ref.startsWith(base)).map(x=>x.ref))];
 const links=[];
 for(const url of external){const r=await get(url);delete r.body;links.push(r);}
 fs.writeFileSync(path.join(out,'live-http.json'),JSON.stringify({results,externalLinks:links},null,2));
})();
