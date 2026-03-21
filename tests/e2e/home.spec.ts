import { test, expect } from '@playwright/test';

test.describe('Home page (/)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for StorageInitializer useEffect to seed localStorage before each test
    await page.waitForFunction(() => localStorage.getItem('hg:hackathons') !== null);
  });

  test('renders hero section with title and CTA buttons', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: '해커톤 보러가기' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: '팀 모집 보기' })).toBeVisible();
  });

  test('renders three feature cards', async ({ page }) => {
    // Scope to card links by href to avoid matching navbar links
    await expect(page.locator('a[href="/hackathons"]').first()).toBeVisible();
    await expect(page.locator('a[href="/camp"]').first()).toBeVisible();
    await expect(page.locator('a[href="/rankings"]').first()).toBeVisible();
  });

  test('feature cards navigate to correct routes', async ({ page }) => {
    await page.getByRole('link', { name: '해커톤 보러가기' }).first().click();
    await expect(page).toHaveURL('/hackathons');

    await page.goto('/');
    await page.getByRole('link', { name: '팀 모집 보기' }).click();
    await expect(page).toHaveURL('/camp');
  });

  test('seeds localStorage with correct keys on first load', async ({ page }) => {
    // hg:hackathons is already confirmed non-null by beforeEach waitForFunction
    const keys = ['hg:hackathons', 'hg:teams', 'hg:leaderboards', 'hg:hackathon_details', 'hg:submissions'];
    for (const key of keys) {
      const value = await page.evaluate((k) => localStorage.getItem(k), key);
      expect(value, `expected "${key}" to be seeded`).not.toBeNull();
    }
    const hackathons = await page.evaluate(() => JSON.parse(localStorage.getItem('hg:hackathons')!));
    expect(hackathons.length).toBeGreaterThan(0);
  });

  test('initStorage does not overwrite existing data on reload', async ({ page }) => {
    // Tamper with a value — hg:seed_version is already set, so reload will not re-seed
    await page.evaluate(() => {
      const data = JSON.parse(localStorage.getItem('hg:hackathons')!);
      data[0].title = '__tampered__';
      localStorage.setItem('hg:hackathons', JSON.stringify(data));
    });

    await page.reload();
    await page.waitForFunction(() => localStorage.getItem('hg:hackathons') !== null);

    const title = await page.evaluate(() => {
      const data = JSON.parse(localStorage.getItem('hg:hackathons')!);
      return data[0].title;
    });
    expect(title).toBe('__tampered__');
  });

  test('dark mode toggle switches theme class on <html>', async ({ page }) => {
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);

    await page.getByRole('button', { name: '테마 전환' }).click();
    await expect(html).toHaveClass(/dark/);

    await page.getByRole('button', { name: '테마 전환' }).click();
    await expect(html).not.toHaveClass(/dark/);
  });

  test('renders stats bar with seed data counts', async ({ page }) => {
    await expect(page.getByText('해커톤').first()).toBeVisible();
    await expect(page.getByText('등록 팀')).toBeVisible();
    await expect(page.getByText('리더보드 항목')).toBeVisible();
  });
});
