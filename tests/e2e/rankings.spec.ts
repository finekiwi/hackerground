import { test, expect } from '@playwright/test';

test.describe('Rankings page (/rankings)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rankings');
    await page.waitForFunction(() => localStorage.getItem('hg:leaderboards') !== null);
  });

  test('renders page with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: '랭킹' })).toBeVisible();
  });

  test('shows leaderboard table headers', async ({ page }) => {
    await expect(page.getByRole('columnheader', { name: '순위' }).first()).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '팀명' }).first()).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '점수' }).first()).toBeVisible();
  });

  test('displays seed data entries', async ({ page }) => {
    await expect(page.getByRole('cell', { name: 'Team Alpha' })).toBeVisible();
    await expect(page.getByRole('cell', { name: '404found' })).toBeVisible();
  });

  test('hackathon filter narrows entries', async ({ page }) => {
    // Select a specific hackathon
    await page.getByLabel('해커톤 선택').click();
    await page.getByRole('option', { name: /Aimers/ }).click();

    // Should show Team Alpha but not 404found
    await expect(page.getByRole('cell', { name: 'Team Alpha' })).toBeVisible();
    await expect(page.getByRole('cell', { name: '404found' })).not.toBeVisible();
  });

  test('period filter "전체" shows all data', async ({ page }) => {
    await page.getByRole('button', { name: '전체' }).click();
    await expect(page.getByRole('cell', { name: 'Team Alpha' })).toBeVisible();
  });

  test('scores are sorted descending within a hackathon', async ({ page }) => {
    // Select aimers hackathon (has 2 entries)
    await page.getByLabel('해커톤 선택').click();
    await page.getByRole('option', { name: /Aimers/ }).click();

    const rows = page.locator('tbody tr');
    const firstScore = await rows.nth(0).locator('td').nth(2).textContent();
    const secondScore = await rows.nth(1).locator('td').nth(2).textContent();

    const parse = (s: string | null) => parseFloat((s ?? '0').replace(/,/g, ''));
    expect(parse(firstScore)).toBeGreaterThanOrEqual(parse(secondScore));
  });
});
