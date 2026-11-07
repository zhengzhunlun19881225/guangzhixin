import { unlockPreview } from './preview-access.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.BASE_URL || 'http://127.0.0.1:5196/';
const out = path.resolve('output/playwright/personal-features'); await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
let context, page; const passed = [], errors = [];
async function start({ mode = 'original', width = 1920, height = 1080, broken = '', corrupt = false } = {}) {
  if (context) await context.close();
  context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' }); page = await context.newPage(); page.setDefaultTimeout(7000);
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(({ mode, broken, corrupt }) => {
    localStorage.setItem('guangxin-ui-mode', mode);
    if (corrupt) { localStorage.setItem('guangxin-travel-preferences', '{bad'); localStorage.setItem('guangxin-custom-agents', '[{"id":"invalid"}]'); }
    if (broken) { const original = Storage.prototype.setItem; Storage.prototype.setItem = function(key, value) { if (key === broken) throw new DOMException('Full', 'QuotaExceededError'); return original.call(this, key, value); }; }
  }, { mode, broken, corrupt });
  await page.goto(base + '?view=agents', { waitUntil: 'networkidle' }); await unlockPreview(page);
}
const travel = () => page.getByRole('dialog', { name: '差旅喜好设置', exact: true });
const builder = () => page.getByRole('region', { name: '创建智能体页面', exact: true });
async function openTravel(user = false) { await page.getByRole('button', { name: user ? '张嘉嘉，个人菜单' : '设置', exact: true }).click(); await page.getByRole('menuitem', { name: '差旅偏好', exact: true }).click(); await travel().waitFor(); }
async function create() { await page.getByRole('button', { name: '创建', exact: true }).click(); await builder().waitFor(); await page.locator('.app-sidebar').waitFor({state:'detached'}); }
async function fillValid() { await page.locator('#ab-name').fill('经营助手'); await page.locator('#ab-intro').fill('整理经营汇报'); await page.locator('#ab-description').fill('根据用户提供材料整理汇报，注明待核对数据。'); }
async function choose(scope, label, value) { await scope.getByRole('combobox', { name: label, exact: true }).click(); await page.getByRole('option', { name: value, exact: true }).click(); }
async function shot(name) { await page.mouse.move(0, 0); await page.screenshot({ path: path.join(out, name + '.png') }); }
async function check(name, fn) { await fn(); passed.push(name); console.log('PASS ' + name); }
try {
  await start();
  await check('设置与个人菜单打开标准差旅弹框，取消保留原值并返回焦点', async () => {
    await openTravel(); assert.equal(await travel().getByRole('combobox').count(), 9);
    assert.equal(await travel().locator('h2').evaluate(el => getComputedStyle(el).fontSize), '18px');
    assert.equal(await travel().getByRole('combobox').first().evaluate(el => getComputedStyle(el).height), '32px');
    await choose(travel(), '常驻城市', '深圳'); await travel().getByRole('button', { name: '取消', exact: true }).click(); await travel().waitFor({ state: 'detached' });
    await page.waitForFunction(() => document.activeElement?.getAttribute('title') === '设置');
    await openTravel(true); assert.match(await travel().getByRole('combobox', { name: '常驻城市', exact: true }).innerText(), /广州/); await page.keyboard.press('Escape');
    await travel().waitFor({ state: 'detached' }); await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === '张嘉嘉，个人菜单');
  });
  await check('差旅九项选择、概览与本机保存、刷新恢复', async () => {
    await openTravel(); for (const [label, value] of [['常驻城市', '上海'], ['火车时间偏好', '下午 12:00–18:00'], ['飞机时间偏好', '上午 06:00–12:00'], ['航司偏好', '中国南方航空'], ['机型偏好', '宽体客机'], ['品牌偏好', '万豪'], ['酒店级别', '高档型'], ['酒店设施', '健身房'], ['早餐', '含早餐']]) await choose(travel(), label, value);
    await travel().getByRole('button', { name: 'AI分析喜好', exact: true }).click(); await travel().getByRole('status').getByText(/未接入历史订单/).waitFor(); await shot('travel-selected');
    await travel().getByRole('button', { name: '保存', exact: true }).click(); await travel().waitFor({ state: 'detached' }); assert.match(await page.getByRole('status').innerText(), /差旅偏好已保存/);
    await page.reload({ waitUntil: 'networkidle' }); await openTravel(); assert.match(await travel().getByRole('combobox', { name: '常驻城市', exact: true }).innerText(), /上海/); assert.match(await travel().getByRole('combobox', { name: '早餐', exact: true }).innerText(), /含早餐/); await choose(travel(), '常驻城市', '请选择'); await travel().getByRole('button', { name: '保存', exact: true }).click(); await travel().waitFor({state:'detached'}); await openTravel(); assert.equal(await travel().getByRole('combobox', {name:'常驻城市',exact:true}).getAttribute('data-placeholder'),'true'); await page.keyboard.press('Escape');
  });
  await check('创建智能体为待办式完整页面，必填校验和焦点', async () => {
    await create(); assert.equal(await page.locator('.app-sidebar:visible').count(), 0); assert.equal(await page.locator('.ab-columns').evaluate(el => getComputedStyle(el).display), 'grid');
    await builder().getByRole('button', { name: '发布', exact: true }).click(); assert.equal(await builder().getByRole('alert').count(), 3); await page.waitForFunction(() => document.activeElement?.id === 'ab-name');
    await builder().getByRole('button', { name: '生成测试', exact: true }).click(); await builder().getByText('未发布测试', { exact: true }).waitFor(); await shot('builder-validation');
  });
  await check('字数限制、五个预设问题、删除、模型/分类/权限和图标选择', async () => {
    await page.locator('#ab-name').fill('1234567890'); await page.locator('#ab-name').press('End'); await page.locator('#ab-name').type('EXTRA'); assert.equal((await page.locator('#ab-name').inputValue()).length, 10); await fillValid();
    await page.locator('#ab-welcome').fill('您好，我是经营助手。请提供本期材料。');
    for (let i = 1; i < 5; i++) await builder().getByRole('button', { name: '添加预设问题', exact: true }).click();
    assert(await builder().getByRole('button', { name: '添加预设问题', exact: true }).isDisabled()); assert.equal(await builder().locator('.ab-question-row').count(), 5);
    await builder().getByRole('textbox', { name: '预设问题1', exact: true }).fill('如何整理经营汇报？'); await builder().getByRole('button', { name: '删除预设问题5', exact: true }).click(); assert.equal(await builder().locator('.ab-question-row').count(), 4);
    await choose(builder(), '智能体分类', '财务'); await choose(builder(), '模型选择', 'qwen3-32b');
    await builder().getByRole('radio', { name: '个人', exact: true }).focus(); await page.keyboard.press('ArrowRight'); assert(await builder().getByRole('radio', { name: '组织', exact: true }).isChecked());
    await builder().getByRole('button', { name: '更换智能体图标', exact: true }).click(); await page.getByRole('dialog', { name: '图片设置', exact: true }).getByRole('button', { name: '选择海豚图片', exact: true }).click(); await page.getByRole('dialog', {name:'图片设置',exact:true}).getByRole('button',{name:'确定',exact:true}).click(); await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === '更换智能体图标'); assert.match(await builder().locator('.ab-icon-picker img').getAttribute('src'), /avatar-03/);
  });
  await check('生成测试展示配置、预设问题发起对话、变更过期提示与清空', async () => {
    await builder().getByRole('button', { name: '生成测试', exact: true }).click(); await builder().locator('.ab-test-welcome').getByText('您好，我是经营助手。请提供本期材料。', { exact: true }).waitFor();
    assert.equal(await builder().getByText('配置已修改，请重新生成测试', { exact: true }).count(), 0);
    await builder().getByRole('button', { name: '如何整理经营汇报？', exact: true }).click(); assert.equal(await builder().locator('.ab-test-message').count(), 2); assert.match(await builder().locator('.is-assistant p').innerText(), /当前未连接模型/);
    await page.locator('#ab-description').fill('按进度、风险、计划输出。'); await builder().getByText('配置已修改，请重新生成测试', { exact: true }).waitFor();
    await builder().getByRole('button', { name: '生成测试', exact: true }).click(); assert.equal(await builder().locator('.ab-test-message').count(), 0);
    await builder().getByRole('textbox', { name: '测试消息', exact: true }).fill('本周汇报'); await builder().getByRole('textbox', { name: '测试消息', exact: true }).press('Enter'); assert.match(await builder().locator('.is-assistant p').innerText(), /按进度、风险、计划输出/);
    await builder().getByRole('button', { name: '清空对话', exact: true }).click(); assert.equal(await builder().locator('.ab-test-message').count(), 0); assert(await builder().getByRole('button', { name: '清空对话', exact: true }).isDisabled());
    await builder().getByRole('button', { name: '一键完善', exact: true }).click(); assert.match(await page.locator('#ab-description').inputValue(), /你是经营助手/); await builder().getByRole('button', { name: '生成测试', exact: true }).click(); await shot('builder-test');
  });
  await check('发布本地卡片、刷新恢复、重新编辑保存与取消返回确认', async () => {
    await builder().getByRole('button', { name: '发布', exact: true }).click(); await builder().waitFor({ state: 'detached' }); await page.getByRole('status').getByText(/已保存到本机/).waitFor();
    await page.reload({ waitUntil: 'networkidle' }); await page.getByRole('button', { name: '编辑经营助手', exact: true }).click(); assert.equal(await page.locator('#ab-name').inputValue(), '经营助手'); assert.equal(await page.locator('#ab-intro').inputValue(), '整理经营汇报'); assert(await builder().getByRole('radio', { name: '组织', exact: true }).isChecked());
    await page.locator('#ab-intro').fill('修改草稿'); await builder().getByRole('button', { name: '返回', exact: true }).click(); const confirm = page.getByRole('dialog', { name: '放弃未保存的配置？', exact: true }); await confirm.getByRole('button', { name: '继续编辑', exact: true }).click(); assert.equal(await page.locator('#ab-intro').inputValue(), '修改草稿');
    await builder().getByRole('button', { name: '返回', exact: true }).click(); await confirm.getByRole('button', { name: '放弃并返回', exact: true }).click(); await builder().waitFor({ state: 'detached' }); await page.getByRole('button', { name: '编辑经营助手', exact: true }).click(); assert.equal(await page.locator('#ab-intro').inputValue(), '整理经营汇报');
    await page.locator('#ab-intro').fill('更新简介'); await builder().getByRole('button', { name: '保存', exact: true }).click(); await builder().waitFor({ state: 'detached' }); const data = await page.evaluate(() => JSON.parse(localStorage.getItem('guangxin-custom-agents'))); assert.equal(data.length, 1); assert.equal(data[0].intro, '更新简介');
  });
  await check('差旅存储损坏回退、保存失败保留草稿', async () => {
    await start({ corrupt: true, broken: 'guangxin-travel-preferences' }); await openTravel(); await choose(travel(), '常驻城市', '杭州'); await travel().getByRole('button', { name: '保存', exact: true }).click(); await travel().getByRole('alert').getByText(/保存失败/).waitFor(); assert.match(await travel().getByRole('combobox', { name: '常驻城市', exact: true }).innerText(), /杭州/);
  });
  await check('智能体存储失败保留配置与测试、技能创建仍使用原弹框', async () => {
    await start({ corrupt: true, broken: 'guangxin-custom-agents' }); await create(); await fillValid(); await builder().getByRole('button', { name: '生成测试', exact: true }).click(); await builder().getByRole('button', { name: '发布', exact: true }).click(); await builder().getByRole('alert').getByText(/发布失败/).waitFor(); assert.equal(await page.locator('#ab-name').inputValue(), '经营助手'); assert.equal(await builder().locator('.ab-test-welcome').count(), 1);
    await builder().getByRole('button', { name: '返回', exact: true }).click(); await page.getByRole('button', { name: '放弃并返回', exact: true }).click(); await page.getByRole('tab', { name: '技能', exact: true }).click(); await page.getByRole('button', { name: '创建', exact: true }).click(); await page.getByRole('dialog', { name: '创建自定义技能', exact: true }).waitFor();
  });
  await check('列表进入法智模式、发送中取消禁用、停止后取消保留对话和草稿', async () => {
    await start(); await page.locator('.sidebar-new-chat button').click();await page.getByRole('button',{name:'智能问答',exact:true}).click();const qaStyle=await page.locator('.selected-agent-pill').evaluate(e=>{const s=getComputedStyle(e);return[s.height,s.backgroundColor,s.borderRadius,s.padding];});await page.getByRole('button',{name:'移除智能体',exact:true}).click();await page.locator('.ai-feature-card').filter({hasText:'法智小新'}).click();assert.deepEqual(await page.locator('.selected-agent-pill').evaluate(e=>{const s=getComputedStyle(e);return[s.height,s.backgroundColor,s.borderRadius,s.padding];}),qaStyle);await page.getByRole('button',{name:'切换智能体：法智小新',exact:true}).click();await page.getByRole('region',{name:'智能体',exact:true}).getByRole('button',{name:'关闭智能体面板',exact:true}).click(); const cancel=page.getByRole('button',{name:'取消法智小新',exact:true}); await cancel.waitFor();
    const input=page.getByRole('textbox',{name:'消息内容',exact:true}); await input.fill('检查合同付款条款'); await input.press('Enter'); await page.getByRole('button',{name:'结束生成',exact:true}).waitFor(); assert(await cancel.isDisabled());
    await page.getByRole('button',{name:'结束生成',exact:true}).click(); await page.waitForFunction(()=>!document.querySelector('.composer-cancel-legal')?.disabled); await input.fill('保留的后续问题'); await cancel.click(); await page.waitForFunction(()=>document.querySelectorAll('.composer-agent-choice').length===4); assert.equal(await input.inputValue(),'保留的后续问题'); assert.equal(await page.locator('.ai-conversation').count(),1);
  });
  for (const mode of ['original', 'spec']) for (const [width, height] of [[1920, 1080], [1440, 900], [1280, 720], [390, 844]]) await check(`${mode} ${width}差旅/创建/法智布局和操作`, async () => {
    await start({ mode, width, height }); await openTravel(); let box = await travel().boundingBox(); assert(box.x >= 0 && box.y >= 0 && box.x + box.width <= width + 1 && box.y + box.height <= height + 1); await shot(`travel-${mode}-${width}`); await travel().getByRole('button', { name: '保存', exact: true }).click(); await travel().waitFor({ state: 'detached' });
    await create(); await fillValid(); await builder().getByRole('button', { name: '生成测试', exact: true }).click(); await builder().locator('.ab-test-welcome').waitFor();
    assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))); box = await builder().boundingBox(); assert(box.x >= 0 && box.x + box.width <= width + 1 && box.y + box.height <= height + 1);
    assert.equal(await builder().getByText('本机配置',{exact:true}).count(),0); assert.equal(await builder().locator('.ab-page-header').evaluate(e=>getComputedStyle(e).borderBottomWidth),'0px');
    if(width>700){const left=await builder().locator('.ab-config').boundingBox(),right=await builder().locator('.ab-test').boundingBox(),columns=await builder().locator('.ab-columns').boundingBox();assert(Math.abs(left.width/columns.width-.3)<.002);assert(Math.abs(right.width/columns.width-.7)<.002);assert(Math.abs(left.y-right.y)<1);}
    await builder().getByRole('textbox', { name: '测试消息', exact: true }).fill('测试'); await builder().getByRole('button', { name: '发送测试消息', exact: true }).click(); assert.equal(await builder().locator('.ab-test-message').count(), 2); await shot(`builder-${mode}-${width}`);
    await builder().getByRole('button', { name: '发布', exact: true }).click(); await builder().waitFor({ state: 'detached' }); await page.getByRole('button', { name: '编辑经营助手', exact: true }).waitFor();
    await page.locator('.sidebar-new-chat button').click(); const input=page.getByRole('textbox',{name:'消息内容',exact:true}); await input.fill('合同付款条款');
    await page.locator('.ai-feature-card').filter({hasText:'法智小新'}).click(); await page.getByRole('button',{name:'取消法智小新',exact:true}).waitFor();
    assert.equal(await page.locator('.composer-agent-choice').count(),0); assert.equal(await page.locator('.composer-agent-tool').count(),0); assert.equal(await page.locator('.selected-agent-pill').count(),1);assert.equal(await page.locator('.selected-agent-pill').innerText(),'法智小新'); assert.equal(await page.locator('.ai-conversation').count(),0); assert.equal(await input.inputValue(),'合同付款条款');
    box=await page.getByRole('button',{name:'取消法智小新',exact:true}).boundingBox(); assert(box.x>=0&&box.x+box.width<=width+1&&box.y+box.height<=height); await shot(`legal-${mode}-${width}`);
    await page.getByRole('button',{name:'取消法智小新',exact:true}).click(); await page.waitForFunction(()=>document.querySelectorAll('.composer-agent-choice').length===4); assert.equal(await input.inputValue(),'合同付款条款'); await page.waitForFunction(()=>document.activeElement?.tagName==='TEXTAREA');
  });
  assert.deepEqual(errors, []);
} catch (error) { console.error(error); if (page) await shot('failure'); process.exitCode = 1; }
finally { await fs.writeFile(path.join(out, 'verification.json'), JSON.stringify({ base, date: new Date().toISOString(), passed, errors, success: !process.exitCode }, null, 2)); await browser.close(); }
