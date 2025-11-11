/**
 * Optical MMPA Feature Extractor
 *
 * Maps optical/visual analysis features to MMPA structure for pattern recognition.
 * Runs in parallel with audioFeatureExtractor.js - user can switch modes.
 *
 * This demonstrates the universal MMPA pattern: ANY domain → 6 forces → Domain-specific interpretation
 */

console.log("📷 opticalFeatureExtractor.js loaded");

/**
 * Map optical data to MMPA feature structure
 * @param {Object} opticalData - { imageData: ImageData, frameHistory: [], canvas: HTMLCanvasElement }
 * @returns {Object} - MMPA-compatible feature structure
 */
export function extractOpticalMMPAFeatures(opticalData) {
  const { imageData, frameHistory = [], canvas } = opticalData;

  // Extract basic visual features from image data
  const visualFeatures = analyzeImageData(imageData);

  // Calculate temporal features from frame history
  const temporalFeatures = analyzeTemporalChange(frameHistory);

  // Calculate spatial features
  const spatialFeatures = analyzeSpatialDistribution(imageData);

  return {
    enabled: true,
    source: 'optical',

    // Identity: What visual content is present?
    identity: {
      brightness: visualFeatures.brightness,      // Average luminance (0-1)
      hue: visualFeatures.dominantHue,            // Dominant hue (0-1, maps to 0-360°)
      saturation: visualFeatures.saturation,      // Color saturation (0-1)
      dominantColor: visualFeatures.dominantColor // RGB array
    },

    // Relationship: How do visual elements relate?
    relationship: {
      harmony: visualFeatures.colorHarmony,       // Color harmony score (0-1)
      distribution: spatialFeatures.distribution, // Spatial spread (0-1)
      contrast: visualFeatures.contrast          // Contrast ratio (0-1)
    },

    // Complexity: How detailed is the visual scene?
    complexity: {
      detail: spatialFeatures.edgeDensity,        // Edge density (0-1)
      edgeDensity: spatialFeatures.edgeDensity,   // Same as detail
      textureRichness: visualFeatures.entropy     // Histogram entropy (0-1)
    },

    // Transformation: How is the scene changing?
    transformation: {
      flux: temporalFeatures.flux,                // Rate of visual change (0-1)
      velocity: temporalFeatures.motionMagnitude, // Motion magnitude (0-1)
      acceleration: temporalFeatures.acceleration // Change in motion (0-1)
    },

    // Alignment: How organized is the scene?
    alignment: {
      symmetry: spatialFeatures.symmetry,         // Horizontal/vertical symmetry (0-1)
      balance: spatialFeatures.balance,           // Weight distribution (0-1)
      coherence: 1 - visualFeatures.entropy       // Inverse of entropy
    },

    // Potential: How unpredictable is the scene?
    potential: {
      entropy: visualFeatures.entropy,            // Color/luminance entropy (0-1)
      unpredictability: temporalFeatures.flux,    // Same as flux
      freedom: spatialFeatures.distribution       // Same as distribution
    }
  };
}

// ============================================================================
// IMAGE DATA ANALYSIS
// ============================================================================

/**
 * Analyze ImageData to extract visual features
 */
function analyzeImageData(imageData) {
  if (!imageData || !imageData.data) {
    return getDefaultVisualFeatures();
  }

  const data = imageData.data;
  const pixelCount = data.length / 4;

  let totalR = 0, totalG = 0, totalB = 0;
  let totalBrightness = 0;
  let totalSaturation = 0;

  // Histogram for entropy calculation
  const histogram = new Array(256).fill(0);

  // Sample every 4th pixel for performance
  const step = 4;
  let sampledCount = 0;

  for (let i = 0; i < data.length; i += 4 * step) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    totalR += r;
    totalG += g;
    totalB += b;

    // Calculate brightness (luminance)
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    totalBrightness += brightness;

    // Add to histogram
    const luminance = Math.floor(brightness * 255);
    histogram[luminance]++;

    // Calculate saturation (HSV color space)
    const maxRGB = Math.max(r, g, b) / 255;
    const minRGB = Math.min(r, g, b) / 255;
    const saturation = maxRGB === 0 ? 0 : (maxRGB - minRGB) / maxRGB;
    totalSaturation += saturation;

    sampledCount++;
  }

  const avgR = totalR / sampledCount;
  const avgG = totalG / sampledCount;
  const avgB = totalB / sampledCount;
  const avgBrightness = totalBrightness / sampledCount;
  const avgSaturation = totalSaturation / sampledCount;

  // Calculate dominant hue from average RGB
  const dominantHue = calculateHue(avgR / 255, avgG / 255, avgB / 255);

  // Calculate entropy from histogram
  const entropy = calculateEntropy(histogram);

  // Calculate contrast (standard deviation of brightness)
  const contrast = calculateContrast(data, avgBrightness, step);

  // Calculate color harmony (simple approximation)
  const colorHarmony = calculateColorHarmony(avgR, avgG, avgB, avgSaturation);

  return {
    brightness: avgBrightness,
    dominantHue: dominantHue,
    saturation: avgSaturation,
    dominantColor: [Math.round(avgR), Math.round(avgG), Math.round(avgB)],
    entropy: entropy,
    contrast: contrast,
    colorHarmony: colorHarmony
  };
}

