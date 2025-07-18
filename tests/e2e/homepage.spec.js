// Example E2E test for IHatePDF using Playwright
import { test, expect } from '@playwright/test';

test('homepage loads and shows main UI', async ({ page }) => {
  await page.goto('file://' + process.cwd() + '/index.html');
  await expect(page.locator('text=IHatePDF')).toBeVisible();
  await expect(page.locator('text=Merge PDFs')).toBeVisible();
  await expect(page.locator('text=Extract Images')).toBeVisible();
});

// Add more E2E tests for file upload, merge, extract, etc.
