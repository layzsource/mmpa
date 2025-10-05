// Electron Main (Phase 13.0)
const { app, BrowserWindow, session } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    fullscreen: true,
    autoHideMenuBar: true,
    backgroundColor: "#000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true,
      autoplayPolicy: "no-user-gesture-required",
    },
  });
  win.loadFile(path.join(__dirname, "dist", "index.html"));
}

function wirePermissions() {
  session.defaultSession.setPermissionRequestHandler((wc, permission, cb) => {
    if (["media", "midi", "midiSysex"].includes(permission)) cb(true);
    else cb(false);
  });
}

app.whenReady().then(() => {
  wirePermissions();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => app.quit());
