function isResponseRelevant(response, expectedKeywords) {
  return expectedKeywords.some(keyword => 
    response.toLowerCase().includes(keyword.toLowerCase())
  );
}

module.exports = { isResponseRelevant };
