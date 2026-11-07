import { unlockPreview } from './preview-access.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.BASE_URL || 'http://127.0.0.1:5196/';
const output = path.resolve('output/news-subscription'); await fs.mkdir(output,{recursive:true});
const browser = await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
const context = await browser.newContext({viewport:{width:1920,height:1080},reducedMotion:'reduce'});
const page = await context.newPage(); page.setDefaultTimeout(8000); const errors=[]; const results=[];
page.on('pageerror',error=>errors.push(error.message));
const key='gx-news-subscription-v1';const dialog=page.locator('.ns-dialog');
const ai=page.locator('.pn-ai-news');
const trigger=()=>ai.getByRole('button',{name:'订阅',exact:true});
const button=name=>dialog.getByRole('button',{name,exact:true});
const read=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
const style=(el,key)=>el.evaluate((e,k)=>getComputedStyle(e)[k],key);
const check=async(name,run)=>{try{await run();results.push({name,status:'passed'});console.log('PASS '+name);}catch(e){results.push({name,status:'failed',error:e.message});console.error('FAIL '+name+': '+e.message);throw e;}};
try{
 await page.goto(base+'?view=portal',{waitUntil:'networkidle'});await unlockPreview(page);
 await check('字号、工具栏及提醒内容适配',async()=>{
  for(const width of [1920,1600,1440,1280]){
   await page.setViewportSize({width,height:1080});
   for(const tab of await page.locator('.pn-tabs button').all()){assert.equal(await style(tab,'fontSize'),'16px');assert.equal(await style(tab,'lineHeight'),'24px');}
   for(const [selector,size]of [['.pn-card-copy p','12px'],['.pn-alert p','14px']])for(const el of await page.locator(selector).all()){assert.equal(await style(el,'fontSize'),size);assert.equal(await style(el,'lineHeight'),'22px');}
   for(const sel of ['.pn-ai-news','.pn-group-news']){const panel=page.locator(sel);const bounds=await panel.boundingBox();const tools=await panel.locator('.pn-section-tools').boundingBox();const tabs=await panel.locator('.pn-tabs').boundingBox();assert(tools.x+tools.width<=bounds.x+bounds.width);assert(tabs.x+tabs.width<=bounds.x+bounds.width);assert(tabs.y>=tools.y+tools.height||tabs.x+tabs.width<=tools.x);}
   for(const card of await page.locator('.pn-ai-card,.pn-alert').all()){assert(await card.evaluate(e=>e.scrollHeight<=e.clientHeight+2));}
   await page.screenshot({path:path.join(output,`portal-${width}.png`)});
  }
 });
 await page.setViewportSize({width:1920,height:1080});
 await check('手动订阅默认、取消及键盘焦点',async()=>{
  await trigger().click();assert(await dialog.isVisible());assert.equal(await dialog.getByRole('tab',{name:'手动订阅'}).getAttribute('aria-selected'),'true');assert(await dialog.getByRole('checkbox',{name:'人工智能',exact:true}).isChecked());
  await dialog.getByLabel('关键词订阅',{exact:true}).fill('不应保存');await button('取消').click();assert.equal(await read(),null);assert(await trigger().evaluate(e=>e===document.activeElement));
  await trigger().click();assert.equal(await dialog.getByLabel('关键词订阅',{exact:true}).inputValue(),'广新集团, AIGC');await page.keyboard.press('Escape');assert(!(await dialog.isVisible()));
 });
 await check('必选错误定位与高级字段菜单',async()=>{
  await trigger().click();for(const option of await dialog.locator('[data-choice="industries"] input').all())await option.uncheck();await button('保存').click();assert((await dialog.getByRole('alert').innerText()).includes('行业'));await page.waitForFunction(()=>document.activeElement===document.querySelector('[data-choice="industries"] input'));
  await dialog.getByRole('checkbox',{name:'人工智能',exact:true}).check();await button('高级设置：来源、屏蔽与提醒').click();
  const combo=dialog.getByRole('combobox',{name:'更新频率',exact:true});await combo.click();await combo.press('ArrowDown');await combo.press('Enter');assert.equal(await combo.innerText(),'每周更新');
  await combo.click();await combo.press('Escape');assert(await dialog.isVisible());assert.equal(await combo.getAttribute('aria-expanded'),'false');await button('恢复默认').click();
  await dialog.locator('.ns-content').evaluate(e=>e.scrollTop=0);await page.screenshot({path:path.join(output,'manual-top.png')});await dialog.locator('.ns-content').evaluate(e=>e.scrollTop=e.scrollHeight);await page.screenshot({path:path.join(output,'manual-advanced.png')});
 });
 await check('本地保存、筛选、刷新恢复',async()=>{
  await dialog.getByLabel('关键词订阅',{exact:true}).fill('');await dialog.getByLabel('与我有关',{exact:true}).fill('供应链');await dialog.getByLabel('屏蔽关键词',{exact:true}).fill('智慧园区');
  await button('保存').click();assert.equal((await read()).related,'供应链');assert.equal(await ai.getByRole('tab',{name:'我关注的'}).getAttribute('aria-selected'),'true');const titles=await ai.locator('.pn-ai-card h4').allInnerTexts();assert(titles.length>0&&titles.length<12);assert(titles.every(t=>!t.includes('智慧园区')));
  await ai.getByRole('tab',{name:'与我有关'}).click();assert((await ai.locator('.pn-ai-card').count())>0);
  await page.reload({waitUntil:'networkidle'});await trigger().click();assert.equal(await dialog.getByLabel('关键词订阅',{exact:true}).inputValue(),'');await button('高级设置：来源、屏蔽与提醒').click();assert.equal(await dialog.getByLabel('与我有关',{exact:true}).inputValue(),'供应链');await button('取消').click();
 });
 await check('恢复默认仅更改草稿',async()=>{
  const before=await read();await trigger().click();await button('恢复默认').click();assert.equal(await dialog.getByLabel('关键词订阅',{exact:true}).inputValue(),'广新集团, AIGC');await button('取消').click();assert.deepEqual(await read(),before);
 });
 await check('AI 空值、未知输入、生成及编辑',async()=>{
  await trigger().click();const manual=dialog.getByRole('tab',{name:'手动订阅'});await manual.focus();await manual.press('ArrowRight');assert.equal(await dialog.getByRole('tab',{name:'AI 订阅'}).getAttribute('aria-selected'),'true');assert(await button('生成订阅条件').isDisabled());assert(await button('保存').isDisabled());
  await dialog.getByLabel('订阅需求',{exact:true}).fill('随便看看');await button('生成订阅条件').click();assert((await dialog.getByRole('alert').innerText()).includes('未识别'));
  await button('每周关注广东新材料政策，只看政府网站，排除娱乐').click();await page.screenshot({path:path.join(output,'ai-input.png')});await button('生成订阅条件').click();assert((await dialog.locator('.ns-result').innerText()).includes('新材料'));assert(!(await button('保存').isDisabled()));await page.screenshot({path:path.join(output,'ai-generated.png')});
  await dialog.getByLabel('订阅需求',{exact:true}).fill('关注人工智能，每天更新');assert(await button('保存').isDisabled());await button('生成订阅条件').click();await button('编辑条件').click();assert(await dialog.getByRole('checkbox',{name:'人工智能',exact:true}).isChecked());assert.equal(await dialog.getByRole('combobox',{name:'更新频率'}).innerText(),'每日更新');await button('取消').click();
 });
 await check('AI参考布局、主题色、内置计数与两种模式多尺寸适配',async()=>{
  for(const mode of ['original','spec'])for(const [width,height]of [[1920,1080],[1440,900],[1280,600],[390,844]]){
   await page.evaluate(mode=>localStorage.setItem('guangxin-ui-mode',mode),mode);await page.setViewportSize({width,height});await page.reload({waitUntil:'networkidle'});await trigger().click();await dialog.getByRole('tab',{name:'AI 订阅'}).click();
   const input=dialog.getByLabel('订阅需求',{exact:true}),heading=dialog.locator('.ns-ai-heading'),counter=dialog.locator('.ns-counter'),generate=button('生成订阅条件');assert.equal(await style(heading,'fontSize'),'16px');assert.equal(await heading.locator('svg').count(),1);assert.equal(await input.getAttribute('maxlength'),'500');assert(await generate.isDisabled());assert.equal(await counter.innerText(),'0 / 500');
   await input.fill('人'.repeat(510));assert.equal((await input.inputValue()).length,500);assert.equal(await counter.innerText(),'500 / 500');await button('关注人工智能、制造业和国产算力，每天更新').click();assert.equal(await counter.innerText(),`${(await input.inputValue()).length} / 500`);assert.equal(await style(generate,'backgroundColor'),'rgb(255, 0, 0)');assert.equal(await style(generate,'height'),mode==='spec'?'36px':'32px');
   const field=await input.boundingBox(),count=await counter.boundingBox();assert(count.x>=field.x&&count.y>=field.y&&count.x+count.width<=field.x+field.width&&count.y+count.height<=field.y+field.height);
   const examples=await dialog.locator('.ns-examples button').all();const genBox=await generate.boundingBox();if(width>600){for(const example of examples){const b=await example.boundingBox();assert(Math.abs(b.y+b.height/2-genBox.y-genBox.height/2)<2,'示例短语和生成按钮应在同一行');}}else{const b=await examples.at(-1).boundingBox();assert(genBox.y>=b.y+b.height);}
   assert(await dialog.evaluate(e=>e.scrollWidth<=e.clientWidth));await generate.scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,`ai-layout-${mode}-${width}.png`)});await button('取消').click();
  }
  await page.evaluate(()=>localStorage.setItem('guangxin-ui-mode','original'));await page.setViewportSize({width:1920,height:1080});await page.reload({waitUntil:'networkidle'});
 });
 await check('AI 保存匹配、空结果、默认恢复生效',async()=>{
  await trigger().click();await dialog.getByRole('tab',{name:'AI 订阅'}).click();await button('每周关注广东新材料政策，只看政府网站，排除娱乐').click();await button('生成订阅条件').click();await button('保存').click();const saved=await read();assert.deepEqual(saved.industries,['新材料']);assert.deepEqual(saved.regions,['广东']);assert.deepEqual(saved.sources,['政府网站']);assert.deepEqual(saved.contentTypes,['政策解读']);assert.equal(saved.blockedKeywords,'娱乐');assert.equal(saved.frequency,'每周更新');await ai.getByText('暂无匹配资讯').waitFor();
  await trigger().click();await button('恢复默认').click();await button('保存').click();assert.equal((await read()).keywords,'广新集团, AIGC');assert(await ai.locator('.pn-ai-card').count()>0);
 });
 await check('存储失败保留草稿并可重试',async()=>{
  await trigger().click();await dialog.getByLabel('关键词订阅',{exact:true}).fill('失败草稿');await page.evaluate(()=>{window.originalSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('test','QuotaExceededError');};});await button('保存').click();assert((await dialog.getByRole('alert').innerText()).includes('未保存'));assert.equal(await dialog.getByLabel('关键词订阅',{exact:true}).inputValue(),'失败草稿');await page.evaluate(()=>{Storage.prototype.setItem=window.originalSetItem;});await button('保存').click();assert.equal((await read()).keywords,'失败草稿');
 });
 await check('弹窗适配、固定操作栏、焦点限制',async()=>{
  await trigger().click();await button('高级设置：来源、屏蔽与提醒').click();
  for(const width of [1920,1440,1280,390]){await page.setViewportSize({width,height:900});const b=await dialog.boundingBox();assert(b.x>=0&&b.x+b.width<=width);assert(await dialog.evaluate(e=>e.scrollWidth<=e.clientWidth));await dialog.locator('.ns-content').evaluate(e=>e.scrollTop=e.scrollHeight);const footer=await dialog.locator('.ns-footer').boundingBox();assert(footer.y+footer.height<=900);await page.screenshot({path:path.join(output,`dialog-${width}.png`)});}
  await button('保存').focus();await page.keyboard.press('Tab');assert(await dialog.evaluate(e=>e.contains(document.activeElement)));await page.keyboard.press('Escape');assert(await trigger().evaluate(e=>e===document.activeElement));
 });
 await check('损坏存储回退、浏览器运行正常',async()=>{
  await page.evaluate(key=>localStorage.setItem(key,'{"industries":"bad"}'),key);await page.setViewportSize({width:1920,height:1080});await page.reload({waitUntil:'networkidle'});await trigger().click();assert(await dialog.getByRole('checkbox',{name:'人工智能',exact:true}).isChecked());await button('取消').click();assert.deepEqual(errors,[]);
 });
}finally{await fs.writeFile(path.join(output,'report.json'),JSON.stringify({results,errors},null,2));await browser.close();}
if(results.some(r=>r.status==='failed'))process.exitCode=1;
