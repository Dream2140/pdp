import { test, expect } from "@playwright/test";

test("home page shows news list", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("Latest News");
  const articles = page.locator("a[href^='/news/']");
  await expect(articles).toHaveCount(6);
});

test("can navigate to a news article and back", async ({ page }) => {
  await page.goto("/");
  await page.locator("a[href^='/news/']").first().click();
  await expect(page.locator("h1")).toBeVisible();
  await page.locator("a[href='/']").click();
  await expect(page.locator("h1")).toHaveText("Latest News");
});

test("healthcheck API returns ok", async ({ request }) => {
  const response = await request.get("/api/healthcheck");
  expect(response.ok()).toBeTruthy();
  expect(await response.json()).toEqual({ status: "ok" });
});
