// Electron Main (Phase 13.0)
const { app, BrowserWindow, session, ipcMain, dialog } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");

// Settings file path
const SETTINGS_PATH = path.join(app.getPath('userData'), 'settings.json');

// Default settings
const DEFAULT_SETTINGS = {
  savePaths: {
    timelines: path.join(os.homedir(), 'MMPA_Data', 'timelines'),
    trainingData: path.join(os.homedir(), 'MMPA_Data', 'training_data'),
    experiments: path.join(os.homedir(), 'MMPA_Data', 'experiments')
  },
  filenamePatterns: {
    presets: 'presets_{date}',
    chains: 'chains_{date}',
    training: 'training_{date}'
  }
};

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

// IPC Handler: Convert WebM to MP4 using native FFmpeg
ipcMain.handle('convert-to-mp4', async (event, webmData) => {
  return new Promise((resolve, reject) => {
    console.log('🎥 Starting native FFmpeg conversion...');

    // Create temp files
    const tempDir = os.tmpdir();
    const timestamp = Date.now();
    const inputPath = path.join(tempDir, `mmpa_input_${timestamp}.webm`);
    const outputPath = path.join(tempDir, `mmpa_output_${timestamp}.mp4`);

    try {
      // Write WebM data to temp file
      const buffer = Buffer.from(webmData);
      fs.writeFileSync(inputPath, buffer);
      console.log(`🎥 Wrote ${(buffer.length / 1024 / 1024).toFixed(2)} MB to ${inputPath}`);

      // Spawn FFmpeg process
      const ffmpeg = spawn('ffmpeg', [
        '-i', inputPath,
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '18',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-y', // Overwrite output file
        outputPath
      ]);

      let stderr = '';

      ffmpeg.stderr.on('data', (data) => {
        stderr += data.toString();
        // Parse FFmpeg progress (optional - for future progress reporting)
        const timeMatch = stderr.match(/time=(\d+):(\d+):(\d+\.\d+)/);
        if (timeMatch) {
          const hours = parseInt(timeMatch[1]);
          const minutes = parseInt(timeMatch[2]);
          const seconds = parseFloat(timeMatch[3]);
          const totalSeconds = hours * 3600 + minutes * 60 + seconds;
          // Could send progress updates here via event.sender.send()
        }
      });

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          // Success - read output file
          try {
            const mp4Data = fs.readFileSync(outputPath);
            console.log(`🎥 Conversion successful: ${(mp4Data.length / 1024 / 1024).toFixed(2)} MB`);

            // Cleanup temp files
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);

            // Return as Uint8Array
            resolve(Array.from(mp4Data));
          } catch (error) {
            reject(new Error(`Failed to read output: ${error.message}`));
          }
        } else {
          // Failure
          console.error('🎥 FFmpeg failed:', stderr);

          // Cleanup temp files
          try {
            if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
          } catch {}

          reject(new Error(`FFmpeg exited with code ${code}`));
        }
      });

      ffmpeg.on('error', (error) => {
        console.error('🎥 FFmpeg spawn error:', error);

        // Cleanup temp files
        try {
          if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
          if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        } catch {}

        reject(new Error(`Failed to spawn FFmpeg: ${error.message}`));
      });

    } catch (error) {
      console.error('🎥 Conversion setup error:', error);
      reject(error);
    }
  });
});

// IPC Handler: Load settings
ipcMain.handle('load-settings', async () => {
  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      const data = fs.readFileSync(SETTINGS_PATH, 'utf8');
      return JSON.parse(data);
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return DEFAULT_SETTINGS;
  }
});

// IPC Handler: Save settings
ipcMain.handle('save-settings', async (event, settings) => {
  try {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf8');
    return { success: true };
  } catch (error) {
    console.error('Failed to save settings:', error);
    return { success: false, error: error.message };
  }
});

// IPC Handler: Save file to custom path
ipcMain.handle('save-file', async (event, { filePath, content, type = 'json' }) => {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    if (type === 'json') {
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
    } else {
      fs.writeFileSync(filePath, content, 'utf8');
    }

    console.log(`✅ Saved file: ${filePath}`);
    return { success: true, path: filePath };
  } catch (error) {
    console.error('Failed to save file:', error);
    return { success: false, error: error.message };
  }
});

// IPC Handler: Choose directory
ipcMain.handle('choose-directory', async (event, defaultPath) => {
  try {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory'],
      defaultPath: defaultPath || os.homedir()
    });

    if (result.canceled) {
      return { canceled: true };
    }

    return { canceled: false, path: result.filePaths[0] };
  } catch (error) {
    console.error('Failed to choose directory:', error);
    return { canceled: true, error: error.message };
  }
});

app.whenReady().then(() => {
  wirePermissions();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => app.quit());
