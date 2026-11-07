import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.BASE_URL || 'http://127.0.0.1:5196/';
const output = path.resolve('output/playwright/reference-patterns');
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, reducedMotion: 'reduce' });
const preview = page.locator('.cr-detail[data-active=true] .cr-preview'), results = [], errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('response', r => { if (r.url().startsWith(base) && r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
async function go(id) { await page.goto(`${base}?view=design-system&component=${id}#library`, { waitUntil: 'networkidle' }); await page.locator(`.cr-detail[data-component="${id}"]`).waitFor(); }
const css = (el, key) => el.evaluate((e, k) => getComputedStyle(e)[k], key);
async function check(name, fn) { try { await fn(); results.push({ name, status: 'passed' }); console.log(`PASS ${name}`); } catch (e) { results.push({ name, status: 'failed', error: e.message }); console.error(`FAIL ${name}: ${e.message}`); } }
try {
  await check('Radio variants, keyboard exclusivity, disabled states', async () => {
    await go('radio'); assert.equal(await preview.getByRole('group').count(), 6);
    const group = preview.getByRole('group', { name: '基础单选', exact: true });
    await group.getByRole('radio', { name: '已选', exact: true }).focus(); await page.keyboard.press('ArrowLeft');
    assert(await group.getByRole('radio', { name: '备选', exact: true }).isChecked()); assert.equal(await group.locator('input:checked').count(), 1);
    assert.equal(await preview.locator('input:disabled').count(), 4);
    assert.equal(await css(preview.locator('.rp-choice-glyph').first(), 'width'), '14px');
    assert.equal(await css(preview.locator('.rp-choice-box').first(), 'height'), '32px');
    assert((await css(preview.locator('.rp-radio-pill [data-selected=true]>span'), 'backgroundImage')).includes('linear-gradient'));
  });
  await check('Checkbox mixed/disabled states and all-selection linkage', async () => {
    await go('checkbox'); const group = preview.locator('.rp-checkbox-group'); const all = group.getByRole('checkbox', { name: '全选行业' });
    assert(await all.evaluate(e => e.indeterminate)); await all.check(); assert.equal(await group.locator('input:checked').count(), 4);
    await group.getByRole('checkbox', { name: '制造业' }).uncheck(); assert(await all.evaluate(e => e.indeterminate));
    await all.check(); await all.uncheck(); assert.equal(await group.locator('input:checked').count(), 0);
    assert(await preview.getByRole('checkbox', { name: '禁用半选', exact: true }).evaluate(e => e.disabled && e.indeterminate));
    const box = preview.locator('.rp-choice-box').first(); assert.equal(await css(box, 'backgroundColor'), 'rgb(255, 255, 255)');
  });
  await check('Switch colors, dimensions, Space toggle and disabled states', async () => {
    await go('switch'); assert.equal(await preview.getByRole('switch').count(), 9);
    const blue = preview.getByRole('switch', { name: '蓝色开关', exact: true });
    const track = preview.locator('.rp-switch-track').first(); assert.equal(await css(track, 'width'), '40px'); assert.equal(await css(track, 'height'), '20px');
    assert.equal(await css(track, 'backgroundColor'), 'rgb(0, 109, 255)');
    assert.equal(await css(preview.locator('.rp-switch-track').nth(1), 'backgroundColor'), 'rgb(0, 181, 120)');
    await blue.focus(); await page.keyboard.press('Space'); assert(!(await blue.isChecked()));
    assert.equal(await preview.locator('input:disabled').count(), 3);
  });
  await check('Two independent Tabs groups, keyboard endpoints and panel labels', async () => {
    await go('tabs'); const line = preview.getByRole('tablist', { name: '资讯示例页签' });
    await line.getByRole('tab', { name: '推荐', exact: true }).focus(); await page.keyboard.press('End');
    assert.equal(await line.getByRole('tab', { name: '政策法规' }).getAttribute('aria-selected'), 'true');
    await page.keyboard.press('Home'); assert.equal(await line.getByRole('tab', { name: '推荐', exact: true }).getAttribute('aria-selected'), 'true');
    const pill = preview.getByRole('tablist', { name: '分类示例页签' }); await pill.getByRole('tab', { name: '组织', exact: true }).click();
    assert.equal(await pill.getByRole('tab', { name: '组织', exact: true }).getAttribute('aria-selected'), 'true');
    assert.equal(await line.getByRole('tab', { name: '推荐', exact: true }).getAttribute('aria-selected'), 'true');
    for (const panel of await preview.getByRole('tabpanel').all()) assert(await panel.getAttribute('aria-labelledby'));
  });
  await check('Empty image loads, add and restore are functional', async () => {
    await go('empty'); assert.equal(await preview.locator('.rp-empty img').count(), 2);
    assert(await preview.locator('.rp-empty img').first().evaluate(e => e.complete && e.naturalWidth === 100));
    await preview.getByRole('button', { name: '添加示例数据' }).click(); await preview.getByText('已添加一条示例数据').waitFor();
    await preview.getByRole('button', { name: '恢复空状态' }).click(); assert.equal(await preview.locator('.rp-empty img').count(), 2);
  });
  await check('MessageBox dimensions, close focus, required input and cancel', async () => {
    await go('dialog'); assert.equal(await preview.locator('.rp-messagebox').count(), 4);
    assert.equal(await css(preview.locator('.rp-messagebox').first(), 'width'), '360px');
    const trigger = preview.getByRole('button', { name: '打开消息提示', exact: true }); await trigger.click();
    let dialog = page.locator('dialog.rp-messagebox-live'); await dialog.waitFor();
    assert(await dialog.getByRole('button', { name: '确定', exact: true }).evaluate(e => e === document.activeElement));
    await page.keyboard.press('Escape'); assert.equal(await dialog.count(), 0); assert(await trigger.evaluate(e => e === document.activeElement));
    const prompt = preview.getByRole('button', { name: '打开输入弹框', exact: true }); await prompt.click(); await dialog.waitFor();
    await dialog.getByRole('button', { name: '确定', exact: true }).click(); assert.equal(await dialog.locator('input').getAttribute('aria-invalid'), 'true');
    assert(await dialog.locator('input').evaluate(e => e === document.activeElement));
    await dialog.locator('input').fill('review-only'); await dialog.getByRole('button', { name: '取消', exact: true }).click();
    assert(await prompt.evaluate(e => e === document.activeElement)); await prompt.click(); assert.equal(await dialog.locator('input').inputValue(), '');
    await dialog.locator('input').fill('review-only'); await dialog.getByRole('button', { name: '确定', exact: true }).click(); assert.equal(await dialog.count(), 0);
    await preview.getByRole('button', { name: '打开确认消息' }).click(); await dialog.waitFor();
    await page.mouse.click(5, 5); assert.equal(await dialog.count(), 1);
    await dialog.getByRole('button', { name: '取消', exact: true }).click();
  });
  await check('Desktop and narrow reference sheets, no overflow, responsive MessageBox', async () => {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1100 });
      for (const id of ['radio', 'checkbox', 'switch', 'tabs', 'empty', 'dialog']) {
        await go(id); assert(await page.locator('.cr-detail[data-active=true]').evaluate(e => e.scrollWidth <= e.clientWidth + 1), `${id}/${width}`);
        await preview.screenshot({ path: path.join(output, `${id}-${width}.png`) });
      }
      await preview.getByRole('button', { name: '打开输入弹框', exact: true }).click();
      const dialog = page.locator('dialog.rp-messagebox-live'), rect = await dialog.boundingBox(); assert(rect.x >= 16 && rect.x + rect.width <= width - 16);
      await dialog.screenshot({ path: path.join(output, `messagebox-live-${width}.png`) }); await page.keyboard.press('Escape');
    }
  });
  await check('Feedback assets use valid masks, not solid rectangles', async () => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    for (const id of ['alert', 'message', 'notification']) {
      await go(id); for (const icon of await preview.locator('.cr-feedback-icon>i,.cr-feedback-close>i').all()) assert.notEqual(await css(icon, 'maskImage'), 'none');
      await preview.screenshot({ path: path.join(output, `${id}-verified.png`) });
    }
  });
  await check('No browser/resource errors', async () => assert.deepEqual(errors, []));
} finally {
  await fs.writeFile(path.join(output, 'verification.json'), JSON.stringify({ date: new Date().toISOString(), results, errors }, null, 2)); await browser.close();
}
if (results.some(r => r.status !== 'passed')) process.exitCode = 1;
