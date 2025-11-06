// Electron Main (Phase 13.0)
const { app, BrowserWindow, session, ipcMain } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");

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

app.whenReady().then(() => {
  wirePermissions();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => app.quit());
