const fs = require('fs');
const path = require('path');

function saveSession(durationInMinutes) {
  const logPath = path.join(__dirname, 'sessions.json');
  let sessions = [];

  // ✅ Lecture du fichier existant avec fallback si vide ou corrompu
  if (fs.existsSync(logPath)) {
    try {
      const content = fs.readFileSync(logPath, 'utf8');
      sessions = content ? JSON.parse(content) : [];
    } catch (err) {
      console.warn("⚠️ Erreur lecture/parsing sessions.json :", err.message);
      sessions = [];
    }
  }

  // ➕ Ajout de la nouvelle session
  sessions.push({
    date: new Date().toISOString(),
    duration: durationInMinutes
  });

  // 💾 Sauvegarde dans le fichier
  try {
    fs.writeFileSync(logPath, JSON.stringify(sessions, null, 2), 'utf8');
    console.log("✅ Session locale enregistrée.");
  } catch (err) {
    console.error("❌ Erreur lors de l’écriture dans sessions.json :", err.message);
  }
}

module.exports = { saveSession };
