import { test, expect } from '@playwright/test';

test('admin login redirects to dashboard', async ({ page, baseURL }) => {
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;

  test.skip(!email || !password, 'E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD are required');

  await page.goto('/admin/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');

  // Expect navigation to dashboard
  await page.waitForURL('**/admin/dashboard', { timeout: 10000 });
  expect(page.url()).toContain('/admin/dashboard');
});
