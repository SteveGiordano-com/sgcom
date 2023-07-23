import { test, expect } from "@playwright/test";
import configObj from "../../configs/env.config.js";

let url = "https://stevedoesitall.com";

if (configObj.environment === "development") {
	url = `http://localhost:${configObj.port}/`;
}

test("has title", async ({ page }) => {
	await page.goto(url);
	await expect(page).toHaveTitle(/Steve Does It All/);
});

// test("get started link", async ({ page }) => {
// 	await page.goto("https://playwright.dev/");

// 	// Click the get started link.
// 	await page.getByRole("link", { "name": "Get started" }).click();

// 	// Expects the URL to contain intro.
// 	await expect(page).toHaveURL(/.*intro/);
// });
