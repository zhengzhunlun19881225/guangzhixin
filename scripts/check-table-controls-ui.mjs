import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const page=await browser.newPage({viewport:{width:1440,height:1080},reducedMotion:'reduce'}),results=[];
const base=process.env.BASE_URL||'http://127.0.0.1:5196/',output=path.resolve('output/playwright/final-controls');await fs.mkdir(output,{recursive:true});
page.setDefaultTimeout(8000);
const css=(node,key)=>node.evaluate((e,k)=>getComputedStyle(e)[k],key);
try{
 for(const mode of ['original','spec'])for(const width of [1440,390])for(const [view,nav] of [['?view=design-system&component=pagination#library','.cr-detail[data-component=pagination] .gx-pagination'],['?view=knowledge&section=files','.gx-pagination'],['?view=drive','.gx-pagination'],['?view=todos','.todo-pagination'],['?view=portal','.pn-more-surface .gx-pagination']]){
  console.log('Checking '+mode+' '+width+' '+view);await page.setViewportSize({width,height:1080});await page.goto(base+view,{waitUntil:'networkidle'});await page.evaluate(mode=>document.documentElement.dataset.uiMode=mode,mode);
  if(view==='?view=portal')await page.locator('.pn-ai-news').getByRole('button',{name:'更多',exact:true}).click();
  const field=page.locator(nav).getByRole('combobox');assert.equal((await field.boundingBox()).width,90);await field.click();const list=page.getByRole('listbox');await list.waitFor();await page.waitForFunction(()=>{const field=document.querySelector('[role=combobox][aria-expanded=true]'),list=document.querySelector('[role=listbox]');return list&&field&&Math.abs(list.getBoundingClientRect().width-field.getBoundingClientRect().width)<1;});assert.equal((await list.boundingBox()).width,90);await list.getByRole('option',{name:'50/页',exact:true}).click();assert.equal(await field.innerText(),'50/页');
  results.push({mode,width,view,paginationWidth:90,menuWidth:90,changeSize:'passed'});
 }
 await page.setViewportSize({width:1440,height:1080});
 for(const mode of ['original','spec']){
  for(const view of ['?view=knowledge&section=files','?view=drive','?view=todos','?view=portal&section=data','?view=design-system&component=table#library']){
   await page.goto(base+view,{waitUntil:'networkidle'});await page.evaluate(mode=>document.documentElement.dataset.uiMode=mode,mode);
   const headers=page.locator('table:not([role=grid])>thead>tr>th');assert(await headers.count()>0);for(const th of await headers.all())assert.equal(await css(th,'backgroundColor'),'rgb(249, 249, 249)');results.push({mode,view,tableHeaders:'#F9F9F9'});
  }
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:1080});await page.goto(base+'?view=design-system&component=radio#library',{waitUntil:'networkidle'});await page.evaluate(mode=>document.documentElement.dataset.uiMode=mode,mode);
   const root=page.locator('.cr-detail[data-component=radio]'),choices=root.locator('.rp-choice-box:not([data-disabled=true])'),selected=root.locator('.rp-choice-box[data-selected=true]:not([data-disabled=true])'),disabled=root.locator('.rp-choice-box[data-disabled=true]').first();const disabledBorder=await css(disabled,'borderTopColor');
   assert.match(await css(selected,'borderTopColor'),/0\.5/);assert.equal(await css(selected.locator('.rp-radio'),'backgroundColor'),'rgb(255, 0, 0)');await choices.nth(1).click();assert.equal(await choices.nth(1).getAttribute('data-selected'),'true');assert.match(await css(selected,'borderTopColor'),/0\.5/);await selected.hover();assert.match(await css(selected,'borderTopColor'),/0\.5/);await choices.nth(1).getByRole('radio').focus();await page.keyboard.press('ArrowLeft');assert.equal(await choices.first().getAttribute('data-selected'),'true');assert.equal(await css(disabled,'borderTopColor'),disabledBorder);await root.locator('.cr-preview').screenshot({path:output+`/radio-${mode}-${width}.png`});results.push({mode,width,radioBorder:'theme / 50%',keyboard:'passed',disabled:'unchanged'});
  }
  await page.setViewportSize({width:1440,height:1080});
  await page.goto(base+'?view=design-system&component=checkbox#library',{waitUntil:'networkidle'});await page.evaluate(mode=>document.documentElement.dataset.uiMode=mode,mode);const option=page.locator('.cr-detail[data-component=checkbox] .rp-choice-box[data-selected=true][data-disabled=false]');assert.match(await css(option,'borderTopColor'),/0\.5/);assert.equal(await css(option.locator('.rp-checkbox'),'backgroundColor'),'rgb(255, 0, 0)');await option.click();assert.equal(await option.count(),0);await page.locator('.cr-detail[data-component=checkbox] .rp-choice-box').first().click();assert.match(await css(option,'borderTopColor'),/0\.5/);await page.locator('.cr-detail[data-component=checkbox] .cr-preview').screenshot({path:output+`/checkbox-${mode}.png`});
  await page.goto(base+'?view=portal',{waitUntil:'networkidle'});await page.evaluate(mode=>document.documentElement.dataset.uiMode=mode,mode);await page.locator('.pn-ai-news').getByRole('button',{name:'订阅',exact:true}).click();const dialog=page.locator('.ns-dialog');for(const label of await dialog.locator('.ns-options label.is-selected').all())assert.match(await css(label,'borderTopColor'),/0\.5/);assert.equal(await css(dialog.locator('.ns-options').first(),'gap'),'12px');await dialog.getByRole('button',{name:'保存',exact:true}).click();await dialog.waitFor({state:'hidden'});await page.locator('.pn-subscription-notice').waitFor();results.push({mode,checkboxBorder:'theme / 50%',subscriptionSpacing:12,save:'passed'});
 }
 console.log(JSON.stringify({passed:results.length,results},null,2));
}finally{await fs.writeFile(output+'/verification.json',JSON.stringify({date:new Date().toISOString(),results},null,2));await browser.close();}
