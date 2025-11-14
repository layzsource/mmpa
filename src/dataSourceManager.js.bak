console.log("₿ dataSourceManager.js loaded");

/**
 * Data Source Manager
 *
 * Manages multiple financial data sources with:
 * - User-configurable source selection
 * - LocalStorage persistence of preferences
 * - Automatic fallback on source failure
 * - Unified interface for pipeline integration
 *
 * Supported Sources:
 * - CoinGecko (10s polling, moderate limits)
 * - CoinCap (5s polling, generous limits)
 * - Binance (3s polling, very generous limits)
 * - Mock (1s synthetic data for testing)
 */

import { CoinGeckoRestSource } from './coingeckoRestSource.js';
import { CoinCapSource } from './coincapSource.js';
import { BinanceSource } from './binanceSource.js';
import { MockDataGenerator } from './financialDataPipeline.js';

export class DataSourceManager {
  constructor() {
    // Available sources registry
    this.sources = {
      'coingecko': {
        name: 'CoinGecko',
        description: 'CoinGecko API (10s, moderate limits)',
        factory: () => new CoinGeckoRestSource({ symbol: 'bitcoin' }),
        instance: null
      },
      'coincap': {
        name: 'CoinCap',
        description: 'CoinCap API (5s, generous limits)',
        factory: () => new CoinCapSource({ symbol: 'bitcoin' }),
        instance: null
      },
      'binance': {
        name: 'Binance',
        description: 'Binance Public API (3s, very generous)',
        factory: () => new BinanceSource({ symbol: 'BTCUSDT' }),
        instance: null
      },
      'mock': {
        name: 'Mock Data',
        description: 'Synthetic Bitcoin data (1s, unlimited)',
        factory: () => new MockDataGenerator({ symbol: 'BTC' }),
        instance: null
      }
    };

    // Load user preference from localStorage
    this.currentSourceKey = this._loadPreference();
    this.activeSource = null;
    this.listeners = [];

    console.log(`₿ DataSourceManager initialized - Default source: ${this.currentSourceKey}`);
  }

  /**
   * Get list of available sources for UI
   */
  getAvailableSources() {
    return Object.keys(this.sources).map(key => ({
      key,
      name: this.sources[key].name,
      description: this.sources[key].description
    }));
  }

  /**
   * Get current active source key
   */
  getCurrentSource() {
    return this.currentSourceKey;
  }

  /**
   * Switch to a different data source
   */
  switchSource(sourceKey) {
    if (!this.sources[sourceKey]) {
      console.error(`₿ Unknown data source: ${sourceKey}`);
      return false;
    }

    console.log(`₿ Switching data source to: ${this.sources[sourceKey].name}`);

    // Stop current source if running
    if (this.activeSource) {
      this.activeSource.stop();
      this.activeSource = null;
    }

    // Create or reuse source instance
    if (!this.sources[sourceKey].instance) {
      this.sources[sourceKey].instance = this.sources[sourceKey].factory();

      // Subscribe to tick events
      this.sources[sourceKey].instance.onTick((tick) => {
        this._emitTick(tick);
      });
    }

    // Activate new source
    this.activeSource = this.sources[sourceKey].instance;
    this.currentSourceKey = sourceKey;

    // Save preference
    this._savePreference(sourceKey);

    // Start new source
    this.activeSource.start();

    console.log(`✓ Data source switched to: ${this.sources[sourceKey].name}`);
    return true;
  }

  /**
   * Start the currently selected data source
   */
  start() {
    if (!this.activeSource) {
      // Initialize the default/preferred source
      this.switchSource(this.currentSourceKey);
    } else if (this.activeSource) {
      this.activeSource.start();
    }
  }

  /**
   * Stop the active data source
   */
  stop() {
    if (this.activeSource) {
      this.activeSource.stop();
    }
  }

  /**
   * Subscribe to tick events from any source
   */
  onTick(callback) {
    this.listeners.push(callback);
  }

  /**
   * Get state of active source
   */
  getState() {
    if (!this.activeSource) {
      return {
        source: this.currentSourceKey,
        connected: false,
        price: null,
        updateCount: 0
      };
    }

    const state = this.activeSource.getState();
    return {
      source: this.currentSourceKey,
      sourceName: this.sources[this.currentSourceKey].name,
      ...state
    };
  }

  /**
   * Internal: Emit tick to all listeners
   */
  _emitTick(tick) {
    this.listeners.forEach(callback => {
      try {
        callback(tick);
      } catch (error) {
        console.error("₿ Error in tick listener:", error);
      }
    });
  }

  /**
   * Internal: Load user preference from localStorage
   */
  _loadPreference() {
    try {
      const saved = localStorage.getItem('mmpa_data_source');
      if (saved && this.sources[saved]) {
        console.log(`₿ Loaded user preference: ${saved}`);
        return saved;
      }
    } catch (error) {
      console.warn("₿ Could not load data source preference:", error);
    }

    // Default to CoinCap (better rate limits than CoinGecko)
    return 'coincap';
  }

  /**
   * Internal: Save user preference to localStorage
   */
  _savePreference(sourceKey) {
    try {
      localStorage.setItem('mmpa_data_source', sourceKey);
      console.log(`₿ Saved user preference: ${sourceKey}`);
    } catch (error) {
      console.warn("₿ Could not save data source preference:", error);
    }
  }
}

console.log("₿ DataSourceManager class ready");
