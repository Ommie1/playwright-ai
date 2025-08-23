// utils/aiEvaluator.js
function evaluateResponse(response, expectedKeywords) {
  if (!expectedKeywords || expectedKeywords.length === 0) return 100;

  let matched = 0;
  for (const keyword of expectedKeywords) {
    if (response.toLowerCase().includes(keyword.toLowerCase())) {
      matched++;
    }
  }

  // Simple scoring (percentage of matched keywords)
  const score = (matched / expectedKeywords.length) * 100;
  return Math.round(score);
}

module.exports = { evaluateResponse };
