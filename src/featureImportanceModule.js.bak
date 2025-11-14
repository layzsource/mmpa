/**
 * MMPA Framework V2.0: Feature Importance Module (FIM)
 *
 * Provides real-time force attribution analysis for the MMPA system.
 * Answers the question: "Which inputs are pushing towards instability right now?"
 *
 * Theory:
 * - State dynamics: Σ*(t+1) = f(Σ*(t), u(t))
 * - Control inputs: u = [Trans_sm, Res, ... (up to 6 dimensions)]
 * - Force contribution: F_i = |B_i × u_i| (magnitude of push from input i)
 * - Normalized importance: I_i = F_i / Σ|F_j|
 *
 * Output Format:
 * - Top 3 contributors with percentages
 * - Raw instability score (sum of destabilizing forces)
 * - Directional indicators (stabilizing vs. destabilizing)
 *
 * V2.0 Features:
 * - 6-dimensional force attribution
 * - Real-time ranking
 * - Normalized contributions (sum to 100%)
 */

console.log("📊 featureImportanceModule.js V2.0 loaded");

export class FeatureImportanceModule {
  constructor(options = {}) {
    // === System Parameters (from UKF) ===
    // Control input matrix B (6-dimensional)
    // B = [B_trans, B_res, B_exp1, B_exp2, B_exp3, B_exp4]
    this.B = options.B || [
      -0.05,  // Trans_sm (translational smoothness)
      -0.15,  // Res (resilience)
      -0.03,  // Expansion 1
      -0.02,  // Expansion 2
      -0.01,  // Expansion 3
      -0.01   // Expansion 4
    ];

    // Input names for human-readable output
    this.inputNames = options.inputNames || [
      'Trans_sm',
      'Res',
      'Exp_1',
      'Exp_2',
      'Exp_3',
      'Exp_4'
    ];

    // === FIM Configuration ===
    this.topN = options.topN || 3; // Number of top contributors to report

    console.log("📊 Feature Importance Module initialized");
    console.log(`   Tracking ${this.B.length} force dimensions`);
    console.log(`   Reporting top ${this.topN} contributors`);
  }

  /**
   * Compute force attribution for current control inputs
   *
   * @param {Array} u - Control inputs (length = B.length)
   * @param {number} current_state - Current Σ* value (optional, for context)
   * @returns {Object} { top_contributors, raw_instability, all_forces }
   */
  computeAttribution(u, current_state = null) {
    // Ensure u has correct dimension
    const u_padded = this.B.map((_, i) => u[i] || 0);

    // Compute force contributions: F_i = B_i × u_i
    const forces = this.B.map((B_i, i) => B_i * u_padded[i]);

    // Total force magnitude (sum of absolute forces)
    const total_force = forces.reduce((sum, f) => sum + Math.abs(f), 0);

    // Avoid division by zero
    if (total_force < 1e-10) {
      return {
        top_contributors: [],
        raw_instability: 0,
        all_forces: forces.map((f, i) => ({
          name: this.inputNames[i],
          force: 0,
          importance: 0,
          direction: 'neutral'
        }))
      };
    }

    // Normalized importance: I_i = |F_i| / Σ|F_j|
    const importances = forces.map(f => Math.abs(f) / total_force);

    // Create attribution array with metadata
    const attributions = forces.map((f, i) => ({
      index: i,
      name: this.inputNames[i],
      force: f,
      importance: importances[i],
      direction: f < 0 ? 'destabilizing' : f > 0 ? 'stabilizing' : 'neutral'
    }));

    // Sort by absolute importance (descending)
    const sorted = [...attributions].sort((a, b) => b.importance - a.importance);

    // Top N contributors
    const top_contributors = sorted.slice(0, this.topN).map(attr => ({
      name: attr.name,
      percentage: (attr.importance * 100).toFixed(1),
      force: attr.force.toFixed(4),
      direction: attr.direction
    }));

    // Raw instability score (sum of destabilizing forces)
    const destabilizing_sum = forces
      .filter(f => f < 0)
      .reduce((sum, f) => sum + Math.abs(f), 0);

    return {
      top_contributors: top_contributors,
      raw_instability: destabilizing_sum,
      total_force: total_force,
      all_forces: attributions,
      current_state: current_state
    };
  }

