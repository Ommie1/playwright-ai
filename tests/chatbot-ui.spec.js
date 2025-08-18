const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ChatbotPage } = require('../pages/ChatbotPage').default;
const { email, password } = require('../utils/config');
const testData = require('../data/test-data.json'); // adjust path if needed

// ----------------------
// Desktop UI Tests
// ----------------------

let chatbot;

test.describe('Chatbot UI Behavior - Desktop', () => {

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
    await chatbot.sendMessage(testData.greetingText);
    // Verify response is received
    await expect(chatbot.queryResponse.last()).toContainText(testData.responseText,
      { timeout: 15000 }
    );
  });

  test('Input is cleared after sending', async () => {
    // Enter query
    await chatbot.sendMessage(testData.greetingText);
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

    test.afterAll(async () => {
    // give logs a chance to flush
    setTimeout(() => process.exit(0), 1000);
  });
});
