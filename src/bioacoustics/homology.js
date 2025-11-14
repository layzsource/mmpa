// Homological Integration: Currents and Differential Forms
// Phase 2: Core mathematical framework for bioacoustic comparison
// Implements the relationship ⟨∂T, α⟩ = ⟨T, dα⟩

console.log('∫ homology.js loaded');

/**
 * Homological Integration Engine
 *
 * Mathematical Background:
 * - Currents T ∈ D^k: Dual space to differential forms D^k = (Ω^k)*
 * - Boundary operator ∂: D^k → D^(k-1) dual to exterior derivative d
 * - Integration: ⟨T, α⟩ = ∫ α over current T
 * - Stokes' theorem: ⟨∂T, α⟩ = ⟨T, dα⟩
 *
 * For bioacoustic analysis:
 * - T represents a "trajectory" in bioacoustic space (e.g., bird trill)
 * - α is a differential form computed from audio spectrogram
 * - ⟨T, α⟩ measures the "energy" of trajectory T according to form α
 * - Comparing ⟨T_bird, α⟩ and ⟨T_whale, α⟩ reveals shared structure
 */
export class HomologicalIntegrator {
  constructor() {
    console.log('∫ Initializing Homological Integrator...');

    // Current storage (k-currents for k=0,1,2)
    this.currents = {
      0: [], // 0-currents (point masses)
      1: [], // 1-currents (curves/trajectories)
      2: []  // 2-currents (surfaces/regions)
    };

    // Persistent homology features
    this.persistentBarcodes = [];
    this.birthDeathPairs = [];

    // Integration cache
    this.integrationCache = new Map();

    console.log('∫ Homological Integrator initialized');
  }

  /**
   * Create a 0-current (point mass) from audio event
   * Represents a single acoustic "atom"
   *
   * @param {number} q - Position coordinate (frequency)
   * @param {number} p - Momentum coordinate (amplitude rate)
   * @param {number} weight - Mass/weight of point
   * @returns {object} 0-current
   */
  createZeroCurrent(q, p, weight = 1.0) {
    const current = {
      degree: 0,
      position: { q, p },
      weight,
      id: `0curr_${this.currents[0].length}`
    };

    this.currents[0].push(current);
    return current;
  }

  /**
   * Create a 1-current (curve) from sequence of phase space points
   * Represents a trajectory through bioacoustic space (e.g., bird trill)
   *
   * @param {Array<object>} points - Array of {q, p} phase space points
   * @param {number} weight - Multiplicity of curve
   * @returns {object} 1-current
   */
  createOneCurrent(points, weight = 1.0) {
    const current = {
      degree: 1,
      points,
      weight,
      id: `1curr_${this.currents[1].length}`,
      length: this.computeCurveLength(points)
    };

    this.currents[1].push(current);
    return current;
  }

  /**
   * Create a 2-current (surface) from triangulated region
   * Represents a region in phase space (e.g., sustained tone envelope)
   *
   * @param {Array<Array<object>>} triangles - Array of triangles [[p1,p2,p3], ...]
   * @param {number} weight - Area multiplicity
   * @returns {object} 2-current
   */
  createTwoCurrent(triangles, weight = 1.0) {
    const current = {
      degree: 2,
      triangles,
      weight,
      id: `2curr_${this.currents[2].length}`,
      area: this.computeSurfaceArea(triangles)
    };

    this.currents[2].push(current);
    return current;
  }

  /**
   * Boundary operator: ∂: D^k → D^(k-1)
   * Dual to exterior derivative d
   *
   * @param {object} current - k-current
   * @returns {object} (k-1)-current (boundary)
   */
  boundary(current) {
    if (current.degree === 0) {
      // ∂(point) = 0
      return null;
    } else if (current.degree === 1) {
      // ∂(curve) = endpoint - startpoint
      const points = current.points;
      const start = points[0];
      const end = points[points.length - 1];

      return {
        degree: 0,
        components: [
          { position: end, weight: current.weight },
          { position: start, weight: -current.weight }
        ]
      };
    } else if (current.degree === 2) {
      // ∂(surface) = boundary curves
      const boundaryCurves = this.extractBoundaryCurves(current.triangles);

      return {
        degree: 1,
        components: boundaryCurves.map(curve => ({
          points: curve,
          weight: current.weight
        }))
      };
    }

    return null;
  }

