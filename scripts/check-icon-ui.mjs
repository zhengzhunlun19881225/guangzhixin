import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const catalog=JSON.parse(await fs.readFile(path.join(root,'src/design/iconCatalog.json'),'utf8'));
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.BASE_URL||'http://127.0.0.1:5196/';
const out=path.join(root,'output/playwright/icon-catalog');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const page=await browser.newPage({viewport:{width:1440,height:1100},reducedMotion:'reduce'});
const results=[],errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
const preview=page.locator('.cr-detail[data-active=true] .cr-preview');const style=(el,k)=>el.evaluate((e,k)=>getComputedStyle(e)[k],k);
async function go(id){await page.goto(`${base}?view=design-system&component=${id}#library`,{waitUntil:'networkidle'});await page.locator(`.cr-detail[data-component="${id}"]`).waitFor();}
async function check(name,fn){try{await fn();results.push({name,status:'passed'});console.log(`PASS ${name}`);}catch(e){results.push({name,status:'failed',error:e.message});console.error(`FAIL ${name}: ${e.message}`);}}
const group=()=>preview.getByRole('group',{name:'图标分类'});
try{
 await check('133 assets load, 119 line / 14 solid, valid masks and default colors',async()=>{
  await go('icon');assert.equal(await preview.locator('.ig-card').count(),133);
  assert.equal(await preview.locator('.ig-card[data-category=line]').count(),119);assert.equal(await preview.locator('.ig-card[data-category=solid]').count(),14);
  const assets=await preview.locator('.ig-glyph img').evaluateAll(async imgs=>{await Promise.all(imgs.map(img=>img.decode()));return imgs.map(img=>({width:img.naturalWidth,height:img.naturalHeight}));});assert.equal(assets.length,133);assert(assets.every(img=>img.width>0&&img.height>0));
  for(const icon of await preview.locator('.ig-monochrome').all()){assert.notEqual(await style(icon,'maskImage'),'none');assert.equal(await style(icon,'width'),'24px');assert.equal(await style(icon,'height'),'24px');}
  assert.equal(await style(preview.locator('.ig-monochrome[data-tone=primary]').first(),'backgroundColor'),'rgb(3, 9, 27)');
  assert.equal(await style(preview.locator('.ig-glyph[data-tone=warning]'),'backgroundColor'),'rgb(255, 125, 0)');
  assert.equal(await style(preview.locator('.ig-glyph[data-tone=info]'),'backgroundColor'),'rgb(0, 109, 255)');
  assert.equal(await preview.locator('.ig-original-color').count(),1);assert.equal(await style(preview.locator('.ig-original-color>img'),'opacity'),'1');
 });
 await check('Classification filters and every merged alias resolve correctly',async()=>{
  await group().getByRole('button',{name:/面性图标/}).click();assert.equal(await preview.locator('.ig-card').count(),14);
  await preview.screenshot({path:path.join(out,'solid-1440.png')});
  await group().getByRole('button',{name:/线性图标/}).click();assert.equal(await preview.locator('.ig-card').count(),119);
  await group().getByRole('button',{name:/全部/}).click();
  const input=preview.getByRole('textbox',{name:'搜索图标'});
  for(const source of catalog.sources.filter(e=>e.status==='duplicate')){await input.fill(source.name);const target=catalog.entries.find(e=>e.sourceIndex===source.canonicalSourceIndex);assert.equal(await preview.locator(`[data-icon-id="${target.id}"]`).count(),1);}
  await input.fill('does-not-exist-000');await preview.getByText('暂无匹配图标',{exact:true}).waitFor();await preview.getByRole('button',{name:'重置图标筛选'}).click();assert.equal(await preview.locator('.ig-card').count(),133);
  await input.fill('对话3');assert.equal(await preview.locator('.ig-card').count(),1);await preview.getByRole('button',{name:'清空搜索图标'}).click();assert(await input.evaluate(e=>e===document.activeElement));
 });
 await check('Size and theme controls preserve semantic colors and gradient',async()=>{
  for(const size of [16,20,24]){await preview.getByRole('group',{name:'图标尺寸'}).getByRole('button',{name:`${size}px`,exact:true}).click();assert(await preview.locator('.ig-glyph').evaluateAll((els,s)=>els.every(e=>e.getBoundingClientRect().width===s&&e.getBoundingClientRect().height===s),size));}
  await preview.getByRole('button',{name:'主题红',exact:true}).click();
  assert.equal(await preview.locator('.ig-glyph[data-tone=primary]').count(),0);assert.equal(await style(preview.locator('.ig-glyph[data-tone=brand]').first(),'backgroundColor'),'rgb(255, 0, 0)');
  assert.equal(await style(preview.locator('.ig-glyph[data-tone=warning]'),'backgroundColor'),'rgb(255, 125, 0)');assert.equal(await style(preview.locator('.ig-original-color>img'),'opacity'),'1');
  await preview.getByRole('textbox',{name:'搜索图标'}).fill('文档');await preview.screenshot({path:path.join(out,'gradient-preserved.png')});
  await preview.getByRole('button',{name:'清空搜索图标'}).click();await preview.getByRole('button',{name:'主文字色',exact:true}).click();
  await preview.getByRole('button',{name:'添加示例条目'}).click();assert((await preview.innerText()).includes('条目数：1'));assert(await preview.getByRole('button',{name:'不可删除的示例'}).isDisabled());
 });
 await check('Tabs use body gray, selected labels and underline stay brand red',async()=>{
  await go('tabs');const tabs=preview.locator('.rp-tabs-line');assert.equal(await style(tabs.locator('[aria-selected=false]').first(),'color'),'rgb(78, 89, 105)');assert.equal(await style(tabs.locator('[aria-selected=true]'),'color'),'rgb(255, 0, 0)');
  assert.equal(await tabs.locator('[aria-selected=true]').evaluate(e=>getComputedStyle(e,'::after').backgroundColor),'rgb(255, 0, 0)');
  await tabs.getByRole('tab',{name:'推荐',exact:true}).focus();await page.keyboard.press('ArrowRight');assert.equal(await tabs.getByRole('tab',{name:'我关注的'}).getAttribute('aria-selected'),'true');assert.equal(await style(tabs.getByRole('tab',{name:'推荐',exact:true}),'color'),'rgb(78, 89, 105)');
  await preview.screenshot({path:path.join(out,'tabs-gray.png')});
 });
 await check('Slider uses success accent and retains step/Home/End behavior',async()=>{
  await go('slider');const slider=preview.getByRole('slider');assert.equal(await style(slider,'accentColor'),'rgb(0, 181, 120)');await slider.focus();await page.keyboard.press('Home');assert.equal(await slider.inputValue(),'0');await page.keyboard.press('ArrowRight');assert.equal(await slider.inputValue(),'5');await page.keyboard.press('End');assert.equal(await slider.inputValue(),'100');await page.keyboard.press('Home');for(let i=0;i<5;i++)await page.keyboard.press('ArrowRight');await slider.blur();await preview.screenshot({path:path.join(out,'slider-success.png')});
 });
 await check('1440/390 layouts and category switching without overflow',async()=>{
  for(const width of [1440,390]){await page.setViewportSize({width,height:1100});for(const id of ['icon','tabs','slider']){await go(id);assert(await page.locator('.cr-detail[data-active=true]').evaluate(e=>e.scrollWidth<=e.clientWidth+1),`${id} ${width}`);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));if(id==='icon'){await page.locator('.cr-detail[data-active=true] .cr-detail-header').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,`icon-overview-${width}.png`)});await group().getByRole('button',{name:/面性图标/}).click();assert.equal(await preview.locator('.ig-card').count(),14);await preview.screenshot({path:path.join(out,`solid-${width}.png`)});}else if(width===390)await preview.screenshot({path:path.join(out,`${id}-390.png`)});}}
 });
 await check('Confirmation warning is 16px; primary sample has no border',async()=>{
  await page.setViewportSize({width:1440,height:1100});await go('dialog');const glyph=preview.locator('.rp-confirm-icon');assert.equal(await style(glyph,'width'),'16px');assert.equal(await style(glyph,'height'),'16px');assert.equal(await style(glyph,'backgroundColor'),'rgb(255, 125, 0)');assert.notEqual(await style(glyph,'maskImage'),'none');await preview.locator('.rp-messagebox').nth(2).screenshot({path:path.join(out,'confirmation-icon-16.png')});
  await preview.getByRole('button',{name:'打开确认消息'}).click();const dialog=page.locator('dialog.rp-messagebox-live');assert.equal(await style(dialog.locator('.rp-confirm-icon'),'width'),'16px');await dialog.getByRole('button',{name:'取消',exact:true}).click();
  await go('button');const primary=preview.getByRole('button',{name:'示例主按钮',exact:true});assert.equal(await style(primary,'borderTopWidth'),'0px');assert.equal(await style(primary,'height'),'32px');await primary.hover();assert.equal(await style(primary,'borderTopWidth'),'0px');await page.mouse.move(0,0);await preview.screenshot({path:path.join(out,'primary-no-border.png')});await primary.focus();assert.notEqual(await style(primary,'outlineStyle'),'none');
 });
 await check('Documentation and browser/resource errors',async()=>{const response=await page.request.get(`${base}design-system-components.md`);assert(response.ok());const text=await response.text();assert(text.includes('133个'));assert(text.includes('成功色#00B578'));assert(text.includes('正文灰#4E5969'));assert.deepEqual(errors,[]);});
}finally{await fs.writeFile(path.join(out,'verification.json'),JSON.stringify({date:new Date().toISOString(),results,errors},null,2));await browser.close();}
if(results.some(r=>r.status!=='passed'))process.exitCode=1;
