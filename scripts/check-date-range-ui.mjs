import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.BASE_URL||'http://127.0.0.1:5196/';
const out=path.resolve('output/playwright/date-range');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
page.setDefaultTimeout(8000);
const preview=page.locator('.cr-detail[data-component=datetime] .cr-preview'),popup=page.locator('.drp-popover'),trigger=preview.getByRole('button',{name:'选择日期范围'}),time=preview.getByRole('combobox',{name:'开始时间'}),results=[],errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
const date=(value)=>popup.locator(`button[data-date="${value}"]:not(:disabled)`);
const css=(el,key)=>el.evaluate((e,k)=>getComputedStyle(e)[k],key);
async function go(){await page.goto(`${base}?view=design-system&component=datetime#library`,{waitUntil:'networkidle'});}
async function monthIndex(){const text=await popup.locator('h4').first().innerText();const n=text.match(/\d+/g).map(Number);return n[0]*12+n[1]-1;}
async function navigate(year,month){const target=year*12+month-1;let current=await monthIndex();while(Math.abs(target-current)>=12){await popup.getByRole('button',{name:target>current?'下一年':'上一年',exact:true}).click();current=await monthIndex();}while(current!==target){await popup.getByRole('button',{name:target>current?'下个月':'上个月',exact:true}).click();current=await monthIndex();}}
async function check(name,fn){try{await fn();results.push({name,status:'passed'});console.log(`PASS ${name}`);}catch(e){results.push({name,status:'failed',error:e.message});console.error(`FAIL ${name}: ${e.message}`);}}
try{
 await check('Two consecutive six-week months, Sunday-first and system styling',async()=>{
  await go();assert.equal(await preview.locator('input[type=date]').count(),0);await trigger.click();await navigate(2026,11);
  assert.equal(await popup.getByRole('grid').count(),2);assert.deepEqual(await popup.locator('h4').allTextContents(),['2026 年 11 月','2026 年 12 月']);assert.equal(await popup.locator('td').count(),84);assert.deepEqual((await popup.locator('th').allTextContents()).slice(0,7),['日','一','二','三','四','五','六']);
  assert.equal((await popup.boundingBox()).width,704);assert.equal(await css(popup,'borderRadius'),'8px');assert.equal(await css(popup,'backgroundColor'),'rgb(255, 255, 255)');assert(await popup.evaluate(e=>e.scrollWidth<=e.clientWidth));for(const table of await popup.getByRole('grid').all())assert((await table.boundingBox()).width<350);
  assert.equal(await css(popup,'scrollbarWidth'),'none');assert(await popup.evaluate(e=>e.scrollHeight<=e.clientHeight+1));
  await popup.screenshot({path:path.join(out,'calendar-empty-desktop.png')});
 });
 await check('Cross-month range, hover preview, inclusive highlight and focus return',async()=>{
  await date('2026-11-05').click();await date('2026-12-23').hover();assert.equal(await popup.locator('td[data-range=true]').count(),49);
  await popup.screenshot({path:path.join(out,'calendar-range-preview.png')});await date('2026-12-23').click();assert.equal(await popup.count(),0);assert(await trigger.evaluate(e=>e===document.activeElement));assert((await trigger.innerText()).includes('2026-11-05'));
  await trigger.click();assert.equal(await popup.locator('button[data-endpoint=true]').count(),2);assert.equal(await css(date('2026-11-05').locator('span'),'backgroundColor'),'rgb(255, 0, 0)');assert.equal(await css(date('2026-11-06'),'backgroundColor'),'rgb(255, 241, 242)');await popup.screenshot({path:path.join(out,'calendar-selected-desktop.png')});
 });
 await check('Cancel/Escape/outside discard partial draft and restore saved range',async()=>{
  await date('2026-11-10').click();await popup.getByRole('button',{name:'取消',exact:true}).click();assert((await trigger.innerText()).includes('2026-11-05'));await trigger.click();await date('2026-11-12').click();await page.keyboard.press('Escape');assert((await trigger.innerText()).includes('2026-12-23'));assert(await trigger.evaluate(e=>e===document.activeElement));await trigger.click();await date('2026-11-13').click();await preview.getByText('开始时间',{exact:true}).first().click();assert.equal(await popup.count(),0);assert((await trigger.innerText()).includes('2026-11-05'));
 });
 await check('Earlier second click restarts range; single-day and clear preserve time',async()=>{
  await trigger.click();await date('2026-11-10').click();await date('2026-11-05').click();assert.equal(await popup.count(),1);await date('2026-11-08').click();assert((await trigger.innerText()).includes('2026-11-08'));await trigger.click();await date('2026-11-07').click();await date('2026-11-07').click();assert.equal((await trigger.innerText()).match(/2026-11-07/g).length,2);
  await time.click();await page.getByRole('option',{name:'09:30',exact:true}).click();await preview.getByRole('button',{name:'清空日期范围'}).click();assert((await trigger.innerText()).includes('开始日期'));assert.equal(await time.innerText(),'09:30');await trigger.click();assert(await popup.getByRole('button',{name:'清空',exact:true}).isDisabled());await page.keyboard.press('Escape');
 });
 await check('Year/month navigation, leap day and December-to-January adjacency',async()=>{
  await trigger.click();await navigate(2026,12);assert.deepEqual(await popup.locator('h4').allTextContents(),['2026 年 12 月','2027 年 1 月']);await popup.getByRole('button',{name:'下个月',exact:true}).click();assert.equal(await monthIndex(),2027*12);await popup.getByRole('button',{name:'上个月',exact:true}).click();await navigate(2028,2);assert.equal(await date('2028-02-29').count(),1);await date('2028-02-29').click();await date('2028-03-01').click();await trigger.click();assert((await trigger.innerText()).includes('2028-02-29'));await navigate(2027,2);assert.equal(await popup.locator('button[data-date="2027-02-29"]').count(),0);await page.keyboard.press('Escape');
 });
 await check('Date keyboard movement, month clamping, selection and Escape',async()=>{
  await trigger.focus();await page.keyboard.press('ArrowDown');await date('2028-02-29').focus();await page.keyboard.press('PageDown');assert.equal(await page.evaluate(()=>document.activeElement.dataset.date),'2028-03-29');await page.keyboard.press('Shift+PageUp');assert.equal(await page.evaluate(()=>document.activeElement.dataset.date),'2027-03-29');await page.keyboard.press('Home');assert.equal(await page.evaluate(()=>document.activeElement.dataset.date),'2027-03-28');await page.keyboard.press('End');assert.equal(await page.evaluate(()=>document.activeElement.dataset.date),'2027-04-03');await page.keyboard.press('Enter');await page.keyboard.press('ArrowRight');await page.keyboard.press('Enter');assert.equal(await popup.count(),0);assert((await trigger.innerText()).includes('2027-04-04'));assert(await trigger.evaluate(e=>e===document.activeElement));
 });
 await check('390px stacked months, viewport bounds and scrolling end selection',async()=>{
  await page.setViewportSize({width:390,height:844});await go();await trigger.click();await navigate(2026,11);const rect=await popup.boundingBox();assert(rect.x>=11&&rect.x+rect.width<=379&&rect.y>=11&&rect.y+rect.height<=833);
  const months=await popup.locator('.drp-month').all();const first=await months[0].boundingBox(),second=await months[1].boundingBox();assert(Math.abs(first.x-second.x)<=1&&second.y>first.y);assert(await popup.evaluate(e=>e.scrollWidth<=e.clientWidth));await date('2026-11-05').click();await date('2026-12-23').click();assert.equal(await popup.count(),0);await trigger.click();await popup.screenshot({path:path.join(out,'calendar-mobile.png')});await popup.getByRole('button',{name:'取消',exact:true}).click();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 });
 await check('Time list matches date width; selection, keyboard, cancel and clear',async()=>{
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:844});await go();
   assert.equal((await time.boundingBox()).width,(await preview.locator('.drp-field').boundingBox()).width);
   await time.click();const list=page.getByRole('listbox',{name:'开始时间'});
   assert.equal(await list.getByRole('option').count(),96);assert.equal((await list.boundingBox()).width,(await time.boundingBox()).width);
   await list.getByRole('option',{name:'08:30',exact:true}).click();assert.equal(await time.innerText(),'08:30');
   await time.press('ArrowDown');await time.press('ArrowDown');await time.press('Escape');assert.equal(await time.innerText(),'08:30');
   await time.press('ArrowDown');await time.press('ArrowDown');await time.press('Enter');assert.equal(await time.innerText(),'08:45');
   await time.click();const selected=list.getByRole('option',{name:'08:45',exact:true});assert.equal(await selected.getAttribute('aria-selected'),'true');assert.equal(await css(selected,'color'),'rgb(255, 0, 0)');
   await page.screenshot({path:path.join(out,`time-list-${width}.png`)});await time.press('End');await time.press('Enter');assert.equal(await time.innerText(),'23:45');
   await preview.getByRole('button',{name:'清空开始时间'}).click();assert.equal(await time.getAttribute('data-placeholder'),'true');assert(await time.evaluate(e=>e===document.activeElement));
   await time.click();await preview.getByText('开始时间',{exact:true}).first().click();assert.equal(await list.count(),0);
  }
 });
 await check('Short viewport calendar has no visible scrollbar and all dates remain reachable',async()=>{
  await page.setViewportSize({width:390,height:480});await go();await trigger.click();await navigate(2026,11);assert.equal(await css(popup,'scrollbarWidth'),'none');
  await date('2026-11-05').click();await date('2026-12-23').click();assert.equal(await popup.count(),0);
 });
 await check('Documentation and no runtime/resource errors',async()=>{const response=await page.request.get(`${base}design-system-components.md`);const text=await response.text();assert(text.includes('双月日历'));assert(text.includes('PageUp/PageDown'));assert.deepEqual(errors,[]);});
}finally{await fs.writeFile(path.join(out,'verification.json'),JSON.stringify({date:new Date().toISOString(),results,errors},null,2));await browser.close();}
if(results.some(r=>r.status!=='passed'))process.exitCode=1;
