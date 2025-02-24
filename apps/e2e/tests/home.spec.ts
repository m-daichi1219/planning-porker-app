import { test, expect } from "@playwright/test";

test("フロントページのタイトルを確認", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await expect(page).toHaveTitle(/Planning Poker/);
});
