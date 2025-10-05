import { defineConfig } from "vite";

// Phase 13.0 — Electron-friendly build
export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
    emptyOutDir: true,
  },
  server: { port: 3002 },
});
