import { test, expect } from "@playwright/test";

function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}@example.com`;
}

test("public packages page loads", async ({ page }) => {
  await page.goto("/packages");
  await expect(page.getByRole("heading", { name: /find your solo journey/i })).toBeVisible();
});

test("inquiry API accepts valid payload", async ({ request }) => {
  const servicesRes = await request.get("/api/services");
  expect(servicesRes.ok()).toBeTruthy();
  const servicesBody = (await servicesRes.json()) as { services: Array<{ slug: string }> };
  test.skip(!servicesBody.services?.[0]?.slug, "No active services available for inquiry test");

  const res = await request.post("/api/inquiries", {
    data: {
      fullName: "E2E Inquiry User",
      email: uniqueEmail("inquiry"),
      phone: "+919999999999",
      companyName: "",
      selectedServiceSlug: servicesBody.services[0].slug,
      budgetRange: "$1,000 - $2,500",
      message: "Automated inquiry",
      source: "website",
      website: "",
    },
  });

  if (res.status() === 429) {
    test.skip(true, "Inquiry endpoint rate-limited in current environment window");
  }

  expect(res.status()).toBe(201);
  const body = await res.json();
  expect(body.ok).toBeTruthy();
});

test("contact API accepts valid payload", async ({ request }) => {
  const res = await request.post("/api/contact-submissions", {
    data: {
      name: "E2E Contact User",
      email: uniqueEmail("contact"),
      subject: "E2E Contact Subject",
      message: "Automated contact message",
      source: "website",
      website: "",
    },
  });

  if (res.status() === 429) {
    test.skip(true, "Contact endpoint rate-limited in current environment window");
  }

  expect(res.status()).toBe(201);
  const body = await res.json();
  expect(body.ok).toBeTruthy();
});

test("newsletter API accepts valid payload", async ({ request }) => {
  const res = await request.post("/api/newsletter", {
    data: {
      email: uniqueEmail("newsletter"),
      source: "website",
    },
  });

  if (res.status() === 429) {
    test.skip(true, "Newsletter endpoint rate-limited in current environment window");
  }

  expect(res.status()).toBe(201);
  const body = await res.json();
  expect(body.ok).toBeTruthy();
});
