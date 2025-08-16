// const { test, expect } = require('@playwright/test');
// const { ChatbotPage } = require('../../pages/ChatbotPage');
// const { isResponseRelevant } = require('../../utils/semanticValidator');
// const testData = require('../../data/test-data.json');

// test.describe('AI Response Validation', () => {
//   for (const lang of Object.keys(testData)) {
//     for (const { prompt, expectedKeywords } of testData[lang]) {
//       test(`Validate response for: "${prompt}" [${lang}]`, async ({ page }) => {
//         const chatbot = new ChatbotPage(page);
//         await chatbot.goto();
//         await chatbot.sendMessage(prompt);
//         const response = await chatbot.lastResponse();
//         expect(isResponseRelevant(response, expectedKeywords)).toBeTruthy();
//       });
//     }
//   }
// });
