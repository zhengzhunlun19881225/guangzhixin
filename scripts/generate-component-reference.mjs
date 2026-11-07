import fs from 'node:fs';
import path from 'node:path';
import { buildFullSpec } from './build-full-spec.mjs';
const root = path.resolve(import.meta.dirname, '..');
const reference = JSON.parse(fs.readFileSync(path.join(root, 'src/design/componentReference.json'), 'utf8'));
const expected = ['button icon link typography divider avatar tag badge space','grid layout card collapse split scrollbar','menu tabs steps breadcrumb pagination dropdown affix anchor backtop pageheader','input inputnumber select radio checkbox switch slider datetime cascader rate upload form transfer search','table tree treeselect descriptions timeline progress skeleton empty statistic carousel chart','tooltip popover popconfirm alert message notification dialog drawer loading'].flatMap(s => s.split(' '));
const ids = reference.entries.map(e => e.id);
if (ids.length !== 59 || new Set(ids).size !== 59 || expected.some(id => !ids.includes(id))) throw new Error('Component reference must cover all 59 requested entries once.');
const stages = { shared: '公共组件：已有共享 API', business: '业务实现：已有页面用法，尚非独立公共 API', proposal: '规范示例：新增建议，尚未在业务上线' };
for (const e of reference.entries) {
  for (const key of ['id','name','group','stage','source','usage','visual','behavior','keyboard','boundaries','contract']) if (!e[key]?.trim()) throw new Error(`${e.id}: missing ${key}`);
  if (!stages[e.stage] || !reference.groups.some(g => g.id === e.group)) throw new Error(`${e.id}: invalid group/stage`);
  if (e.source !== '—' && !fs.existsSync(path.join(root, 'src', e.source))) throw new Error(`${e.id}: missing source ${e.source}`);
}
const example = fs.readFileSync(path.join(root,'src/design/ComponentExamples.tsx'),'utf8');
for (const id of expected) if (!example.includes(`case '${id}':`)) throw new Error(`Missing preview: ${id}`);
const text = buildFullSpec(root, reference, stages);
const targets = ['docs/design-system/COMPONENTS.md','public/design-system-components.md'];
for (const target of targets) {
  const file = path.join(root,target);
  if (process.argv.includes('--check')) { if (!fs.existsSync(file) || fs.readFileSync(file,'utf8') !== text) throw new Error(`Stale component reference: ${target}`); }
  else fs.writeFileSync(file,text);
}
console.log(`Component reference ${process.argv.includes('--check')?'verified':'generated'}: 6 categories, 59 entries, all previews and source paths present.`);
