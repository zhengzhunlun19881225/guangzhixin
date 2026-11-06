import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const failures=[];
const tokens=read('src/design/tokens.css');
const definitions=new Set([...tokens.matchAll(/(--gx-[\w-]+)\s*:/g)].map(m=>m[1]));
const required={'--gx-text-primary':'#03091B','--gx-hover-text':'#E60101','--gx-hover-bg':'#F1F5F9','--gx-focus':'#CC0000','--gx-control-height':'32px','--gx-font-title':'24px','--gx-line-body':'22px'};
for(const [key,value] of Object.entries(required))if(!tokens.includes(`${key}: ${value};`))failures.push(`${key} should be ${value}; update the specification and checker together for an approved change.`);
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const files=walk(path.join(root,'src'));
for(const file of files){
 const source=fs.readFileSync(file,'utf8'),relative=path.relative(root,file);
 if(file.endsWith('.css')){
  for(const match of source.matchAll(/var\((--gx-[\w-]+)/g))if(!definitions.has(match[1]))failures.push(`${relative}: undefined ${match[1]}`);
  if(!file.endsWith('tokens.css'))for(const match of source.matchAll(/#(?:03091b|4e5969|83899f|878b99|ebeef5|e60101|cc0000|f1f5f9|fff1f2)(?![0-9a-f])/gi))failures.push(`${relative}: use a semantic token instead of ${match[0]}`);
 }
 if(file.endsWith('.tsx')&&/<select(?:\s|>)/.test(source))failures.push(`${relative}: use SelectField, not a native select`);
}
for(const [file,name] of [['src/components/WorkbenchDashboard.tsx','PanelHeading'],['src/components/WorkbenchDashboard.tsx','StatusBadge'],['src/components/ApplicationManager.tsx','Button'],['src/App.tsx','EmptyState']])if(!read(file).includes(`<${name}`))failures.push(`${name} must retain a production consumer (${file})`);
const index=read('src/index.css');if(index.indexOf('./design/tokens.css')>index.indexOf('./design-system.css'))failures.push('Load tokens before business styles.');
for(const doc of ['README','INVENTORY','IMPLEMENTATION','ACCEPTANCE'])if(!fs.existsSync(path.join(root,`docs/design-system/${doc}.md`)))failures.push(`Missing ${doc}.md`);
if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log(`Design checks passed: ${definitions.size} tokens, ${files.filter(f=>f.endsWith('.css')).length} stylesheets, no native selects, shared production consumers and documentation present.`);
