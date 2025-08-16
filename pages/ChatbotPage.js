class ChatbotPage {
  constructor(page) {
    this.page = page;
    this.inputQuery = page.locator('[id="chat-input"]');
    this.queryResponse = page.locator('[class="h-full flex pt-8"]');
    this.sendBtn = page.locator('[id="send-message-button"]');
  }

  async goto() {
    // Assuming chatbot loads after login
    await this.page.goto('/');
  }

  async sendMessage(message) {
    await this.inputQuery.fill(message);
    await this.sendBtn.click();
  }

  async lastResponse() {
    const last = this.queryResponse.last();
    await last.waitFor({ state: 'visible' });
    return await last.innerText();
  }
}

module.exports = { ChatbotPage };
