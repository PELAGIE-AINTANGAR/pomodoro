const fs = require('fs');
const path = require('path');

function saveSession(durationInMinutes) {
  const logPath = path.join(__dirname, 'sessions.json');
  let sessions = [];

  if (fs.existsSync(logPath)) {
    sessions = JSON.parse(fs.readFileSync(logPath));
  }

  sessions.push({ date: new Date().toISOString(), duration: durationInMinutes });

  fs.writeFileSync(logPath, JSON.stringify(sessions, null, 2));
}

module.exports = { saveSession };
