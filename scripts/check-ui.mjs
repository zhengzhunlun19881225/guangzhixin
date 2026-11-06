import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
let chromium;
try { ({chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright')); }
catch { throw new Error('Install Playwright or set PLAYWRIGHT_MODULE to its index.mjs. See docs/design-system/IMPLEMENTATION.md.'); }
const base=process.env.BASE_URL || 'http://127.0.0.1:5197/guangzhixin/';
const output=path.join(root,'output/design-system');await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const context=await browser.newContext({viewport:{width:1920,height:1080},reducedMotion:'reduce'});
const page=await context.newPage();const errors=[];const results=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400 && r.url().startsWith(base))errors.push(`${r.status()} ${r.url()}`);});
const style=(locator,key)=>locator.evaluate((el,key)=>getComputedStyle(el)[key],key);
async function go(query=''){await page.goto(base+query,{waitUntil:'networkidle'});}
async function check(name,fn){try{await fn();results.push({name,status:'passed'});console.log(`PASS ${name}`);}catch(e){results.push({name,status:'failed',error:e.message});console.error(`FAIL ${name}: ${e.message}`);}}
try {
 await check('规范页目录、颜色参数与示例',async()=>{
  await go('?view=design-system');await page.getByRole('heading',{name:'广智新设计规范',exact:true}).waitFor();
  assert.equal(await page.locator('.spec-section').count(),7);
  assert.equal(await page.locator('.spec-swatch').count(),12);
  await page.screenshot({path:path.join(output,'spec-overview.png')});
  await page.getByRole('link',{name:'03 公共组件'}).click();await page.getByRole('button',{name:'演示加载',exact:true}).click();await page.getByRole('button',{name:'处理中',exact:true}).waitFor();assert(await page.getByRole('button',{name:'处理中',exact:true}).isDisabled());await page.getByRole('button',{name:'演示加载',exact:true}).waitFor();
  await page.getByRole('button',{name:'次操作',exact:true}).hover();assert.equal(await style(page.getByRole('button',{name:'次操作',exact:true}),'color'),'rgb(230, 1, 1)');
  const select=page.getByRole('combobox',{name:'文件类型示例',exact:true});assert.equal(await style(select,'height'),'32px');await select.click();
  const list=page.getByRole('listbox',{name:'文件类型示例'});assert.equal(await list.locator('svg').count(),0);assert.equal(await style(list,'borderRadius'),'8px');
  await page.getByRole('option',{name:'PDF文档',exact:true}).hover();assert.equal(await style(page.getByRole('option',{name:'PDF文档',exact:true}),'backgroundColor'),'rgb(241, 245, 249)');
  await select.press('End');await select.press('Enter');assert.equal(await select.innerText(),'PDF文档');await select.click();await select.press('Escape');assert.equal(await select.getAttribute('aria-expanded'),'false');
  await page.getByRole('combobox',{name:'带图标示例',exact:true}).click();assert.equal(await page.getByRole('listbox').locator('.ui-select-option-icon').count(),2);await page.keyboard.press('Escape');
  assert(await page.getByRole('combobox',{name:'禁用选择示例'}).isDisabled());
  const search=page.getByRole('textbox',{name:'组件搜索示例'});await search.fill('测试');await page.getByRole('button',{name:'清空组件搜索示例'}).click();assert.equal(await search.inputValue(),'');assert(await search.evaluate(e=>e===document.activeElement));
  await page.getByLabel('开始日期',{exact:true}).fill('2026-11-01');await page.getByLabel('结束日期',{exact:true}).fill('2026-11-06');await page.getByRole('button',{name:'清空日期范围'}).click();assert.equal(await page.getByLabel('开始日期',{exact:true}).inputValue(),'');
  await page.screenshot({path:path.join(output,'spec-components.png')});
 });
 await check('确认弹窗校验、焦点和退出',async()=>{
  const trigger=page.getByRole('button',{name:'打开确认示例'});await trigger.click();const dialog=page.locator('dialog');await dialog.getByRole('button',{name:'确认操作',exact:true}).click();await page.getByRole('alert').waitFor();assert.equal(await page.locator('#spec-confirm-input').getAttribute('aria-invalid'),'true');await page.locator('#spec-confirm-input').fill('确认');await dialog.getByRole('button',{name:'确认操作',exact:true}).click();assert.equal(await dialog.count(),1);assert(!(await dialog.isVisible()));assert(await trigger.evaluate(e=>e===document.activeElement));await trigger.click();await page.keyboard.press('Escape');assert(!(await dialog.isVisible()));
 });
 await check('页面目录过滤、空态与样式参数下载',async()=>{
  await page.getByRole('link',{name:'06 页面盘点'}).click();const rows=page.locator('#inventory tbody tr');assert.equal(await rows.count(),14);await page.getByRole('textbox',{name:'查找页面规范'}).fill('云盘');assert.equal(await rows.count(),1);await page.getByRole('textbox',{name:'查找页面规范'}).fill('不存在的页面');assert.equal(await rows.count(),0);await page.locator('#inventory').getByRole('button',{name:'清空筛选'}).click();assert.equal(await rows.count(),14);
  await page.getByRole('combobox',{name:'页面分组'}).click();await page.getByRole('option',{name:'门户',exact:true}).click();assert.equal(await rows.count(),2);
  const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'下载样式参数'}).click();const download=await downloadPromise;assert.equal(download.suggestedFilename(),'guangzhixin-tokens-v1.css');await download.saveAs(path.join(output,'downloaded-tokens.css'));assert.equal(await fs.readFile(path.join(output,'downloaded-tokens.css'),'utf8'),await fs.readFile(path.join(root,'src/design/tokens.css'),'utf8'));
 });
 await check('规范示例状态颜色与轮播',async()=>{
  await go('?view=design-system#components');
  assert.equal(await style(page.locator('.spec-demo-row .ui-status-success'),'color'),'rgb(0, 135, 90)');
  assert.equal(await style(page.locator('.spec-demo-row .ui-status-danger'),'color'),'rgb(204, 0, 0)');
  const carousel=page.getByRole('region',{name:'规范示例资讯轮播'});await carousel.scrollIntoViewIfNeeded();await page.mouse.move(0,0);
  const next=carousel.getByRole('button',{name:'下一组规范示例资讯'});assert.equal(await style(next,'opacity'),'0');
  await carousel.hover();assert.equal(await style(next,'opacity'),'1');const track=carousel.locator('.pn-track');await next.click();assert(await track.evaluate(e=>e.scrollLeft>0));
  await carousel.getByRole('button',{name:'上一组规范示例资讯'}).click();assert.equal(await track.evaluate(e=>e.scrollLeft),0);
  await page.screenshot({path:path.join(output,'spec-carousel.png')});
 });
 const scenes=[['home','', '.ai-landing'],['answer','', '.ai-response-content'],['dashboard','?view=dashboard','.workbench-dashboard'],['agents','?view=agents','.agents-view'],['skills','?view=skills','.agents-view'],['knowledge','?view=knowledge','.knowledge-view'],['knowledge-detail','?view=knowledge','.knowledge-detail-view'],['drive','?view=drive','.cloud-drive-view'],['todos','?view=todos','.todo-view'],['employees','?view=employees','.digital-employee-empty'],['portal','?view=portal','.portal-news'],['data','?view=portal&section=data','.portal-data'],['im','?view=im','.im-workspace'],['contacts','?view=im&section=contacts','.im-workspace']];
 for(const width of [1920,1440,1280]){
  await page.setViewportSize({width,height:1080});
  for(const [name,query,selector] of scenes)await check(`${name} / ${width}px`,async()=>{
   await go(query);
   if(name==='answer')await page.locator('.ai-questions .grid button').first().click();
   if(name==='knowledge-detail')await page.locator('.knowledge-card').first().click();
   await page.locator(selector).first().waitFor({timeout:8000});
   assert.equal(await page.locator('select').count(),0);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1));
   if(name==='home')assert.equal(await style(page.locator('.ai-landing h1'),'fontSize'),'24px');
   if(name==='answer')assert.equal(await style(page.locator('.ai-response-content'),'color'),'rgb(3, 9, 27)');
   if(name==='dashboard'){
    assert.equal(await page.locator('.wb-heading.ui-panel-heading').count(),5);
    assert.equal(await style(page.locator('.wb-task-list .ui-status').first(),'color'),'rgb(0, 135, 90)');
    const paragraph=page.locator('.daily-brief .wb-brief p').first();assert.equal(await style(paragraph,'fontSize'),'14px');assert.equal(await style(paragraph,'lineHeight'),'22px');
    const gaps=await page.evaluate(()=>{const col=document.querySelector('.daily-brief').getBoundingClientRect(),item=document.querySelector('.daily-brief article').getBoundingClientRect();return [item.left-col.left,col.right-item.right];});assert(Math.abs(gaps[0]-gaps[1])<2,`unequal brief gaps ${gaps}`);
   }
   if(width===1920)await page.screenshot({path:path.join(output,`${name}-${width}.png`)});
  });
 }
 await page.setViewportSize({width:1920,height:1080});
 await check('工作台公共按钮和原生弹窗',async()=>{
  await go('?view=dashboard');await page.getByRole('button',{name:'系统导航更多'}).click();await page.getByRole('button',{name:'管理',exact:true}).click();const save=page.getByRole('button',{name:'保存',exact:true});assert(await save.evaluate(e=>e.classList.contains('ui-button-primary')));assert.equal(await style(save,'color'),'rgb(255, 255, 255)');await save.hover();assert.equal(await style(save,'color'),'rgb(255, 255, 255)');await page.getByRole('button',{name:'取消',exact:true}).click();await page.getByRole('button',{name:'关闭应用管理'}).click();await page.getByRole('button',{name:'AI 帮写感谢'}).click();await page.getByRole('dialog').waitFor();assert.equal(await style(page.getByRole('button',{name:'发送IM祝福'}),'color'),'rgb(255, 255, 255)');await page.keyboard.press('Escape');
 });
 await check('门户轮播悬浮、标题和左右切换',async()=>{
  await go('?view=portal');const carousel=page.locator('.pn-carousel').first();const next=carousel.locator('.pn-carousel-next');
  await page.mouse.move(0,0);assert.equal(await style(next,'opacity'),'0');await carousel.hover();await page.waitForTimeout(200);assert.equal(await style(next,'opacity'),'1');
  const track=carousel.locator('.pn-track');await next.click();assert(await track.evaluate(e=>e.scrollLeft>0));await carousel.locator('.pn-carousel-prev').click();assert.equal(await track.evaluate(e=>e.scrollLeft),0);
  const card=carousel.locator('.pn-ai-card').first();await card.hover();assert.equal(await style(card.locator('h4'),'color'),'rgb(230, 1, 1)');
 });
 await check('帮助菜单提供规范入口',async()=>{await go();await page.getByRole('button',{name:'帮助与反馈',exact:true}).click();await page.getByRole('menuitem',{name:'设计规范'}).click();await page.locator('.spec-app').waitFor();});
 await check('规范页 390px 窄屏',async()=>{await page.setViewportSize({width:390,height:844});await go('?view=design-system');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));const main=page.locator('.spec-main');assert(await main.evaluate(e=>e.scrollWidth<=e.clientWidth+1));await page.screenshot({path:path.join(output,'spec-mobile.png')});});
 await check('浏览器运行错误与资源请求',async()=>assert.deepEqual(errors,[]));
} finally {await fs.writeFile(path.join(output,'report.json'),JSON.stringify({date:new Date().toISOString(),base,results,errors},null,2));await browser.close();}
if(results.some(r=>r.status==='failed'))process.exitCode=1;
