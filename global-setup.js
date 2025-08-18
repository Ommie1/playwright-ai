// global-setup.js
const fs = require('fs');
const path = require('path');

async function globalSetup() {
  // === Clean AI response logs ===
  const logDir = path.join(__dirname, 'ai-response-log');
  if (fs.existsSync(logDir)) {
    const files = fs.readdirSync(logDir).filter(f => f.endsWith('.txt'));
    for (const file of files) {
      fs.unlinkSync(path.join(logDir, file));
      console.log(`🗑 Deleted AI log: ${file}`);
    }
    if (files.length === 0) {
      console.log('No .txt files found in ai-response-log.');
    }
  } else {
    console.log('ai-response-log folder does not exist, skipping cleanup.');
  }

  // === Clean Playwright default report ===
  const pwReportDir = path.join(__dirname, 'playwright-report');
  if (fs.existsSync(pwReportDir)) {
    fs.rmSync(pwReportDir, { recursive: true, force: true });
    console.log('🗑 Deleted playwright-report folder.');
  } else {
    console.log('playwright-report folder does not exist, skipping cleanup.');
  }

  // === Clean custom HTML reports ===
  const reportDir = path.join(__dirname, 'reports');
  if (fs.existsSync(reportDir)) {
    const folders = fs.readdirSync(reportDir);
    for (const folder of folders) {
      const folderPath = path.join(reportDir, folder);
      fs.rmSync(folderPath, { recursive: true, force: true });
      console.log(`🗑 Deleted report folder: ${folder}`);
    }
    if (folders.length === 0) {
      console.log('No report folders found in /reports.');
    }
  } else {
    console.log('reports folder does not exist, skipping report cleanup.');
  }
}

module.exports = globalSetup;