  /**
   * Format attribution as human-readable string
   *
   * @param {Object} attribution - Output from computeAttribution()
   * @returns {string} - Formatted report
   */
  formatReport(attribution) {
    let report = "📊 Force Attribution Report\n";
    report += "━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

    if (attribution.current_state !== null) {
      report += `Current State: Σ* = ${attribution.current_state.toFixed(3)}\n`;
    }

    report += `Raw Instability: ${attribution.raw_instability.toFixed(4)}\n`;
    report += `Total Force: ${attribution.total_force.toFixed(4)}\n\n`;

    report += "Top Contributors:\n";
    attribution.top_contributors.forEach((contrib, idx) => {
      const arrow = contrib.direction === 'destabilizing' ? '↓' :
                    contrib.direction === 'stabilizing' ? '↑' : '→';
      report += `  ${idx + 1}. ${contrib.name}: ${contrib.percentage}% ${arrow}\n`;
      report += `     Force: ${contrib.force}\n`;
    });

    return report;
  }

  /**
   * Get compact summary (for HUD display)
   *
   * @param {Object} attribution - Output from computeAttribution()
   * @returns {string} - One-line summary
   */
  getSummary(attribution) {
    if (attribution.top_contributors.length === 0) {
      return "No active forces";
    }

    const top = attribution.top_contributors[0];
    const arrow = top.direction === 'destabilizing' ? '↓' :
                  top.direction === 'stabilizing' ? '↑' : '→';

    return `${top.name} ${top.percentage}% ${arrow} | Instability: ${attribution.raw_instability.toFixed(3)}`;
  }

  /**
   * Compute sensitivity analysis: how important is each input?
   *
   * This is different from force attribution - sensitivity shows
   * the *potential* impact of each input at unit magnitude.
   *
   * Sensitivity_i = |B_i| / Σ|B_j|
   *
   * @returns {Object} - Sensitivity percentages for each input
   */
  computeSensitivity() {
    const total_B = this.B.reduce((sum, B_i) => sum + Math.abs(B_i), 0);

    const sensitivities = this.B.map((B_i, i) => ({
      name: this.inputNames[i],
      sensitivity: Math.abs(B_i) / total_B,
      percentage: ((Math.abs(B_i) / total_B) * 100).toFixed(1)
    }));

    // Sort by sensitivity (descending)
    sensitivities.sort((a, b) => b.sensitivity - a.sensitivity);

    return {
      sensitivities: sensitivities,
      most_sensitive: sensitivities[0].name,
      least_sensitive: sensitivities[sensitivities.length - 1].name
    };
  }

  /**
   * Update B matrix (if system dynamics change)
   *
   * @param {Array} B_new - New control input matrix
   */
  updateB(B_new) {
    if (B_new.length !== this.B.length) {
      console.warn(`📊 FIM: B dimension mismatch (expected ${this.B.length}, got ${B_new.length})`);
      return;
    }

    this.B = [...B_new];
    console.log("📊 FIM: B matrix updated");
  }

  /**
   * Get diagnostics
   */
  getDiagnostics() {
    const sensitivity = this.computeSensitivity();

    return {
      version: '2.0-FIM',
      dimensions: this.B.length,
      input_names: this.inputNames,
      B_matrix: this.B,
      sensitivity: sensitivity.sensitivities,
      most_sensitive_input: sensitivity.most_sensitive,
      least_sensitive_input: sensitivity.least_sensitive
    };
  }
}

console.log("📊 FeatureImportanceModule class ready");

export default FeatureImportanceModule;
