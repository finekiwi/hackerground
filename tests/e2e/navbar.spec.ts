import { test, expect } from '@playwright/test';

// Active nav links have 'font-medium' class; inactive links do not.
// Using 'font-medium' avoids false positives from 'hover:bg-accent/50'
// which is present on all inactive links and would match a naive /bg-accent/ regex.
const ACTIVE_CLASS = 'font-medium';

test.describe('Navbar', () => {
  test('no nav link is active on home route', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation');
    for (const label of ['해커톤', '팀 모집', '랭킹']) {
      const link = nav.getByRole('link', { name: label });
      await expect(link).not.toHaveClass(new RegExp(ACTIVE_CLASS));
    }
  });

  test('해커톤 link is active on /hackathons', async ({ page }) => {
    await page.goto('/hackathons');
    const nav = page.getByRole('navigation');
    await expect(nav.getByRole('link', { name: '해커톤' })).toHaveClass(new RegExp(ACTIVE_CLASS));
    await expect(nav.getByRole('link', { name: '팀 모집' })).not.toHaveClass(new RegExp(ACTIVE_CLASS));
    await expect(nav.getByRole('link', { name: '랭킹' })).not.toHaveClass(new RegExp(ACTIVE_CLASS));
  });

  test('팀 모집 link is active on /camp', async ({ page }) => {
    await page.goto('/camp');
    const nav = page.getByRole('navigation');
    await expect(nav.getByRole('link', { name: '팀 모집' })).toHaveClass(new RegExp(ACTIVE_CLASS));
    await expect(nav.getByRole('link', { name: '해커톤' })).not.toHaveClass(new RegExp(ACTIVE_CLASS));
  });

  test('랭킹 link is active on /rankings', async ({ page }) => {
    await page.goto('/rankings');
    const nav = page.getByRole('navigation');
    await expect(nav.getByRole('link', { name: '랭킹' })).toHaveClass(new RegExp(ACTIVE_CLASS));
    await expect(nav.getByRole('link', { name: '해커톤' })).not.toHaveClass(new RegExp(ACTIVE_CLASS));
  });

  test('해커톤 link is active on /hackathons sub-route', async ({ page }) => {
    await page.goto('/hackathons/some-slug');
    const nav = page.getByRole('navigation');
    await expect(nav.getByRole('link', { name: '해커톤' })).toHaveClass(new RegExp(ACTIVE_CLASS));
  });

  test('logo navigates to home', async ({ page }) => {
    await page.goto('/hackathons');
    // Logo is a sibling of <nav> inside <header>, not a child of <nav>
    await page.locator('header a[href="/"]').click();
    await expect(page).toHaveURL('/');
  });
});
