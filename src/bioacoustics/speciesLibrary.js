// Species Library: Bioacoustic Signature Storage
// Phase 2: Storage and comparison of cross-species audio patterns
// Framework for birdsong, whale song, and other bioacoustic data

console.log('🦜 speciesLibrary.js loaded');

/**
 * Species Library
 *
 * Purpose:
 * - Store bioacoustic signatures from different species
 * - Enable cross-species comparison via homological integration
 * - Map communication patterns to symplectic manifold
 *
 * Signature Structure:
 * - Spectrograms: Raw time-frequency data
 * - Differential forms: 0-, 1-, 2-forms computed from audio
 * - Currents: Trajectories through phase space
 * - Persistent homology: Topological features
 */
export class SpeciesLibrary {
  constructor() {
    console.log('🦜 Initializing Species Library...');

    // Species database
    this.species = new Map();

    // Preload default species
    this.initializeDefaultSpecies();

    console.log('🦜 Species Library initialized');
  }

  /**
   * Initialize default species with placeholder data
   * In production, this would load from audio files or database
   */
  initializeDefaultSpecies() {
    // Placeholder: Add example species
    this.addSpecies({
      id: 'example_bird_1',
      name: 'Example Songbird',
      scientificName: 'Passeridae exemplaris',
      category: 'bird',
      description: 'Example bioacoustic signature for testing',
      frequencyRange: [2000, 8000], // Hz
      typicalDuration: 2.5 // seconds
    });

    this.addSpecies({
      id: 'example_whale_1',
      name: 'Example Whale',
      scientificName: 'Cetacea exemplaris',
      category: 'whale',
      description: 'Example whale vocalization signature',
      frequencyRange: [20, 500], // Hz (much lower than birds)
      typicalDuration: 10 // seconds (longer vocalizations)
    });

    console.log(`🦜 Loaded ${this.species.size} default species`);
  }

  /**
   * Add a species to the library
   *
   * @param {object} speciesData - Species metadata
   * @returns {string} Species ID
   */
  addSpecies(speciesData) {
    const species = {
      id: speciesData.id || `species_${Date.now()}`,
      name: speciesData.name || 'Unknown Species',
      scientificName: speciesData.scientificName || null,
      category: speciesData.category || 'unknown', // bird, whale, dolphin, etc.
      description: speciesData.description || '',
      frequencyRange: speciesData.frequencyRange || [0, 22050],
      typicalDuration: speciesData.typicalDuration || 5,

      // Bioacoustic data (populated by analysis)
      signatures: [],

      // Statistical summaries
      stats: {
        numRecordings: 0,
        avgFrequency: 0,
        avgAmplitude: 0,
        avgComplexity: 0
      },

      // Metadata
      dateAdded: new Date().toISOString(),
      tags: speciesData.tags || []
    };

    this.species.set(species.id, species);
    console.log(`🦜 Added species: ${species.name} (${species.id})`);

    return species.id;
  }

