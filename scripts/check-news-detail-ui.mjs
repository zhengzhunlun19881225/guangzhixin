import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.BASE_URL||'http://127.0.0.1:5196/';
const output=path.resolve('output/playwright/news-detail');await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const page=await browser.newPage({reducedMotion:'reduce'}),results=[],errors=[];page.setDefaultTimeout(8000);page.on('pageerror',error=>errors.push(error.message));
try{
 for(const mode of ['original','spec'])for(const width of [1440,390]){
  await page.setViewportSize({width,height:1080});await page.goto(base+'?view=portal',{waitUntil:'networkidle'});
  await page.evaluate(mode=>{localStorage.setItem('guangxin-ui-mode',mode);localStorage.removeItem('guangxin-news-feedback');},mode);await page.reload({waitUntil:'networkidle'});
  const settings=page.getByTitle('设置',{exact:true});await settings.click();const menu=page.getByRole('menu',{name:'个人设置'});
  assert.equal(await menu.locator('.ui-mode-option[hidden]').count(),1);assert.equal(await menu.getByRole('menuitemradio',{name:/模式二/}).count(),0);
  assert.equal(await menu.locator('.ui-mode-option[hidden]').evaluate(e=>getComputedStyle(e).display),'none');
  await page.keyboard.press('Home');await page.waitForFunction(()=>document.activeElement?.textContent.includes('模式一'));
  await page.keyboard.press('ArrowDown');await page.waitForFunction(()=>document.activeElement?.textContent.includes('差旅偏好'));
  await page.keyboard.press('End');await page.waitForFunction(()=>document.activeElement?.textContent.includes('退出系统'));
  await page.keyboard.press('Escape');assert(await settings.evaluate(e=>e===document.activeElement));assert.equal(await page.locator('html').getAttribute('data-ui-mode'),mode);
  results.push({mode,width,hiddenMode:'preserved, hidden and skipped by keyboard'});
  await page.locator('.pn-ai-news').getByRole('button',{name:'订阅',exact:true}).click();
  const subscription=page.getByRole('dialog',{name:'资讯订阅设置'}),tabs=subscription.getByRole('tablist',{name:'订阅方式'}),ai=tabs.getByRole('tab',{name:'AI 订阅',exact:true}),manual=tabs.getByRole('tab',{name:'手动订阅',exact:true});
  assert.equal(await tabs.evaluate(e=>getComputedStyle(e).height),'32px');assert.equal((await tabs.boundingBox()).width,260);
  assert.equal(await tabs.evaluate(e=>getComputedStyle(e).borderRadius),'8px');assert.equal(await manual.evaluate(e=>getComputedStyle(e).fontWeight),'600');assert.equal(await manual.evaluate(e=>getComputedStyle(e).color),await subscription.locator('#ns-title').evaluate(e=>getComputedStyle(e).color));
  assert.equal(await ai.locator('svg').count(),1);assert.equal(await ai.locator('svg').evaluate(e=>getComputedStyle(e).width),'14px');
  await subscription.getByRole('textbox',{name:'关键词订阅',exact:true}).fill('订阅草稿');await manual.focus();await page.keyboard.press('ArrowRight');assert.equal(await ai.getAttribute('aria-selected'),'true');assert.equal(await ai.evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(255, 255, 255)');
  await page.keyboard.press('Home');assert.equal(await subscription.getByRole('textbox',{name:'关键词订阅',exact:true}).inputValue(),'订阅草稿');await subscription.screenshot({path:path.join(output,`subscription-${mode}-${width}.png`)});await page.keyboard.press('Escape');await subscription.waitFor({state:'hidden'});
  results.push({mode,width,subscription:'32px segmented control, AI icon, keyboard and draft retained'});
  const open=async(index=0)=>{await page.locator('.pn-ai-card').nth(index).click();await page.locator('dialog.pn-article-detail').waitFor();};
  await open();const dialog=page.locator('dialog.pn-article-detail'),group=dialog.getByRole('group',{name:'资讯偏好'});
  const interested=group.getByRole('button',{name:'感兴趣',exact:true}),less=group.getByRole('button',{name:'减少此类内容',exact:true});
  assert.equal(await dialog.getByText('示例资讯',{exact:true}).count(),0);assert.equal(await interested.getAttribute('aria-pressed'),'false');assert.equal(await less.getAttribute('aria-pressed'),'false');
  const mask=async button=>decodeURIComponent(await button.locator('.pn-feedback-icon').evaluate(e=>getComputedStyle(e).maskImage));
  assert.match(await mask(interested),/icon\/点赞<\/title>|34ea38113a5f13b7/);assert.match(await mask(less),/icon\/踩<\/title>|79103c7c42caf873/);
  await interested.focus();await page.keyboard.press('Enter');assert.equal(await interested.getAttribute('aria-pressed'),'true');assert.match(await mask(interested),/icon\/点赞已选<\/title>|698e003d9e5e375b/);
  await less.click();assert.equal(await interested.getAttribute('aria-pressed'),'false');assert.equal(await less.getAttribute('aria-pressed'),'true');assert.match(await mask(less),/icon\/踩已选<\/title>|eb119e7053af95bb/);
  assert(await dialog.evaluate(e=>e.scrollWidth<=e.clientWidth));assert(await group.evaluate(e=>e.scrollWidth<=e.clientWidth));
  assert.equal(await interested.evaluate(e=>getComputedStyle(e).height),'32px');
  await dialog.screenshot({path:path.join(output,`article-${mode}-${width}.png`)});
  await page.keyboard.press('Escape');await open(1);assert.equal(await less.getAttribute('aria-pressed'),'false');await page.keyboard.press('Escape');await open();assert.equal(await less.getAttribute('aria-pressed'),'true');
  await page.reload({waitUntil:'networkidle'});await open();assert.equal(await less.getAttribute('aria-pressed'),'true');await less.click();assert.equal(await less.getAttribute('aria-pressed'),'false');
  await page.reload({waitUntil:'networkidle'});await open();assert.equal(await less.getAttribute('aria-pressed'),'false');
  assert.equal(await dialog.locator('.gx-dialog-body').evaluate(e=>getComputedStyle(e).paddingBottom),'30px');
  results.push({mode,width,articleFeedback:'library icons, keyboard, mutually exclusive, per article, reload and undo',overflow:'none'});console.log('PASS '+mode+' '+width);
 }
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:1080});await page.goto(base+'?view=design-system',{waitUntil:'networkidle'});assert.equal(await page.locator('#overview,.spec-hero,.spec-metrics').count(),0);assert.equal(await page.locator('.spec-section').count(),6);assert.equal(await page.locator('.spec-section').first().getAttribute('id'),'foundations');assert.equal(await page.locator('#foundations .spec-section-title>span').innerText(),'01');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(output,`foundations-${width}.png`)});
  await page.goto(base+'?view=design-system#overview',{waitUntil:'networkidle'});await page.waitForURL('**#foundations');const mobile=page.getByRole('button',{name:'规范目录',exact:true});if(await mobile.isVisible())await mobile.click();
  const nav=page.getByRole('navigation',{name:'规范目录'});assert.equal(await nav.locator('.spec-nav-item>a').count(),6);await nav.getByRole('link',{name:'02 组件规范全览',exact:true}).click();assert.equal(await page.locator('.spec-sidebar .cr-list button').count(),59);results.push({width,overview:'removed, six numbered sections and old anchor redirected',catalogue:59});
 }
 await page.setViewportSize({width:1440,height:1080});await page.goto(base+'?view=design-system#library',{waitUntil:'networkidle'});
 await page.getByRole('textbox',{name:'搜索组件规范',exact:true}).fill('DatePicker');assert.equal(await page.locator('.cr-detail').count(),1);
 const pending=page.waitForEvent('download');await page.getByRole('link',{name:'下载完整规范',exact:true}).click();const download=await pending;
 assert.equal(download.suggestedFilename(),'广智新完整设计规范-v3.6.0.md');const file=path.join(output,'full-spec.md');await download.saveAs(file);const text=await fs.readFile(file,'utf8');
 assert.deepEqual([...text.matchAll(/^## (.+)$/gm)].map(match=>match[1]),['01 基础样式','02 组件规范全览','03 状态与交互']);assert.equal([...text.matchAll(/^#### /gm)].length,59);
 assert.equal(text,await fs.readFile(path.resolve('public/design-system-components.md'),'utf8'));for(const value of ['#F9F9F9','90px','50%','12px','26px','18/28','--gx-radius-feedback','260×32px','15分钟'])assert(text.includes(value),value);
 await page.goto(base+'?view=design-system#foundations',{waitUntil:'networkidle'});assert.equal(await page.locator('.spec-swatch').count(),20);assert(await page.locator('.spec-radii').innerText().then(text=>text.includes('12px')));
 results.push({download:'actual downloaded Markdown equals generated source',modules:3,components:59,foundations:'current tokens and online values retained'});
 assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:results.length,results},null,2));
}finally{await fs.writeFile(path.join(output,'verification.json'),JSON.stringify({date:new Date().toISOString(),results,errors},null,2));await browser.close();}
