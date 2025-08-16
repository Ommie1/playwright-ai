const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { ChatbotPage } = require('../../pages/ChatbotPage');
const { email, password } = require('../../utils/config');

test.describe('Chatbot UI Behavior', () => {
  test('Login and open chatbot', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(email, password);

    const chatbot = new ChatbotPage(page);
    await expect(chatbot.input).toBeVisible();
  });

  test('Send message after login', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(email, password);

    const chatbot = new ChatbotPage(page);
    await chatbot.sendMessage('Hello');
    const response = await chatbot.lastResponse();
    expect(response).not.toBe('');
  });
});