  /**
   * Integrate a differential form over a current: ⟨T, α⟩
   * This is the fundamental pairing operation
   *
   * @param {object} current - Current T ∈ D^k
   * @param {object} form - Differential form α ∈ Ω^k
   * @returns {number} Integration value ⟨T, α⟩
   */
  integrate(current, form) {
    const cacheKey = `${current.id}_${JSON.stringify(form)}`;

    // Check cache
    if (this.integrationCache.has(cacheKey)) {
      return this.integrationCache.get(cacheKey);
    }

    let result = 0;

    if (current.degree === 0 && form.degree === 0) {
      // ⟨point, function⟩ = f(point) * weight
      result = this.evaluateZeroForm(form, current.position) * current.weight;

    } else if (current.degree === 1 && form.degree === 1) {
      // ⟨curve, 1-form⟩ = ∫_curve α = sum of α evaluated along curve
      const points = current.points;

      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];

        // Midpoint evaluation
        const midpoint = {
          q: (p1.q + p2.q) / 2,
          p: (p1.p + p2.p) / 2
        };

        // Tangent vector
        const tangent = {
          q: p2.q - p1.q,
          p: p2.p - p1.p
        };

        // Evaluate 1-form at midpoint
        const formValue = this.evaluateOneForm(form, midpoint);

        // Inner product: α(tangent)
        result += (formValue.q * tangent.q + formValue.p * tangent.p) * current.weight;
      }

    } else if (current.degree === 2 && form.degree === 2) {
      // ⟨surface, 2-form⟩ = ∫∫_surface ω
      for (const triangle of current.triangles) {
        const center = this.triangleCenter(triangle);
        const area = this.triangleArea(triangle);
        const formValue = this.evaluateTwoForm(form, center);

        result += formValue * area * current.weight;
      }

    } else {
      console.warn(`∫ Degree mismatch: current degree ${current.degree}, form degree ${form.degree}`);
    }

    // Cache result
    this.integrationCache.set(cacheKey, result);

    return result;
  }

  /**
   * Verify Stokes' theorem: ⟨∂T, α⟩ = ⟨T, dα⟩
   * Essential mathematical consistency check
   *
   * @param {object} current - Current T
   * @param {object} form - Form α
   * @param {object} exteriorDerivative - dα
   * @returns {object} {lhs, rhs, error, verified}
   */
  verifyStokes(current, form, exteriorDerivative) {
    const boundaryT = this.boundary(current);

    if (!boundaryT) {
      console.log('∫ Cannot verify Stokes: boundary is zero');
      return { verified: false, reason: 'boundary_zero' };
    }

    // Left side: ⟨∂T, α⟩
    const lhs = this.integrate(boundaryT, form);

    // Right side: ⟨T, dα⟩
    const rhs = this.integrate(current, exteriorDerivative);

    const error = Math.abs(lhs - rhs);
    const verified = error < 1e-6;

    console.log(`∫ Stokes verification: ⟨∂T, α⟩ = ${lhs.toFixed(6)}, ⟨T, dα⟩ = ${rhs.toFixed(6)}, error = ${error.toExponential(3)}`);

    return { lhs, rhs, error, verified };
  }

  /**
   * Compute persistent homology barcodes
   * Identifies topological features that persist across scales
   *
   * @param {Array<object>} phaseSpacePoints - Points from spectrogram
   * @param {number} maxScale - Maximum filtration scale
   * @returns {Array<object>} Birth-death pairs
   */
  computePersistentHomology(phaseSpacePoints, maxScale = 2.0) {
    console.log(`∫ Computing persistent homology for ${phaseSpacePoints.length} points...`);

    // Build Vietoris-Rips complex at multiple scales
    const numScales = 50;
    const scaleStep = maxScale / numScales;
    const barcodes = [];

    // Track connected components (0-dimensional homology)
    const features = new Map(); // feature_id → {birth, death}

    for (let i = 0; i <= numScales; i++) {
      const scale = i * scaleStep;

      // Build adjacency at this scale
      const adjacency = this.buildAdjacency(phaseSpacePoints, scale);

      // Find connected components
      const components = this.findConnectedComponents(adjacency);

      // Update persistent features
      this.updatePersistence(features, components, scale);
    }

    // Convert features to barcodes
    for (const [id, feature] of features) {
      if (feature.death === Infinity) {
        feature.death = maxScale; // Close at max scale
      }

      if (feature.death - feature.birth > 0.01) { // Filter noise
        barcodes.push({
          dimension: 0,
          birth: feature.birth,
          death: feature.death,
          persistence: feature.death - feature.birth,
          id
        });
      }
    }

    // Sort by persistence (most significant first)
    barcodes.sort((a, b) => b.persistence - a.persistence);

    this.persistentBarcodes = barcodes;
    console.log(`∫ Found ${barcodes.length} persistent features`);

    return barcodes;
  }

  /**
   * Compare two currents using homological integration
   * Returns similarity measure based on form integrals
   *
   * @param {object} current1 - First current (e.g., birdsong trajectory)
   * @param {object} current2 - Second current (e.g., whale song trajectory)
   * @param {Array<object>} forms - Test forms to integrate
   * @returns {number} Similarity score [0,1]
   */
  compareCurrents(current1, current2, forms) {
    if (current1.degree !== current2.degree) {
      console.warn('∫ Cannot compare currents of different degree');
      return 0;
    }

    let similarity = 0;
    let totalWeight = 0;

    for (const form of forms) {
      if (form.degree !== current1.degree) continue;

      const integral1 = this.integrate(current1, form);
      const integral2 = this.integrate(current2, form);

      // Normalized difference
      const maxVal = Math.max(Math.abs(integral1), Math.abs(integral2), 1e-10);
      const diff = Math.abs(integral1 - integral2) / maxVal;

      similarity += (1 - diff);
      totalWeight += 1;
    }

    return totalWeight > 0 ? similarity / totalWeight : 0;
  }

  // ===== Helper Methods =====

  computeCurveLength(points) {
    let length = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const dq = points[i + 1].q - points[i].q;
      const dp = points[i + 1].p - points[i].p;
      length += Math.sqrt(dq * dq + dp * dp);
    }
    return length;
  }

  computeSurfaceArea(triangles) {
    let area = 0;
    for (const triangle of triangles) {
      area += this.triangleArea(triangle);
    }
    return area;
  }

  triangleArea(triangle) {
    const [p1, p2, p3] = triangle;
    // Shoelace formula in 2D
    return 0.5 * Math.abs(
      p1.q * (p2.p - p3.p) +
      p2.q * (p3.p - p1.p) +
      p3.q * (p1.p - p2.p)
    );
  }

  triangleCenter(triangle) {
    const [p1, p2, p3] = triangle;
    return {
      q: (p1.q + p2.q + p3.q) / 3,
      p: (p1.p + p2.p + p3.p) / 3
    };
  }

  evaluateZeroForm(form, position) {
    // Interpolate from grid
    return form[Math.floor(position.q)] || 0;
  }

  evaluateOneForm(form, position) {
    // Return covector at position
    return form.q !== undefined ? form : { q: 0, p: 0 };
  }

  evaluateTwoForm(form, position) {
    // Return scalar (coefficient of dq ∧ dp)
    return form.value || 0;
  }

  extractBoundaryCurves(triangles) {
    // Find edges that appear only once (boundary edges)
    const edgeCount = new Map();

    for (const triangle of triangles) {
      const edges = [
        [triangle[0], triangle[1]],
        [triangle[1], triangle[2]],
        [triangle[2], triangle[0]]
      ];

      for (const edge of edges) {
        const key = `${edge[0].q},${edge[0].p}_${edge[1].q},${edge[1].p}`;
        edgeCount.set(key, (edgeCount.get(key) || 0) + 1);
      }
    }

    const boundaryCurves = [];
    for (const [key, count] of edgeCount) {
      if (count === 1) {
        const [p1, p2] = key.split('_').map(s => {
          const [q, p] = s.split(',').map(Number);
          return { q, p };
        });
        boundaryCurves.push([p1, p2]);
      }
    }

    return boundaryCurves;
  }

  buildAdjacency(points, scale) {
    const n = points.length;
    const adjacency = Array(n).fill(null).map(() => []);

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dist = this.distance(points[i], points[j]);
        if (dist <= scale) {
          adjacency[i].push(j);
          adjacency[j].push(i);
        }
      }
    }

    return adjacency;
  }

  distance(p1, p2) {
    const dq = p1.q - p2.q;
    const dp = p1.p - p2.p;
    return Math.sqrt(dq * dq + dp * dp);
  }

  findConnectedComponents(adjacency) {
    const n = adjacency.length;
    const visited = new Array(n).fill(false);
    const components = [];

    for (let i = 0; i < n; i++) {
      if (!visited[i]) {
        const component = [];
        this.dfs(i, adjacency, visited, component);
        components.push(component);
      }
    }

    return components;
  }

  dfs(node, adjacency, visited, component) {
    visited[node] = true;
    component.push(node);

    for (const neighbor of adjacency[node]) {
      if (!visited[neighbor]) {
        this.dfs(neighbor, adjacency, visited, component);
      }
    }
  }

  updatePersistence(features, components, scale) {
    // Simplified persistence tracking
    for (const component of components) {
      const id = component.sort().join(',');
      if (!features.has(id)) {
        features.set(id, { birth: scale, death: Infinity });
      }
    }
  }

  /**
   * Get integrator state
   */
  getState() {
    return {
      currents: {
        0: this.currents[0].length,
        1: this.currents[1].length,
        2: this.currents[2].length
      },
      persistentBarcodes: this.persistentBarcodes.length,
      cacheSize: this.integrationCache.size
    };
  }

  /**
   * Clear all currents and caches
   */
  clear() {
    this.currents = { 0: [], 1: [], 2: [] };
    this.persistentBarcodes = [];
    this.integrationCache.clear();
    console.log('∫ Homology state cleared');
  }
}

console.log('∫ Homological Integration module ready');
