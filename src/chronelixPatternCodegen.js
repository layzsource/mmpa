// src/chronelixPatternCodegen.js
// Pattern Library Code Generation from Chronelix Analysis
// Generates reusable pattern templates from phase space, gates, and wavelet analysis

console.log("💻 chronelixPatternCodegen.js loaded");

/**
 * Pattern Template
 * Represents a detected and codified pattern in the bibibinary system
 */
class PatternTemplate {
  constructor(id, type, name) {
    this.id = id;
    this.type = type;   // 'phase_transition', 'gate_sequence', 'wavelet_signature', 'attractor'
    this.name = name;
    this.timestamp = performance.now() / 1000;

    // Pattern characteristics
    this.signature = {};
    this.parameters = {};
    this.conditions = [];

    // Generated code
    this.code = '';
    this.documentation = '';

    // Usage statistics
    this.occurrences = 1;
    this.confidence = 0;
    this.reliability = 0;
  }

  /**
   * Generate JavaScript code for this pattern
   */
  generateCode() {
    const code = `
// ${this.name}
// Type: ${this.type}
// Confidence: ${(this.confidence * 100).toFixed(0)}%
// Detected: ${this.occurrences} times

export const ${this.id} = {
  signature: ${JSON.stringify(this.signature, null, 2)},

  parameters: ${JSON.stringify(this.parameters, null, 2)},

  conditions: ${JSON.stringify(this.conditions, null, 2)},

  // Apply this pattern to current state
  apply(audioMMPA, opticalMMPA) {
    // Pattern-specific transformation logic
    ${this.generateApplicationLogic()}
  },

  // Check if current state matches this pattern
  matches(audioMMPA, opticalMMPA) {
    // Pattern matching logic
    ${this.generateMatchingLogic()}
  }
};
`;

    this.code = code.trim();
    return this.code;
  }

  /**
   * Generate application logic based on pattern type
   */
  generateApplicationLogic() {
    switch (this.type) {
      case 'phase_transition':
        return `
    // Apply phase transition dynamics
    const orderParam = (audioMMPA.identity.strength + opticalMMPA.identity.brightness) / 2;
    const variance = (audioMMPA.complexity.spectralEntropy + opticalMMPA.complexity.edgeDensity) / 2;

    return {
      orderParameter: orderParam,
      variance: variance,
      isTransitioning: Math.abs(orderParam - 0.5) < 0.2 && variance > 0.7
    };`;

      case 'gate_sequence':
        return `
    // Apply gate sequence pattern
    const avgVelocity = (audioMMPA.transformation.flux + opticalMMPA.transformation.flux) / 2;
    const avgEnergy = (audioMMPA.identity.strength + audioMMPA.potential.entropy +
                      opticalMMPA.identity.brightness + opticalMMPA.potential.entropy) / 4;

    return {
      velocity: avgVelocity,
      energy: avgEnergy,
      gatePhase: this.signature.gatePhase || 0
    };`;

      case 'wavelet_signature':
        return `
    // Apply wavelet signature pattern
    const dominantScale = this.signature.dominantScale || 'medium';
    const fastSlowRatio = this.signature.fastSlowRatio || 1.0;

    return {
      temporalScale: dominantScale,
      dynamicsRatio: fastSlowRatio,
      isTransient: fastSlowRatio > 2.0
    };`;

      case 'attractor':
        return `
    // Apply attractor pattern
    const attractorType = this.signature.attractorType || 'unknown';
    const lyapunov = this.signature.lyapunovExponent || 0;

    return {
      attractorType: attractorType,
      stability: lyapunov < 0 ? 'stable' : 'chaotic',
      lyapunovExponent: lyapunov
    };`;

      default:
        return '// Custom pattern logic';
    }
  }

  /**
   * Generate matching logic
   */
  generateMatchingLogic() {
    return `
    // Check conditions
    for (const condition of this.conditions) {
      // Evaluate condition...
      // Return false if any condition fails
    }

    // Check signature similarity
    const similarity = this.computeSimilarity(audioMMPA, opticalMMPA);
    return similarity > 0.7; // 70% similarity threshold`;
  }
}

/**
 * Pattern Code Generator
 * Analyzes chronelix data and generates reusable pattern library
 */
export class ChronelixPatternCodegen {
  constructor() {
    this.patterns = new Map(); // id → PatternTemplate
    this.nextPatternId = 0;

    // Pattern library
    this.library = {
      phaseTransitions: [],
      gateSequences: [],
      waveletSignatures: [],
      attractors: []
    };

    // Generated code stream
    this.codeStream = [];
    this.maxStreamLength = 100;

    // Pattern detection thresholds
    this.thresholds = {
      minOccurrences: 3,           // Pattern must occur at least 3 times
      minConfidence: 0.7,          // 70% confidence
      minReliability: 0.6          // 60% reliability
    };

    // Statistics
    this.totalPatternsDetected = 0;
    this.totalCodeGenerated = 0;
  }

