const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ChatbotPage } = require('../pages/ChatbotPage').default;
const { email, password } = require('../utils/config');
const testData = require('../../data/test-data.json'); // adjust path if needed

// ----------------------
// Desktop UI Tests
// ----------------------
test.describe('Chatbot UI Behavior - Desktop', () => {
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


// English Chatbot Tests
// ----------------------
test.describe.only('English Chatbot Tests', () => {
  let chatbot;

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(email, password);
    chatbot = new ChatbotPage(page);
  });

  test('User can send messages via input box', async ({ page }) => {

    // verify user can type in input box
    await chatbot.sendMessage('What are UAE visa requirements?');

    // Wait for analysing loader to complete to disappear 
    await expect(chatbot.processingIndicator).toBeHidden({ timeout: 60000 });

    // Get qury response
    const messagesContainer = chatbot.queryResponse;

    // Wait until text stops changing Chat GPT stream finished.
    let prevText = '';
    let stableCount = 0;
    for (let i = 0; i < 360; i++) { // up to ~60s (120 * 500ms)
      const currentText = await messagesContainer.innerText();
      if (currentText === prevText) {
        stableCount++;
        if (stableCount >= 2) break; // stable for 1s
      } else {
        stableCount = 0;
        prevText = currentText;
      }
      await page.waitForTimeout(500);
    }

    console.log('***************** Final Response Text:', prevText);
  });
});
