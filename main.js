// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // Tu HTML/JS funciona como en un navegador normal
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Carga tu index.html
  win.loadFile(path.join(__dirname, 'index.html'));

  // Si quieres ver siempre las devtools, descomenta:
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  // En macOS vuelve a crear ventana al reactivar la app
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Cerrar la app cuando se cierran todas las ventanas (menos en macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
