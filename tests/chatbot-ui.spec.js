const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pages/LoginPage");
const { ChatbotPage } = require("../pages/ChatbotPage");
const { email, password, STREAMING_WAIT_MS } = require("../utils/config");
const testData = require("../data/test-data.json");
const { isArabic, saveResponse } = require("../utils/helper");

// ----------------------
// Desktop UI Tests
// ----------------------

let chatbot;

test.describe("Chatbot UI Behavior - Desktop", () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(email, password);
    chatbot = new ChatbotPage(page);
  });

  test("Verify that Chat widget loads correctly on desktop and mobile", async () => {
    // Verify query input box is visible
    await expect(chatbot.inputQuery).toBeVisible();
  });

  test("Verify that User can send messages via input box", async () => {
    // verify user can type in input box
    await chatbot.sendMessage(testData.greetingText);
    // Verify response is received
    await expect(chatbot.queryResponse.last()).toContainText(
      testData.responseText,
      { timeout: 15000 }
    );
  });

  test("Verify that AI responses are rendered properly in the conversation area", async () => {
    // verify user can type in input box
    await chatbot.sendMessage(testData.greetingText);
    // Verify AI response is rendered area
    await expect(chatbot.queryResponse).toBeVisible();
  });

  test("Input is cleared after sending", async () => {
    // Enter query
    await chatbot.sendMessage(testData.greetingText);
    // Verify query input is cleared
    await expect(chatbot.emptyInputQuery).toBeVisible();
  });

  test.afterAll(async () => {
    // give logs a chance to flush
    setTimeout(() => process.exit(0), 1000);
  });
});

// ----------------------
// Mobile UI Tests
// ----------------------
test.describe("Chatbot UI Behavior - Mobile", () => {
  test("Chat widget loads correctly on mobile", async ({ browser }) => {
    const mobile = await browser.newContext({
      viewport: { width: 390, height: 844 }, // iPhone 12 size
      isMobile: true,
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

// Multi Language Response Validation
test.describe("Multilingual support (LTR for English, RTL for Arabic)", () => {
  let chatbot;

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(email, password);
    chatbot = new ChatbotPage(page);
  });

  // Loop through all English prompts from JSON
  for (const query of testData.multiLanguageQueries) {
    test(`English response validation: ${query.queryText}`, async ({
      page,
    }) => {
      // Send question
      await chatbot.sendMessage(query.queryText);

      // Wait for loader to disappear
      await expect(chatbot.processingIndicator).toBeHidden({ timeout: 60000 });

      // Wait for final stable streamed response
      const messagesContainer = chatbot.queryResponse;
      let finalResponse = "";
      let stableCount = 0;

      const maxWaitMs = STREAMING_WAIT_MS; // Stream wait timeout 1 min
      const start = Date.now();

      while (Date.now() - start < maxWaitMs) {
        const currentText = await messagesContainer.innerText();

        if (currentText === finalResponse) {
        } else {
          stableCount = 0;
          finalResponse = currentText;
        }

        await page.waitForTimeout(500);
      }

      // Verify LTR and RTL languages
      const actualDirection = isArabic(finalResponse) ? "rtl" : "ltr";
      expect(actualDirection).toBe(query.expectedDirection);

      // For debugging: log the detected language direction
      // console.log(
      //   `Language Detected: ${actualDirection.toUpperCase()} | Expected: ${query.expectedDirection.toUpperCase()}`
      // );

      // Save response with timestamp
      saveResponse(finalResponse, "ai-response-log");
    });
  }

  test.afterAll(async () => {
    // give logs a chance to flush
    setTimeout(() => process.exit(0), 1000);
  });
});
