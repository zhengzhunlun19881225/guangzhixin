import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base=process.env.BASE_URL || 'http://127.0.0.1:5196/';
const output=path.resolve('output/dialogs');await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
const context=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});const page=await context.newPage();page.setDefaultTimeout(8000);
const results=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
const go=async q=>page.goto(base+(q||''),{waitUntil:'networkidle'});
const close=async()=>page.keyboard.press('Escape');
const inspect=async(name,selector='dialog[open]')=>{
 const dialog=page.locator(selector);await dialog.waitFor();await page.mouse.move(0,0);
 const metrics=await dialog.evaluate(e=>{const rect=e.getBoundingClientRect(),header=e.querySelector('.gx-dialog-header'),h=header.getBoundingClientRect(),title=header.querySelector('h2,h3,strong'),cs=getComputedStyle(title);return{rect:{x:rect.x,y:rect.y,width:rect.width,height:rect.height},radius:getComputedStyle(e).borderRadius,headerHeight:h.height,headerTop:h.top-rect.top,titleSize:cs.fontSize,titleLine:cs.lineHeight,titleWeight:cs.fontWeight,overflow:e.scrollWidth>e.clientWidth};});
 assert.equal(metrics.radius,'16px');assert.equal(metrics.headerHeight,64, name+' header');assert.equal(metrics.headerTop,0);assert.equal(metrics.titleSize,'16px');assert.equal(metrics.titleLine,'24px');assert.equal(metrics.titleWeight,'600');assert(!metrics.overflow);assert(metrics.rect.x>=12&&metrics.rect.y>=12);assert(metrics.rect.y+metrics.rect.height<=page.viewportSize().height-10);assert(Math.abs(metrics.rect.x+metrics.rect.width/2-page.viewportSize().width/2)<2, name+' centered');
 const footer=dialog.locator('.gx-dialog-footer');if(await footer.count()){
  const buttons=footer.locator(':scope>button:not(.gx-dialog-reset)');for(const button of await buttons.all()){assert.equal(await button.evaluate(e=>getComputedStyle(e).height),'36px');}
  if(await buttons.count()){const first=await buttons.first().boundingBox(),last=await buttons.last().boundingBox();assert(Math.abs((first.x+last.x+last.width)/2-(metrics.rect.x+metrics.rect.width/2))<2,name+' actions centered');}
  const b=await footer.boundingBox();assert(b.y+b.height<=metrics.rect.y+metrics.rect.height+1,name+' footer');
 }
 for(const button of await dialog.locator('.ui-button-primary,.gx-dialog-primary').all()){
  assert.deepEqual(await button.evaluate(e=>{const c=getComputedStyle(e);return[c.backgroundImage,c.backgroundColor,c.color]}),['none','rgb(255, 0, 0)','rgb(255, 255, 255)'],name+' solid primary');
  if(await button.isEnabled()){await button.hover();assert.deepEqual(await button.evaluate(e=>{const c=getComputedStyle(e);return[c.backgroundImage,c.backgroundColor,c.color]}),['none','rgb(230, 1, 1)','rgb(255, 255, 255)'],name+' hover');}
 }
 const body=dialog.locator('.gx-dialog-body').first();if(await body.count()){await body.evaluate(e=>e.scrollTop=e.scrollHeight);assert.equal(await dialog.locator('.gx-dialog-header').evaluate(e=>e.getBoundingClientRect().top),metrics.rect.y);await body.evaluate(e=>e.scrollTop=0);}
 await page.mouse.move(0,0);await dialog.screenshot({path:path.join(output,name+'.png')});results.push({name,status:'passed'});console.log('PASS '+name);
};
try{
 await go('?view=dashboard');assert.deepEqual(await page.locator('.sch-week [aria-pressed=true] b').evaluate(e=>[getComputedStyle(e).backgroundColor,getComputedStyle(e).color]),['rgb(255, 0, 0)','rgb(255, 255, 255)']);await page.locator('.sch-week').screenshot({path:path.join(output,'week-selection.png')});await page.getByRole('button',{name:'新增日程',exact:true}).click();await page.getByRole('menuitem',{name:'新建会议',exact:true}).click();await inspect('meeting');await close();
 await page.getByRole('button',{name:'新增日程',exact:true}).click();await page.getByRole('menuitem',{name:'新建事件',exact:true}).click();await inspect('event');await close();
 await page.locator('.sch-item').first().click();await inspect('schedule-detail');await close();await page.getByRole('button',{name:'我的日程更多'}).click();await inspect('schedule-list');await close();
 await page.getByRole('button',{name:'系统导航更多'}).click();await inspect('systems-browse');
 for(const heading of await page.locator('.app-manager-section h3,.app-manager-category h4').all()){assert.deepEqual(await heading.evaluate(e=>[getComputedStyle(e).fontSize,getComputedStyle(e).lineHeight]),['14px','22px']);}
 const manage=page.locator('.app-manager-manage');assert.equal(await manage.locator('svg').count(),1);assert.deepEqual(await manage.evaluate(e=>{const c=getComputedStyle(e);return[c.height,c.backgroundImage,c.backgroundColor,c.color,c.borderColor]}),['32px','none','rgb(255, 255, 255)','rgb(3, 9, 27)','rgb(235, 238, 245)']);
 const original=await manage.boundingBox();await manage.locator('span').evaluate(e=>e.textContent='管理应用目录');assert((await manage.boundingBox()).width>original.width);await manage.locator('span').evaluate(e=>e.textContent='管理');
 await page.getByRole('button',{name:'管理',exact:true}).click();await inspect('systems-edit');await page.getByRole('button',{name:'取消',exact:true}).click();await close();
 await page.getByRole('button',{name:'常用功能更多'}).click();await inspect('applications-browse');await page.getByRole('button',{name:'管理',exact:true}).click();await inspect('applications-edit');await page.getByRole('button',{name:'取消',exact:true}).click();await close();
 await page.getByRole('button',{name:'AI 帮写感谢'}).click();await inspect('greeting');await close();
 await go('?view=portal');await page.getByRole('button',{name:'订阅',exact:true}).click();await inspect('subscription-manual');await page.getByRole('button',{name:'高级设置：来源、屏蔽与提醒'}).click();await inspect('subscription-advanced');await page.getByRole('tab',{name:'AI 订阅'}).click();await inspect('subscription-ai');await close();
 await page.locator('.pn-ai-card').first().click();await inspect('news-article');await close();await page.locator('.pn-alert').first().getByRole('button',{name:'查看',exact:true}).click();await inspect('news-alert');await close();await page.locator('.pn-ai-news').getByRole('button',{name:'更多',exact:true}).click();await inspect('news-directory');await close();
 await go('?view=agents');await page.getByRole('button',{name:'创建',exact:true}).click();await inspect('agent-create');await page.getByRole('textbox',{name:'名称',exact:true}).fill('弹窗验证');await page.getByRole('combobox',{name:'所属分类'}).click();await page.getByRole('option',{name:'组织',exact:true}).click();await page.getByRole('button',{name:'取消',exact:true}).click();
 await go('?view=skills');await page.getByRole('button',{name:'创建',exact:true}).click();await inspect('skill-create');await close();
 await go();await page.getByRole('button',{name:'搜索 (Ctrl+K)',exact:true}).click();await inspect('search');await close();await page.getByRole('button',{name:'查看更多历史记录',exact:true}).click();await inspect('history');await close();
 await page.getByRole('button',{name:'智能写作',exact:true}).click();await page.getByRole('button',{name:'PPT生成',exact:true}).click();await page.locator('.template-preview-button').first().click();await inspect('ppt-preview');await close();
 await go('?view=drive');await page.getByRole('button',{name:'新建',exact:true}).click();await inspect('drive-create');await page.getByRole('textbox',{name:'名称',exact:true}).fill('弹窗检查');await page.getByRole('button',{name:'取消',exact:true}).click();
 const row=page.locator('.drive-table tbody tr').filter({has:page.locator('.drive-entry-name:not(.is-folder)')}).first();await row.hover();await row.getByRole('button',{name:'重命名',exact:true}).click();await inspect('drive-rename');await close();
 await row.getByRole('button',{name:'预览',exact:true}).click();await inspect('drive-preview');await close();await row.hover();await row.getByRole('button',{name:'发送',exact:true}).click();await inspect('drive-send');await close();await row.getByRole('button',{name:'删除',exact:true}).click();await inspect('drive-delete');await page.getByRole('button',{name:'取消',exact:true}).click();
 await go('?view=im');const group=page.locator('.im-contact').filter({has:page.locator('em')}).first();await group.click();await page.locator('.im-person-card').click();await inspect('im-profile');await close();if(await page.getByRole('button',{name:'展开会话详情',exact:true}).count())await page.getByRole('button',{name:'展开会话详情',exact:true}).click();await page.getByTitle('添加群成员',{exact:true}).click();await inspect('im-members');await close();await page.getByRole('button',{name:'退出群聊',exact:true}).click();await inspect('im-leave');await page.getByRole('button',{name:'取消',exact:true}).click();
 await go('?view=design-system');await page.getByRole('button',{name:'打开确认示例'}).click();await inspect('spec-confirm');await close();
 await go('?view=portal');await page.getByRole('button',{name:'订阅',exact:true}).click();await page.getByRole('button',{name:'高级设置：来源、屏蔽与提醒'}).click();await page.setViewportSize({width:390,height:844});await inspect('subscription-mobile');await close();
 assert.deepEqual(errors,[]);
}catch(e){results.push({name:'failure',status:'failed',error:e.message});console.error(e);process.exitCode=1;}finally{await fs.writeFile(path.join(output,'report.json'),JSON.stringify({results,errors},null,2));await browser.close();}
