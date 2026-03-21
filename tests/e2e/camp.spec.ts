import { test, expect } from '@playwright/test';

test.describe('Camp page (/camp)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/camp');
    await page.waitForFunction(() => localStorage.getItem('hg:teams') !== null);
  });

  test('renders page with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: '팀 모집' })).toBeVisible();
  });

  test('displays seed team cards', async ({ page }) => {
    // At least one of the seed teams should be visible
    await expect(page.getByText('Team Alpha')).toBeVisible();
  });

  test('hackathon filter changes displayed cards', async ({ page }) => {
    // Wait for cards to render
    await expect(page.getByText('Team Alpha')).toBeVisible();
    const initialCount = await page.locator('.rounded-xl.border.bg-card').count();
    expect(initialCount).toBeGreaterThanOrEqual(2);

    // Filter to a specific hackathon
    await page.getByLabel('해커톤 필터').click();
    await page.getByRole('option', { name: /Aimers/ }).click();

    // Wait for filter to take effect
    await expect(page.getByText('1개 팀')).toBeVisible();
    const filteredCount = await page.locator('.rounded-xl.border.bg-card').count();
    expect(filteredCount).toBeLessThan(initialCount);
  });

  test('create team dialog flow', async ({ page }) => {
    // Open dialog
    await page.getByRole('button', { name: '팀 등록하기' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Fill form fields
    await page.getByLabel('팀 이름').fill('TestTeam');
    await page.getByLabel('팀 소개').fill('테스트 팀입니다');
    await page.getByLabel('현재 인원').fill('2');
    await page.getByLabel('찾는 포지션').fill('Frontend, Backend');

    // Select hackathon
    await page.getByLabel('해커톤 선택').click();
    await page.getByRole('option', { name: /Aimers/ }).click();

    await page.getByLabel('연락 링크').fill('https://example.com/contact');

    // Submit
    await page.getByRole('button', { name: '등록' }).click();

    // Dialog should close and new card should appear
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText('TestTeam')).toBeVisible();
  });

  test('create team dialog validates required fields', async ({ page }) => {
    await page.getByRole('button', { name: '팀 등록하기' }).click();

    // Submit without filling anything
    await page.getByRole('button', { name: '등록' }).click();

    // Error messages should appear
    await expect(page.getByText('팀 이름을 입력해 주세요')).toBeVisible();
    await expect(page.getByText('팀 소개를 입력해 주세요')).toBeVisible();
    await expect(page.getByText('해커톤을 선택해 주세요')).toBeVisible();
  });
});
