class ChatbotPage {
  constructor(page) {
    this.page = page;
    this.input = page.locator('textarea.chat-input');
    this.messages = page.locator('.chat-message');
    this.sendBtn = page.locator('button.send-btn');
  }

  async goto() {
    // Assuming chatbot loads after login
    await this.page.goto('/');
  }

  async sendMessage(message) {
    await this.input.fill(message);
    await this.sendBtn.click();
  }

  async lastResponse() {
    return await this.messages.last().innerText();
  }
}

module.exports = { ChatbotPage };
