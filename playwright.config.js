// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  retries: 1,
  workers: 1,   // 👈 Force Playwright to use only ONE worker
  reporter: [['html'], ['list']],
  use: {
    headless: false,   // 👈 open browser window
    viewport: { width: 1280, height: 720 },
    baseURL: 'https://govgpt.sandbox.dge.gov.ae/',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        channel: 'chrome'   // 👈 runs on your installed Google Chrome
      }
    }
  ]
});
