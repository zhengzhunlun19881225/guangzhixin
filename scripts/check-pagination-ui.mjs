import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { pathToFileURL, fileURLToPath } from 'node:url';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const base = process.env.BASE_URL || 'http://127.0.0.1:5196/';
const out = new URL('../output/playwright/pagination/', import.meta.url);
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
const context = await browser.newContext({ viewport: { width: 1440, height: 1080 }, reducedMotion: 'reduce' });
const page = await context.newPage(), results = [], errors = [];
page.on('pageerror', e => errors.push(e.message));
const go = query => page.goto(base + query, { waitUntil: 'networkidle' });
const check = async (name, action) => { await action(); results.push(name); };
const size = async (nav, value) => { await nav.getByRole('combobox').click(); await page.getByRole('option', { name: `${value}/页`, exact: true }).click(); };
try {
 await go('?view=design-system&component=pagination#library');
 let nav = page.getByRole('navigation', { name: '示例分页', exact: true });
 await check('规范：完整分页、跳页校验、每页条数及空结果', async () => {
  assert.match(await nav.innerText(), /共47 条/); assert(await nav.getByRole('button', { name: '上一页', exact: true }).isDisabled());
  await nav.getByRole('button', { name: '下一页', exact: true }).click(); assert.equal(await nav.locator('[aria-current]').innerText(), '2');
  const jump = nav.getByRole('textbox'); await jump.fill('99'); await jump.press('Enter'); await nav.getByRole('alert').waitFor(); assert.equal(await nav.locator('[aria-current]').innerText(), '2');
  for (const bad of ['1.5', 'abc', '0']) { await jump.fill(bad); await jump.press('Enter'); assert(await nav.getByRole('alert').isVisible()); }
  await jump.press('Escape'); assert.equal(await jump.inputValue(), '2'); await jump.fill('3'); await jump.press('Enter'); assert(await nav.getByRole('button', { name: '下一页', exact: true }).isDisabled());
  await size(nav, 10); assert.equal(await nav.locator('[aria-current]').innerText(), '1'); assert.equal(await page.locator('.cr-pagination-list li').count(), 10);
  await page.getByRole('textbox', { name: '搜索分页示例文件', exact: true }).fill('不存在'); assert.match(await nav.innerText(), /共0 条/); assert(await jump.isDisabled());
  await page.getByRole('textbox', { name: '搜索分页示例文件', exact: true }).fill('');
 });
 await check('规范：390px分页不溢出、键盘及焦点', async () => {
  await page.setViewportSize({ width: 390, height: 950 }); await nav.scrollIntoViewIfNeeded(); assert(await page.locator('.spec-main').evaluate(e => e.scrollWidth <= e.clientWidth));
  const next=nav.getByRole('button',{name:'下一页',exact:true}); await next.focus(); await next.press('Enter'); assert.equal(await nav.locator('[aria-current]').innerText(),'2');
  assert.equal(await next.evaluate(e=>getComputedStyle(e).outlineWidth),'2px'); await nav.screenshot({path:fileURLToPath(new URL('spec-390.png',out))});
 });
 await page.setViewportSize({ width: 1440, height: 1080 });
 await go('?view=knowledge&section=files'); nav=page.getByRole('navigation',{name:'知识库分页',exact:true});
 await check('知识库：实际总数、搜索空态、全选及底部布局',async()=>{
  const count=await page.locator('.kb-files tbody tr').count(); assert.match(await nav.innerText(),new RegExp(`共${count} 条`)); assert(await nav.getByRole('button',{name:'下一页',exact:true}).isDisabled());
  await page.getByRole('checkbox',{name:'全选文件',exact:true}).check(); assert.equal(await page.locator('.kb-files tbody input:checked').count(),count);
  await page.getByRole('textbox',{name:'搜索文件',exact:true}).fill('不存在'); assert.match(await nav.innerText(),/共0 条/); assert(!(await page.getByRole('checkbox',{name:'全选文件',exact:true}).isChecked()));
  await page.getByRole('textbox',{name:'搜索文件',exact:true}).fill(''); const box=await nav.boundingBox(); assert(box.y+box.height<1080); await page.screenshot({path:fileURLToPath(new URL('knowledge-1440.png',out))});
 });
 await go('?view=drive'); await page.waitForFunction(()=>!document.querySelector('.drive-upload')?.disabled);
 // Seed only this disposable browser context; never touches the user's browser data.
 await page.evaluate(async()=>{await new Promise((resolve,reject)=>{const req=indexedDB.open('guangxin-cloud-drive',1);req.onsuccess=()=>{const db=req.result;const tx=db.transaction('state','readwrite');const store=tx.objectStore('state');const get=store.get('current');get.onsuccess=()=>{const value=get.result;if(!value){db.close();resolve();return;}for(let i=0;i<41;i++)value.entries.push({id:'pagination-test-'+i,parent:'drive-current',name:'分页验证文件 '+i,kind:'text',size:'1KB',created:'2026-11-07 12:00',sampleText:'分页测试'});store.put(value,'current');};tx.oncomplete=()=>{db.close();resolve();};tx.onerror=reject;};req.onerror=reject;});});
 // Fresh cloud state is initially in memory. Create a local fixture via the upload UI if no database record exists.
 if (!(await page.evaluate(async()=>new Promise(resolve=>{const r=indexedDB.open('guangxin-cloud-drive',1);r.onsuccess=()=>{const db=r.result;const q=db.transaction('state').objectStore('state').get('current');q.onsuccess=()=>{resolve(!!q.result);db.close();};};})))) {
  await page.locator('.drive-filters input[type=file]').setInputFiles(Array.from({length:41},(_,i)=>({name:`分页验证文件 ${i}.txt`,mimeType:'text/plain',buffer:Buffer.from('pagination fixture')})));
  await page.waitForFunction(()=>document.querySelector('.drive-notice')?.textContent.includes('已上传 41'));
 }
 await page.reload({waitUntil:'networkidle'}); nav=page.getByRole('navigation',{name:'云盘分页',exact:true});
 await check('云盘：分页切片、跨页选择与当前页全选',async()=>{
  assert.match(await nav.innerText(),/共47 条/);assert.equal(await page.locator('.drive-table tbody tr').count(),20);
  await page.locator('.drive-table tbody input').first().check();await nav.getByRole('button',{name:'下一页',exact:true}).click();await page.getByRole('checkbox',{name:'全选云盘文件',exact:true}).check();assert.match(await page.locator('.drive-batch-bar').innerText(),/已选择 21 项/);
  await nav.getByRole('button',{name:'上一页',exact:true}).click();assert(await page.getByRole('checkbox',{name:'全选云盘文件',exact:true}).evaluate(e=>e.indeterminate));assert.equal(await page.locator('.drive-table tbody input:checked').count(),1);
  await page.locator('.drive-batch-bar').getByRole('button',{name:'取消',exact:true}).click();
 });
 await check('云盘：删空末页回退、筛选重置、空文件夹',async()=>{
  await nav.getByRole('textbox').fill('3');await nav.getByRole('textbox').press('Enter');assert.equal(await page.locator('.drive-table tbody tr').count(),7);
  await page.getByRole('checkbox',{name:'全选云盘文件',exact:true}).check();await page.getByRole('button',{name:'批量删除',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'确认删除',exact:true}).click();await page.getByRole('dialog').waitFor({state:'detached'});
  assert.match(await nav.innerText(),/共40 条/);assert.equal(await nav.locator('[aria-current]').innerText(),'2');assert.equal(await page.locator('.drive-table tbody tr').count(),20);
  await page.getByRole('textbox',{name:'搜索云盘文件',exact:true}).fill('不存在');assert.match(await nav.innerText(),/共0 条/);assert.equal(await nav.locator('[aria-current]').innerText(),'1');await page.getByRole('textbox',{name:'搜索云盘文件',exact:true}).fill('');
  await size(nav,10);assert.equal(await page.locator('.drive-table tbody tr').count(),10);
  await page.locator('.drive-table .drive-entry-name.is-folder').first().click();assert.match(await nav.innerText(),/共0 条/);await page.getByRole('button',{name:'返回上级目录',exact:true}).click();assert.equal(await nav.locator('[aria-current]').innerText(),'1');
 });
 for(const mode of ['original','spec'])for(const width of [1920,1440,1280])await check(`${mode}模式 / ${width}px底部布局`,async()=>{
  await page.evaluate(mode=>localStorage.setItem('guangxin-ui-mode',mode),mode);await page.setViewportSize({width,height:1080});await page.reload({waitUntil:'networkidle'});
  const box=await nav.boundingBox();assert(box.y+box.height<=1080);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:fileURLToPath(new URL(`drive-${mode}-${width}.png`,out))});
 });
 assert.deepEqual(errors,[]);await fs.writeFile(new URL('verification.json',out),JSON.stringify({results,errors},null,2));console.log(`${results.length} pagination checks passed`);
}finally{await browser.close();}
