// Deterministic static package in a new content-addressed folder. No deletion,
// historical dist overwrite, deployment, HTML rewriting or image processing.
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {root,sha256,pages,collect}=require('./site.cjs');
const {generate}=require('./css.cjs');
const buildRoot=path.join(root,'build');
function safe(file){const target=path.resolve(file);assert.ok(target.startsWith(buildRoot+path.sep),'Output leaves build folder');return target;}
function list(directory){return fs.readdirSync(directory,{withFileTypes:true}).flatMap(e=>{const f=path.join(directory,e.name);if(e.isSymbolicLink())throw Error('Unexpected output symlink: '+f);return e.isDirectory()?list(f):[f];});}
function build(){
 if(fs.existsSync(buildRoot)&&fs.lstatSync(buildRoot).isSymbolicLink())throw Error('Build directory must not be a symlink');
 const graph=collect(new Map([['css/milestone-home.min.css',Buffer.from(generate())]]));
 graph.files.set('robots.txt',fs.readFileSync(path.join(root,'robots.txt')));graph.files.set('sitemap.xml',fs.readFileSync(path.join(root,'sitemap.xml')));
 const files=[...graph.files].sort(([a],[b])=>a.localeCompare(b)).map(([file,bytes])=>({path:file,bytes:bytes.length,sha256:sha256(bytes)}));
 const contentId=sha256(JSON.stringify(files)),manifest={version:1,contentId,pages:pages(),files,externalOrigins:graph.externalOrigins,excluded:['docs/','tools/','node_modules/','dist/','.git/','.parcel-cache/','package*.json','readable CSS reference/source files','hosting drafts and .htaccess (separate release review)']};
 const directory=safe(path.join(buildRoot,'site-'+contentId.slice(0,16)));fs.mkdirSync(buildRoot,{recursive:true});
 if(fs.existsSync(directory)){
  assert.ok(!fs.lstatSync(directory).isSymbolicLink(),'Output package must not be a symlink');
  const expected=new Set([...files.map(f=>path.join(directory,f.path)),path.join(directory,'build-manifest.json')]);for(const file of list(directory))assert.ok(expected.has(file),'Unexpected file in prior package: '+file);
 }else fs.mkdirSync(directory);
 for(const [file,bytes]of graph.files){const target=safe(path.join(directory,file));fs.mkdirSync(path.dirname(target),{recursive:true});if(fs.existsSync(target))assert.equal(sha256(fs.readFileSync(target)),sha256(bytes),'Modified prior package: '+file);else fs.writeFileSync(target,bytes,{flag:'wx'});}
 const json=JSON.stringify(manifest,null,2)+'\n',manifestFile=path.join(directory,'build-manifest.json');if(fs.existsSync(manifestFile))assert.equal(fs.readFileSync(manifestFile,'utf8'),json);else fs.writeFileSync(manifestFile,json,{flag:'wx'});
 const latest={directory:path.relative(root,directory).replace(/\\/g,'/'),contentId,manifest:path.relative(root,manifestFile).replace(/\\/g,'/')};fs.writeFileSync(path.join(buildRoot,'latest.json'),JSON.stringify(latest,null,2)+'\n');
 return{...latest,pages:manifest.pages.length,files:files.length,bytes:files.reduce((n,f)=>n+f.bytes,0)};
}
if(require.main===module)console.log(JSON.stringify(build(),null,2));
module.exports={build};