  /**
   * Analyze phase transition and generate pattern
   */
  analyzePhaseTransition(event, phaseSpace) {
    const patternId = `phaseTransition_${event.transitionType}_${this.nextPatternId++}`;

    const pattern = new PatternTemplate(
      patternId,
      'phase_transition',
      `Phase Transition: ${event.transitionType}`
    );

    // Extract signature
    pattern.signature = {
      transitionType: event.transitionType,
      orderParameter: event.metrics.orderParameter,
      variance: event.metrics.variance || 0,
      criticalSlowing: event.metrics.criticalSlowing || 0
    };

    // Extract parameters
    pattern.parameters = {
      threshold: this.thresholds.minConfidence,
      duration: event.duration || 0,
      significance: event.significance
    };

    // Define conditions
    pattern.conditions = [
      {
        metric: 'orderParameter',
        operator: 'near',
        value: 0.5,
        tolerance: 0.2
      },
      {
        metric: 'variance',
        operator: '>',
        value: 0.7
      }
    ];

    // Check if similar pattern exists
    const existing = this.findSimilarPattern(pattern);

    if (existing) {
      // Update existing pattern
      existing.occurrences++;
      existing.confidence = Math.min(1.0, existing.confidence + 0.1);
      existing.reliability = existing.occurrences / this.totalPatternsDetected;
    } else {
      // Add new pattern
      pattern.confidence = 0.5; // Initial confidence
      this.patterns.set(patternId, pattern);
      this.library.phaseTransitions.push(pattern);
      this.totalPatternsDetected++;
    }

    // Generate code if pattern meets thresholds
    this.maybeGenerateCode(existing || pattern);
  }

  /**
   * Analyze gate sequence and generate pattern
   */
  analyzeGateSequence(gateStats) {
    const patternId = `gateSequence_${this.nextPatternId++}`;

    const pattern = new PatternTemplate(
      patternId,
      'gate_sequence',
      'Gate Sequence Pattern'
    );

    // Extract signature from gate statistics
    pattern.signature = {
      totalGates: gateStats.totalGates,
      activeGates: gateStats.activeGates,
      energyByGate: gateStats.averageEnergyByGate,
      velocityByGate: gateStats.averageVelocityByGate
    };

    // Extract parameters
    pattern.parameters = {
      dominantGate: gateStats.averageEnergyByGate.indexOf(Math.max(...gateStats.averageEnergyByGate)),
      totalParticles: gateStats.totalParticles
    };

    // Define conditions
    pattern.conditions = [
      {
        metric: 'activeGates',
        operator: '>=',
        value: 6 // At least half the gates active
      }
    ];

    pattern.confidence = 0.6;
    this.patterns.set(patternId, pattern);
    this.library.gateSequences.push(pattern);
    this.totalPatternsDetected++;

    this.maybeGenerateCode(pattern);
  }

  /**
   * Analyze wavelet decomposition and generate pattern
   */
  analyzeWaveletSignature(waveletData) {
    const patternId = `waveletSig_${this.nextPatternId++}`;

    const pattern = new PatternTemplate(
      patternId,
      'wavelet_signature',
      'Wavelet Signature Pattern'
    );

    // Extract signature
    const transition = waveletData.detectScaleTransition();

    pattern.signature = {
      dominantScale: transition.dominantScale,
      dominantPeriod: transition.dominantPeriod,
      fastSlowRatio: transition.fastSlowRatio,
      isTransient: transition.isTransient,
      isTrending: transition.isTrending
    };

    // Extract parameters
    pattern.parameters = {
      energyDistribution: waveletData.energyDistribution
    };

    // Define conditions
    pattern.conditions = [
      {
        metric: 'fastSlowRatio',
        operator: 'between',
        min: 0.5,
        max: 2.0
      }
    ];

    pattern.confidence = 0.7;
    this.patterns.set(patternId, pattern);
    this.library.waveletSignatures.push(pattern);
    this.totalPatternsDetected++;

    this.maybeGenerateCode(pattern);
  }

  /**
   * Analyze attractor and generate pattern
   */
  analyzeAttractor(phaseSpace) {
    const patternId = `attractor_${phaseSpace.attractorType}_${this.nextPatternId++}`;

    const pattern = new PatternTemplate(
      patternId,
      'attractor',
      `Attractor: ${phaseSpace.attractorType}`
    );

    // Extract signature
    pattern.signature = {
      attractorType: phaseSpace.attractorType,
      lyapunovExponent: phaseSpace.lyapunovExponent,
      synchronicity: phaseSpace.synchronicity,
      phaseCoherence: phaseSpace.phaseCoherence
    };

    // Extract parameters
    pattern.parameters = {
      coupling: phaseSpace.coupling,
      temperature: phaseSpace.temperature
    };

    // Define conditions
    pattern.conditions = [
      {
        metric: 'lyapunovExponent',
        operator: '<',
        value: 0.1
      }
    ];

    pattern.confidence = 0.8;
    this.patterns.set(patternId, pattern);
    this.library.attractors.push(pattern);
    this.totalPatternsDetected++;

    this.maybeGenerateCode(pattern);
  }

