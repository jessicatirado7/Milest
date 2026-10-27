const fs=require('fs');
const path=require('path');
const cache=process.env.AUDIT_TOOL_MODULES || 'C:/Users/alaba/AppData/Local/npm-cache/_npx/4f3a81969a4b9f91/node_modules';
const {chromium}=require(path.join(cache,'playwright'));
const axe=fs.readFileSync(path.join(cache,'axe-core/axe.min.js'),'utf8');
const {pages,out}=require('./inventory.cjs');
const base='http://127.0.0.1:4173/';
async function scan(page){await page.evaluate(axe);const r=await page.evaluate(async()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));return {violations:r.violations,passes:r.passes.map(x=>x.id),incomplete:r.incomplete.map(x=>({id:x.id,nodes:x.nodes.length})),inapplicable:r.inapplicable.map(x=>x.id)};}
async function main(){
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={auditDate:'2026-10-27',browser:await browser.version(),axe:require(path.join(cache,'axe-core/package.json')).version,viewports:[],interactions:[]};
for(const viewport of [{width:390,height:844},{width:1440,height:1000}]){
 const context=await browser.newContext({viewport});
 for(const p of pages){
  const page=await context.newPage();const errors=[];const failures=[];page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failures.push({url:r.url(),failure:r.failure()}));page.on('response',r=>{if(r.status()>=400)failures.push({url:r.url(),status:r.status()});});
  try{await page.goto(base+p.file,{waitUntil:'networkidle',timeout:30000});await page.evaluate(()=>document.fonts.ready);const a11y=await scan(page);
  const layout=await page.evaluate(()=>({viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,images:[...document.images].map(i=>({src:i.currentSrc,alt:i.alt,complete:i.complete,naturalWidth:i.naturalWidth,width:i.getBoundingClientRect().width,loading:i.loading})),resources:performance.getEntriesByType('resource').map(r=>({name:r.name,type:r.initiatorType,transferSize:r.transferSize,duration:r.duration})),lcpCandidate:document.querySelector('.milestone-hero img')?.currentSrc}));
  report.viewports.push({environment:'local',file:p.file,viewport,errors,failures,layout,a11y});console.log('local',viewport.width,p.file,'axe',a11y.violations.map(x=>x.id).join(','),'overflow',layout.scrollWidth-layout.viewport);
  if(['index.html','parent-child-interaction-therapy.html'].includes(p.file))await page.screenshot({path:path.join(out,`local-${p.file}-${viewport.width}.png`),fullPage:false});
  }catch(e){report.viewports.push({file:p.file,viewport,error:e.message,errors,failures});}await page.close();fs.writeFileSync(path.join(out,'browser.json'),JSON.stringify(report,null,2));
 }await context.close();
}
for(const viewport of [{width:390,height:844},{width:1440,height:1000}]){
 const page=await browser.newPage({viewport});
 for(const file of ['index.html','parent-child-interaction-therapy.html']){try{await page.goto('https://www.milestonementalhealth.com/'+(file==='index.html'?'':file),{waitUntil:'networkidle',timeout:30000});const a11y=await scan(page);report.viewports.push({environment:'live',file,viewport,a11y});console.log('live',viewport.width,file,'axe',a11y.violations.map(x=>x.id).join(','));await page.screenshot({path:path.join(out,`live-${file}-${viewport.width}.png`)});}catch(e){report.viewports.push({environment:'live',file,viewport,error:e.message});}}
 await page.close();
}
const page=await browser.newPage({viewport:{width:390,height:844}});
await page.goto(base,{waitUntil:'networkidle'});
await page.keyboard.press('Tab');report.interactions.push({test:'First Tab',active:await page.evaluate(()=>({text:document.activeElement.textContent.trim(),rect:document.activeElement.getBoundingClientRect().toJSON()}))});
await page.keyboard.press('Enter');report.interactions.push({test:'Skip activation',active:await page.evaluate(()=>({id:document.activeElement.id,hash:location.hash}))});
const toggle=page.locator('.navbar-toggler');await toggle.focus();await page.keyboard.press('Space');await page.waitForTimeout(500);report.interactions.push({test:'Mobile nav Space',expanded:await toggle.getAttribute('aria-expanded')});
const navLink=page.locator('#navbarResponsive a:not(.dropdown-toggle)').first();await navLink.focus();await page.keyboard.press('Enter');await page.waitForTimeout(500);report.interactions.push({test:'Mobile nav link',expanded:await toggle.getAttribute('aria-expanded'),shown:await page.locator('#navbarResponsive').getAttribute('class')});
await page.goto(base,{waitUntil:'networkidle'});const trigger=page.locator('[data-bs-toggle="modal"]').first();await trigger.focus();await page.keyboard.press('Enter');await page.waitForTimeout(500);report.interactions.push({test:'Modal keyboard open',shown:await page.locator('.modal.show').count(),active:await page.evaluate(()=>document.activeElement.outerHTML.slice(0,500)),axe:await scan(page)});await page.keyboard.press('Escape');await page.waitForTimeout(500);report.interactions.push({test:'Modal Escape',shown:await page.locator('.modal.show').count(),focusReturned:await trigger.evaluate(e=>e===document.activeElement)});
report.interactions.push({test:'Native form required validation; no submission',fields:await page.locator('#contactForm input[required],#contactForm textarea[required]').evaluateAll(es=>es.map(e=>({id:e.id,valid:e.checkValidity(),message:e.validationMessage}))),cta:await page.locator('.nav-cta').getAttribute('href')});
await page.setViewportSize({width:1440,height:1000});await page.goto(base,{waitUntil:'networkidle'});const drop=page.locator('[data-bs-toggle="dropdown"]').first();await drop.focus();await page.keyboard.press('Enter');await page.keyboard.press('ArrowDown');report.interactions.push({test:'Desktop dropdown Enter/ArrowDown',expanded:await drop.getAttribute('aria-expanded'),active:await page.evaluate(()=>document.activeElement.textContent.trim())});await page.keyboard.press('Escape');report.interactions.push({test:'Dropdown Escape',expanded:await drop.getAttribute('aria-expanded')});
for(const width of [320,375,768,1024]){await page.setViewportSize({width,height:900});report.interactions.push({test:'Homepage reflow width',width,scrollWidth:await page.evaluate(()=>document.documentElement.scrollWidth)});}
await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:320,height:900});await page.reload({waitUntil:'networkidle'});await page.addStyleTag({content:'* {line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important} p{margin-bottom:2em!important}'});report.interactions.push({test:'320px reduced motion and text spacing',scrollWidth:await page.evaluate(()=>document.documentElement.scrollWidth),invisibleAos:await page.locator('[data-aos]').evaluateAll(es=>es.filter(e=>getComputedStyle(e).opacity==='0').length)});
await page.setViewportSize({width:1440,height:1000});await page.goto(base,{waitUntil:'networkidle'});await page.coverage.startCSSCoverage();await page.coverage.startJSCoverage();await page.reload({waitUntil:'networkidle'});await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,20));}});const t=page.locator('[data-bs-toggle="modal"]').first();await t.click();await page.waitForTimeout(400);await page.keyboard.press('Escape');const coverage={scope:'Homepage desktop, scroll and first modal only; NOT deletion evidence',css:await page.coverage.stopCSSCoverage(),js:await page.coverage.stopJSCoverage()};fs.writeFileSync(path.join(out,'coverage.json'),JSON.stringify(coverage,null,2));
await page.close();await browser.close();fs.writeFileSync(path.join(out,'browser.json'),JSON.stringify(report,null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
