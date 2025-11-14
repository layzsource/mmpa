console.log("₿ coincapRestSource.js loaded");

/**
 * CoinCap REST API Data Source
 *
 * Polls CoinCap.io REST API for Bitcoin price data.
 * More reliable than WebSockets - works everywhere.
 *
 * REST endpoint: https://api.coincap.io/v2/assets/bitcoin
 *
 * Response format:
 * {
 *   "data": {
 *     "id": "bitcoin",
 *     "symbol": "BTC",
 *     "priceUsd": "110241.50",
 *     "marketCapUsd": "...",
 *     "volumeUsd24Hr": "..."
 *   }
 * }
 */

import { MarketTick } from './financialDataPipeline.js';

export class CoinCapRestSource {
  constructor(config = {}) {
    this.config = {
      symbol: config.symbol || 'bitcoin',
      pollInterval: config.pollInterval || 1000, // Poll every 1 second
      maxRetries: config.maxRetries || 5,
      retryDelay: config.retryDelay || 3000,
      ...config
    };

    this.listeners = [];
    this.isRunning = false;
    this.pollTimer = null;
    this.retryCount = 0;

    // Price state
    this.state = {
      lastPrice: null,
      lastUpdate: Date.now(),
      updateCount: 0,
      connected: false
    };

    console.log(`₿ CoinCapRestSource initialized for ${this.config.symbol}`);
  }

  /**
   * Start polling
   */
  start() {
    if (this.isRunning) {
      console.warn("₿ CoinCap REST already running");
      return;
    }

    this.isRunning = true;
    this.state.connected = true;
    console.log("₿ Starting CoinCap REST polling");

    // Start polling immediately
    this._poll();
  }

  /**
   * Stop polling
   */
  stop() {
    console.log("₿ Stopping CoinCap REST polling");
    this.isRunning = false;
    this.state.connected = false;

    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }
  }

  /**
   * Subscribe to tick events
   */
  onTick(callback) {
    this.listeners.push(callback);
  }

  /**
   * Poll CoinCap API
   */
  async _poll() {
    if (!this.isRunning) return;

    try {
      const endpoint = `https://api.coincap.io/v2/assets/${this.config.symbol}`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data && data.data && data.data.priceUsd) {
        const price = parseFloat(data.data.priceUsd);
        const volumeUsd = data.data.volumeUsd24Hr ? parseFloat(data.data.volumeUsd24Hr) : 0;

        // Update state
        this.state.lastPrice = price;
        this.state.lastUpdate = Date.now();
        this.state.updateCount++;

        // Create and emit tick
        const tick = new MarketTick(
          'BTC',
          price,
          volumeUsd,
          Date.now()
        );

        this.listeners.forEach(callback => callback(tick));

        // Reset retry count on success
        this.retryCount = 0;

        // Log first successful update
        if (this.state.updateCount === 1) {
          console.log(`₿ CoinCap REST connected - BTC price: $${price.toFixed(2)}`);
        }
      }
    } catch (error) {
      console.error("₿ CoinCap REST error:", error.message);

      this.retryCount++;

      if (this.retryCount >= this.config.maxRetries) {
        console.error(`₿ Max retries (${this.config.maxRetries}) reached. Stopping.`);
        this.stop();
        return;
      }

      console.log(`₿ Retry ${this.retryCount}/${this.config.maxRetries} in ${this.config.retryDelay}ms`);
    }

    // Schedule next poll
    if (this.isRunning) {
      this.pollTimer = setTimeout(() => {
        this._poll();
      }, this.config.pollInterval);
    }
  }

  /**
   * Get current state
   */
  getState() {
    return {
      symbol: this.config.symbol,
      connected: this.state.connected,
      price: this.state.lastPrice,
      updateCount: this.state.updateCount,
      retryCount: this.retryCount
    };
  }
}

console.log("₿ CoinCapRestSource class ready");
