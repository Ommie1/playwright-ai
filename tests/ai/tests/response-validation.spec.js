const { test, expect } = require('@playwright/test');
const { evaluateResponse } = require('../../utils/langchainEvaluator');
const testData = require('../../data/test-data.json');

test.describe('Multilingual support with relevancy scoring', () => {
 let chatbot;

  test.beforeEach(async ({ browser }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(email, password);
    chatbot = new ChatbotPage(page);
  });


  // Loop through English prompts
  for (const { prompt, expectedDirection } of testData.english) {
    test(`English prompt: "${prompt}"`, async () => {
      await chatbot.sendMessage(prompt);

      const responseText = await chatbot.getResponseText();
      const direction = await chatbot.getResponseDirection();

      console.log('English Response:', responseText);
      expect(direction).toBe(expectedDirection);

      // LangChain scoring
      const evaluation = await evaluateResponse(prompt, responseText);
      console.log('English Eval:', evaluation);
      expect(evaluation.score).toBeGreaterThanOrEqual(3);
    });
  }

//   // Loop through Arabic prompts
//   for (const { prompt, expectedDirection } of testData.arabic) {
//     test(`Arabic prompt: "${prompt}"`, async () => {
//       await chatbot.sendMessage(prompt);

//       const responseText = await chatbot.getResponseText();
//       const direction = await chatbot.getResponseDirection();

//       console.log('Arabic Response:', responseText);
//       expect(direction).toBe(expectedDirection);

//       // LangChain scoring
//       const evaluation = await evaluateResponse(prompt, responseText);
//       console.log('Arabic Eval:', evaluation);
//       expect(evaluation.score).toBeGreaterThanOrEqual(3);
//     });
//   }
});
