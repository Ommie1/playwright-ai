// global-setup.js
const fs = require('fs');
const path = require('path');

async function globalSetup() {
  const logDir = path.join(__dirname, 'ai-response-log');

  if (fs.existsSync(logDir)) {
    const files = fs.readdirSync(logDir).filter(f => f.endsWith('.txt'));
    for (const file of files) {
      fs.unlinkSync(path.join(logDir, file));
      console.log(`🗑 Deleted: ${file}`);
    }
    if (files.length === 0) {
      console.log('No .txt files found to delete.');
    }
  } else {
    console.log('ai-response-log folder does not exist, skipping cleanup.');
  }
}

module.exports = globalSetup;
