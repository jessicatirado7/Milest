const http=require('http');
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'../..');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.ico':'image/x-icon','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.pdf':'application/pdf','.xml':'application/xml','.txt':'text/plain'};
http.createServer((req,res)=>{let name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(name==='/')name='/index.html';const file=path.resolve(root,'.'+name);if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end('Not found');}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);}).listen(4173,'127.0.0.1',()=>console.log('Audit-only static server http://127.0.0.1:4173'));
