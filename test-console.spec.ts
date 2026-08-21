import { test, expect } from '@playwright/test';

test('log console', async ({ page }) => {
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  
  await page.goto('http://localhost:3006');
  
  // Click the correct button
  await page.locator('button.bg-gold').last().click();
  
  // Type hello
  const input = page.locator('input[placeholder*="پیام خود را بنویسید"]');
  const inputEn = page.locator('input[placeholder*="Type your message"]');
  const activeInput = await input.count() > 0 ? input : inputEn;
  
  await activeInput.fill('سلام');
  await activeInput.press('Enter');
  
  await page.waitForTimeout(3000);
});
