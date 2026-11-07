// Browser regressions may run against the password-enabled published build.
export async function unlockPreview(page) {
  const password = page.getByLabel('访问密码', { exact: true });
  await page.locator('.preview-access, .app-shell, .spec-app').first().waitFor();
  if (await password.isVisible()) {
    await password.fill(process.env.PREVIEW_PASSWORD || '888888');
    await page.getByRole('button', { name: '进入系统', exact: true }).click();
    await page.locator('.preview-access').waitFor({ state: 'detached' });
  }
}
