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

function isArabic(text) {
  return /[\u0600-\u06FF]/.test(text);
}


function saveScore(query, score, folder = "ai-response-score", fileName = "score-log.json") {
  const dir = path.join(process.cwd(), folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); // create folder if not exist

  const filePath = path.join(dir, fileName);
  let data = [];

  if (fs.existsSync(filePath)) {
    try {
      data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch {
      data = [];
    }
  }

  data.push({
    query,
    score: Number(score.toFixed(2)),
    timestamp: new Date().toISOString()
  });

  // Write JSON with utf8 encoding for Arabic/English support
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

module.exports = { isArabic, saveResponse, saveScore };