/**
 * Calculate hue from RGB (HSV color space)
 */
function calculateHue(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  if (delta === 0) return 0;

  let hue = 0;
  if (max === r) {
    hue = ((g - b) / delta) % 6;
  } else if (max === g) {
    hue = (b - r) / delta + 2;
  } else {
    hue = (r - g) / delta + 4;
  }

  hue = hue * 60;
  if (hue < 0) hue += 360;

  return hue / 360; // Normalize to 0-1
}

/**
 * Calculate entropy from histogram
 */
function calculateEntropy(histogram) {
  const total = histogram.reduce((sum, count) => sum + count, 0);
  if (total === 0) return 0;

  let entropy = 0;
  for (const count of histogram) {
    if (count > 0) {
      const p = count / total;
      entropy -= p * Math.log2(p);
    }
  }

  // Normalize to 0-1 (max entropy for 256 bins is 8 bits)
  return Math.min(entropy / 8, 1);
}

/**
 * Calculate contrast (standard deviation of brightness)
 */
function calculateContrast(data, avgBrightness, step) {
  let variance = 0;
  let sampledCount = 0;

  for (let i = 0; i < data.length; i += 4 * step) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    variance += Math.pow(brightness - avgBrightness, 2);
    sampledCount++;
  }

  const stdDev = Math.sqrt(variance / sampledCount);
  return Math.min(stdDev * 2, 1); // Normalize to 0-1
}

/**
 * Calculate color harmony (complementary colors = low harmony, analogous = high harmony)
 */
function calculateColorHarmony(r, g, b, saturation) {
  // Low saturation = high harmony (neutral colors are always harmonious)
  if (saturation < 0.2) return 0.8;

  // Calculate balance between RGB channels
  const total = r + g + b;
  if (total === 0) return 0.5;

  const rRatio = r / total;
  const gRatio = g / total;
  const bRatio = b / total;

  // Balanced RGB = neutral/harmonious
  const balance = 1 - (Math.abs(rRatio - 0.33) + Math.abs(gRatio - 0.33) + Math.abs(bRatio - 0.33));
  return Math.max(0, Math.min(balance * 1.5, 1));
}

// ============================================================================
// TEMPORAL ANALYSIS
// ============================================================================

/**
 * Analyze temporal change between frames
 */
function analyzeTemporalChange(frameHistory) {
  if (!frameHistory || frameHistory.length < 2) {
    return {
      flux: 0,
      motionMagnitude: 0,
      acceleration: 0
    };
  }

  // Compare last two frames
  const current = frameHistory[frameHistory.length - 1];
  const previous = frameHistory[frameHistory.length - 2];

  if (!current || !previous || !current.data || !previous.data) {
    return {
      flux: 0,
      motionMagnitude: 0,
      acceleration: 0
    };
  }

  // Calculate pixel-wise difference (simplified optical flow)
  let totalDifference = 0;
  const step = 16; // Sample every 16th pixel for performance
  let sampledCount = 0;

  for (let i = 0; i < current.data.length; i += 4 * step) {
    const rDiff = Math.abs(current.data[i] - previous.data[i]);
    const gDiff = Math.abs(current.data[i + 1] - previous.data[i + 1]);
    const bDiff = Math.abs(current.data[i + 2] - previous.data[i + 2]);
    totalDifference += (rDiff + gDiff + bDiff) / 3;
    sampledCount++;
  }

  const avgDifference = totalDifference / sampledCount;
  const flux = Math.min(avgDifference / 128, 1); // Normalize to 0-1

  // Motion magnitude (same as flux for now)
  const motionMagnitude = flux;

  // Acceleration (change in flux over time)
  let acceleration = 0;
  if (frameHistory.length >= 3) {
    const prevFlux = frameHistory[frameHistory.length - 2].flux || 0;
    acceleration = Math.abs(flux - prevFlux);
  }

  return {
    flux: flux,
    motionMagnitude: motionMagnitude,
    acceleration: acceleration
  };
}

