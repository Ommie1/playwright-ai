const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ChatbotPage } = require('../pages/ChatbotPage').default;
const { email, password } = require('../utils/config');
const promptQuery = require('../ai-prompt-queries/prompt-queries.json');
const { saveResponse } = require('../utils/helper');

test.describe('Multi Language - Response validation', () => {
  let chatbot;

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(email, password);
    chatbot = new ChatbotPage(page);
  });

  // Loop through all English prompts from JSON
  for (const query of promptQuery) {
    test(`English response validation: ${query.prompt}`, async ({ page }) => {
      // Send question
      await chatbot.sendMessage(query.prompt);

      // Wait for loader to disappear
      await expect(chatbot.processingIndicator).toBeHidden({ timeout: 60000 });

      // Wait for final stable streamed response
      const messagesContainer = chatbot.queryResponse;
      let finalResponse = '';
      let stableCount = 0;

      const maxWaitMs = 15000; // 15 seconds max wait
      const start = Date.now();

      while (Date.now() - start < maxWaitMs) {
        const currentText = await messagesContainer.innerText();

        if (currentText === finalResponse) {
          stableCount++;
          if (stableCount >= 2) break; // stable for ~1s
        } else {
          stableCount = 0;
          finalResponse = currentText;
        }

        await page.waitForTimeout(500);
      }

      console.log('***************** Final Response Text:', finalResponse);

      // Save response with timestamp
      saveResponse(finalResponse, 'ai-response-log');
    });
  }

  test.afterAll(async () => {
    // give logs a chance to flush
    setTimeout(() => process.exit(0), 1000);
  });
});














// const { test, expect } = require('@playwright/test');
// const { LoginPage } = require('../pages/LoginPage');
// const { ChatbotPage } = require('../pages/ChatbotPage').default;
// const { email, password } = require('../utils/config');
// const promptQuery = require('../ai-prompt-queries/prompt-queries.json');
// const { saveResponse } = require('../utils/helper');

// test.describe.only('English Chatbot Tests', () => {
//   let chatbot;

//   test.beforeEach(async ({ page }) => {
//     const login = new LoginPage(page);
//     await login.goto();
//     await login.login(email, password);
//     chatbot = new ChatbotPage(page);
//   });

//   // Loop through all English prompts from JSON
//   for (const query of promptQuery) {
//     test(`English response validation: ${query.prompt}`, async ({ page }) => {
//       // Send question
//       await chatbot.sendMessage(query.prompt);

//       // Wait for loader to disappear
//       await expect(chatbot.processingIndicator).toBeHidden({ timeout: 60000 });

//       // Get streamed response
//       const messagesContainer = chatbot.queryResponse;
//       let finalResponse = '';
//       let stableCount = 0;

//       for (let i = 0; i < 500; i++) {
//         const currentText = await messagesContainer.innerText();
//         if (currentText === finalResponse) {
//           stableCount++;
//           if (stableCount >= 2) break; // stable for 1s
//         } else {
//           stableCount = 0;
//           finalResponse = currentText;
//         }
//         await page.waitForTimeout(500);
//       }

//       console.log('***************** Final Response Text:', finalResponse);

//       //Save response with timestamp
//       saveResponse(finalResponse, 'ai-response-log');
//     });
//   }
// });
