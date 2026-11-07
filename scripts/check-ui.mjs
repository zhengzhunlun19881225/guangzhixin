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
 await check('规范页目录、颜色参数与二级组件导航',async()=>{
  await go('?view=design-system');await page.getByRole('heading',{name:'基础样式',exact:true}).waitFor();
  assert.equal(await page.locator('.spec-section').count(),6);assert.equal(await page.locator('#components').count(),0);
  assert.equal(await page.locator('.spec-swatch').count(),20);
  await page.getByRole('link',{name:'02 组件规范全览',exact:true}).click();
  const menu=page.locator('.spec-sidebar .cr-list');await menu.waitFor();assert.equal(await menu.locator('button').count(),59);
  assert.equal(await page.locator('.cr-workspace .cr-list').count(),0);
  await menu.getByRole('button',{name:'Button 按钮 公共组件',exact:true}).click();
  const load=page.locator('.cr-detail[data-component=button] .cr-preview').getByRole('button',{name:'加载示例',exact:true});await load.click();assert(await load.isDisabled());await page.waitForTimeout(1000);assert(!(await load.isDisabled()));
  await page.screenshot({path:path.join(output,'spec-components.png')});
 });
 await check('确认弹窗校验、焦点和退出',async()=>{
  await go('?view=design-system&component=dialog#library');
  const trigger=page.getByRole('button',{name:'打开输入弹框',exact:true});await trigger.click();const dialog=page.locator('dialog.rp-messagebox-live');await dialog.getByRole('button',{name:'确定',exact:true}).click();await dialog.getByRole('alert').waitFor();
  await page.keyboard.press('Escape');assert.equal(await dialog.count(),0);assert(await trigger.evaluate(e=>e===document.activeElement));
 });
 await check('页面目录过滤、空态与样式参数下载',async()=>{
  await page.getByRole('link',{name:'06 页面盘点'}).click();const rows=page.locator('#inventory tbody tr');assert.equal(await rows.count(),14);await page.getByRole('textbox',{name:'查找页面规范'}).fill('云盘');assert.equal(await rows.count(),1);await page.getByRole('textbox',{name:'查找页面规范'}).fill('不存在的页面');assert.equal(await rows.count(),0);await page.locator('#inventory').getByRole('button',{name:'清空筛选'}).click();assert.equal(await rows.count(),14);
  await page.getByRole('combobox',{name:'页面分组'}).click();await page.getByRole('option',{name:'门户',exact:true}).click();assert.equal(await rows.count(),2);
  const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'下载样式参数'}).click();const download=await downloadPromise;assert.equal(download.suggestedFilename(),'guangzhixin-tokens-v3.css');await download.saveAs(path.join(output,'downloaded-tokens.css'));assert.equal(await fs.readFile(path.join(output,'downloaded-tokens.css'),'utf8'),await fs.readFile(path.join(root,'src/design/tokens.css'),'utf8'));
 });
 await check('规范示例状态颜色与轮播',async()=>{
  await go('?view=design-system&component=tag#library');
  assert.equal(await style(page.locator('.cr-detail[data-component=tag] .cr-preview .ui-status-success'),'color'),'rgb(0, 181, 120)');
  assert.equal(await style(page.locator('.cr-detail[data-component=tag] .cr-preview .ui-status-danger'),'color'),'rgb(255, 0, 0)');
  await go('?view=design-system&component=carousel#library');
  const carousel=page.getByRole('region',{name:'组件全览资讯轮播'});await carousel.scrollIntoViewIfNeeded();
  const track=carousel.locator('.pn-track');await track.focus();await page.keyboard.press('ArrowRight');assert(await track.evaluate(e=>e.scrollLeft>0));
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
    assert.equal(await style(page.locator('.wb-task-list .ui-status').first(),'color'),'rgb(0, 181, 120)');
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
 await check('两组资讯卡片/列表切换、筛选与详情',async()=>{
  await go('?view=portal');const ai=page.locator('.pn-ai-news');const group=page.locator('.pn-group-news');
  const listMetrics=panel=>panel.locator('.pn-news-list').evaluate(e=>({height:e.clientHeight,scroll:e.scrollHeight,rows:e.querySelectorAll('li').length}));
  await ai.getByRole('button',{name:'AI 智能资讯列表模式',exact:true}).click();assert.equal(await ai.locator('.pn-news-row').count(),12);assert.equal(await ai.locator('.pn-carousel').count(),0);assert.equal(await group.locator('.pn-group-card').count(),12);assert.equal((await listMetrics(ai)).height,628);assert((await listMetrics(ai)).scroll>628);assert.equal(await ai.locator('.pn-row-image').count(),12);await ai.screenshot({path:path.join(output,'news-image-list-five.png')});
  await ai.getByRole('tab',{name:'行业趋势',exact:true}).click();const count=await ai.locator('.pn-news-row').count();assert(count>0&&count<12);
  const title=await ai.locator('.pn-news-row h4').first().innerText();await ai.getByRole('textbox',{name:'搜索AI 智能资讯',exact:true}).fill(title);assert.equal(await ai.locator('.pn-news-row').count(),1);assert.equal((await listMetrics(ai)).height,100);assert.equal((await listMetrics(ai)).scroll,100);await ai.screenshot({path:path.join(output,'news-image-list-one.png')});
  await ai.getByRole('button',{name:'AI 智能资讯卡片模式',exact:true}).click();assert.equal(await ai.locator('.pn-ai-card').count(),1);assert.equal(await ai.getByRole('textbox').inputValue(),title);
  await ai.getByRole('button',{name:'AI 智能资讯列表模式',exact:true}).click();await ai.locator('.pn-news-row').first().hover();assert.equal(await style(ai.locator('.pn-news-row h4').first(),'color'),'rgb(230, 1, 1)');await ai.locator('.pn-news-row').first().click();assert.equal(await page.locator('.pn-detail h3').innerText(),title);await page.getByRole('button',{name:'关闭资讯详情',exact:true}).click();
  await ai.getByRole('textbox').fill('没有这个新闻abcdef');assert.equal(await ai.locator('.pn-news-row').count(),0);await ai.getByText('暂无匹配资讯',{exact:true}).waitFor();await ai.getByRole('button',{name:'清空搜索AI 智能资讯',exact:true}).click();await ai.getByRole('tab',{name:'推荐',exact:true}).click();
  await group.getByRole('button',{name:'集团综合资讯列表模式',exact:true}).focus();await page.keyboard.press('Enter');assert.equal(await group.locator('.pn-news-row').count(),12);
  await group.locator('.pn-news-row').last().scrollIntoViewIfNeeded();assert(await group.locator('.pn-news-list').evaluate(e=>e.scrollTop>0));await group.getByRole('tab',{name:'党建',exact:true}).click();assert.equal(await group.locator('.pn-news-list').evaluate(e=>e.scrollTop),0);await group.getByRole('tab',{name:'最新',exact:true}).click();assert.equal((await listMetrics(group)).height,628);assert((await listMetrics(group)).scroll>628);
  for(const width of [1920,1600,1440,1280]){await page.setViewportSize({width,height:1080});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));for(const panel of [ai,group]){const b=await panel.boundingBox();const t=await panel.locator('.pn-section-tools').boundingBox();assert(t.x>=b.x&&t.x+t.width<=b.x+b.width,`toolbar exceeds panel at ${width}`);}await page.screenshot({path:path.join(output,`news-list-${width}.png`)});}
  await page.setViewportSize({width:1920,height:1080});await ai.getByRole('button',{name:'AI 智能资讯卡片模式',exact:true}).click();await group.getByRole('button',{name:'集团综合资讯卡片模式',exact:true}).click();assert.equal(await page.locator('.pn-carousel').count(),2);await page.screenshot({path:path.join(output,'news-cards-toggle.png')});
 });
 await check('资讯两行摘要、完整详情和真实附件',async()=>{
  await page.setViewportSize({width:1920,height:1080});await go('?view=portal');
  for(const [selector,label] of [['.pn-ai-news','AI 智能资讯'],['.pn-group-news','集团综合资讯']]){
   const panel=page.locator(selector);await panel.getByRole('button',{name:label+'列表模式',exact:true}).click();
   const summaries=await panel.locator('.pn-row-summary').evaluateAll(els=>els.map(e=>({height:e.getBoundingClientRect().height,line:getComputedStyle(e).lineHeight})));
   assert(summaries.every(s=>s.height===44&&s.line==='22px'),JSON.stringify(summaries));
   for(let i=0;i<12;i++){
    const row=panel.locator('.pn-news-row').nth(i);const title=await row.locator('h4').innerText();await row.click();const detail=page.locator('.pn-article-detail');assert.equal(await detail.locator('h3').innerText(),title);assert.equal(await detail.locator('.pn-article-body p').count(),4);assert.equal(await detail.locator('.pn-article-files a').count(),2);assert(await detail.locator('.pn-article-body img').evaluate(async e=>{await e.decode();return e.naturalWidth>=800;}));
    assert.equal(await style(detail.locator('.pn-article-body p').first(),'fontSize'),'16px');assert.equal(await detail.locator('.pn-demo-label').innerText(),'示例资讯');
    for(const link of await detail.locator('.pn-article-files a').all()){const url=await link.getAttribute('href');const response=await context.request.get(new URL(url,base).href);assert(response.ok());assert.equal((await response.body()).subarray(0,5).toString(),'%PDF-');}
    if(i===0&&selector==='.pn-ai-news'){
     await page.setViewportSize({width:924,height:1393});await detail.screenshot({path:path.join(output,'news-article-reference-size.png')});
     await page.setViewportSize({width:1920,height:1080});await page.screenshot({path:path.join(output,'news-article-desktop.png')});
     const pending=page.waitForEvent('download');await detail.locator('.pn-article-files a').first().click();const download=await pending;assert.equal(download.suggestedFilename(),title+'-交流材料.pdf');await download.saveAs(path.join(output,'news-downloaded.pdf'));assert.equal((await fs.readFile(path.join(output,'news-downloaded.pdf'))).subarray(0,5).toString(),'%PDF-');
     await page.setViewportSize({width:390,height:844});const b=await detail.boundingBox();assert(b.x>=0&&b.x+b.width<=390);assert(await detail.evaluate(e=>e.scrollWidth<=e.clientWidth));await page.keyboard.press('Escape');await page.setViewportSize({width:1920,height:1080});await row.click();
    }
    await page.keyboard.press('Escape');assert(await row.evaluate(e=>e===document.activeElement));
   }
   await panel.locator('.pn-news-list').evaluate(e=>e.scrollTop=0);await panel.screenshot({path:path.join(output,selector==='.pn-ai-news'?'news-two-line-ai.png':'news-two-line-group.png')});
  }
 });
 await check('帮助菜单提供规范入口',async()=>{await go();await page.getByRole('button',{name:'帮助与反馈',exact:true}).click();await page.getByRole('menuitem',{name:'设计规范'}).click();await page.locator('.spec-app').waitFor();});
 await check('规范页 390px 窄屏',async()=>{await page.setViewportSize({width:390,height:844});await go('?view=design-system');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));const main=page.locator('.spec-main');assert(await main.evaluate(e=>e.scrollWidth<=e.clientWidth+1));await page.screenshot({path:path.join(output,'spec-mobile.png')});});
 await check('浏览器运行错误与资源请求',async()=>assert.deepEqual(errors,[]));
} finally {await fs.writeFile(path.join(output,'report.json'),JSON.stringify({date:new Date().toISOString(),base,results,errors},null,2));await browser.close();}
if(results.some(r=>r.status==='failed'))process.exitCode=1;
