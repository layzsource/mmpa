console.log("💹 financialDataPipeline.js loaded");

/**
 * Financial Data Pipeline
 *
 * Provides abstraction layer for financial market data:
 * - Mock data generator (for testing)
 * - WebSocket feeds (Alpaca, Polygon.io, etc.)
 * - REST API fallback
 * - Event-driven updates
 *
 * Philosophy:
 * - The pipeline is source-agnostic
 * - Emits standardized tick events
 * - Handles reconnection and error recovery
 */

import { FinancialFeatureExtractor } from './financialFeatureExtractor.js';
import { RegimeClassifier } from './regimeClassifier.js';
import { ForecastingEngine } from './forecastingEngine.js';
import { CoinGeckoRestSource } from './coingeckoRestSource.js';
import { DataSourceManager } from './dataSourceManager.js';

/**
 * Standardized tick format
 */
export class MarketTick {
  constructor(symbol, price, volume, timestamp = null) {
    this.symbol = symbol;
    this.price = price;
    this.volume = volume;
    this.timestamp = timestamp || Date.now();
  }
}

/**
 * Symbol-specific configurations for mock data generation
 * Updated prices as of November 2025
 */
const SYMBOL_CONFIGS = {
  'SPY': {
    initialPrice: 590.0,          // S&P 500 ETF current level
    baseVolatility: 0.015,        // 1.5% daily volatility
    crisisVolatility: 0.05,       // 5% during crisis
    trendDrift: 0.0001,           // Slight upward drift
  },
  'QQQ': {
    initialPrice: 510.0,          // NASDAQ ETF current level
    baseVolatility: 0.020,        // 2.0% (more volatile than SPY)
    crisisVolatility: 0.07,       // 7% during crisis
    trendDrift: 0.00015,          // Higher growth trend
  },
  'BTC': {
    initialPrice: 110000.0,       // Bitcoin current level
    baseVolatility: 0.040,        // 4.0% (crypto volatility)
    crisisVolatility: 0.15,       // 15% during crisis (extreme)
    trendDrift: 0.0002,           // High growth trend
  },
  'TSLA': {
    initialPrice: 350.0,          // Tesla current level
    baseVolatility: 0.035,        // 3.5% (individual stock)
    crisisVolatility: 0.10,       // 10% during crisis
    trendDrift: 0.00005,          // Moderate trend
  }
};

/**
 * Mock Data Generator
 * Simulates realistic price movements with volatility regimes
 */
export class MockDataGenerator {
  constructor(config = {}) {
    const symbol = config.symbol || 'SPY';
    const symbolConfig = SYMBOL_CONFIGS[symbol] || SYMBOL_CONFIGS['SPY'];

    this.config = {
      symbol: symbol,
      initialPrice: symbolConfig.initialPrice,
      baseVolatility: symbolConfig.baseVolatility,
      trendDrift: symbolConfig.trendDrift,
      crisisVolatility: symbolConfig.crisisVolatility,
      regimeChangeProb: 0.02,      // 2% chance per tick
      updateInterval: 1000,        // 1 second between ticks
      ...config
    };

    this.state = {
      currentPrice: this.config.initialPrice,
      currentVolume: 100000000,
      tickCount: 0,
      inCrisis: false,
      crisisCountdown: 0
    };

    this.intervalId = null;
    this.listeners = [];
  }

  /**
   * Start generating mock data
   */
  start() {
    if (this.intervalId) {
      console.warn("💹 Mock generator already running");
      return;
    }

    console.log(`💹 Starting mock data generator for ${this.config.symbol}`);

    this.intervalId = setInterval(() => {
      this._generateTick();
    }, this.config.updateInterval);
  }

  /**
   * Stop generating data
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("💹 Mock data generator stopped");
    }
  }

  /**
   * Subscribe to tick events
   */
  onTick(callback) {
    this.listeners.push(callback);
  }

