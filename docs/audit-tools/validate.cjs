const fs=require('fs');
const path=require('path');
const cache=process.env.AUDIT_TOOL_MODULES || 'C:/Users/alaba/AppData/Local/npm-cache/_npx/4f3a81969a4b9f91/node_modules';
const {HtmlValidate}=require(path.join(cache,'html-validate'));
const {pages,root,out}=require('./inventory.cjs');
(async()=>{const validator=new HtmlValidate({extends:['html-validate:recommended']});const report=[];for(const p of pages){try{const r=await validator.validateString(fs.readFileSync(path.join(root,p.file),'utf8'),p.file);report.push({file:p.file,valid:r.valid,errorCount:r.errorCount,warningCount:r.warningCount,results:r.results});console.log(p.file,r.errorCount,r.warningCount);}catch(e){report.push({file:p.file,error:e.message});}}fs.writeFileSync(path.join(out,'html-validation.json'),JSON.stringify(report,null,2));})();
