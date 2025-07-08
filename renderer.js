const { saveSession } = require('./storage');
const supabase = require('./supabase');
const fs = require('fs');
const path = require('path');

let timer;
let timeLeft = 25 * 60;
let isWorking = true;
let cycleCount = 0;
let paused = false;
let currentUser = null;

// Récupère les durées depuis les inputs
function getDurations() {
  return {
    work: parseInt(document.getElementById("work-duration")?.value) || 25,
    short: parseInt(document.getElementById("short-break")?.value) || 5,
    long: parseInt(document.getElementById("long-break")?.value) || 15,
  };
}
function updateNav() {
  const navPrivate = document.getElementById('private-nav');
  const pomodoroView = document.getElementById('pomodoro-view');
  const historyView = document.getElementById('history-view');

  const loggedIn = isAuthenticated();

  if (navPrivate) navPrivate.style.display = loggedIn ? 'inline-block' : 'none';
  if (pomodoroView) pomodoroView.style.display = loggedIn ? 'block' : 'none';
  if (historyView) historyView.style.display = loggedIn ? 'block' : 'none';
}

// Joue le bip sonore si activé                      
function playSound() {
  if (document.getElementById('sound-toggle')?.checked) {
    const audio = new Audio('bip.mp3');
    audio.play();
  }
}


function showView(view) {
  const sections = document.querySelectorAll('section');
  sections.forEach(section => section.style.display = 'none');

  const restrictedViews = ['pomodoro', 'history'];
  const isRestricted = restrictedViews.includes(view);

  if (isRestricted && !isAuthenticated()) {
    console.warn("Accès refusé : utilisateur non connecté");
    showView('login');
    return;
  }

  const target = document.getElementById(`${view}-view`);
  if (target) target.style.display = 'block';

  if (view === 'history') loadHistory();
}


// Inscription
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    document.getElementById('register-message').textContent = error.message;
    return;
  }

  // L'utilisateur est automatiquement connecté si l'email confirmation est désactivée
  const { data: { session, user } } = await supabase.auth.getSession();

  if (session) {
    currentUser = user;
    updateNav();
    showView('pomodoro');
    document.getElementById('register-message').textContent = "✅ Compte créé et connecté.";
  } else {
    document.getElementById('register-message').textContent = "❌ Compte créé, mais pas connecté.";
  }
});

  

// 👤 Connexion
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  document.getElementById('login-message').textContent = error
    ? error.message
    : '✅ Connexion réussie.';

  if (!error) {
    const { data: { user } } = await supabase.auth.getUser();
    currentUser = user;
    updateNav();
    showView('pomodoro');
  }
});

// 🔁 Déconnexion
async function logout() {
  await supabase.auth.signOut();
  currentUser = null;
  updateNav();
  showView('login');
}

// 🔍 Initialisation à l'ouverture
(async () => {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error("❌ Erreur récupération session Supabase :", error);
  }

  if (session && user) {
    const { data: { user } } = await supabase.auth.getUser();
    currentUser = user;
    console.log("✅ Utilisateur connecté :", currentUser);
    updateNav();
    showView('pomodoro');
  } else {
    currentUser = null;
    // updateNav();
    showView('login');
  }
})();



// Timer Pomodoro
function updateDisplay() {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

function updateSessionLabel() {
  document.getElementById('session-type').textContent = isWorking
    ? "Session de travail"
    : (cycleCount % 4 === 0 ? "Pause longue" : "Pause courte");
}

function startTimer() {
  clearInterval(timer);
  paused = false;

  const { work, short, long } = getDurations();
  const duration = isWorking
    ? work * 60
    : (cycleCount % 4 === 0 ? long * 60 : short * 60);

  timeLeft = duration;
  updateSessionLabel();
  updateDisplay();

  new Notification(isWorking ? 'Session de travail commencée' : 'Pause !', {
    body: isWorking ? `Concentre-toi pendant ${work} minutes 💪` : 'Détends-toi quelques minutes 😌',
  });

  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timer);
      playSound();
      // Affiche une notification de fin de session
      new Notification(isWorking ? 'Session de travail terminée' : 'Pause terminée', {
        body: isWorking ? `Bien joué ! Tu as travaillé pendant ${work} minutes 🎉` : `Ta pause de ${isWorking ? short : long} minutes est terminée, reprends le travail !`,
      });

      if (isWorking) {
        cycleCount++;
        saveSession(work);
        saveToSupabase(work);
      }
      isWorking = !isWorking;
      startTimer();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  paused = true;
  // Affiche une notification de pause
  new Notification('Pause activée', {
    body: 'Le timer est en pause. Reprends quand tu es prêt !',
  });
 
}

function resumeTimer() {
  if (!paused) return;
  paused = false;
  new Notification('Reprise de la session', {
    body: isWorking ? "C’est reparti pour le travail 💼" : "La pause continue 😌"
  });
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timer);
      playSound();
      if (isWorking) cycleCount++;
      isWorking = !isWorking;
      startTimer();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  const { work } = getDurations();
  timeLeft = work * 60;
  isWorking = true;
  paused = false;
  updateDisplay();
  updateSessionLabel();
}

updateDisplay();
updateSessionLabel();

// 💾 Historique
async function loadHistory() {
  console.log("📦 Tentative de chargement de l'historique...");
  console.log("👤 Utilisateur courant :", currentUser);
  const historyList = document.getElementById('history-list');
  historyList.innerHTML = '';

  // 🛡 Sécurité : vérifier si l'utilisateur est connecté
  if (!currentUser || !currentUser.id) {
    historyList.innerHTML = '<li>Utilisateur non connecté. Historique non disponible.</li>';
    console.warn("❌ Aucun utilisateur connecté au moment du chargement de l'historique.");
    return;
  }
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('date', { ascending: false });

  if (error) {
    historyList.innerHTML = `<li>Erreur : ${error.message}</li>`;
    return;
  }

  if (data.length === 0) {
    historyList.innerHTML = '<li>Aucune session trouvée.</li>';
    return;
  }
  console.log("📦 Historique chargé :", data);
  data.forEach((s, i) => {
    const date = new Date(s.date).toLocaleString('fr-FR');
    const duration = `${s.duration} minutes`;
    const item = document.createElement('li');
    item.textContent = `${i + 1}. ${date} — ${duration}`;
    historyList.appendChild(item);
  });
}
function isAuthenticated() {
  console.log("🧪 Vérif auth :", !!currentUser, currentUser);
  return !!currentUser;
}

// Envoi à Supabase
async function saveToSupabase(durationInMinutes) {
  if (!currentUser || !currentUser.id) {
    console.warn("Aucun utilisateur connecté. Session non sauvegardée.");
    return;
  }

  const newSession = {
    duration: durationInMinutes,
    user_id: currentUser.id,
    date: new Date().toISOString(), 
  };

  const { data, error } = await supabase
    .from('sessions')
    .insert([newSession]);

  if (error) {
    console.error('❌ Erreur Supabase (insertion session) :', error.message);
  } else {
    console.log('✅ Session enregistrée pour l’utilisateur connecté :', data);
  }
}
