// Preload (Phase 13.0)
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
  getVersion: () => "Phase 13.0 Electron Baseline",

  // Native FFmpeg conversion (Phase 13.15)
  convertToMP4: async (webmData) => {
    return await ipcRenderer.invoke('convert-to-mp4', webmData);
  },

  // File system operations
  saveFile: async (filePath, content, type = 'json') => {
    return await ipcRenderer.invoke('save-file', { filePath, content, type });
  },

  // Settings management
  loadSettings: async () => {
    return await ipcRenderer.invoke('load-settings');
  },

  saveSettings: async (settings) => {
    return await ipcRenderer.invoke('save-settings', settings);
  },

  // Directory chooser
  chooseDirectory: async (defaultPath) => {
    return await ipcRenderer.invoke('choose-directory', defaultPath);
  }
});

// Phase 13.12 — Role flag exposed to renderer
const isElectron = true;
contextBridge.exposeInMainWorld('env', { isElectron });
