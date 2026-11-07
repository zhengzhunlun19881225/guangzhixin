import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.BASE_URL||'http://127.0.0.1:5196/';const out=path.resolve('output/schedule-calendar');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const passed=[],errors=[];let page,context;
async function check(name,fn){await fn();passed.push(name);console.log('PASS '+name);}
async function choose(label,value){await page.getByRole('combobox',{name:label,exact:true}).click();await page.getByRole('option',{name:value,exact:true}).click();}
async function start(mode='original',width=1920,height=1080){
 if(context)await context.close();context=await browser.newContext({viewport:{width,height},timezoneId:'Asia/Shanghai'});page=await context.newPage();page.setDefaultTimeout(6000);page.on('pageerror',e=>errors.push(e.message));
 await page.clock.install({time:new Date('2026-11-07T11:30:00+08:00')});await page.addInitScript(mode=>localStorage.setItem('guangxin-ui-mode',mode),mode);
 await page.goto(base+'?view=dashboard',{waitUntil:'networkidle'});await page.getByRole('button',{name:'我的日程更多'}).click();await page.locator('.sc-scroll[aria-busy=false]').waitFor();
}
async function shot(name){await page.mouse.move(0,0);await page.screenshot({path:path.join(out,name+'.png')});}
try{
 await start();
 await check('更多进入完整周历、系统控件和重叠日程',async()=>{
  assert.equal(await page.locator('.sch-list-dialog').count(),0);assert.equal(await page.locator('.sc-day-column').count(),7);assert.equal(await page.locator('.sc-event').count(),3);
  assert.match(await page.locator('.sc-period h1').innerText(),/2026年11月2日.*2026年11月8日/);
  const boxes=await page.locator('.sc-event').evaluateAll(els=>els.map(el=>el.getBoundingClientRect().toJSON()));assert(boxes[0].right<=boxes[1].left&&boxes[1].right<=boxes[2].left);
  assert.equal(await page.locator('.sc-modes').evaluate(el=>getComputedStyle(el).height),'32px');assert.equal(await page.locator('.sch-add-button').evaluate(el=>getComputedStyle(el).height),'32px');
  assert.equal(await page.locator('.sc-now').evaluate(el=>el.style.top),'690px');await page.clock.fastForward(60000);assert.equal(await page.locator('.sc-now').evaluate(el=>el.style.top),'691px');
  assert.equal(await page.locator('.sc-page').evaluate(el=>getComputedStyle(el).borderRadius),'16px');assert.equal(await page.locator('.sc-sidebar .is-selected').evaluate(el=>getComputedStyle(el).color),'rgb(255, 0, 0)');await shot('week-1920');
 });
 await check('详情、18px标题、Escape及事件焦点恢复',async()=>{
  const event=page.locator('.sc-event').filter({hasText:'高级职位候选人面试'});await event.click();await page.locator('.sch-detail-dialog').waitFor();assert.equal(await page.locator('#sch-detail-title').evaluate(el=>getComputedStyle(el).fontSize),'18px');await page.keyboard.press('Escape');await page.waitForFunction(()=>document.activeElement?.classList.contains('sc-event'));
 });
 await check('类型、本人范围、他人和公开视图筛选',async()=>{
  await choose('日程类型','事件');assert.equal(await page.locator('.sc-event').count(),1);await choose('日程类型','全部类型');
  await choose('日历范围','我发起的');assert.equal(await page.locator('.sc-event').count(),0);await page.locator('.sc-summary').getByText(/暂无日程/).waitFor();
  await page.getByRole('button',{name:'部门视图',exact:true}).click();assert.equal(await page.locator('.sc-department-table tbody tr').count(),8);assert.equal(await page.locator('.sc-department-event').count(),0);
  await page.getByRole('button',{name:'他人视图',exact:true}).click();assert.equal(await page.locator('.sc-event').count(),3);await choose('查看人员','李明浩');assert.equal(await page.locator('.sc-event').count(),0);
  await page.getByRole('button',{name:'我的视图',exact:true}).click();await choose('日历范围','我的日程');
 });
 await check('日期翻页、本周恢复、键盘日周月切换',async()=>{
  await page.getByRole('button',{name:'下一个日期范围'}).click();assert.equal(await page.locator('.sc-event').count(),0);await page.getByRole('button',{name:'本周',exact:true}).click();assert.equal(await page.locator('.sc-event').count(),3);
  await page.getByRole('tab',{name:'周',exact:true}).focus();await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('.sc-day-column').count(),1);await page.keyboard.press('End');assert.equal(await page.locator('.sc-month-day').count(),42);
  await page.getByRole('button',{name:'查看2026-11-07日程'}).click();assert.equal(await page.locator('.sc-day-column').count(),1);assert.equal(await page.locator('.sc-event').count(),3);await page.getByRole('tab',{name:'周',exact:true}).click();
 });
 await check('新建菜单键盘、取消和保存后恢复筛选',async()=>{
  const trigger=page.getByRole('button',{name:'新建',exact:true});await trigger.focus();await trigger.press('ArrowDown');await page.keyboard.press('End');await page.keyboard.press('Enter');await page.locator('.sch-create-dialog').waitFor();await page.keyboard.press('Escape');await page.waitForFunction(()=>document.activeElement?.classList.contains('sch-add-button'));
  await choose('日程类型','会议');await page.getByRole('button',{name:'他人视图',exact:true}).click();await trigger.click();await page.getByRole('menuitem',{name:'新建事件',exact:true}).click();
  await page.locator('#sch-title').fill('日历新增验证');await page.locator('#sch-content').fill('日历新建后与工作台共享同一条本地记录。');await page.locator('#sch-start').fill('2026-11-07T14:00');await page.locator('#sch-end').fill('2026-11-07T15:00');await page.locator('.sch-create-dialog').getByRole('button',{name:'确定',exact:true}).click();await page.locator('.sch-create-dialog').waitFor({state:'detached'});
  await page.locator('.sc-event').filter({hasText:'日历新增验证'}).waitFor();assert.equal(await page.getByRole('combobox',{name:'日程类型'}).innerText(),'全部类型');await page.locator('.sc-sidebar>button.is-selected').getByText('我的视图',{exact:true}).waitFor();
 });
 await check('返回保留日期、聚焦更多、刷新共享新建记录',async()=>{
  await page.getByRole('button',{name:'返回',exact:true}).click();await page.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='我的日程更多');assert.equal(await page.locator('.sch-item').filter({hasText:'日历新增验证'}).count(),1);
  await page.reload({waitUntil:'networkidle'});await page.getByRole('button',{name:'我的日程更多'}).click();await page.locator('.sc-event').filter({hasText:'日历新增验证'}).waitFor();
 });
 await check('跨天截断、月末切换与半开日期边界',async()=>{
  await page.evaluate(async()=>{
   const base={mode:'线下',location:'',host:'',participants:['张嘉嘉'],informed:[],reminder:'不提醒',visibility:'个人日程',content:'测试',description:'',attachments:[],creator:'张嘉嘉',completed:false,kind:'event'};
   const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('guangxin-schedules',1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
   await new Promise((resolve,reject)=>{const tx=db.transaction('items','readwrite');for(const item of [{id:'test-cross',title:'跨天验证',start:'2026-11-07T23:00',end:'2026-11-08T01:00'},{id:'test-boundary',title:'午夜结束验证',start:'2026-11-07T22:00',end:'2026-11-08T00:00'},{id:'test-month',title:'月末验证',start:'2026-11-30T09:00',end:'2026-11-30T10:00'}])tx.objectStore('items').put({...base,...item});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});db.close();
  });
  await page.reload({waitUntil:'networkidle'});await page.getByRole('button',{name:'我的日程更多'}).click();await page.locator('.sc-scroll[aria-busy=false]').waitFor();
  assert.equal(await page.locator('.sc-event').filter({hasText:'跨天验证'}).count(),2);assert.equal(await page.locator('.sc-event').filter({hasText:'午夜结束验证'}).count(),1);
  const cross=page.locator('.sc-day-column[aria-label="2026-11-08日程"] .sc-event').filter({hasText:'跨天验证'});assert.equal(await cross.evaluate(el=>el.style.top),'0px');assert.equal(await cross.locator('time').innerText(),'00:00 – 01:00');
  await page.getByRole('tab',{name:'月',exact:true}).click();await page.getByRole('button',{name:'查看2026-11-30日程'}).click();await page.getByRole('tab',{name:'月',exact:true}).click();await page.getByRole('button',{name:'下一个日期范围'}).click();assert.equal(await page.locator('.sc-period h1').innerText(),'2026年12月');await page.getByRole('tab',{name:'日',exact:true}).click();assert.equal(await page.locator('.sc-period h1').innerText(),'2026年12月30日');
 });
 await check('部门成员矩阵、全选半选、公开记录和详情',async()=>{
  await page.evaluate(async()=>{
   const base={mode:'线下',location:'3楼会议室',host:'刘向阳',participants:['刘向阳'],informed:[],reminder:'不提醒',visibility:'公开日程',content:'测试',description:'',attachments:[],creator:'上官成硕',completed:false,kind:'meeting',start:'2026-11-07T09:00',end:'2026-11-07T10:00'};
   const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('guangxin-schedules',1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
   await new Promise((resolve,reject)=>{const tx=db.transaction('items','readwrite');for(const item of [{id:'department-public',title:'部门公开会议验证'},{id:'department-private',title:'个人日程不可见验证',visibility:'个人日程'},{id:'department-cross',title:'部门跨天验证',kind:'event',host:'',participants:['麦宝文','荣梓鑫'],start:'2026-11-07T23:00',end:'2026-11-08T01:00'}])tx.objectStore('items').put({...base,...item});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});db.close();
  });
  await page.reload({waitUntil:'networkidle'});await page.getByRole('button',{name:'我的日程更多'}).click();await page.locator('.sc-scroll[aria-busy=false]').waitFor();await page.getByRole('button',{name:'部门视图',exact:true}).click();
  assert.equal(await page.locator('.sc-department-table tbody tr').count(),8);assert.equal(await page.locator('.sc-department-event').filter({hasText:'部门公开会议验证'}).count(),1);assert.equal(await page.locator('.sc-department-event').filter({hasText:'部门跨天验证'}).count(),4);assert.equal(await page.locator('.sc-department-event').filter({hasText:'个人日程不可见验证'}).count(),0);assert.match(await page.locator('.sc-summary').innerText(),/2 项日程/);
  assert.equal(await page.locator('.sc-member-profile').first().innerText(),'向阳\n刘向阳\n物业经营部总经理');
  const all=page.getByRole('checkbox',{name:'全选部门成员',exact:true}),liu=page.getByRole('checkbox',{name:'显示刘向阳的日程',exact:true});await liu.uncheck();assert.equal(await page.locator('.sc-department-table tbody tr').count(),7);assert(await all.evaluate(el=>el.indeterminate));assert.equal(await page.locator('.sc-department-event').filter({hasText:'部门公开会议验证'}).count(),0);
  await liu.focus();await liu.press('Space');assert(await all.isChecked());await all.uncheck();await page.getByText('请选择部门成员',{exact:true}).waitFor();await page.getByRole('button',{name:'全选成员',exact:true}).click();assert.equal(await page.locator('.sc-department-table tbody tr').count(),8);
  await page.locator('.sc-department-event').filter({hasText:'部门公开会议验证'}).click();await page.locator('.sch-detail-dialog').getByText('刘向阳',{exact:true}).first().waitFor();await page.keyboard.press('Escape');await page.waitForFunction(()=>document.activeElement?.classList.contains('sc-department-event'));
  await choose('日程类型','会议');assert.equal(await page.locator('.sc-department-event').count(),1);await choose('日程类型','全部类型');
  await page.getByRole('button',{name:'下一个日期范围'}).click();assert.equal(await page.locator('.sc-department-event').count(),0);await page.getByRole('button',{name:'本周',exact:true}).click();assert.equal(await page.locator('.sc-department-event').count(),5);
  await shot('department-week-data');await page.getByRole('tab',{name:'日',exact:true}).click();assert.equal(await page.locator('.sc-department-table thead th').count(),2);await page.getByRole('tab',{name:'月',exact:true}).click();assert.equal(await page.locator('.sc-department-table thead th').count(),31);
  await page.locator('.sc-scroll').evaluate(el=>{el.scrollLeft=500;el.scrollTop=300;});const clip=await page.locator('.sc-scroll').boundingBox(),member=await page.locator('.sc-department-table tbody .sc-member-column').last().boundingBox(),header=await page.locator('.sc-department-table thead th').last().boundingBox();assert(Math.abs(member.x-clip.x)<2);assert(Math.abs(header.y-clip.y)<2);
  await page.getByRole('tab',{name:'周',exact:true}).click();await liu.uncheck();await page.getByRole('button',{name:'我的视图',exact:true}).click();await page.getByRole('button',{name:'部门视图',exact:true}).click();assert.equal(await page.locator('.sc-department-table tbody tr').count(),7);assert(await all.evaluate(el=>el.indeterminate));
 });
 await check('读取失败、重试恢复与禁用新增',async()=>{
  await page.goto(base+'?view=dashboard',{waitUntil:'networkidle'});await page.evaluate(()=>{window.originalScheduleOpen=indexedDB.open.bind(indexedDB);indexedDB.open=()=>{throw new Error('test unavailable');};});await page.getByRole('button',{name:'我的日程更多'}).click();await page.getByRole('alert').getByText('日程读取失败，请重试。').waitFor();assert(await page.getByRole('button',{name:'新建',exact:true}).isDisabled());await page.evaluate(()=>{indexedDB.open=window.originalScheduleOpen;});await page.getByRole('button',{name:'重试',exact:true}).click();await page.locator('.sc-scroll[aria-busy=false]').waitFor();assert(!(await page.getByRole('button',{name:'新建',exact:true}).isDisabled()));
 });
 for(const mode of ['original','spec'])for(const [width,height] of [[1920,1080],[1440,900],[1280,720],[390,844]])await check(`${mode} ${width}布局、全天滚动和月视图`,async()=>{
  await start(mode,width,height);assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)));const rect=await page.locator('.sc-page').boundingBox();assert(rect.x>=0&&rect.x+rect.width<=width&&rect.y+rect.height<=height+1);const scroll=await page.locator('.sc-scroll').boundingBox();assert(scroll.height>180);if(width>=1280){const toolbar=await page.locator('.sc-toolbar').boundingBox();assert(toolbar.height<=64);}
  await page.locator('.sc-scroll').evaluate(el=>el.scrollTop=el.scrollHeight);const hour=await page.locator('.sc-time-labels').getByText('23:00',{exact:true}).boundingBox();assert(hour.y>=scroll.y&&hour.y+hour.height<=scroll.y+scroll.height+1);
  await page.locator('.sc-scroll').evaluate(el=>el.scrollTop=480);if(width===390)assert(await page.locator('.sc-scroll').evaluate(el=>el.scrollLeft>0));await shot(`${mode}-week-${width}`);
  await page.getByRole('tab',{name:'月',exact:true}).click();assert.equal(await page.locator('.sc-month-day').count(),42);await shot(`${mode}-month-${width}`);await page.getByRole('tab',{name:'周',exact:true}).click();await page.getByRole('button',{name:'部门视图',exact:true}).click();assert.equal(await page.locator('.sc-department-table tbody tr').count(),8);assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)));await shot(`${mode}-department-${width}`);
 });
 assert.deepEqual(errors,[]);
}catch(error){console.error(error);if(page)await shot('failure');process.exitCode=1;}finally{await fs.writeFile(path.join(out,'verification.json'),JSON.stringify({date:new Date().toISOString(),base,passed,errors,success:!process.exitCode},null,2));await browser.close();}
