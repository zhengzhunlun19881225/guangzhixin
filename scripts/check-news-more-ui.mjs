import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.BASE_URL||'http://127.0.0.1:5196/';
const output=path.resolve('output/playwright/news-more');await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const page=await browser.newPage({viewport:{width:1920,height:1080},reducedMotion:'reduce'});
page.setDefaultTimeout(8000);const results=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
const css=(node,key)=>node.evaluate((e,k)=>getComputedStyle(e)[k],key);
async function check(name,fn){try{await fn();results.push({name,status:'passed'});console.log('PASS '+name);}catch(e){results.push({name,status:'failed',error:e.message});console.error('FAIL '+name+': '+e.message);}}
const home=page.locator('.pn-ai-news'),surface=page.getByRole('region',{name:'AI 智能资讯全部资讯',exact:true});
try{
 await check('More retains filters, paginates actual data, opens article and restores portal',async()=>{
  await page.goto(base+'?view=portal',{waitUntil:'networkidle'});
  await home.getByRole('tab',{name:'我关注的',exact:true}).click();await home.getByRole('button',{name:'AI 智能资讯列表模式'}).click();await home.getByRole('button',{name:'更多',exact:true}).click();
  await surface.waitFor();assert.equal(await surface.getByRole('tab',{name:'我关注的'}).getAttribute('aria-selected'),'true');assert.equal(await surface.locator('.pn-news-row').count(),6);
  await surface.getByRole('tab',{name:'推荐',exact:true}).click();assert.equal(await surface.locator('.pn-news-row').count(),12);assert((await surface.locator('.gx-pagination-summary').innerText()).includes('共12 条'));
  await surface.getByRole('combobox',{name:'AI 智能资讯分页每页条数'}).click();await page.getByRole('option',{name:'10/页',exact:true}).click();assert.equal(await surface.locator('.pn-news-row').count(),10);
  await surface.getByRole('button',{name:'下一页',exact:true}).click();assert.equal(await surface.locator('.pn-news-row').count(),2);
  await surface.getByRole('textbox',{name:'搜索AI 智能资讯'}).fill('绿色材料');assert.equal(await surface.locator('.pn-news-row').count(),1);assert.equal(await surface.getByRole('button',{name:'第1页'}).getAttribute('aria-current'),'page');
  await surface.locator('.pn-news-row').click();const dialog=page.locator('dialog.pn-article-detail');await dialog.waitFor();assert.equal(await css(dialog.locator('.gx-dialog-body'),'paddingLeft'),'30px');assert.equal(await css(dialog.locator('.gx-dialog-body'),'paddingRight'),'30px');assert.equal(await css(dialog.locator('.gx-dialog-body'),'paddingBottom'),'30px');
  await dialog.locator('.gx-dialog-body').evaluate(e=>e.scrollTop=e.scrollHeight);await dialog.screenshot({path:path.join(output,'article-bottom-30px.png')});await dialog.getByRole('button',{name:'关闭资讯详情'}).click();assert.equal(await surface.locator('.pn-news-row').count(),1);
  await surface.getByRole('textbox',{name:'搜索AI 智能资讯'}).fill('不存在的资讯');await surface.getByText('暂无匹配资讯',{exact:true}).waitFor();assert(await surface.getByRole('button',{name:'下一页',exact:true}).isDisabled());
  await surface.getByRole('textbox',{name:'搜索AI 智能资讯'}).fill('');await surface.getByRole('button',{name:'返回',exact:true}).click();assert.equal(await home.getByRole('button',{name:'AI 智能资讯列表模式'}).getAttribute('aria-pressed'),'true');await page.waitForFunction(()=>document.activeElement?.matches('.pn-ai-news .pn-more'));
 });
 await check('More list at 1920/1440/390 in both UI modes; fixed footer, subscription and keyboard tabs',async()=>{
  for(const mode of ['original','spec'])for(const width of [1920,1440,390]){
   await page.setViewportSize({width,height:1080});await page.goto(base+'?view=portal',{waitUntil:'networkidle'});await page.evaluate(mode=>document.documentElement.dataset.uiMode=mode,mode);
   await home.getByRole('button',{name:'更多',exact:true}).click();await surface.waitFor();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert(await surface.evaluate(e=>e.scrollWidth<=e.clientWidth));
   const panel=await surface.boundingBox(),footer=await surface.locator('.gx-pagination').boundingBox();assert(footer.y+footer.height<=panel.y+panel.height);
   const list=await surface.locator('.pn-news-list').boundingBox();assert(Math.abs(footer.x-list.x)<=1,`left edges ${footer.x}/${list.x}`);assert(Math.abs(footer.width-list.width)<=1,`widths ${footer.width}/${list.width}`);
   const heading=surface.locator('.pn-row-heading h4').first();assert.equal(await css(heading,'fontSize'),'16px');assert.equal(await css(heading,'fontWeight'),'400');
   await surface.getByRole('tab',{name:'推荐',exact:true}).focus();await page.keyboard.press('ArrowRight');assert.equal(await surface.getByRole('tab',{name:'我关注的'}).getAttribute('aria-selected'),'true');
   await surface.getByRole('tab',{name:'推荐',exact:true}).click();await page.screenshot({path:path.join(output,`more-${mode}-${width}.png`)});
   await surface.getByRole('button',{name:'订阅',exact:true}).click();const subscription=page.getByRole('dialog',{name:'资讯订阅设置'});await subscription.waitFor();await subscription.getByRole('button',{name:'保存',exact:true}).waitFor();await subscription.getByRole('button',{name:'高级设置：来源、屏蔽与提醒'}).click();for(const group of await subscription.locator('.ns-options').all()){assert.equal(await css(group,'columnGap'),'12px');assert.equal(await css(group,'rowGap'),'12px');}await page.keyboard.press('Escape');await subscription.waitFor({state:'hidden'});
  }
 });
 await check('News cards have no hover shadow in both modes and group More also works',async()=>{
  await page.setViewportSize({width:1440,height:1080});await page.goto(base+'?view=portal',{waitUntil:'networkidle'});
  for(const mode of ['original','spec']){await page.evaluate(mode=>document.documentElement.dataset.uiMode=mode,mode);for(const selector of ['.pn-ai-card','.pn-group-card']){const card=page.locator(selector).first();await card.hover();assert.equal(await css(card,'boxShadow'),'none');}}
  await page.locator('.pn-group-news').getByRole('button',{name:'更多',exact:true}).click();const group=page.getByRole('region',{name:'集团综合资讯全部资讯'});await group.waitFor();await group.getByRole('tab',{name:'党建',exact:true}).click();assert.equal(await group.locator('.pn-news-row').count(),4);
 });
 await check('12px foundation and six feedback modules, including live surfaces',async()=>{
  const selectors={alert:'.cr-alert',message:'.cr-message',notification:'.cr-notification',dialog:'.rp-messagebox'};
  for(const [id,selector] of Object.entries(selectors)){await page.goto(`${base}?view=design-system&component=${id}#library`,{waitUntil:'networkidle'});const preview=page.locator(`.cr-detail[data-component=${id}] .cr-preview`);for(const node of await preview.locator(selector).all())assert.equal(await css(node,'borderRadius'),'12px');
   if(id==='message'){await preview.getByRole('button',{name:'显示成功轻提示'}).click();assert.equal(await css(page.locator('.cr-message-overlay .cr-message'),'borderRadius'),'12px');}
   if(id==='dialog'){await preview.getByRole('button',{name:'打开消息提示',exact:true}).click();assert.equal(await css(page.locator('dialog.rp-messagebox-live'),'borderRadius'),'12px');await page.keyboard.press('Escape');}
  }
  for(const [id,name] of [['popover','查看卡片说明'],['popconfirm','移除示例条目']]){await page.goto(`${base}?view=design-system&component=${id}#library`,{waitUntil:'networkidle'});await page.locator(`.cr-detail[data-component=${id}]`).getByRole('button',{name,exact:true}).click();assert.equal(await css(page.locator(`.cr-popup-${id}`),'borderRadius'),'12px');}
  await page.goto(base+'?view=design-system#foundations',{waitUntil:'networkidle'});const radius=page.locator('.spec-radii>div').filter({hasText:'12px'});assert.equal(await radius.count(),1);assert.equal(await css(radius,'borderRadius'),'12px');assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--gx-radius-feedback').trim()),'12px');await page.screenshot({path:path.join(output,'foundation-radius-12px.png')});
 });
 await check('Business modal titles are 18px in both modes; feedback titles retain their scale',async()=>{
  await page.setViewportSize({width:1440,height:1080});
  const inspect=async()=>{const title=page.locator('dialog[open] .gx-dialog-header').locator('h2,h3,strong').first();await title.waitFor();assert.equal(await css(title,'fontSize'),'18px');assert.equal(await css(title,'fontWeight'),'600');await page.keyboard.press('Escape');};
  for(const mode of ['original','spec']){
   await page.goto(base+'?view=dashboard',{waitUntil:'networkidle'});await page.evaluate(mode=>document.documentElement.dataset.uiMode=mode,mode);
   await page.getByRole('button',{name:'新增日程',exact:true}).click();await page.getByRole('menuitem',{name:'新建会议',exact:true}).click();await inspect();
   await page.locator('.sch-item').first().click();await inspect();await page.getByRole('button',{name:'我的日程更多'}).click();await inspect();
   await page.goto(base,{waitUntil:'networkidle'});await page.evaluate(mode=>document.documentElement.dataset.uiMode=mode,mode);await page.getByRole('button',{name:'搜索 (Ctrl+K)',exact:true}).click();await inspect();await page.getByRole('button',{name:'查看更多历史记录',exact:true}).click();await inspect();
   await page.goto(base+'?view=portal',{waitUntil:'networkidle'});await page.evaluate(mode=>document.documentElement.dataset.uiMode=mode,mode);await home.getByRole('button',{name:'订阅',exact:true}).click();await inspect();
  }
  await page.goto(base+'?view=design-system&component=notification#library',{waitUntil:'networkidle'});assert.equal(await css(page.locator('.cr-notification h5').first(),'fontSize'),'16px');await page.goto(base+'?view=design-system&component=dialog#library',{waitUntil:'networkidle'});assert.equal(await css(page.locator('.rp-messagebox h5').first(),'fontSize'),'16px');
 });
 await check('Button solid and icon variants, 26px small controls, keyboard and loading',async()=>{
  for(const mode of ['original','spec'])for(const width of [1440,390]){
   await page.setViewportSize({width,height:1080});await page.goto(base+'?view=design-system&component=button#library',{waitUntil:'networkidle'});await page.evaluate(mode=>document.documentElement.dataset.uiMode=mode,mode);
   const preview=page.locator('.cr-detail[data-component=button] .cr-preview'),normal=preview.getByRole('group',{name:'常规按钮 32px'}),small=preview.getByRole('group',{name:'小号按钮 26px'});
   for(const button of await normal.getByRole('button').all())assert.equal((await button.boundingBox()).height,32);
   for(const button of await small.getByRole('button').all())assert.equal((await button.boundingBox()).height,26);
   const solid=normal.getByRole('button',{name:'主题红按钮',exact:true});await page.mouse.move(0,0);assert.equal(await css(solid,'backgroundColor'),'rgb(255, 0, 0)');assert.equal(await css(solid,'color'),'rgb(255, 255, 255)');assert.equal(await css(solid,'borderTopWidth'),'0px');await solid.focus();await page.keyboard.press('Enter');await preview.getByRole('status').filter({hasText:'已触发主题红按钮示例'}).waitFor();
   assert.equal(await preview.getByRole('group',{name:'带图标按钮'}).locator('button>svg').count(),5);const load=small.getByRole('button',{name:'加载示例'});await load.click();assert(await load.isDisabled());assert.equal(await load.getAttribute('aria-busy'),'true');await load.waitFor({state:'visible'});await page.waitForFunction(()=>!document.querySelector('.cr-detail[data-component=button] [aria-label="小号按钮 26px"] [aria-busy]'));assert(await load.isEnabled());
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await preview.screenshot({path:path.join(output,`buttons-${mode}-${width}.png`)});
  }
 });
 assert.deepEqual(errors,[]);
}finally{await fs.writeFile(path.join(output,'verification.json'),JSON.stringify({date:new Date().toISOString(),results,errors},null,2));await browser.close();}
if(results.some(r=>r.status==='failed'))process.exitCode=1;
