console.log("🌀 periaktos.js loaded");

const MORPH_TARGETS = ["cube", "sphere", "pyramid", "torus"];
let currentTarget = "cube";
let previousTarget = "cube";
let morphProgress = 0;
let morphBlend = 0.0;
let morphWeights = { cube: 1.0, sphere: 0.0, pyramid: 0.0, torus: 0.0 };
let morphCallbacks = [];
let blendCallbacks = [];
let weightCallbacks = [];
let isTransitioning = false;

export function initPeriaktos() {
  console.log("🌀 Periaktos initialized, state:", currentTarget);
}

export function toggleMorph() {
  if (isTransitioning) return;

  const currentIndex = MORPH_TARGETS.indexOf(currentTarget);
  const nextIndex = (currentIndex + 1) % MORPH_TARGETS.length;
  const newTarget = MORPH_TARGETS[nextIndex];

  setMorphTarget(newTarget);
}

export function setMorphTarget(target) {
  if (isTransitioning) return;
  if (!MORPH_TARGETS.includes(target)) {
    console.warn(`🌀 Invalid morph target: ${target}`);
    return;
  }
  if (target === currentTarget) return;

  console.log(`🌀 Morphing from ${currentTarget} to ${target}`);

  previousTarget = currentTarget;
  currentTarget = target;
  isTransitioning = true;

  startMorphTransition();
}

export function onMorphUpdate(callback) {
  morphCallbacks.push(callback);
}

export function getMorphState() {
  return {
    current: currentTarget,
    previous: previousTarget,
    progress: morphProgress,
    blend: morphBlend,
    weights: { ...morphWeights },
    isTransitioning: isTransitioning,
    targets: MORPH_TARGETS
  };
}

export function setMorphBlend(value) {
  const clampedValue = Math.max(0.0, Math.min(1.0, value));
  if (clampedValue !== morphBlend) {
    morphBlend = clampedValue;

    // Backwards compatibility: convert blend to weight system
    if (morphBlend === 0.0) {
      // Reset to current target only
      const newWeights = { cube: 0.0, sphere: 0.0, pyramid: 0.0, torus: 0.0 };
      newWeights[currentTarget] = 1.0;
      setMorphWeights(newWeights);
    } else {
      // Blend between current and next target
      const targets = MORPH_TARGETS;
      const currentIndex = targets.indexOf(currentTarget);
      const nextIndex = (currentIndex + 1) % targets.length;
      const nextTarget = targets[nextIndex];

      const newWeights = { cube: 0.0, sphere: 0.0, pyramid: 0.0, torus: 0.0 };
      newWeights[currentTarget] = 1.0 - morphBlend;
      newWeights[nextTarget] = morphBlend;
      setMorphWeights(newWeights);
    }

    notifyBlendUpdate();
  }
}

export function getMorphBlend() {
  return morphBlend;
}

export function onMorphBlend(callback) {
  blendCallbacks.push(callback);
}

export function setMorphWeights(weights) {
  // Normalize weights to ensure total = 1.0
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

  if (totalWeight === 0) {
    // If all weights are 0, default to current target
    morphWeights = { cube: 0.0, sphere: 0.0, pyramid: 0.0, torus: 0.0 };
    morphWeights[currentTarget] = 1.0;
  } else {
    // Normalize weights
    morphWeights = {};
    MORPH_TARGETS.forEach(target => {
      morphWeights[target] = (weights[target] || 0) / totalWeight;
    });
  }

  notifyWeightUpdate();
}

export function getMorphWeights() {
  return { ...morphWeights };
}

export function onMorphWeights(callback) {
  weightCallbacks.push(callback);
}

export function setTargetWeight(target, weight) {
  if (!MORPH_TARGETS.includes(target)) {
    console.warn(`🌀 Invalid morph target: ${target}`);
    return;
  }

  const newWeights = { ...morphWeights };
  newWeights[target] = Math.max(0.0, Math.min(1.0, weight));
  setMorphWeights(newWeights);
}

export function getTargetWeight(target) {
  return morphWeights[target] || 0.0;
}

function startMorphTransition() {
  const duration = 1000;
  const startTime = performance.now();

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const t = Math.min(elapsed / duration, 1);

    const easeInOut = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    morphProgress = easeInOut;

    notifyMorphUpdate();

    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      isTransitioning = false;
      morphProgress = 0;
      previousTarget = currentTarget;
      console.log(`🌀 Morph to ${currentTarget} complete`);
    }
  }

  requestAnimationFrame(animate);
}

function notifyMorphUpdate() {
  const morphData = {
    current: currentTarget,
    previous: previousTarget,
    progress: morphProgress,
    blend: morphBlend,
    weights: { ...morphWeights },
    isTransitioning: isTransitioning,
    targets: MORPH_TARGETS
  };

  morphCallbacks.forEach(callback => {
    try {
      callback(morphData);
    } catch (error) {
      console.error('🌀 Error in morph callback:', error);
    }
  });
}

function notifyBlendUpdate() {
  const blendData = {
    current: currentTarget,
    blend: morphBlend,
    targets: MORPH_TARGETS
  };

  blendCallbacks.forEach(callback => {
    try {
      callback(blendData);
    } catch (error) {
      console.error('🌀 Error in blend callback:', error);
    }
  });

  // Also trigger morph update to keep everything in sync
  notifyMorphUpdate();
}

function notifyWeightUpdate() {
  const weightData = {
    weights: { ...morphWeights },
    targets: MORPH_TARGETS
  };

  weightCallbacks.forEach(callback => {
    try {
      callback(weightData);
    } catch (error) {
      console.error('🌀 Error in weight callback:', error);
    }
  });

  // Also trigger morph update to keep everything in sync
  notifyMorphUpdate();
}