  /**
   * Add a bioacoustic signature for a species
   * Stores differential forms, currents, and homology features
   *
   * @param {string} speciesId - Species identifier
   * @param {object} signatureData - Bioacoustic analysis results
   * @returns {boolean} Success
   */
  addSignature(speciesId, signatureData) {
    const species = this.species.get(speciesId);
    if (!species) {
      console.error(`🦜 Species not found: ${speciesId}`);
      return false;
    }

    const signature = {
      id: `sig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),

      // Raw data
      spectrogram: signatureData.spectrogram || null,
      audioBuffer: signatureData.audioBuffer || null,

      // Differential forms
      forms: {
        zeroForms: signatureData.zeroForms || [],
        oneForms: signatureData.oneForms || [],
        twoForms: signatureData.twoForms || []
      },

      // Currents (trajectories)
      currents: signatureData.currents || {
        0: [],
        1: [],
        2: []
      },

      // Persistent homology
      homology: {
        barcodes: signatureData.persistentBarcodes || [],
        bettiNumbers: signatureData.bettiNumbers || [0, 0, 0]
      },

      // Phase space representation
      phaseSpace: signatureData.phaseSpace || [],

      // Audio features
      features: signatureData.features || {
        centroid: 0,
        spread: 0,
        bass: 0,
        mid: 0,
        treble: 0
      },

      // Metadata
      duration: signatureData.duration || 0,
      sampleRate: signatureData.sampleRate || 44100,
      notes: signatureData.notes || ''
    };

    species.signatures.push(signature);
    species.stats.numRecordings = species.signatures.length;

    // Update statistics
    this.updateSpeciesStats(speciesId);

    console.log(`🦜 Added signature ${signature.id} to ${species.name}`);
    return true;
  }

  /**
   * Get species by ID
   *
   * @param {string} speciesId - Species identifier
   * @returns {object|null} Species data
   */
  getSpecies(speciesId) {
    return this.species.get(speciesId) || null;
  }

  /**
   * Get all species in a category
   *
   * @param {string} category - Category (bird, whale, dolphin, etc.)
   * @returns {Array<object>} Array of species
   */
  getSpeciesByCategory(category) {
    const results = [];
    for (const species of this.species.values()) {
      if (species.category === category) {
        results.push(species);
      }
    }
    return results;
  }

  /**
   * Search species by name
   *
   * @param {string} query - Search query
   * @returns {Array<object>} Matching species
   */
  searchSpecies(query) {
    const lowerQuery = query.toLowerCase();
    const results = [];

    for (const species of this.species.values()) {
      if (species.name.toLowerCase().includes(lowerQuery) ||
          species.scientificName?.toLowerCase().includes(lowerQuery) ||
          species.description.toLowerCase().includes(lowerQuery)) {
        results.push(species);
      }
    }

    return results;
  }

  /**
   * Compare two species signatures using homological integration
   * Returns similarity score and detailed comparison
   *
   * @param {string} speciesId1 - First species
   * @param {string} speciesId2 - Second species
   * @param {object} integrator - HomologicalIntegrator instance
   * @returns {object} Comparison result
   */
  compareSpecies(speciesId1, speciesId2, integrator) {
    const species1 = this.species.get(speciesId1);
    const species2 = this.species.get(speciesId2);

    if (!species1 || !species2) {
      console.error('🦜 One or both species not found');
      return null;
    }

    if (species1.signatures.length === 0 || species2.signatures.length === 0) {
      console.error('🦜 One or both species have no signatures');
      return null;
    }

    console.log(`🦜 Comparing ${species1.name} with ${species2.name}...`);

    // Use most representative signatures (for now, just use first)
    const sig1 = species1.signatures[0];
    const sig2 = species2.signatures[0];

    // Compare forms using homological integration
    const formSimilarity = this.compareForms(sig1.forms, sig2.forms, integrator);

    // Compare currents (trajectories)
    const currentSimilarity = this.compareCurrents(sig1.currents, sig2.currents, integrator);

    // Compare persistent homology
    const homologySimilarity = this.compareHomology(sig1.homology, sig2.homology);

    // Weighted combination
    const overallSimilarity =
      0.4 * formSimilarity +
      0.4 * currentSimilarity +
      0.2 * homologySimilarity;

    const result = {
      species1: { id: speciesId1, name: species1.name },
      species2: { id: speciesId2, name: species2.name },
      similarity: overallSimilarity,
      details: {
        forms: formSimilarity,
        currents: currentSimilarity,
        homology: homologySimilarity
      },
      frequencyShift: this.computeFrequencyShift(species1, species2),
      timestamp: new Date().toISOString()
    };

    console.log(`🦜 Similarity: ${(overallSimilarity * 100).toFixed(1)}%`);
    return result;
  }

  /**
   * Compare differential forms between two signatures
   */
  compareForms(forms1, forms2, integrator) {
    // Simplified comparison: compare 2-form magnitudes
    const mag1 = this.computeFormMagnitude(forms1.twoForms);
    const mag2 = this.computeFormMagnitude(forms2.twoForms);

    const diff = Math.abs(mag1 - mag2) / Math.max(mag1, mag2, 1e-10);
    return Math.max(0, 1 - diff);
  }

  /**
   * Compare currents between two signatures
   */
  compareCurrents(currents1, currents2, integrator) {
    // Compare 1-currents (trajectories)
    const curves1 = currents1[1] || [];
    const curves2 = currents2[1] || [];

    if (curves1.length === 0 || curves2.length === 0) {
      return 0.5; // Neutral if no curves
    }

    // Simple comparison: curve lengths
    const avgLen1 = curves1.reduce((sum, c) => sum + (c.points?.length || 0), 0) / curves1.length;
    const avgLen2 = curves2.reduce((sum, c) => sum + (c.points?.length || 0), 0) / curves2.length;

    const diff = Math.abs(avgLen1 - avgLen2) / Math.max(avgLen1, avgLen2, 1e-10);
    return Math.max(0, 1 - diff);
  }

  /**
   * Compare persistent homology barcodes
   */
  compareHomology(homology1, homology2) {
    const barcodes1 = homology1.barcodes || [];
    const barcodes2 = homology2.barcodes || [];

    if (barcodes1.length === 0 || barcodes2.length === 0) {
      return 0.5; // Neutral if no barcodes
    }

    // Bottleneck distance (simplified)
    // Compare number of persistent features
    const countDiff = Math.abs(barcodes1.length - barcodes2.length);
    const maxCount = Math.max(barcodes1.length, barcodes2.length);

    return Math.max(0, 1 - countDiff / maxCount);
  }

  /**
   * Compute magnitude of form collection
   */
  computeFormMagnitude(forms) {
    if (!forms || forms.length === 0) return 0;

    let sum = 0;
    for (const frameData of forms) {
      if (Array.isArray(frameData)) {
        for (const form of frameData) {
          const val = form.value || form || 0;
          sum += val * val;
        }
      }
    }

    return Math.sqrt(sum);
  }

  /**
   * Compute frequency shift factor between two species
   * Used for manifold transformation
   */
  computeFrequencyShift(species1, species2) {
    const avg1 = (species1.frequencyRange[0] + species1.frequencyRange[1]) / 2;
    const avg2 = (species2.frequencyRange[0] + species2.frequencyRange[1]) / 2;

    return avg2 / avg1; // Ratio for frequency scaling
  }

  /**
   * Update species statistics from signatures
   */
  updateSpeciesStats(speciesId) {
    const species = this.species.get(speciesId);
    if (!species || species.signatures.length === 0) return;

    const sigs = species.signatures;
    const n = sigs.length;

    // Average features
    let totalFreq = 0, totalAmp = 0, totalComplexity = 0;

    for (const sig of sigs) {
      totalFreq += sig.features.centroid || 0;
      totalAmp += (sig.features.bass + sig.features.mid + sig.features.treble) / 3;
      totalComplexity += sig.homology.barcodes.length || 0;
    }

    species.stats.avgFrequency = totalFreq / n;
    species.stats.avgAmplitude = totalAmp / n;
    species.stats.avgComplexity = totalComplexity / n;
  }

  /**
   * Export species data as JSON
   */
  exportSpecies(speciesId) {
    const species = this.species.get(speciesId);
    if (!species) return null;

    return JSON.stringify(species, null, 2);
  }

  /**
   * Import species data from JSON
   */
  importSpecies(jsonData) {
    try {
      const species = JSON.parse(jsonData);
      this.species.set(species.id, species);
      console.log(`🦜 Imported species: ${species.name}`);
      return species.id;
    } catch (error) {
      console.error('🦜 Import failed:', error);
      return null;
    }
  }

  /**
   * Get library statistics
   */
  getStats() {
    let totalSpecies = this.species.size;
    let totalSignatures = 0;
    const categoryCounts = {};

    for (const species of this.species.values()) {
      totalSignatures += species.signatures.length;
      categoryCounts[species.category] = (categoryCounts[species.category] || 0) + 1;
    }

    return {
      totalSpecies,
      totalSignatures,
      categoryCounts,
      avgSignaturesPerSpecies: totalSpecies > 0 ? totalSignatures / totalSpecies : 0
    };
  }

  /**
   * Clear all species data
   */
  clear() {
    this.species.clear();
    console.log('🦜 Species library cleared');
  }
}

console.log('🦜 Species Library module ready');
