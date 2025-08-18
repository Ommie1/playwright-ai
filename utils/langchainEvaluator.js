const { OpenAI } = require("langchain/llms/openai");
const { PromptTemplate } = require("langchain/prompts");
const { LLMChain } = require("langchain/chains");

// Create an OpenAI client via LangChain
const llm = new OpenAI({
  temperature: 0,
  modelName: "gpt-4o-mini",  // fast & cost-effective
  openAIApiKey: process.env.OPENAI_API_KEY
});

// Define the evaluation prompt
const evaluationPrompt = new PromptTemplate({
  template: `
You are evaluating a chatbot response.
The user asked: "{prompt}"
The chatbot responded: "{response}"

Rate the relevancy from 1 to 5:
- 5 = completely relevant
- 3 = somewhat relevant
- 1 = irrelevant

Return ONLY a JSON object like:
{ "score": X, "reason": "..." }
`,
  inputVariables: ["prompt", "response"]
});

// Build a chain
const chain = new LLMChain({ llm, prompt: evaluationPrompt });

// Exported helper function
async function evaluateResponse(prompt, response) {
  const result = await chain.call({ prompt, response });

  try {
    return JSON.parse(result.text);  // Expecting { score, reason }
  } catch (e) {
    return { score: 0, reason: "Failed to parse LangChain output" };
  }
}

module.exports = { evaluateResponse };
