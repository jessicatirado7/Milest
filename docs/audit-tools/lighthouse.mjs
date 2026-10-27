import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const modules=process.env.AUDIT_TOOL_MODULES || 'C:/Users/alaba/AppData/Local/npm-cache/_npx/4f3a81969a4b9f91/node_modules';
const {default:lighthouse}=await import(pathToFileURL(path.join(modules,'lighthouse/core/index.js')));
const launcher=await import(pathToFileURL(path.join(modules,'chrome-launcher/dist/index.js')));
const out=path.resolve('docs/evidence');
const scenarios=[['local-home','http://127.0.0.1:4173/'],['local-pcit','http://127.0.0.1:4173/parent-child-interaction-therapy.html'],['live-home','https://www.milestonementalhealth.com/']];
const summary=[];
for(const [name,url] of scenarios)for(const desktop of [false,true]){
 const chrome=await launcher.launch({chromePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',chromeFlags:['--headless','--no-sandbox']});
 try{const opts={port:chrome.port,output:'json',onlyCategories:['performance','accessibility','best-practices','seo'],logLevel:'error'};
 if(desktop)Object.assign(opts,{formFactor:'desktop',screenEmulation:{mobile:false,width:1350,height:940,deviceScaleFactor:1,disabled:false},throttling:{rttMs:40,throughputKbps:10240,cpuSlowdownMultiplier:1}});
 const r=await lighthouse(url,opts);const file=`lighthouse-${name}-${desktop?'desktop':'mobile'}.json`;fs.writeFileSync(path.join(out,file),r.report);
 const ids=['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index','total-byte-weight','network-requests','render-blocking-resources','unused-css-rules','unused-javascript','font-display','modern-image-formats','uses-responsive-images','uses-long-cache-ttl','uses-text-compression','errors-in-console'];
 const item={name,url,mode:desktop?'desktop':'mobile',file,fetchTime:r.lhr.fetchTime,version:r.lhr.lighthouseVersion,userAgent:r.lhr.userAgent,environment:r.lhr.environment,config:r.lhr.configSettings,scores:Object.fromEntries(Object.entries(r.lhr.categories).map(([k,v])=>[k,v.score])),audits:Object.fromEntries(ids.map(k=>[k,r.lhr.audits[k]]).filter(([,v])=>v)),warnings:r.lhr.runWarnings};summary.push(item);console.log(name,item.mode,JSON.stringify(item.scores));
 }catch(e){summary.push({name,url,desktop,error:e.message});console.error(e.message);}finally{await chrome.kill();fs.writeFileSync(path.join(out,'lighthouse-summary.json'),JSON.stringify(summary,null,2));}
}
