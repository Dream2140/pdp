import { test, expect } from "@playwright/test";

const BASE = "https://pdp-news-prod.fly.dev";

test.describe("Production Monitoring", () => {
  test("healthcheck returns ok", async ({ request }) => {
    const response = await request.get(`${BASE}/api/healthcheck`);
    expect(response.ok()).toBeTruthy();
    expect(await response.json()).toEqual({ status: "ok" });
  });

  test("homepage loads with news from database", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator("h1")).toHaveText("Latest News");
    const articles = page.locator("a[href^='/news/']");
    const count = await articles.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("can open a news article", async ({ page }) => {
    await page.goto(BASE);
    await page.locator("a[href^='/news/']").first().click();
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("text=Back to news")).toBeVisible();
  });

  test("metrics endpoint returns prometheus data", async ({ request }) => {
    const response = await request.get(`${BASE}/api/metrics`);
    expect(response.ok()).toBeTruthy();
    const body = await response.text();
    expect(body).toContain("process_cpu");
  });

  test("page loads within 3 seconds", async ({ page }) => {
    const start = Date.now();
    await page.goto(BASE);
    await expect(page.locator("h1")).toBeVisible();
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(3000);
  });
});
