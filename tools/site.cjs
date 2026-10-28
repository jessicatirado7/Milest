// Collect the static site's complete local dependency graph without transforming HTML.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {parseDocument,DomUtils:D}=require('htmlparser2');
const postcss=require('postcss');
const root=path.resolve(__dirname,'..'),origin='https://www.milestonementalhealth.com';
const sha256=b=>crypto.createHash('sha256').update(b).digest('hex');
const pages=()=>fs.readdirSync(root).filter(f=>f.endsWith('.html')).sort();
function srcset(value){const result=[];let rest=value.trim();while(rest){const first=rest.match(/^\S+/)[0];rest=rest.slice(first.length).trimStart();result.push(first.replace(/,+$/,''));if(first.endsWith(','))continue;const end=rest.indexOf(',');rest=end<0?'':rest.slice(end+1).trimStart();}return result;}
function collect(overrides=new Map()){
 const files=new Map(),externalOrigins=new Set(),queue=pages(),fragments=[];
 function add(raw,from,checkFragment=false){
  if(!raw||/^(?:data:|mailto:|tel:|javascript:|#)/i.test(raw)){if(checkFragment&&raw?.startsWith('#'))fragments.push({file:from,id:decodeURIComponent(raw.slice(1)),from});return;}
  const u=new URL(raw,origin+'/'+from);if(!['http:','https:'].includes(u.protocol))return;
  if(!['www.milestonementalhealth.com','milestonementalhealth.com'].includes(u.hostname)){externalOrigins.add(u.origin);return;}
  const file=decodeURIComponent(u.pathname==='/'?'/index.html':u.pathname).slice(1);
  if(file.includes('\\')||file.split('/').includes('..')||file.startsWith('.'))throw Error('Unsafe local reference from '+from+': '+raw);
  const absolute=path.resolve(root,file);if(!absolute.startsWith(root+path.sep)||!fs.existsSync(absolute)||!fs.statSync(absolute).isFile())throw Error('Missing local dependency from '+from+': '+raw);
  if(!files.has(file))queue.push(file);
  if(checkFragment&&u.hash&&file.endsWith('.html'))fragments.push({file,id:decodeURIComponent(u.hash.slice(1)),from});
 }
 while(queue.length){
  const file=queue.shift();if(files.has(file))continue;
  const absolute=path.resolve(root,file);if(fs.lstatSync(absolute).isSymbolicLink())throw Error('Symlink dependency requires explicit review: '+file);
  const bytes=overrides.get(file)||fs.readFileSync(absolute);files.set(file,bytes);
  if(file.endsWith('.html')){
   const nodes=D.findAll(n=>['tag','script','style'].includes(n.type),parseDocument(bytes.toString('utf8')).children);
   for(const node of nodes){for(const attr of ['href','src','poster'])if(node.attribs[attr])add(node.attribs[attr],file,node.name==='a');if(node.attribs.srcset)for(const ref of srcset(node.attribs.srcset))add(ref,file);if(node.name==='meta'&&/^(?:og:image|twitter:image)$/.test(node.attribs.property||node.attribs.name||''))add(node.attribs.content,file);if(node.name==='style')css(D.textContent(node),file);if(node.name==='script'&&node.attribs.type==='application/ld+json'){const walk=n=>{if(typeof n==='string'&&/^https?:/.test(n))add(n,file);else if(n&&typeof n==='object')for(const v of Object.values(n))walk(v);};walk(JSON.parse(D.textContent(node)));}}
  }else if(file.endsWith('.css'))css(bytes.toString('utf8'),file);
  else if(file.endsWith('.js')&&/\bimport\s*(?:\(|["'{*])|\bexport\s.+\bfrom\s/.test(bytes.toString('utf8')))throw Error('Add JS import graph support before packaging '+file);
 }
 function css(text,file){postcss.parse(text,{from:file}).walkDecls(d=>{for(const m of d.value.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)]+))\s*\)/gi))add(m[1]??m[2]??m[3],file);});postcss.parse(text,{from:file}).walkAtRules('import',a=>{const m=a.params.match(/^(?:url\(\s*)?["']([^"']+)["']/);if(!m)throw Error('Unsupported CSS import syntax in '+file);add(m[1],file);});}
 for(const ref of fragments){const bytes=files.get(ref.file),nodes=D.findAll(n=>n.attribs?.id===ref.id,parseDocument(bytes.toString('utf8')).children);if(!nodes.length)throw Error('Missing fragment '+ref.file+'#'+ref.id+' from '+ref.from);}
 return{files:new Map([...files].sort(([a],[b])=>a.localeCompare(b))),externalOrigins:[...externalOrigins].sort()};
}
module.exports={root,origin,sha256,pages,collect};
