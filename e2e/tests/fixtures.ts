import { expect, type Page } from "@playwright/test";

export function requireAdminEnv() {
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;
  return { email, password, ready: Boolean(email && password) };
}

export async function loginAdmin(page: Page, email: string, password: string) {
  await page.goto("/admin/login");
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.click("button[type='submit']");
  await page.waitForURL("**/admin/dashboard", { timeout: 15000 });
  await expect(page).toHaveURL(/\/admin\/dashboard/);
}

export function uniqueText(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
}
