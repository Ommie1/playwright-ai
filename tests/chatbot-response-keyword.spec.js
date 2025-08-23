const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pages/LoginPage");
const { ChatbotPage } = require("../pages/ChatbotPage");
const { email, password, STREAMING_WAIT_MS } = require("../utils/config");
const testData = require("../data/test-data.json");
const { saveResponse } = require("../utils/helper");
const { evaluateResponse } = require("../utils/aiEvaluator");

test.describe("Chatbot response validation", () => {
  let chatbot;

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(email, password);
    chatbot = new ChatbotPage(page);
  });

  for (const query of testData.multiLanguageQueries) {
    test(`Response validation: ${query.queryText}`, async ({ page }) => {
      // Send query
      await chatbot.sendMessage(query.queryText);
      await expect(chatbot.processingIndicator).toBeHidden({ timeout: 60000 });

      // Capture final response (stable streamed text)
      const messagesContainer = chatbot.queryResponse;
      let finalResponse = "";
      const start = Date.now();

      while (Date.now() - start < STREAMING_WAIT_MS) {
        const currentText = await messagesContainer.innerText();
        if (currentText !== finalResponse) {
          finalResponse = currentText;
        }
        await page.waitForTimeout(500);
      }
      // Save response to file for manual review
      saveResponse(finalResponse, "ai-response-log");

        // Keyword validation in AI repsonse
        if (query.expectedKeywords) {
          for (const keyword of query.expectedKeywords) {
            expect(finalResponse.toLowerCase()).toContain(
              keyword.toLowerCase(),
              `Expected keyword "${keyword}" missing in response for query: ${query.queryText}`
            );
          }
        }
    });
  }

  test.afterAll(async () => {
    setTimeout(() => process.exit(0), 1000);
  });
});
