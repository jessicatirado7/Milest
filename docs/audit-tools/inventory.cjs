const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { parseDocument, DomUtils } = require('htmlparser2');
const root = path.resolve(__dirname, '../..');
const out = path.join(root, 'docs/evidence');
fs.mkdirSync(out, { recursive: true });
const walk = d => fs.readdirSync(d, {withFileTypes:true}).flatMap(e => ['.git','node_modules','.parcel-cache','docs'].includes(e.name) ? [] : e.isDirectory() ? walk(path.join(d,e.name)) : [path.relative(root,path.join(d,e.name)).replaceAll('\\','/')]);
const files = walk(root);
const all = n => DomUtils.findAll(x => x.type === 'tag' || x.type === 'script' || x.type === 'style', n.children || []);
function inspect(html, file) {
  const nodes = all(parseDocument(html));
  const tags = name => nodes.filter(n => n.name === name);
  const text = n => DomUtils.textContent(n).replace(/\s+/g,' ').trim();
  const line = n => html.slice(0,html.indexOf(DomUtils.getOuterHTML(n).slice(0,50))).split('\n').length;
  const a = n => ({...n.attribs});
  const refs = nodes.filter(n => n.attribs.href || n.attribs.src).map(n => ({tag:n.name,ref:n.attribs.href || n.attribs.src}));
  refs.forEach(x => { if (x.ref.startsWith('/') && !x.ref.startsWith('//')) { x.ref = x.ref.slice(1); if (!x.ref || x.ref.startsWith('#')) x.ref = 'index.html'+x.ref; } });
  const ids = tags('html').length ? nodes.filter(n=>n.attribs.id).map(n=>n.attribs.id):[];
  return {file,bytes:Buffer.byteLength(html),sha256:crypto.createHash('sha256').update(html).digest('hex'),title:tags('title').map(text),description:tags('meta').filter(n=>n.attribs.name==='description').map(a),canonical:tags('link').filter(n=>n.attribs.rel==='canonical').map(a),robots:tags('meta').filter(n=>n.attribs.name==='robots').map(a),lang:tags('html').map(n=>n.attribs.lang),headings:nodes.filter(n=>/^h[1-6]$/.test(n.name)).map(n=>({tag:n.name,text:text(n),id:n.attribs.id})),css:tags('link').filter(n=>(n.attribs.rel||'').includes('stylesheet')).map(a),scripts:tags('script').map(n=>({...a(n),inlineBytes:n.attribs.src?0:Buffer.byteLength(text(n))})),schema:tags('script').filter(n=>n.attribs.type==='application/ld+json').map(n=>text(n)),forms:tags('form').map(a),fields:nodes.filter(n=>['input','textarea','select','label'].includes(n.name)).map(n=>({...a(n),tag:n.name,text:text(n)})),images:tags('img').map(a),iframes:tags('iframe').map(a),modals:nodes.filter(n=>(n.attribs.class||'').split(' ').includes('modal')).map(a),duplicateIds:[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))],refs,skip:tags('a').filter(n=>/skip/i.test(text(n))).map(a),landmarks:{main:tags('main').length,nav:tags('nav').length,footer:tags('footer').length},broken:refs.filter(x=>!x.ref.match(/^(https?:|mailto:|tel:|javascript:|data:|\/\/)/)).flatMap(x=>{const [f,h]=decodeURI(x.ref).split('#');const target=path.resolve(root,path.dirname(file),f||path.basename(file));if(!fs.existsSync(target))return [{...x,reason:'missing file'}];if(h && /\.html$/.test(target)){const other=target===path.join(root,file)?ids:all(parseDocument(fs.readFileSync(target,'utf8'))).filter(n=>n.attribs.id).map(n=>n.attribs.id);if(!other.includes(h))return [{...x,reason:'missing fragment'}];}return [];})};
}
const pages = files.filter(f=>f.endsWith('.html')&&!f.startsWith('dist/')).map(f=>inspect(fs.readFileSync(path.join(root,f),'utf8'),f));
const assets=files.map(file=>({file,bytes:fs.statSync(path.join(root,file)).size}));
const used=new Set(pages.flatMap(p=>p.refs).map(r=>r.ref.replace(/^\.\//,'').split(/[?#]/)[0]));
fs.writeFileSync(path.join(out,'inventory.json'),JSON.stringify({auditDate:'2026-10-27',files:assets,pages,locallyReferenced:assets.filter(x=>used.has(x.file)),notDirectlyReferenced:assets.filter(x=>!used.has(x.file))},null,2));
if (require.main === module) console.log(JSON.stringify(pages.map(p=>({file:p.file,bytes:p.bytes,title:p.title,canonical:p.canonical,css:p.css.map(x=>x.href),js:p.scripts.filter(x=>x.src).map(x=>x.src),h1:p.headings.filter(x=>x.tag==='h1'),images:p.images.length,modals:p.modals.length,duplicateIds:p.duplicateIds,broken:p.broken})),null,2));
module.exports={inspect,root,out,pages};
