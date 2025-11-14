/**
 * 🧬 MMPA Recipe Engine - Universal Pattern Recognition
 *
 * The core insight: MMPA forces are like the periodic table of fundamental patterns.
 * - The 6 MMPA forces are CONSTANT across ALL domains
 * - Only the input/output adapters change per domain
 * - Same visualization (chronelix) works for any recipe
 *
 * Design Philosophy:
 * - Start with accessible data (audio)
 * - Build incrementally with validation at each step
 * - Easy to pivot between use cases by swapping recipes
 *
 * ANY INPUT → MMPA Processing (constant) → DOMAIN-SPECIFIC OUTPUT
 */

console.log("🧬 recipeEngine.js loading...");

// ============================================================================
// CORE MMPA FORCE STRUCTURE (Universal - Never Changes)
// ============================================================================

/**
 * The 6 fundamental forces that apply to ALL patterns across ALL domains
 */
export const MMPA_FORCES = {
  IDENTITY: 'identity',           // What IS this?
  RELATIONSHIP: 'relationship',   // How do parts relate?
  COMPLEXITY: 'complexity',       // How intricate?
  TRANSFORMATION: 'transformation', // How is it changing?
  ALIGNMENT: 'alignment',         // How coherent?
  POTENTIAL: 'potential'          // What could happen?
};

/**
 * Validate that MMPA features contain all 6 forces
 */
function validateMMPAStructure(features) {
  const required = Object.values(MMPA_FORCES);
  const missing = required.filter(force => !features[force]);

  if (missing.length > 0) {
    console.warn(`⚠️ MMPA structure incomplete. Missing forces:`, missing);
    return false;
  }

  return true;
}

// ============================================================================
// RECIPE BASE CLASS
// ============================================================================

/**
 * MMPARecipe: Universal pattern recognition recipe
 *
 * Each recipe defines:
 * 1. Input adapter: Domain data → Signal
 * 2. Output interpreter: MMPA forces → Domain meaning
 * 3. Thresholds/config: Domain-specific parameters
 *
 * The MMPA processing itself is CONSTANT - it never changes!
 */
export class MMPARecipe {
  constructor(config) {
    // Recipe identity
    this.name = config.name || 'Unnamed Recipe';
    this.domain = config.domain || 'unknown';
    this.description = config.description || '';

    // Input: Convert domain data to signal
    // Signature: (rawData) => { signal, metadata }
    this.inputAdapter = config.inputAdapter || this.defaultInputAdapter;

    // Output: Interpret MMPA forces for domain
    // Signature: (mmpaFeatures) => { interpretation, alerts, visualization }
    this.outputInterpreter = config.outputInterpreter || this.defaultOutputInterpreter;

    // Domain-specific thresholds and config
    this.config = config.config || {};

    // Metadata
    this.enabled = config.enabled !== false; // Default to enabled
    this.createdAt = Date.now();
    this.processCount = 0;

    console.log(`📋 Recipe created: "${this.name}" (${this.domain})`);
  }

  /**
   * Process raw data through the recipe pipeline
   * @param {*} rawData - Domain-specific raw data
   * @param {Object} mmpaFeatures - Pre-computed MMPA features (optional)
   * @returns {Object} - { mmpa, interpretation, metadata }
   */
  process(rawData, mmpaFeatures = null) {
    if (!this.enabled) {
      console.warn(`⚠️ Recipe "${this.name}" is disabled`);
      return null;
    }

    const startTime = performance.now();

    try {
      // Step 1: Convert domain data to signal (if MMPA not pre-computed)
      let signal = null;
      if (!mmpaFeatures) {
        const adapted = this.inputAdapter(rawData);
        signal = adapted.signal;

        // Input adapter should return MMPA-ready signal
        // For now, we assume external MMPA extraction happens elsewhere
        // (This keeps the recipe system lightweight)
        console.warn(`⚠️ Recipe "${this.name}" needs pre-computed MMPA features`);
        return null;
      }

      // Step 2: Validate MMPA structure
      if (!validateMMPAStructure(mmpaFeatures)) {
        console.error(`❌ Invalid MMPA structure for recipe "${this.name}"`);
        return null;
      }

      // Step 3: Interpret MMPA forces for this domain
      const interpretation = this.outputInterpreter(mmpaFeatures);

      // Step 4: Package result
      const result = {
        recipe: this.name,
        domain: this.domain,
        timestamp: Date.now(),
        processingTime: performance.now() - startTime,
        mmpa: mmpaFeatures,
        interpretation: interpretation,
        metadata: {
          enabled: this.enabled,
          processCount: ++this.processCount
        }
      };

      return result;

    } catch (err) {
      console.error(`❌ Recipe "${this.name}" processing error:`, err);
      return null;
    }
  }

