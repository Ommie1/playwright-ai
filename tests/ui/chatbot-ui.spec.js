const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { ChatbotPage } = require('../../pages/ChatbotPage');
const { email, password } = require('../../utils/config');
const testData = require('../../data/test-data.json'); // adjust path if needed

test.describe('Chatbot UI Behavior', () => {

  let chatbot;

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(email, password);
    chatbot = new ChatbotPage(page);
  });

  test('Widget loads correctly on desktop', async ({ page }) => {
    const chatbot = new ChatbotPage(page);
    await expect(chatbot.inputQuery).toBeVisible();
  });

  test('User can send messages via input box', async ({ page }) => {
    await chatbot.sendMessage('Hello');
    await expect(chatbot.queryResponse.last()).toContainText(
      'How can I assist you today?',
      { timeout: 15000 } // 15s is usually enough, avoid 50s unless API is slow
    );
  });

  
  for (const { prompt, expectedKeywords } of testData.english) {
    test.only(`English: "${prompt}"`, async () => {
      await chatbot.sendMessage(prompt);
      const response = await chatbot.lastResponse();

      // check each keyword is present
      for (const keyword of expectedKeywords) {
        expect(response.toLowerCase()).toContain(keyword.toLowerCase());
      }
      expect(response.length).toBeGreaterThan(10); // sanity check
    });
  }

});
