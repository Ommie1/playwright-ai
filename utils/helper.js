const fs = require('fs');
const path = require('path');

function saveResponse(responseText, folderRelative = 'ai-response-log') {
  const projectRoot = path.resolve(__dirname, '..');
  const folderPath = path.resolve(projectRoot, folderRelative);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(folderPath, `Prompt Response - ${timestamp}.txt`);

  fs.writeFileSync(filePath, responseText, 'utf-8');
  console.log(`Response written to: ${filePath}`);
  return filePath;
}

module.exports = { saveResponse };
