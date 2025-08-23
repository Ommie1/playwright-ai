const stringSimilarity = require("string-similarity");

/**
 * Evaluate chatbot response against expectations
 * @param {string} query - User input/query
 * @param {string} response - AI chatbot response
 * @param {object} criteria - { direction?, keywords?, expectedAnswer? }
 */
async function evaluateResponse(query, response, criteria = {}) {
  let score = 0;
  let relevant = true;

  // --- Keyword check (if provided)
  if (criteria.keywords && criteria.keywords.length > 0) {
    const missing = criteria.keywords.filter(
      (kw) => !response.toLowerCase().includes(kw.toLowerCase())
    );
    if (missing.length > 0) {
      relevant = false;
    }
  }

  // --- Similarity score (if expected answer given)
  if (criteria.expectedAnswer) {
    score = stringSimilarity.compareTwoStrings(
      criteria.expectedAnswer.toLowerCase(),
      response.toLowerCase()
    );
  } else {
    // fallback: check similarity with query itself
    score = stringSimilarity.compareTwoStrings(
      query.toLowerCase(),
      response.toLowerCase()
    );
  }

  return {
    relevant,
    score: Math.round(score * 100) / 100, // keep 2 decimals
    passed: relevant && score > 0.6, // pass threshold = 0.6
  };
}

module.exports = { evaluateResponse };
