// Preload (Phase 13.0)
const { contextBridge } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
  getVersion: () => "Phase 13.0 Electron Baseline",
});

// Phase 13.12 — Role flag exposed to renderer
const isElectron = true;
contextBridge.exposeInMainWorld('env', { isElectron });
