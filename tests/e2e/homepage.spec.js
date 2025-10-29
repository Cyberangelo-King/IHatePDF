// Example E2E test for IHatePDF using Playwright
import { test, expect } from '@playwright/test';
import path from 'path';

test('homepage loads and shows main UI', async ({ page }) => {
  await page.goto('file://' + process.cwd() + '/index.html');
  await expect(page.getByAltText('Logo')).toBeVisible();
  await expect(page.locator('nav >> text=Merge')).toBeVisible();
  await expect(page.locator('text=Extract Images')).toBeVisible();
});

test('clicking on split shows the split UI', async ({ page }) => {
  await page.goto('file://' + process.cwd() + '/index.html');
  await page.click('text=Split');

  const fileInput = page.locator('div[x-show="activeTab === \'split\'"] input[type="file"]');
  await fileInput.setInputFiles({
    name: 'test.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('this is a test pdf'),
  });

  await expect(page.locator('input[placeholder="e.g., 1-3, 5, 7-9"]')).toBeVisible();
});

test('clicking on merge shows the merge UI', async ({ page }) => {
  await page.goto('file://' + process.cwd() + '/index.html');
  await page.click('text=Merge');
  await expect(page.locator('button:has-text("Merge PDFs")')).toBeVisible();
});
