import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'src/design/iconCatalog.json'),'utf8'));
assert.equal(data.sources.length,138);assert.equal(data.entries.length,133);
assert.equal(new Set(data.entries.map(e=>e.id)).size,133);
assert.equal(data.entries.filter(e=>e.category==='line').length,119);
assert.equal(data.entries.filter(e=>e.category==='solid').length,14);
assert.equal(data.sources.filter(e=>e.status==='duplicate').length,5);
for(const source of data.sources){
 const entry=data.entries.find(e=>e.sourceIndex===source.canonicalSourceIndex);assert(entry,`Missing destination: ${source.name}`);
 if(source.status==='duplicate')assert(entry.aliases.includes(source.name),`Missing alias: ${source.name}`);
}
for(const entry of data.entries){
 const file=path.join(root,'src/assets/spec-icons',entry.file),raw=fs.readFileSync(file),svg=raw.toString('utf8');
 const source=data.sources.find(s=>s.index===entry.sourceIndex);
 assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),source.sha256,`Source changed: ${entry.name}`);
 assert(/viewBox="0 0 (24 24|1024 1024)"/.test(svg));
 assert(!/<script\b|<foreignObject\b|\son\w+\s*=/i.test(svg));
 assert(!/(?:href|xlink:href)="(?!#)/.test(svg));
 assert(['line','solid'].includes(entry.category));
 assert(['primary','warning','info','brand'].includes(entry.tone));
}
assert.equal(fs.readdirSync(path.join(root,'src/assets/spec-icons')).filter(f=>f.endsWith('.svg')).length,133);
let doc='# 图标资源规范 v3.4.0\n\n入口：`?view=design-system&component=icon#library`。本轮仅规范评审，尚未替换系统图标。\n\n## 来源、分类与配色\n\n用户提供138个SVG，按图形去重保留133个：线性119、面性14。线性按中空轮廓、面性按实体主体判断，不依据SVG是否采用fill属性分类；默认24px，可切换16/20/24px，并搜索名称与别名。\n\n普通图标使用主文字色#03091B，可切换主题红#FF0000；警告使用#FF7D00、提示使用#006DFF、事件使用主题红；渐变文档保留原有蓝紫色层次。原SVG字节不修改，保留viewBox，CSS遮罩着色保留镂空。资源缺失时等尺寸占位。\n\n目录来自src/design/iconCatalog.json，来源路径与SHA-256保存在该文件。运行npm run docs:icons生成本文，npm run check:icons检查来源覆盖、字节哈希、别名和文档同步。用户桌面和下载目录中的原文件不删除、不改名。\n\n## 去重记录\n\n| 保留名称 | 合并的原文件名 | 依据 |\n| --- | --- | --- |\n';
for(const source of data.sources.filter(s=>s.status==='duplicate')){
 const entry=data.entries.find(e=>e.sourceIndex===source.canonicalSourceIndex);
 doc+=`| ${entry.name} | ${source.name}.svg | ${source.index===13?'128px渲染外观相同；平均通道差0.0224/255，为导出坐标精度差异':'忽略导出元数据后结构相同，128px渲染逐像素相同'} |\n`;
}
doc+='\n## 图标目录\n\n名称沿用来源，仅将“跟多”显示为“更多（圆形）”、“*助手”显示为“助手”，编号和原名保留为别名。备份文件只在图形相同时合并，不凭名称删除。\n';
for(const [id,title] of [['line','线性图标'],['solid','面性图标']]){
 doc+=`\n### ${title}\n\n| 名称 | 搜索别名 | 配色 |\n| --- | --- | --- |\n`;
 for(const e of data.entries.filter(e=>e.category===id))doc+=`| ${e.name} | ${e.aliases.join('、')||'—'} | ${e.preserveColor?'原有渐变':{primary:'主文字 / 主题红',brand:'主题红',warning:'警告色',info:'信息色'}[e.tone]} |\n`;
}
doc+='\n## 接入边界\n\nIconCatalog为规范内部预览，不新增公共图标API。原业务的lucide和品牌图标消费者保持原样。装饰图标不响应操作；图标按钮提供完整名称、禁用语义与键盘焦点。只有用户确认后才安排业务迁移。\n';
const docPath=path.join(root,'docs/design-system/ICONS.md');
if(process.argv.includes('--write'))fs.writeFileSync(docPath,doc);else assert.equal(fs.readFileSync(docPath,'utf8'),doc,'Run npm run docs:icons to update the icon reference.');
console.log('Icon catalogue verified: 138 sources -> 133 unchanged assets; 119 line / 14 solid; 5 duplicates retain aliases.');