  /**
   * Default input adapter (passthrough)
   */
  defaultInputAdapter(rawData) {
    return {
      signal: rawData,
      metadata: {}
    };
  }

  /**
   * Default output interpreter (passthrough)
   */
  defaultOutputInterpreter(mmpaFeatures) {
    return {
      summary: 'No interpretation defined',
      forces: mmpaFeatures,
      alerts: [],
      visualization: {}
    };
  }

  /**
   * Enable/disable recipe
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    console.log(`🔧 Recipe "${this.name}" ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    console.log(`🔧 Recipe "${this.name}" config updated:`, this.config);
  }

  /**
   * Get recipe info
   */
  getInfo() {
    return {
      name: this.name,
      domain: this.domain,
      description: this.description,
      enabled: this.enabled,
      processCount: this.processCount,
      config: this.config
    };
  }
}

// ============================================================================
// RECIPE REGISTRY
// ============================================================================

/**
 * Central registry for all available recipes
 */
export class RecipeRegistry {
  constructor() {
    this.recipes = new Map();
    this.activeRecipe = null;
    console.log("📚 Recipe registry initialized");
  }

  /**
   * Register a new recipe
   */
  register(recipe) {
    if (!(recipe instanceof MMPARecipe)) {
      console.error("❌ Can only register MMPARecipe instances");
      return false;
    }

    this.recipes.set(recipe.name, recipe);
    console.log(`✅ Recipe registered: "${recipe.name}"`);

    // Auto-activate first recipe
    if (!this.activeRecipe) {
      this.setActive(recipe.name);
    }

    return true;
  }

  /**
   * Set active recipe
   */
  setActive(recipeName) {
    const recipe = this.recipes.get(recipeName);
    if (!recipe) {
      console.error(`❌ Recipe "${recipeName}" not found`);
      return false;
    }

    this.activeRecipe = recipe;
    console.log(`🎯 Active recipe: "${recipeName}"`);
    return true;
  }

  /**
   * Get active recipe
   */
  getActive() {
    return this.activeRecipe;
  }

  /**
   * Process data with active recipe
   */
  process(rawData, mmpaFeatures = null) {
    if (!this.activeRecipe) {
      console.warn("⚠️ No active recipe set");
      return null;
    }

    return this.activeRecipe.process(rawData, mmpaFeatures);
  }

  /**
   * Get all recipe names
   */
  getRecipeNames() {
    return Array.from(this.recipes.keys());
  }

  /**
   * Get recipe by name
   */
  getRecipe(name) {
    return this.recipes.get(name);
  }

  /**
   * List all recipes with info
   */
  listRecipes() {
    const list = [];
    this.recipes.forEach(recipe => {
      list.push({
        ...recipe.getInfo(),
        isActive: recipe === this.activeRecipe
      });
    });
    return list;
  }
}

// ============================================================================
// GLOBAL RECIPE REGISTRY
// ============================================================================

// Create global registry (singleton pattern)
export const recipeRegistry = new RecipeRegistry();

// Make available globally for debugging
if (typeof window !== 'undefined') {
  window.recipeRegistry = recipeRegistry;
}

console.log("🧬 Recipe engine ready - Universal pattern recognition framework loaded");
