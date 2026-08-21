import { test, expect } from '@playwright/test';

test('chatbot interactions', async ({ page }) => {
  await page.goto('http://localhost:3006');
  
  // Find the exact button
  const chatButton = page.locator('button.w-14.h-14.bg-gold');
  await chatButton.click();
  
  // Wait for the input
  const input = page.locator('input[placeholder*="پیام خود را بنویسید"]');
  const inputEn = page.locator('input[placeholder*="Type your message"]');
  
  const activeInput = await input.count() > 0 ? input : inputEn;
  
  await activeInput.fill('سلام');
  await activeInput.press('Enter');
  
  // Wait a bit
  await page.waitForTimeout(3000);
  
  // Get all text inside the chat area
  const texts = await page.locator('.flex-1.overflow-y-auto').innerText();
  console.log("Chat text after enter:", texts);
});