// ============================================================================
// SPATIAL ANALYSIS
// ============================================================================

/**
 * Analyze spatial distribution and structure
 */
function analyzeSpatialDistribution(imageData) {
  if (!imageData || !imageData.data) {
    return {
      distribution: 0.5,
      symmetry: 0.5,
      balance: 0.5,
      edgeDensity: 0.5
    };
  }

  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;

  // Calculate center of mass (balance)
  let totalMass = 0;
  let xWeighted = 0;
  let yWeighted = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / (3 * 255);
      totalMass += brightness;
      xWeighted += x * brightness;
      yWeighted += y * brightness;
    }
  }

  const centerX = xWeighted / totalMass;
  const centerY = yWeighted / totalMass;

  // Balance: how close to center is the center of mass?
  const centerOffsetX = Math.abs(centerX - width / 2) / (width / 2);
  const centerOffsetY = Math.abs(centerY - height / 2) / (height / 2);
  const balance = 1 - (centerOffsetX + centerOffsetY) / 2;

  // Symmetry: compare left/right halves
  const symmetry = calculateSymmetry(data, width, height);

  // Distribution: variance in spatial brightness
  const distribution = calculateSpatialVariance(data, width, height);

  // Edge density: simple Sobel-like edge detection
  const edgeDensity = calculateEdgeDensity(data, width, height);

  return {
    distribution: distribution,
    symmetry: symmetry,
    balance: balance,
    edgeDensity: edgeDensity
  };
}

/**
 * Calculate horizontal symmetry
 */
function calculateSymmetry(data, width, height) {
  let difference = 0;
  let count = 0;
  const halfWidth = Math.floor(width / 2);

  // Sample every 4th row for performance
  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < halfWidth; x += 4) {
      const leftI = (y * width + x) * 4;
      const rightI = (y * width + (width - 1 - x)) * 4;

      const leftBrightness = (data[leftI] + data[leftI + 1] + data[leftI + 2]) / 3;
      const rightBrightness = (data[rightI] + data[rightI + 1] + data[rightI + 2]) / 3;

      difference += Math.abs(leftBrightness - rightBrightness);
      count++;
    }
  }

  const avgDifference = difference / count;
  return Math.max(0, 1 - avgDifference / 128); // Normalize to 0-1
}

/**
 * Calculate spatial variance (distribution)
 */
function calculateSpatialVariance(data, width, height) {
  // Divide into quadrants and compare variance
  let totalVariance = 0;
  const quadrantSize = 8;

  for (let qy = 0; qy < height; qy += quadrantSize) {
    for (let qx = 0; qx < width; qx += quadrantSize) {
      let quadrantSum = 0;
      let count = 0;

      for (let y = qy; y < Math.min(qy + quadrantSize, height); y++) {
        for (let x = qx; x < Math.min(qx + quadrantSize, width); x++) {
          const i = (y * width + x) * 4;
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          quadrantSum += brightness;
          count++;
        }
      }

      const quadrantAvg = quadrantSum / count;
      totalVariance += quadrantAvg;
    }
  }

  // Normalize to 0-1
  return Math.min(totalVariance / (width * height), 1);
}

/**
 * Calculate edge density (simplified edge detection)
 */
function calculateEdgeDensity(data, width, height) {
  let edgeCount = 0;
  let totalCount = 0;
  const threshold = 30; // Edge threshold

  // Sample every 4th pixel for performance
  for (let y = 1; y < height - 1; y += 4) {
    for (let x = 1; x < width - 1; x += 4) {
      const i = (y * width + x) * 4;
      const rightI = (y * width + (x + 1)) * 4;
      const downI = ((y + 1) * width + x) * 4;

      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const rightBrightness = (data[rightI] + data[rightI + 1] + data[rightI + 2]) / 3;
      const downBrightness = (data[downI] + data[downI + 1] + data[downI + 2]) / 3;

      const gradientX = Math.abs(rightBrightness - brightness);
      const gradientY = Math.abs(downBrightness - brightness);
      const gradient = Math.sqrt(gradientX * gradientX + gradientY * gradientY);

      if (gradient > threshold) {
        edgeCount++;
      }
      totalCount++;
    }
  }

  return edgeCount / totalCount; // Already 0-1
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

function getDefaultVisualFeatures() {
  return {
    brightness: 0.5,
    dominantHue: 0,
    saturation: 0,
    dominantColor: [128, 128, 128],
    entropy: 0.5,
    contrast: 0,
    colorHarmony: 0.5
  };
}

console.log("📷 Optical MMPA feature extraction ready");
