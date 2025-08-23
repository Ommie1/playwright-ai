const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pages/LoginPage");
const { ChatbotPage } = require("../pages/ChatbotPage");
const { email, password, STREAMING_WAIT_MS } = require("../utils/config");
const testData = require("../data/test-data.json");
const { saveResponse } = require("../utils/helper");

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
      await chatbot.sendMessage(query.queryText);
      await expect(chatbot.processingIndicator).toBeHidden({ timeout: 60000 });

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

      saveResponse(finalResponse, "ai-response-log");

      // Scoring evaluation
      if (query.expectedKeywords) {
        const score = evaluateResponse(finalResponse, query.expectedKeywords);
        console.log(
          `Query: "${query.queryText}" | Score: ${score}% | Response: ${finalResponse}`
        );

        // Example: Require at least 70% match to pass
        expect(score).toBeGreaterThanOrEqual(
          70,
          `**********Low score for query: ${query.queryText}, got ${score}%`
        );
      }
    });
  }
});