  /**
   * Find similar existing pattern
   */
  findSimilarPattern(newPattern) {
    const library = this.library[this.getLibraryKey(newPattern.type)];

    for (const existing of library) {
      const similarity = this.computeSimilarity(existing.signature, newPattern.signature);

      if (similarity > 0.8) { // 80% similarity threshold
        return existing;
      }
    }

    return null;
  }

  /**
   * Compute similarity between signatures
   */
  computeSimilarity(sig1, sig2) {
    const keys1 = Object.keys(sig1);
    const keys2 = Object.keys(sig2);

    // Check key overlap
    const commonKeys = keys1.filter(k => keys2.includes(k));
    if (commonKeys.length === 0) return 0;

    // Compute value similarity for common keys
    let totalSimilarity = 0;

    for (const key of commonKeys) {
      const val1 = sig1[key];
      const val2 = sig2[key];

      if (typeof val1 === 'number' && typeof val2 === 'number') {
        // Numerical similarity (1 - normalized difference)
        const maxVal = Math.max(Math.abs(val1), Math.abs(val2), 1);
        const diff = Math.abs(val1 - val2) / maxVal;
        totalSimilarity += (1 - diff);
      } else if (val1 === val2) {
        // Exact match
        totalSimilarity += 1;
      }
    }

    return totalSimilarity / commonKeys.length;
  }

  /**
   * Get library key for pattern type
   */
  getLibraryKey(type) {
    const mapping = {
      'phase_transition': 'phaseTransitions',
      'gate_sequence': 'gateSequences',
      'wavelet_signature': 'waveletSignatures',
      'attractor': 'attractors'
    };

    return mapping[type] || 'phaseTransitions';
  }

  /**
   * Generate code if pattern meets thresholds
   */
  maybeGenerateCode(pattern) {
    if (pattern.occurrences >= this.thresholds.minOccurrences &&
        pattern.confidence >= this.thresholds.minConfidence) {

      // Generate code
      const code = pattern.generateCode();

      // Add to stream
      this.codeStream.push({
        patternId: pattern.id,
        code: code,
        timestamp: performance.now() / 1000,
        confidence: pattern.confidence,
        occurrences: pattern.occurrences
      });

      if (this.codeStream.length > this.maxStreamLength) {
        this.codeStream.shift();
      }

      this.totalCodeGenerated++;

      console.log(`💻 Generated code for pattern: ${pattern.name}`);
    }
  }

  /**
   * Export full pattern library as JavaScript module
   */
  exportLibrary() {
    let code = `// Chronelix Pattern Library
// Auto-generated from ${this.totalPatternsDetected} detected patterns
// ${new Date().toISOString()}

`;

    // Export all patterns
    for (const [id, pattern] of this.patterns) {
      if (pattern.occurrences >= this.thresholds.minOccurrences) {
        code += pattern.generateCode() + '\n\n';
      }
    }

    // Export library index
    code += `
// Pattern Library Index
export const PatternLibrary = {
  phaseTransitions: [${this.library.phaseTransitions.map(p => p.id).join(', ')}],
  gateSequences: [${this.library.gateSequences.map(p => p.id).join(', ')}],
  waveletSignatures: [${this.library.waveletSignatures.map(p => p.id).join(', ')}],
  attractors: [${this.library.attractors.map(p => p.id).join(', ')}],

  totalPatterns: ${this.patterns.size},
  generatedAt: '${new Date().toISOString()}'
};
`;

    return code;
  }

  /**
   * Get recent code stream
   */
  getCodeStream(count = 10) {
    return this.codeStream.slice(-count);
  }

  /**
   * Get pattern by ID
   */
  getPattern(id) {
    return this.patterns.get(id);
  }

  /**
   * Get patterns by type
   */
  getPatternsByType(type) {
    return Array.from(this.patterns.values()).filter(p => p.type === type);
  }

  /**
   * Get top patterns by confidence
   */
  getTopPatterns(count = 10) {
    return Array.from(this.patterns.values())
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, count);
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    return {
      totalPatternsDetected: this.totalPatternsDetected,
      totalCodeGenerated: this.totalCodeGenerated,
      librarySize: this.patterns.size,
      byType: {
        phaseTransitions: this.library.phaseTransitions.length,
        gateSequences: this.library.gateSequences.length,
        waveletSignatures: this.library.waveletSignatures.length,
        attractors: this.library.attractors.length
      },
      codeStreamLength: this.codeStream.length,
      topPatterns: this.getTopPatterns(5).map(p => ({
        name: p.name,
        type: p.type,
        confidence: p.confidence.toFixed(2),
        occurrences: p.occurrences
      }))
    };
  }

  /**
   * Reset code generator
   */
  reset() {
    this.patterns.clear();
    this.library = {
      phaseTransitions: [],
      gateSequences: [],
      waveletSignatures: [],
      attractors: []
    };
    this.codeStream = [];
    this.totalPatternsDetected = 0;
    this.totalCodeGenerated = 0;
  }
}

// Singleton instance
export const patternCodegen = new ChronelixPatternCodegen();

console.log("💻 Pattern code generator ready");
