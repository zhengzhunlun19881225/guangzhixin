import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base=process.env.BASE_URL || 'http://127.0.0.1:5196/';
const out=path.resolve('output/schedule');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const context=await browser.newContext({viewport:{width:1920,height:1080},timezoneId:'Asia/Shanghai'});
const page=await context.newPage();page.setDefaultTimeout(6000);const errors=[];const passed=[];
page.on('pageerror',e=>errors.push(e.message));
const shot=async name=>{if(await page.locator('.sch-create-dialog').count())await page.locator('#sch-dialog-title').click();await page.mouse.move(0,0);await page.screenshot({path:path.join(out,name+'.png')});};
const dialog=()=>page.locator('.sch-create-dialog');
async function check(name,fn){await fn();passed.push(name);console.log('PASS '+name);}
async function open(kind){await page.getByRole('button',{name:'新增日程',exact:true}).click();await page.getByRole('menuitem',{name:kind}).click();await dialog().waitFor();}
async function choose(label,value){await dialog().getByRole('combobox',{name:label,exact:true}).click();await page.getByRole('option',{name:value,exact:true}).click();}
async function person(label,names){await dialog().getByRole('button',{name:'选择'+label,exact:true}).click();for(const name of names)await dialog().getByRole('option',{name,exact:true}).click();await dialog().getByRole('combobox',{name:'搜索'+label,exact:true}).press('Escape');}
async function calendarItem(date,kind,title){
 await page.getByRole('button',{name:'我的日程更多'}).click();await page.locator('.sc-scroll[aria-busy=false]').waitFor();
 await page.getByRole('tab',{name:'月',exact:true}).click();
 while(!await page.getByRole('button',{name:`查看${date}日程`,exact:true}).count())await page.getByRole('button',{name:date<today?'上一个日期范围':'下一个日期范围',exact:true}).click();
 await page.getByRole('button',{name:`查看${date}日程`,exact:true}).click();
 await page.getByRole('button',{name:new RegExp(kind+' '+title)}).click();
}
async function calendarBack(){await page.locator('.sc-page').getByRole('button',{name:'返回',exact:true}).click();}
const fixture=Buffer.from('%PDF-1.4\n% Schedule attachment test: retain exact bytes\n%%EOF');
let today;
const files=[{name:'会议资料.pdf',mimeType:'application/pdf',buffer:fixture},{name:'客户资料.pdf',mimeType:'application/pdf',buffer:fixture}];
try{
 await page.goto(base+'?view=dashboard',{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'新增日程',exact:true}).waitFor();today=await page.locator('.sch-week [aria-pressed=true]').getAttribute('title');
 await check('七天周历、空日期、周切换与键盘',async()=>{
  assert.equal(await page.locator('.sch-week [title]').count(),7);assert.equal(await page.locator('.sch-item').count(),3);
  const selected=page.locator('.sch-week [aria-pressed=true]');const date=await selected.getAttribute('title');await selected.press('ArrowRight');assert.notEqual(await selected.getAttribute('title'),date);await selected.press('ArrowLeft');assert.equal(await selected.getAttribute('title'),date);
  await page.getByRole('button',{name:'下一周',exact:true}).click();assert.equal(await page.locator('.sch-item').count(),0);await page.getByRole('button',{name:'上一周',exact:true}).click();assert.equal(await page.locator('.sch-item').count(),3);
  await page.getByRole('button',{name:'新增日程',exact:true}).click();await shot('dashboard-menu');await page.keyboard.press('Escape');
 });
 await check('会议必填校验、取消和焦点恢复',async()=>{
  await open('新建会议');await dialog().getByRole('button',{name:'确定',exact:true}).click();assert.equal(await dialog().getByRole('alert').count(),3);assert(await page.locator('#sch-title').evaluate(e=>e===document.activeElement));await dialog().getByRole('button',{name:'取消',exact:true}).click();assert.equal(await dialog().count(),0);await page.waitForFunction(()=>document.activeElement?.classList.contains('sch-add-button'));assert.equal(await page.locator('.sch-item').count(),3);
 });
 await check('线下会议、时间范围和人员搜索增删',async()=>{
  await open('新建会议');await page.locator('#sch-title').fill('关于集团2026年调研实施方案的讨论');
  await dialog().getByRole('button',{name:'会议时间',exact:true}).click();await page.getByLabel('会议开始时间',{exact:true}).fill('2026-10-29T16:00');await page.getByLabel('会议结束时间',{exact:true}).fill('2026-10-29T17:00');await page.getByRole('button',{name:'完成',exact:true}).click();
  await page.locator('#sch-location').fill('3楼会议室');const host=dialog().getByRole('combobox',{name:'主持人',exact:true});await host.fill('上官成');await dialog().getByRole('option',{name:'上官成硕',exact:true}).click();assert.equal(await host.inputValue(),'上官成硕');
  await person('与会人',['李明浩','上官家家']);await person('告知人',['李家家']);
  await dialog().getByRole('button',{name:'从与会人移除李明浩'}).click();await person('与会人',['李明浩']);
  await shot('meeting-offline');
 });
 await check('弹窗下拉可操作、线上线下保留各自地址',async()=>{
  await choose('会议类型','线上');assert.equal(await page.getByLabel('会议链接',{exact:true}).inputValue(),'');await page.getByLabel('会议链接',{exact:true}).fill('https://meeting.tencent.com/dm/BIWL3');
  await choose('会议类型','线下');assert.equal(await page.getByLabel('会议地址',{exact:true}).inputValue(),'3楼会议室');await choose('会议类型','线上');assert.equal(await page.getByLabel('会议链接',{exact:true}).inputValue(),'https://meeting.tencent.com/dm/BIWL3');
  await choose('提前提醒','30分钟');await choose('提前提醒','10分钟');await choose('可见范围','个人日程');await choose('可见范围','公开日程');await shot('meeting-online');
  await page.getByLabel('会议链接',{exact:true}).fill('invalid');await dialog().getByRole('button',{name:'确定',exact:true}).click();await page.getByText('请输入以 http:// 或 https:// 开头的会议链接',{exact:true}).waitFor();await page.getByLabel('会议链接',{exact:true}).fill('https://meeting.tencent.com/dm/BIWL3');
 });
 await check('保存会议、详情和刷新持久化',async()=>{
  await dialog().getByRole('button',{name:'确定',exact:true}).click();await dialog().waitFor({state:'detached'});assert.equal(await page.locator('.sch-item').count(),1);assert.equal(await page.locator('.sch-week [aria-pressed=true]').getAttribute('title'),'2026-10-29');await page.locator('.sch-item').click();await page.locator('.sch-detail-dialog').getByText('https://meeting.tencent.com/dm/BIWL3',{exact:true}).waitFor();await page.keyboard.press('Escape');await page.reload({waitUntil:'networkidle'});await calendarItem('2026-10-29','线上会议','关于集团2026年调研实施方案的讨论');await page.locator('.sch-detail-dialog').waitFor();await page.keyboard.press('Escape');await calendarBack();
 });
 await check('事件必填、结束时间校验和字数限制',async()=>{
  await open('新建事件');await dialog().getByRole('button',{name:'确定',exact:true}).click();assert.equal(await dialog().getByRole('alert').count(),2);await page.locator('#sch-title').fill('关于集团2026年调研实施方案的讨论');await page.locator('#sch-start').fill(`${today}T12:30`);await page.locator('#sch-end').fill(`${today}T12:00`);await page.locator('#sch-content').fill('确认各部门调研时间和资料清单。');await dialog().getByRole('button',{name:'确定',exact:true}).click();await page.getByText('结束时间须晚于开始时间',{exact:true}).waitFor();await page.locator('#sch-end').fill(`${today}T13:30`);await person('安排他人',['李明浩','上官家家']);await person('告知人',['李明浩','上官家家']);assert.equal(await page.locator('#sch-title').getAttribute('maxlength'),'20');assert.equal(await page.locator('#sch-content').getAttribute('maxlength'),'200');
 });
 await check('真实附件添加、移除、下载及事件样式',async()=>{
  await page.getByLabel('日程附件',{exact:true}).setInputFiles(files);assert.equal(await dialog().locator('.sch-attachments li').count(),2);await shot('event-attachments');
  const promise=page.waitForEvent('download');await dialog().getByRole('button',{name:'会议资料.pdf',exact:true}).click();const download=await promise;assert.deepEqual(await fs.readFile(await download.path()),fixture);
  await dialog().getByRole('button',{name:'移除附件客户资料.pdf'}).click();assert.equal(await dialog().locator('.sch-attachments li').count(),1);await page.getByLabel('日程附件',{exact:true}).setInputFiles([files[1]]);
 });
 await check('窄屏弹窗滚动与底部按钮可达',async()=>{
  for(const width of [1440,1280,390]){await page.setViewportSize({width,height:900});const bounds=await dialog().boundingBox();assert(bounds.x>=0&&bounds.x+bounds.width<=width+1);const confirm=dialog().getByRole('button',{name:'确定',exact:true});assert(await confirm.isVisible());const rect=await confirm.boundingBox();assert(rect.y+rect.height<=900);await shot('event-'+width);}
  await page.setViewportSize({width:1920,height:1080});
 });
 await check('保存事件和附件刷新恢复',async()=>{
  await dialog().getByRole('button',{name:'确定',exact:true}).click();await dialog().waitFor({state:'detached'});await page.reload({waitUntil:'networkidle'});await calendarItem(today,'事项','关于集团2026年调研实施方案的讨论');assert.equal(await page.locator('.sch-detail-dialog .sch-attachments li').count(),2);const promise=page.waitForEvent('download');await page.locator('.sch-detail-dialog').getByRole('button',{name:'会议资料.pdf',exact:true}).click();assert.deepEqual(await fs.readFile(await (await promise).path()),fixture);await page.keyboard.press('Escape');await calendarBack();
 });
 await check('日程范围过滤',async()=>{await page.getByRole('combobox',{name:'日程范围',exact:true}).click();await page.getByRole('option',{name:'我发起的',exact:true}).click();assert.equal(await page.locator('.sch-item').count(),1);await page.getByRole('combobox',{name:'日程范围',exact:true}).click();await page.getByRole('option',{name:'公开日程',exact:true}).click();assert.equal(await page.locator('.sch-item').count(),4);});

 await check('保存失败保留草稿、取消附件不落盘',async()=>{
  await open('新建事件');await page.locator('#sch-title').fill('存储失败恢复检查');await page.locator('#sch-content').fill('该草稿取消后不得保存。');await page.getByLabel('日程附件',{exact:true}).setInputFiles([files[0]]);
  await page.evaluate(()=>{window.originalSchedulePut=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(){throw new DOMException('Test quota','QuotaExceededError');};});
  await dialog().getByRole('button',{name:'确定',exact:true}).click();await dialog().getByText('保存失败，请检查浏览器存储空间后重试。填写的内容已保留。',{exact:true}).waitFor();assert.equal(await page.locator('#sch-title').inputValue(),'存储失败恢复检查');assert.equal(await dialog().locator('.sch-attachments li').count(),1);assert(!(await dialog().getByRole('button',{name:'确定',exact:true}).isDisabled()));
  await page.evaluate(()=>{IDBObjectStore.prototype.put=window.originalSchedulePut;delete window.originalSchedulePut;});await page.keyboard.press('Escape');await dialog().waitFor({state:'detached'});
  await page.getByRole('button',{name:'我的日程更多'}).click();assert.equal(await page.locator('.sc-event').filter({hasText:'存储失败恢复检查'}).count(),0);await calendarBack();
 });
 await check('弹窗键盘下拉关闭后继续编辑',async()=>{
  await open('新建会议');const type=dialog().getByRole('combobox',{name:'会议类型',exact:true});await type.focus();await type.press('ArrowDown');await type.press('End');await type.press('Enter');assert.equal(await type.innerText(),'线上');await type.press('ArrowDown');await type.press('Escape');assert.equal(await type.getAttribute('aria-expanded'),'false');assert(await dialog().isVisible());await dialog().getByRole('button',{name:'取消',exact:true}).click();
 });
 assert.deepEqual(errors,[]);
} catch(e){console.error(e);await shot('failure');process.exitCode=1;} finally{await fs.writeFile(path.join(out,'report.json'),JSON.stringify({date:new Date().toISOString(),base,passed,errors,success:!process.exitCode},null,2));await browser.close();}
