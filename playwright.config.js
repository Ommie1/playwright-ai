// @ts-check
const { defineConfig } = require('@playwright/test');

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 600000,
  retries: 1,
  workers: 1,   // 👈 Force Playwright to use only ONE worker
  reporter:  [
    ['list'],
    ['html', { open: 'never', outputFolder: `reports/html-report-${timestamp}` }]
  ],
  use: {
    headless: false,   // 👈 open browser window
    viewport: null,
    baseURL: 'https://govgpt.sandbox.dge.gov.ae/',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        channel: 'firefox'   // 👈 runs on your installed Google Chrome
      }
    }
  ]
});