  /**
   * Generate single tick
   */
  _generateTick() {
    this.state.tickCount++;

    // Regime change logic
    if (Math.random() < this.config.regimeChangeProb) {
      this.state.inCrisis = !this.state.inCrisis;
      if (this.state.inCrisis) {
        this.state.crisisCountdown = 20 + Math.floor(Math.random() * 30); // 20-50 ticks
        console.log(`💹 ⚠️ CRISIS MODE ACTIVATED (${this.state.crisisCountdown} ticks)`);
      } else {
        console.log("💹 ✅ Crisis mode ended, returning to normal");
      }
    }

    // Countdown crisis
    if (this.state.inCrisis && this.state.crisisCountdown > 0) {
      this.state.crisisCountdown--;
      if (this.state.crisisCountdown === 0) {
        this.state.inCrisis = false;
      }
    }

    // Select volatility based on regime
    const volatility = this.state.inCrisis
      ? this.config.crisisVolatility
      : this.config.baseVolatility;

    // Generate price change (geometric Brownian motion)
    const drift = this.state.inCrisis ? -0.001 : this.config.trendDrift;
    const shock = (Math.random() - 0.5) * 2 * volatility;
    const priceChange = drift + shock;

    // Update price
    this.state.currentPrice = this.state.currentPrice * (1 + priceChange);

    // Generate volume (higher during volatility)
    const baseVolume = 100000000;
    const volumeMultiplier = 1 + Math.abs(shock) * 10;
    this.state.currentVolume = baseVolume * volumeMultiplier * (0.8 + Math.random() * 0.4);

    // Create tick
    const tick = new MarketTick(
      this.config.symbol,
      this.state.currentPrice,
      this.state.currentVolume,
      Date.now()
    );

    // Emit to listeners
    this.listeners.forEach(callback => callback(tick));

    return tick;
  }

  /**
   * Get current state summary
   */
  getState() {
    return {
      symbol: this.config.symbol,
      price: this.state.currentPrice,
      volume: this.state.currentVolume,
      tickCount: this.state.tickCount,
      inCrisis: this.state.inCrisis,
      crisisCountdown: this.state.crisisCountdown
    };
  }
}

/**
 * Financial Data Pipeline
 * Manages data sources and feeds extractor
 */
export class FinancialDataPipeline {
  constructor(config = {}) {
    this.config = {
      source: 'mock',           // 'mock', 'websocket', 'rest' (legacy, or use dataSourceKey)
      symbol: 'SPY',
      autoStart: false,
      dataSourceKey: null,      // New: specific data source key for manager
      ...config
    };

    // Feature extractor
    this.extractor = new FinancialFeatureExtractor(config.extractorParams || {});

    // Phase 13.29: Regime classifier
    this.regimeClassifier = new RegimeClassifier(config.regimeParams || {});

    // Phase 13.30: Forecasting engine
    // Note: Will be initialized after extractor.kalmanFilter is available
    this.forecastingEngine = null;

    // Data source (legacy single source OR new DataSourceManager)
    this.dataSource = null;
    this.dataSourceManager = null;
    this.useManager = false; // Flag to determine which system to use

    // Event listeners
    this.listeners = {
      tick: [],
      features: [],
      error: []
    };

    // Initialize data source
    this._initDataSource();

    if (this.config.autoStart) {
      this.start();
    }
  }

  /**
   * Initialize data source based on config
   */
  _initDataSource() {
    // NEW: If 'managed' source is specified, use DataSourceManager
    if (this.config.source === 'managed' || this.config.dataSourceKey) {
      console.log("💹 Using DataSourceManager for multi-source support");
      this.useManager = true;
      this.dataSourceManager = new DataSourceManager();

      // If a specific source key was requested, switch to it
      if (this.config.dataSourceKey) {
        this.dataSourceManager.switchSource(this.config.dataSourceKey);
      }

      // Subscribe to manager's tick events
      this.dataSourceManager.onTick((tick) => this._handleTick(tick));
      return;
    }

    // LEGACY: Direct source creation (backwards compatibility)
    switch (this.config.source) {
      case 'mock':
        this.dataSource = new MockDataGenerator({
          symbol: this.config.symbol,
          updateInterval: this.config.updateInterval || 1000
        });
        break;

      case 'websocket':
        // Bitcoin: Use CoinGecko REST API (globally accessible, no geographic restrictions)
        if (this.config.symbol === 'BTC') {
          this.dataSource = new CoinGeckoRestSource({
            symbol: 'bitcoin',
            pollInterval: this.config.updateInterval || 10000 // 10 seconds (CoinGecko free tier rate limit)
          });
          console.log("₿ Using CoinGecko API for live Bitcoin data (10s updates)");
        } else {
          // Other symbols: fallback to mock (TODO: Implement Alpaca for stocks)
          console.warn(`💹 Live data source not available for ${this.config.symbol}, using mock data`);
          this.dataSource = new MockDataGenerator({ symbol: this.config.symbol });
        }
        break;

      case 'rest':
        // TODO: Implement REST API polling source
        console.warn("💹 REST source not yet implemented, falling back to mock");
        this.dataSource = new MockDataGenerator({ symbol: this.config.symbol });
        break;

      default:
        console.error(`💹 Unknown source: ${this.config.source}, using mock`);
        this.dataSource = new MockDataGenerator({ symbol: this.config.symbol });
    }

    // Subscribe to data source
    this.dataSource.onTick((tick) => this._handleTick(tick));
  }

