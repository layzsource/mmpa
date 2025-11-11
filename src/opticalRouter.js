// 📷 opticalRouter.js — Optical Recipe Integration
// Event-driven relay: CameraSignal → opticalState → MMPA features → Recipe interpretation
// Parallel to audioRouter.js - demonstrates universal recipe pattern

import { extractOpticalMMPAFeatures } from "./opticalFeatureExtractor.js";
import { recipeRegistry } from "./recipeEngine.js";
import { opticalRecipe } from "./recipes/opticalRecipe.js";
import { state } from "./state.js";

console.log("📷 opticalRouter.js loaded");

let opticalState = {
  brightness: 0,
  saturation: 0,
  motion: 0,
  edges: 0,
  imageData: null,
  frameHistory: []
};

// Frame history management
const MAX_FRAME_HISTORY = 5; // Keep last 5 frames for temporal analysis

/**
 * Initialize optical router and connect to camera signal
 */
export function initOpticalRouter() {
  console.log("📷 Initializing optical router...");

  // Register optical recipe with the global registry
  recipeRegistry.register(opticalRecipe);
  console.log("📋 Optical recipe registered with recipe engine");

  let frameCount = 0;
  let opticalFeatureExtractionStarted = false;
  let processingFrames = false;

  // Check periodically for camera signal provider
  const checkForCamera = setInterval(() => {
    const camera = window.cameraSignalProvider;

    if (camera && camera.enabled && camera.canvas) {
      console.log("📷 Camera signal detected - connecting optical router");
      clearInterval(checkForCamera);

      // Start processing camera frames
      processingFrames = true;
      processOpticalFrame();

      function processOpticalFrame() {
        if (!processingFrames || !camera.enabled) {
          processingFrames = false;
          return;
        }

        if (!camera.canvas || !camera.ctx) {
          console.warn("⚠️ opticalRouter: Camera canvas not available");
          requestAnimationFrame(processOpticalFrame);
          return;
        }

        // Start logging when first frame arrives
        if (!opticalFeatureExtractionStarted) {
          opticalFeatureExtractionStarted = true;
          console.log("📷 Optical MMPA feature extraction started (Camera is now running)");
        }

        try {
          // Get current frame data from camera canvas
          const canvas = camera.canvas;
          const ctx = camera.ctx;
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          // Update optical state (basic features if available from camera)
          opticalState.imageData = imageData;

          // Add to frame history for temporal analysis
          const frameData = {
            data: new Uint8ClampedArray(imageData.data), // Copy data
            width: imageData.width,
            height: imageData.height,
            timestamp: performance.now(),
            flux: opticalState.motion // Store flux from motion detection
          };

          opticalState.frameHistory.push(frameData);

          // Keep only last N frames
          if (opticalState.frameHistory.length > MAX_FRAME_HISTORY) {
            opticalState.frameHistory.shift();
          }

          // Extract MMPA features from optical data
          // Optical MMPA processing enabled by default when camera is running
          const opticalModeEnabled = state.optical?.enabled ?? true;

          if (opticalModeEnabled) {
            const opticalData = {
              imageData: imageData,
              frameHistory: opticalState.frameHistory,
              canvas: canvas
            };

            // Direct camera → MMPA feature extraction
            state.opticalMMPAFeatures = extractOpticalMMPAFeatures(opticalData);
            state.opticalMMPAFeatures.enabled = true;

            // Process MMPA features through optical recipe for interpretation
            // Process directly with optical recipe (allows parallel operation with audio recipe)
            const recipeResult = opticalRecipe.process(null, state.opticalMMPAFeatures);
            if (recipeResult) {
              state.opticalRecipeInterpretation = recipeResult;

              // Log recipe interpretation every 180 frames (~3 seconds at 60fps / ~6 seconds at 30fps)
              if (frameCount % 180 === 0) {
                console.log("📷 Optical pattern recognized:", {
                  pattern: recipeResult.interpretation.pattern.type,
                  confidence: (recipeResult.interpretation.pattern.confidence * 100).toFixed(0) + '%',
                  qualities: recipeResult.interpretation.qualities.join(', '),
                  alerts: recipeResult.interpretation.alerts.length
                });
              }
            }

            // Log MMPA features every 180 frames
            if (frameCount % 180 === 0) {
              console.log("📷 Optical MMPA features extracted:", {
                brightness: state.opticalMMPAFeatures.identity?.brightness?.toFixed(3),
                saturation: state.opticalMMPAFeatures.identity?.saturation?.toFixed(3),
                motion: state.opticalMMPAFeatures.transformation?.flux?.toFixed(3),
                edges: state.opticalMMPAFeatures.complexity?.edgeDensity?.toFixed(3)
              });
            }
          } else if (state.opticalMMPAFeatures?.enabled) {
            // Disable MMPA features when optical mode is off
            state.opticalMMPAFeatures.enabled = false;
            console.log("📷 Optical mode disabled - MMPA features disabled");
          }

          // Log every 60 frames (once per second at 60fps / once per 2 seconds at 30fps)
          if (frameCount++ % 60 === 0) {
            console.log("📷 Optical frame relay:", {
              frameHistorySize: opticalState.frameHistory.length,
              processing: processingFrames
            });
          }

        } catch (err) {
          console.error("❌ opticalRouter relay error:", err);
        }

        // Continue processing frames
        requestAnimationFrame(processOpticalFrame);
      }

      console.log("✅ Optical router connected to camera provider");
    }
  }, 1000); // Check every second

  // Note: No timeout - keep checking indefinitely since camera starts manually (user clicks "▶️ Start Camera")
  // The interval continues running until camera is detected and connected
}

export { opticalState };
console.log("📷 Optical routing configured");
