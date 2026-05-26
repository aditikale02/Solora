import { test, expect } from "@playwright/test";
import { loginAdmin, requireAdminEnv } from "./fixtures";

test("protected route redirects unauthenticated users", async ({ page }) => {
  await page.goto("/admin/dashboard");
  await page.waitForURL("**/admin/login", { timeout: 10000 });
  await expect(page).toHaveURL(/\/admin\/login/);
});

test("admin login and logout flow", async ({ page }) => {
  const { email, password, ready } = requireAdminEnv();
  test.skip(!ready, "E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD are required");

  await loginAdmin(page, String(email), String(password));
  await page.getByRole("button", { name: /logout/i }).click();
  await page.waitForURL("**/admin/login", { timeout: 10000 });
  await expect(page).toHaveURL(/\/admin\/login/);
});