  /**
   * Handle incoming tick
   */
  _handleTick(tick) {
    // Emit raw tick
    this.listeners.tick.forEach(callback => callback(tick));

    // Update feature extractor
    const features = this.extractor.update(tick.price, tick.volume, tick.timestamp);

    // Phase 13.29: Run regime classification
    const regimeState = this.regimeClassifier.calculateRegimeState({
      sigmaStar: features.features.resolution.sigma_star,
      sigmaR: features.features.resolution.sigma_R,
      bifurcationRisk: features.features.resolution.bifurcation_risk,
      phiRatio: features.features.resolution.phi_ratio
    });

    // Add regime state to features
    features.regimeState = regimeState;

    // Phase 13.30: Lazy initialize forecasting engine
    if (!this.forecastingEngine && this.extractor.kalmanFilter) {
      this.forecastingEngine = new ForecastingEngine(
        this.extractor.kalmanFilter,
        this.config.forecastParams || {}
      );
      console.log("🔮 ForecastingEngine initialized in pipeline");
    }

    // Phase 13.30: Generate multi-step forecast
    if (this.forecastingEngine) {
      const sigmaStar = features.features.resolution.sigma_star;
      const trans_sm = features.features.transformation.flux;
      const res_sm = features.features.resolution.sigma_R;
      const inputs = [trans_sm, res_sm];

      // Generate forecast: x_t+τ|t = A^τ * x_t
      this.forecastingEngine.generateForecast(sigmaStar, inputs);

      // Record actual regime for validation
      this.forecastingEngine.recordActual(
        regimeState.regimeState,
        tick.timestamp,
        features
      );

      // Add forecast to features
      features.forecast = this.forecastingEngine.getForecast();
      features.validationMetrics = this.forecastingEngine.getValidationMetrics();
    }

    // Update data source mock state (for backward compatibility with HUD display)
    if (this.dataSource && this.dataSource.state) {
      this.dataSource.state.inCrisis = (regimeState.regimeState === 'CRISIS');
      // Keep mock countdown if available
      if (!this.dataSource.state.inCrisis) {
        this.dataSource.state.crisisCountdown = 0;
      }
    }

    // Emit features
    this.listeners.features.forEach(callback => callback(features, tick));
  }

  /**
   * Start pipeline
   */
  start() {
    console.log(`💹 Starting financial data pipeline (source: ${this.config.source})`);
    if (this.useManager && this.dataSourceManager) {
      this.dataSourceManager.start();
    } else if (this.dataSource && this.dataSource.start) {
      this.dataSource.start();
    }
  }

  /**
   * Stop pipeline
   */
  stop() {
    console.log("💹 Stopping financial data pipeline");
    if (this.useManager && this.dataSourceManager) {
      this.dataSourceManager.stop();
    } else if (this.dataSource && this.dataSource.stop) {
      this.dataSource.stop();
    }
  }

  /**
   * Switch data source (only works with DataSourceManager)
   * @param {string} sourceKey - Key of the source to switch to ('coingecko', 'coincap', 'binance', 'mock')
   * @returns {boolean} Success status
   */
  switchDataSource(sourceKey) {
    if (!this.useManager || !this.dataSourceManager) {
      console.warn("💹 Data source switching requires DataSourceManager. Reinitialize with source='managed'");
      return false;
    }

    return this.dataSourceManager.switchSource(sourceKey);
  }

  /**
   * Get available data sources (only works with DataSourceManager)
   * @returns {Array} List of available sources
   */
  getAvailableDataSources() {
    if (!this.useManager || !this.dataSourceManager) {
      return [];
    }

    return this.dataSourceManager.getAvailableSources();
  }

