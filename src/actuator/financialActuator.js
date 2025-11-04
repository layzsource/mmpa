/**
 * MMPA Framework V2.0: Financial Actuator Interface
 *
 * Translates LQR control signals into actionable financial trading commands.
 *
 * Theory:
 * - Input: u = [Trans_sm, Res] from LQR controller
 * - Output: {trade_velocity, exposure_target}
 * - Trade velocity: Rate of position adjustment (shares/sec or contracts/min)
 * - Exposure target: Desired position size as % of portfolio
 *
 * Domain Translation:
 * - Trans_sm → Trade velocity modulation (smooth entry/exit)
 * - Res → Exposure scaling (risk sizing)
 * - Negative u → Reduce exposure (stabilize)
 * - Positive u → Increase exposure (destabilize, rare in crisis management)
 *
 * V2.0 Features:
 * - Rate limiting (max trade velocity to avoid market impact)
 * - Exposure constraints (min/max position limits)
 * - Emergency stop (halt trading if instability exceeds threshold)
 */

console.log("💰 financialActuator.js V2.0 loaded");

export class FinancialActuator {
  constructor(options = {}) {
    // === Domain-Specific Parameters ===
    // Maximum trade velocity (shares/second or contracts/minute)
    this.maxTradeVelocity = options.maxTradeVelocity || 100; // shares/sec

    // Exposure limits (% of portfolio, 0-1)
    this.minExposure = options.minExposure || 0.0;    // 0% (full cash)
    this.maxExposure = options.maxExposure || 1.0;    // 100% (full invested)

    // Current portfolio state
    this.currentExposure = options.initialExposure || 0.5; // 50% default

    // === Control-to-Actuator Mapping ===
    // How sensitive is trade velocity to Trans_sm control signal?
    this.velocity_gain = options.velocity_gain || 50.0; // shares/sec per unit control

    // How sensitive is exposure target to Res control signal?
    this.exposure_gain = options.exposure_gain || 0.2; // % change per unit control

    // === Safety Parameters ===
    // Emergency stop threshold (Σ* below this → halt all trading)
    this.emergencyStopThreshold = options.emergencyStopThreshold || 0.3;
    this.tradingHalted = false;

    console.log("💰 Financial Actuator initialized");
    console.log(`   Max Trade Velocity: ${this.maxTradeVelocity} shares/sec`);
    console.log(`   Exposure Range: ${(this.minExposure * 100).toFixed(0)}% - ${(this.maxExposure * 100).toFixed(0)}%`);
    console.log(`   Emergency Stop: Σ* < ${this.emergencyStopThreshold}`);
  }

  /**
   * Apply control signal to generate trading commands
   *
   * @param {Array} u - Control signal [Trans_sm, Res] from LQR
   * @param {number} current_state - Current Σ* value
   * @returns {Object} { trade_velocity, exposure_target, action, halted }
   */
  actuate(u, current_state) {
    // Check emergency stop condition
    if (current_state < this.emergencyStopThreshold) {
      if (!this.tradingHalted) {
        console.warn(`💰 EMERGENCY STOP: Σ* = ${current_state.toFixed(3)} < ${this.emergencyStopThreshold}`);
        this.tradingHalted = true;
      }

      return {
        trade_velocity: 0,
        exposure_target: this.minExposure, // Go to cash
        action: 'HALT',
        halted: true,
        reason: `Crisis detected (Σ* = ${current_state.toFixed(3)})`
      };
    }

    // Resume trading if state recovers
    if (this.tradingHalted && current_state >= this.emergencyStopThreshold + 0.05) {
      console.log(`💰 Trading resumed: Σ* = ${current_state.toFixed(3)}`);
      this.tradingHalted = false;
    }

    const [trans_sm, res] = u;

    // --- Trade Velocity Calculation ---
    // Trans_sm controls how fast we adjust positions
    // Negative Trans_sm → reduce positions quickly
    // Positive Trans_sm → increase positions (rare)
    let trade_velocity = -trans_sm * this.velocity_gain;

    // Apply rate limiting
    trade_velocity = Math.max(-this.maxTradeVelocity, Math.min(this.maxTradeVelocity, trade_velocity));

    // --- Exposure Target Calculation ---
    // Res controls desired exposure level
    // Negative Res → reduce exposure (defensive)
    // Positive Res → increase exposure (aggressive, rare)
    let exposure_delta = -res * this.exposure_gain;
    let exposure_target = this.currentExposure + exposure_delta;

    // Apply exposure constraints
    exposure_target = Math.max(this.minExposure, Math.min(this.maxExposure, exposure_target));

    // Determine action type
    let action = 'HOLD';
    if (Math.abs(trade_velocity) > 1.0) {
      action = trade_velocity < 0 ? 'SELL' : 'BUY';
    }

    return {
      trade_velocity: trade_velocity,        // shares/sec
      exposure_target: exposure_target,      // % of portfolio (0-1)
      exposure_delta: exposure_delta,        // change from current
      action: action,                        // BUY, SELL, HOLD
      halted: false,
      current_exposure: this.currentExposure
    };
  }

  /**
   * Update current exposure (called after trade execution)
   *
   * @param {number} new_exposure - New exposure level (0-1)
   */
  updateExposure(new_exposure) {
    this.currentExposure = Math.max(this.minExposure, Math.min(this.maxExposure, new_exposure));
    console.log(`💰 Exposure updated: ${(this.currentExposure * 100).toFixed(1)}%`);
  }

  /**
   * Manually halt/resume trading
   *
   * @param {boolean} halt - True to halt, false to resume
   */
  setTradingHalt(halt) {
    this.tradingHalted = halt;
    console.log(`💰 Trading ${halt ? 'HALTED' : 'RESUMED'} (manual override)`);
  }

  /**
   * Get diagnostics
   */
  getDiagnostics() {
    return {
      version: '2.0-FinancialActuator',
      domain: 'financial',
      current_exposure: this.currentExposure,
      exposure_range: [this.minExposure, this.maxExposure],
      max_trade_velocity: this.maxTradeVelocity,
      trading_halted: this.tradingHalted,
      emergency_threshold: this.emergencyStopThreshold,
      gains: {
        velocity: this.velocity_gain,
        exposure: this.exposure_gain
      }
    };
  }
}

console.log("💰 FinancialActuator class ready");

export default FinancialActuator;
