const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow; // On déclare d'abord la variable

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Charge ton index.html
  mainWindow.loadFile('index.html');

  // ✅ Active les outils de dev une fois que la fenêtre est prête
  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.webContents.openDevTools();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
