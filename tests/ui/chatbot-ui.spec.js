const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { ChatbotPage } = require('../../pages/ChatbotPage').default;
const { email, password } = require('../../utils/config');
const testData = require('../../data/test-data.json'); // adjust path if needed

// ----------------------
// Desktop UI Tests
// ----------------------
test.describe.only('Chatbot UI Behavior - Desktop', () => {
  let chatbot;

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(email, password);
    chatbot = new ChatbotPage(page);
  });

  test('Widget loads correctly on desktop', async () => {
    // Verify query input box is visible
    await expect(chatbot.inputQuery).toBeVisible();
  });

  test('User can send messages via input box', async () => {
    // verify user can type in input box
    await chatbot.sendMessage('Hello');
    // Verify response is received
    await expect(chatbot.queryResponse.last()).toContainText(
      'How can I assist you today?',
      { timeout: 15000 }
    );
  });

  test('Input is cleared after sending', async ({ browser }) => {
    // Enter query
    await chatbot.sendMessage('Hello');
    // Verify query input is cleared
    await expect(chatbot.emptyInputQuery).toBeVisible();

  });
});


// ----------------------
// Mobile UI Tests
// ----------------------
test.describe('Chatbot UI Behavior - Mobile', () => {
  test('Chat widget loads correctly on mobile', async ({ browser }) => {
    const mobile = await browser.newContext({
      viewport: { width: 390, height: 844 }, // iPhone 12 size
      isMobile: true
    });
    const page = await mobile.newPage();

    const login = new LoginPage(page);
    await login.goto();
    await login.login(email, password);

    const chatbot = new ChatbotPage(page);
    await expect(chatbot.inputQuery).toBeVisible();

    await mobile.close();
  });
});

// ----------------------
// English Chatbot Tests
// ----------------------
test.describe('English Chatbot Tests', () => {
  let chatbot;

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(email, password);
    chatbot = new ChatbotPage(page);
  });

  for (const { prompt, expectedKeywords } of testData.english) {
    test(`English: "${prompt}"`, async () => {
      await chatbot.sendMessage(prompt);

      // waits until last response is ready
      const response = await chatbot.lastResponse();

      for (const keyword of expectedKeywords) {
        expect(response.toLowerCase()).toContain(keyword.toLowerCase());
      }
      expect(response.length).toBeGreaterThan(10);
    });
  }
});
