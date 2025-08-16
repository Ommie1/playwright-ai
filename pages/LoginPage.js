class LoginPage {
  constructor(page) {
    this.page = page;
    this.signInLink = page.locator('[class="text-[14px] text-[#CEE7FF] leading-normal font-medium cursor-pointer"]');
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginBtn = page.locator('[type="submit"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(email, password) {
    await this.signInLink.click();
    await this.page.waitForSelector('input[type="email"]');
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginBtn.click();
  }
}

module.exports = { LoginPage };