  /**
   * Get current data source info
   * @returns {Object} Current source state
   */
  getCurrentDataSource() {
    if (this.useManager && this.dataSourceManager) {
      return this.dataSourceManager.getState();
    }

    // Legacy mode
    if (this.dataSource && this.dataSource.getState) {
      return {
        source: this.config.source,
        ...this.dataSource.getState()
      };
    }

    return {
      source: this.config.source,
      connected: false
    };
  }

  /**
   * Subscribe to tick events
   */
  onTick(callback) {
    this.listeners.tick.push(callback);
  }

  /**
   * Subscribe to feature extraction events
   */
  onFeatures(callback) {
    this.listeners.features.push(callback);
  }

  /**
   * Subscribe to error events
   */
  onError(callback) {
    this.listeners.error.push(callback);
  }

  /**
   * Get current state
   */
  getState() {
    return {
      source: this.config.source,
      symbol: this.config.symbol,
      dataSource: this.dataSource?.getState?.() || null,
      extractor: this.extractor.getStateSummary()
    };
  }

  /**
   * Change symbol (if supported by data source)
   */
  setSymbol(symbol) {
    this.config.symbol = symbol;

    // For mock generator, recreate with new symbol
    if (this.config.source === 'mock') {
      const wasRunning = this.dataSource.intervalId !== null;
      this.stop();

      this.dataSource = new MockDataGenerator({
        symbol: symbol,
        updateInterval: this.config.updateInterval || 1000
      });

      const symbolConfig = SYMBOL_CONFIGS[symbol] || SYMBOL_CONFIGS['SPY'];
      console.log(`💹 Symbol changed to ${symbol}`);
      console.log(`   Initial Price: $${symbolConfig.initialPrice.toLocaleString()}`);
      console.log(`   Base Volatility: ${(symbolConfig.baseVolatility * 100).toFixed(1)}%`);
      console.log(`   Crisis Volatility: ${(symbolConfig.crisisVolatility * 100).toFixed(1)}%`);

      this.dataSource.onTick((tick) => this._handleTick(tick));

      // Reset extractor state for new symbol
      this.extractor.reset();
      console.log(`   Feature extractor reset for new symbol`);

      if (wasRunning) {
        this.start();
      }
    }
  }

  /**
   * Reset extractor state
   */
  resetExtractor() {
    this.extractor.reset();
    console.log("💹 Feature extractor state reset");
  }
}

/**
 * State Persistence
 */
export class FinancialStatePersistence {
  constructor(storageKey = 'mmpa_financial_state') {
    this.storageKey = storageKey;
  }

  /**
   * Save pipeline state to localStorage
   */
  save(pipeline) {
    try {
      const state = {
        config: pipeline.config,
        extractorState: {
          priceHistory: pipeline.extractor.state.priceHistory,
          volumeHistory: pipeline.extractor.state.volumeHistory,
          returnsHistory: pipeline.extractor.state.returnsHistory,
          timestampHistory: pipeline.extractor.state.timestampHistory,
          ewma: pipeline.extractor.state.ewma
        },
        timestamp: Date.now()
      };

      localStorage.setItem(this.storageKey, JSON.stringify(state));
      console.log(`💹 State saved to localStorage (${this.storageKey})`);
      return true;
    } catch (error) {
      console.error("💹 Failed to save state:", error);
      return false;
    }
  }

  /**
   * Load pipeline state from localStorage
   */
  load() {
    try {
      const stateJson = localStorage.getItem(this.storageKey);
      if (!stateJson) {
        console.log("💹 No saved state found");
        return null;
      }

      const state = JSON.parse(stateJson);
      console.log(`💹 State loaded from localStorage (saved ${new Date(state.timestamp).toLocaleString()})`);
      return state;
    } catch (error) {
      console.error("💹 Failed to load state:", error);
      return null;
    }
  }

  /**
   * Clear saved state
   */
  clear() {
    localStorage.removeItem(this.storageKey);
    console.log("💹 Saved state cleared");
  }
}

// Singleton instance (optional convenience)
let defaultPipeline = null;

export function getFinancialPipeline(config = null) {
  if (!defaultPipeline || config) {
    defaultPipeline = new FinancialDataPipeline(config || { source: 'mock', symbol: 'SPY' });
  }
  return defaultPipeline;
}

export function resetFinancialPipeline() {
  if (defaultPipeline) {
    defaultPipeline.stop();
    defaultPipeline = null;
  }
}

console.log("💹 Financial Data Pipeline module ready");
