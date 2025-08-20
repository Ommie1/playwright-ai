class ChatbotPage {
  constructor(page) {
    this.page = page;
    this.inputQuery = page.locator('#chat-input');
    this.emptyInputQuery = page.locator('.is-empty.is-editor-empty');
    this.queryResponse = page.locator('[id="messages-container"]');
    this.sendBtn = page.locator('#send-message-button');
    this.processingIndicator = page.getByText('Processing your request..');
  }

  async goto() {
    await this.page.goto('/');
  }

  async sendMessage(message) {
    await this.inputQuery.fill(message);
    await this.sendBtn.click();
  }

  async lastResponse() {
    await this.page.waitForFunction(
      () => document.querySelectorAll('.shimmer-text').length === 0,
      { timeout: 20000 }
    );
    await this.lastResponseLocator.waitFor({ state: 'visible', timeout: 20000 });
    return await this.lastResponseLocator.innerText();
  }
}

module.exports = { ChatbotPage };
