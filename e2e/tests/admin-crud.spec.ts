import path from "path";
import { test, expect } from "@playwright/test";
import { loginAdmin, requireAdminEnv, uniqueText } from "./fixtures";

test("admin destination and package CRUD with image upload", async ({ page }) => {
  const { email, password, ready } = requireAdminEnv();
  test.skip(!ready, "E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD are required");

  await loginAdmin(page, String(email), String(password));

  // Destination create
  const destinationName = uniqueText("e2e-destination");
  await page.getByPlaceholder("New destination").fill(destinationName);
  await page.getByRole("button", { name: /^add$/i }).click();
  await expect(page.locator(".font-medium", { hasText: destinationName }).first()).toBeVisible();
  await expect(page.getByPlaceholder("New destination")).toHaveValue("");

  // Destination update
  const destinationTitle = page.locator("div.font-medium", { hasText: destinationName }).first();
  const destinationRow = destinationTitle.locator("xpath=ancestor::div[contains(@class,'rounded-md')][1]");
  await destinationRow.getByRole("button", { name: /^edit$/i }).click();
  const updatedDestinationName = `${destinationName}-updated`;
  await page.getByPlaceholder("New destination").fill(updatedDestinationName);
  await expect(page.getByRole("button", { name: /^save$/i })).toBeEnabled();
  await page.getByRole("button", { name: /^save$/i }).click();
  await expect(page.locator(".font-medium", { hasText: updatedDestinationName }).first()).toBeVisible();

  // Package create
  const packageTitle = uniqueText("e2e-package");
  await expect(page.locator("select").first().locator("option", { hasText: updatedDestinationName })).toHaveCount(1);
  await page.locator("select").first().selectOption({ label: updatedDestinationName });
  await page.locator("label", { hasText: "Title" }).first().locator("xpath=..").locator("input").fill(packageTitle);
  await page.locator("textarea.min-h-28").fill("Automated e2e package description for validation.");
  await page.locator("label", { hasText: "Days" }).first().locator("xpath=..").locator("input").fill("4");
  await page.locator("label", { hasText: "Price" }).first().locator("xpath=..").locator("input").fill("19999");
  await page.locator("label", { hasText: "Currency" }).first().locator("xpath=..").locator("input").fill("INR");
  await page.getByRole("button", { name: /save package/i }).click();
  await expect(page.getByText(/package saved\./i)).toBeVisible({ timeout: 10000 });
  await expect(page.locator("article", { hasText: packageTitle }).first()).toBeVisible({ timeout: 15000 });

  // Package update
  const packageCard = page.locator("article", { hasText: packageTitle }).first();
  await packageCard.getByRole("button", { name: /edit/i }).click();
  const updatedPackageTitle = `${packageTitle}-updated`;
  await page.locator("label", { hasText: "Title" }).first().locator("xpath=..").locator("input").fill(updatedPackageTitle);
  await page.getByRole("button", { name: /save package/i }).click();
  await expect(page.getByText(updatedPackageTitle)).toBeVisible();

  // Image upload
  await page.getByRole("button", { name: /^images$/i }).click();
  await page.locator("select").first().selectOption({ label: updatedPackageTitle });
  const imagePath = path.resolve(process.cwd(), "..", "artifacts", "solora", "src", "assets", "images", "dest-healing.jpg");
  await page.locator("input[type='file']").setInputFiles(imagePath);
  await page.getByRole("button", { name: /upload image/i }).click();
  await expect(page.getByText(/image uploaded\./i)).toBeVisible({ timeout: 15000 });

  // Cleanup package via its card delete action
  await page.getByRole("button", { name: /^packages$/i }).click();
  await page.locator("article", { hasText: updatedPackageTitle }).first().getByRole("button", { name: /delete/i }).click();
  await expect(page.locator("article", { hasText: updatedPackageTitle }).first()).toHaveCount(0);

  // Destination cleanup is intentionally skipped here to avoid brittle row-level selectors;
  // backend persistence is verified separately in the API/database checks.
});
