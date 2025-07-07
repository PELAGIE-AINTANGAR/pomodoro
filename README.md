# Pomodoro – Application de gestion de temps

**Pomodoro** est une  application(desktop) développée avec **Electron.js**, **JavaScript** et **Supabase**, elle permet aux utilisateurs de rester productifs grâce à la méthode Pomodoro : alterner des périodes de travail concentré et des pauses régulières.

## Objectif

Cette application aide les utilisateurs à rester concentrés en alternant sessions de travail et pauses. Elle permet également :
- La **connexion / inscription** via Supabase Auth
- L’**historique des sessions** Pomodoro sauvegardé dans Supabase
- Des **notifications desktop** au début, à la pause, à la reprise et la fin
- Un **paramétrage personnalisé** des durées (travail, pause courte, pause longue)

---

## Technologie utilisée

- **Electron.js** – Application desktop
- **JavaScript Vanilla** – Pas de framework frontend
- **Supabase** – Authentification + Base de données (PostgreSQL)
- **Node.js** – Lecture/écriture locale pour les sessions JSON 
- **HTML/CSS** – Interface simple et responsive

---

## Aperçu de l'application

| Connexion | Pomodoro | Historique |

---

## Installation

1. **Cloner le dépôt** :

```bash
git clone https://github.com/votre-utilisateur/pomodoro-devops.git
cd pomodoro-devops
```

2. **Installer les dépendances** :

```bash
npm install
npm install electron
npm install @supabase/supabase-js

```

3. **Configurer Supabase** :

- Crée un projet sur [https://supabase.io](https://supabase.io)
- Ajoute une table `sessions` avec les champs :
  - `id` (UUID, primary key)
  - `user_id` (UUID, relation avec auth.users)
  - `date` (timestamp)
  - `duration` (int)
- Mets à jour `supabase.js` avec tes credentials (`url` + `anon key`)

4. **Lancer l'application** :

```bash
npm start
```

---

## Structure du projet

```
pomodoro-devops/
│
├── main.js              # Entrée Electron
├── renderer.js          # Logique de l'interface (frontend)
├── supabase.js          # Connexion Supabase
├── storage.js           # Gestion locale des sessions
├── index.html           # Structure HTML
├── style.css            # Styles
├── bip.mp3              # Son de fin de session
└── package.json         # Dépendances
```

---

## Fonctionnalités clés

-  Authentification Supabase
-  Historique stocké en ligne
-  Stockage local JSON en complément
-  Notifications : début, pause, reprise
-  Son à la fin d'une session 
-  Responsive et simple d'utilisation

---

## Améliorations possibles

- Ajouter une **progress bar**
- Permettre la **synchronisation entre plusieurs machines**
- Ajouter des **statistiques visuelles (graphique)**

---

##  Auteur

Pélagie AINTANGAR – Alexandre PHAM  
Étudiant Bachelor 3 Ynov Informatique – Module **Développement Desktop**

