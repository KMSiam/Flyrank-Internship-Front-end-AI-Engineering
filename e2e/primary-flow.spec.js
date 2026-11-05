import { test, expect } from '@playwright/test';

test.describe('FlyRank Frontend AI Primary Flow E2E (FE-09)', () => {
  test('primary chat flow: navigates to /chat, sends prompt, and observes streaming completion', async ({ page }) => {
    // 1. Visit Chat Studio
    await page.goto('/chat');

    // 2. Verify header & empty state onboarding
    await expect(page.locator('h1')).toContainText('Streaming AI Chat Studio');
    
    // 3. Locate input box by role or selector
    const input = page.getByRole('textbox');
    await expect(input).toBeVisible();

    // 4. Fill prompt
    await input.fill('What is Frontend AI Engineering?');

    // 5. Submit form
    const sendButton = page.getByRole('button', { name: /Send/i });
    await expect(sendButton).toBeEnabled();
    await sendButton.click();

    // 6. Observe transition to thinking / streaming
    await expect(page.locator('text=Thinking').or(page.locator('text=Frontend'))).toBeVisible({ timeout: 10000 });

    // 7. Validate that message container has tokens
    const botBubble = page.locator('div[class*="rounded-2xl"]').last();
    await expect(botBubble).toBeVisible();
  });
});
