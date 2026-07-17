const { test, expect } = require('@playwright/test');

async function resetState(page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator('#menu')).toBeVisible();
}

async function seedState(page, state) {
  await page.goto('/');
  await page.evaluate((entries) => {
    localStorage.clear();
    Object.entries(entries).forEach(([key, value]) => {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    });
  }, state);
  await page.reload();
}

async function startGame(page) {
  await page.locator('#start-btn').click();
  await expect(page.locator('#menu')).toHaveClass(/hidden/);
}

test.describe('Robo Clicker smoke and regression', () => {
  test.beforeEach(async ({ page }) => {
    await resetState(page);
  });

  test('loads the main menu and works without Yandex SDK', async ({ page }) => {
    await expect(page).toHaveTitle('Robo Clicker');
    await expect(page.locator('.main-title')).toContainText('Robo Clicker');
    await expect(page.locator('#start-btn')).toBeVisible();
    await expect(page.locator('#score')).toHaveText('0');
    await expect(page.locator('#click-power-val')).toHaveText('1');
    await expect(page.locator('#btn-upgrade-click')).toBeDisabled();
    await expect(page.locator('#btn-auto-bot')).toBeDisabled();
  });

  test('opens and closes About and Settings', async ({ page }) => {
    await page.locator('#about-btn').click();
    await expect(page.locator('#about-modal')).toBeVisible();
    await page.locator('#close-about').click();
    await expect(page.locator('#about-modal')).toBeHidden();

    await page.locator('#settings-btn').click();
    await expect(page.locator('#settings')).toBeVisible();
    await page.locator('#close-settings').click();
    await expect(page.locator('#settings')).toBeHidden();
  });

  test('starts a new game', async ({ page }) => {
    await startGame(page);
    await expect(page.locator('#click-object')).toBeVisible();
    await expect(page.locator('.shop-panel')).toBeVisible();
  });

  test('increments score and statistics after a click', async ({ page }) => {
    await startGame(page);
    await page.locator('#click-object').click();
    await expect(page.locator('#score')).toHaveText('1');
    await page.locator('#btn-stats').click();
    await expect(page.locator('#stats-coins-current')).toHaveText('1');
    await expect(page.locator('#stats-total-clicks')).toHaveText('1');
  });

  test('reaches level 1 after 150 clicks', async ({ page }) => {
    await startGame(page);
    await page.locator('#click-object').evaluate((element) => {
      for (let i = 0; i < 150; i += 1) {
        element.dispatchEvent(new PointerEvent('pointerdown', {
          bubbles: true,
          pointerType: 'mouse',
          button: 0,
          clientX: 100,
          clientY: 100,
        }));
      }
    });
    await expect(page.locator('#level-text')).toHaveText(/LVL 1/);
    await expect(page.locator('#level-bar')).toHaveAttribute('aria-valuenow', '0');
  });

  test('switches interface language in the current session', async ({ page }) => {
    await page.locator('#settings-btn').click();
    await page.locator('#language-select').selectOption('en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('#start-btn')).toHaveText('Start game');
    await page.locator('#language-select').selectOption('ru');
    await expect(page.locator('#start-btn')).toHaveText('Начать игру');
  });

  test('applies and persists the light theme', async ({ page }) => {
    await page.locator('#settings-btn').click();
    await page.locator('.theme-select').selectOption('light');
    await expect(page.locator('body')).toHaveClass(/light_theme/);
    await page.reload();
    await expect(page.locator('body')).toHaveClass(/light_theme/);
  });

  test('buys a click upgrade at the boundary value', async ({ page }) => {
    await seedState(page, { coins: '85', clickPower: '1', clickUpgradePrice: '85' });
    await startGame(page);
    await expect(page.locator('#btn-upgrade-click')).toBeEnabled();
    await page.locator('#btn-upgrade-click').click();
    await expect(page.locator('#score')).toHaveText('0');
    await expect(page.locator('#click-power-val')).toHaveText('2');
  });

  test('buys a robot and receives automatic income', async ({ page }) => {
    await seedState(page, { coins: '200', robotPrice: '200', robotCount: '0', robotIncomePerSecond: '0' });
    await startGame(page);
    await page.locator('#btn-auto-bot').click();
    await expect(page.locator('#robot-info')).toContainText('1 куплено');
    await expect.poll(async () => Number(await page.locator('#score').innerText()), { timeout: 2500 }).toBeGreaterThanOrEqual(1);
  });

  test('buys and equips a skin', async ({ page }) => {
    await seedState(page, { coins: '800', skinsOwned: '[1]', skinSelected: '1' });
    await startGame(page);
    await page.locator('#btn-skins').click();
    await expect(page.locator('.skin-card')).toHaveCount(16);
    await page.locator('[data-skin-id="2"]').click();
    await expect(page.locator('#score')).toHaveText('0');
    await expect(page.locator('#click-object')).toHaveText('🔧');
  });

  test('buys a temporary boost and shows it as active', async ({ page }) => {
    await seedState(page, { coins: '300' });
    await startGame(page);
    await page.locator('#btn-boosts').click();
    await page.locator('[data-boost-id="neon_overdrive"]').click();
    await expect(page.locator('#score')).toHaveText('0');
    await expect(page.locator('#boosts-active-list')).toContainText(/Неоновый разгон|Neon Overdrive/);
    await expect(page.locator('[data-boost-id="neon_overdrive"]')).toBeDisabled();
  });

  test('opens achievements and renders achievement series', async ({ page }) => {
    await startGame(page);
    await page.locator('#btn-achievements').click({ force: true });
    await expect(page.locator('#achievements-modal')).toBeVisible();
    await expect(page.locator('.achievement-card')).toHaveCount(11);
    await expect(page.locator('#achievements-summary')).toContainText(/Завершено серий|Series completed/);
  });

  test('preserves score after reload', async ({ page }) => {
    await startGame(page);
    await page.locator('#click-object').click();
    await expect(page.locator('#score')).toHaveText('1');
    await page.reload();
    await expect(page.locator('#score')).toHaveText('1');
  });

  test('returns to the menu without losing score', async ({ page }) => {
    await startGame(page);
    await page.locator('#click-object').click();
    await page.locator('#back-menu-btn').click();
    await expect(page.locator('#menu')).toBeVisible();
    await page.locator('#start-btn').click();
    await expect(page.locator('#score')).toHaveText('1');
  });

  test('does not create horizontal page overflow', async ({ page }) => {
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflow).toBeFalsy();
  });
});
