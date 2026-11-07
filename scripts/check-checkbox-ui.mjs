import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const out=path.resolve('output/playwright/checkboxes');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const page=await browser.newPage({viewport:{width:1440,height:1080},reducedMotion:'reduce'});
const base=process.env.BASE_URL || 'http://127.0.0.1:5196/',errors=[],results=[];page.on('pageerror',e=>errors.push(e.message));
const style=(el,k)=>el.evaluate((e,k)=>getComputedStyle(e)[k],k);
const red='rgb(255, 0, 0)';
async function shape(el){assert.equal(await style(el,'borderRadius'),'4px');assert.equal(await style(el,'width'),'14px');assert.equal(await style(el,'height'),'14px');assert.equal(await style(el,'appearance'),'none');}
try{
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:1080});await page.goto(base+'?view=design-system&component=checkbox#library',{waitUntil:'networkidle'});
  const preview=page.locator('.cr-detail[data-component=checkbox] .cr-preview');
  const transfer=page.locator('.cr-detail[data-component=transfer] input[type=checkbox]').first();
  await transfer.check();
  const mark=el=>el.evaluate(e=>{const s=getComputedStyle(e,'::before');return {width:s.width,height:s.height,clipPath:s.clipPath};});
  const reference=await mark(transfer);
  assert.equal(reference.width,'10px');assert.equal(reference.height,'10px');
  for(const choice of await preview.locator('.rp-choice').all()){
   const glyph=choice.locator('.rp-checkbox');assert.equal(await style(glyph,'borderRadius'),'4px');
   if(await choice.getAttribute('data-mixed')==='true')assert.deepEqual(await mark(glyph),{width:'8px',height:'2px',clipPath:'none'});
   else assert.deepEqual(await mark(glyph),reference);
   if(await choice.getAttribute('data-selected')==='true'&&await choice.getAttribute('data-disabled')==='false')assert.equal(await style(glyph,'backgroundColor'),red);
  }
  const basic=preview.locator('.rp-choice').first();await basic.click();assert.equal(await style(basic.locator('.rp-checkbox'),'backgroundColor'),red);
  await basic.locator('input').focus();await basic.locator('input').press('Space');assert(!(await basic.locator('input').isChecked()));assert.equal(await style(basic.locator('.rp-checkbox'),'outlineWidth'),'2px');
  await preview.screenshot({path:path.join(out,`reference-${width}.png`)});
  const radio=page.locator('.cr-detail[data-component=radio] .rp-radio').first();assert.equal(await style(radio,'borderRadius'),'50%');
  const toggle=page.locator('.rp-switch-track').first();assert.equal(await style(toggle,'width'),'40px');assert.equal(await style(toggle,'borderRadius'),'999px');
  results.push(`规范${width}px：4px全状态、主题红、Space、焦点；Radio/Switch不变`);
 }
 await page.setViewportSize({width:1440,height:1080});
 for(const mode of ['original','spec']){
  await page.evaluate(mode=>localStorage.setItem('guangxin-ui-mode',mode),mode);
  for(const [query,table] of [['?view=knowledge&section=files','.kb-files'],['?view=drive','.drive-table'],['?view=design-system&component=table#library','.ss-drive .drive-table']]){
   await page.goto(base+query,{waitUntil:'networkidle'});const root=page.locator(table);const item=root.locator('tbody input[type=checkbox]').first(),all=root.locator('thead input[type=checkbox]');
   await shape(item);await item.check();await shape(item);assert.equal(await style(item,'backgroundColor'),red);
   assert(await all.evaluate(e=>e.indeterminate));await shape(all);assert.equal(await style(all,'backgroundColor'),red);assert.equal(await all.evaluate(e=>getComputedStyle(e,'::before').height),'2px');
   await all.check();assert(await all.isChecked());await shape(all);await all.focus();await all.press('Space');assert(!(await all.isChecked()));assert.equal(await style(all,'outlineWidth'),'2px');
   await item.evaluate(e=>{e.disabled=true;e.checked=true;});await shape(item);assert.equal(await style(item,'backgroundColor'),'rgb(235, 238, 245)');await item.hover();assert.equal(await style(item,'backgroundColor'),'rgb(235, 238, 245)');await item.evaluate(e=>{e.disabled=false;e.checked=false;});
   await root.screenshot({path:path.join(out,`${mode}-${table.includes('kb')?'knowledge':table.includes('ss-')?'spec-table':'drive'}.png`)});
   results.push(`${mode} ${query}：未选/已选/半选/禁用均4px，主题红及键盘切换`);
  }
  await page.goto(base+'?view=portal',{waitUntil:'networkidle'});await page.locator('.pn-ai-news').getByRole('button',{name:'订阅',exact:true}).click();const dialog=page.locator('.ns-dialog');const item=dialog.getByRole('checkbox',{name:'人工智能',exact:true});
  await shape(item);assert.equal(await style(item,'backgroundColor'),red);await item.focus();await item.press('Space');assert(!(await item.isChecked()));await item.press('Space');assert(await item.isChecked());await shape(item);await dialog.screenshot({path:path.join(out,`${mode}-subscription.png`)});await page.keyboard.press('Escape');results.push(`${mode} 订阅弹窗：4px主题红与Space切换`);
 }
 assert.deepEqual(errors,[]);await fs.writeFile(path.join(out,'verification.json'),JSON.stringify({results,errors},null,2));console.log(`${results.length} checkbox checks passed`);
}finally{await browser.close();}
