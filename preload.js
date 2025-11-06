// Preload (Phase 13.0)
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
  getVersion: () => "Phase 13.0 Electron Baseline",
  // Native FFmpeg conversion (Phase 13.15)
  convertToMP4: async (webmData) => {
    return await ipcRenderer.invoke('convert-to-mp4', webmData);
  }
});

// Phase 13.12 — Role flag exposed to renderer
const isElectron = true;
contextBridge.exposeInMainWorld('env', { isElectron });
