console.log("₿ coincapSource.js loaded");

/**
 * CoinCap API Data Source
 *
 * CoinCap API has more generous rate limits than CoinGecko:
 * - Free tier: 200 requests/minute
 * - No API key required for basic endpoints
 *
 * REST endpoint: https://api.coincap.io/v2/assets/bitcoin
 *
 * Response format:
 * {
 *   "data": {
 *     "priceUsd": "110241.50",
 *     "volumeUsd24Hr": "12345678.90"
 *   }
 * }
 */

import { MarketTick } from './financialDataPipeline.js';

export class CoinCapSource {
  constructor(config = {}) {
    this.config = {
      symbol: config.symbol || 'bitcoin',
      pollInterval: config.pollInterval || 5000, // More generous: 5 seconds
      maxRetries: config.maxRetries || 5,
      retryDelay: config.retryDelay || 10000,
      ...config
    };

    this.listeners = [];
    this.isRunning = false;
    this.pollTimer = null;
    this.retryCount = 0;
    this.rateLimitBackoff = 0;

    // Price state
    this.state = {
      lastPrice: null,
      lastUpdate: Date.now(),
      updateCount: 0,
      connected: false
    };

    console.log(`₿ CoinCapSource initialized for ${this.config.symbol}`);
  }

  /**
   * Start polling
   */
  start() {
    if (this.isRunning) {
      console.warn("₿ CoinCap already running");
      return;
    }

    this.isRunning = true;
    this.state.connected = true;
    console.log("₿ Starting CoinCap polling");

    // Start polling immediately
    this._poll();
  }

  /**
   * Stop polling
   */
  stop() {
    console.log("₿ Stopping CoinCap polling");
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

      const result = await response.json();

      if (result && result.data && result.data.priceUsd) {
        const price = parseFloat(result.data.priceUsd);
        const volumeUsd = parseFloat(result.data.volumeUsd24Hr || 0);

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

        // Reset retry count and rate limit backoff on success
        this.retryCount = 0;
        this.rateLimitBackoff = 0;

        // Log first successful update
        if (this.state.updateCount === 1) {
          console.log(`₿ CoinCap connected - BTC price: $${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
        }
      }
    } catch (error) {
      // Check if it's a 429 rate limit error
      if (error.message.includes('429')) {
        this.rateLimitBackoff = Math.min(this.rateLimitBackoff + 5000, 30000); // Increase backoff up to 30s
        console.warn(`₿ CoinCap rate limit hit - backing off for ${this.rateLimitBackoff / 1000}s`);

        // Schedule next poll with backoff
        if (this.isRunning) {
          this.pollTimer = setTimeout(() => {
            this._poll();
          }, this.config.pollInterval + this.rateLimitBackoff);
        }
        return;
      }

      console.error("₿ CoinCap error:", error.message);
      this.retryCount++;

      if (this.retryCount >= this.config.maxRetries) {
        console.error(`₿ Max retries (${this.config.maxRetries}) reached. Stopping.`);
        this.stop();
        return;
      }

      console.log(`₿ Retry ${this.retryCount}/${this.config.maxRetries} in ${this.config.retryDelay}ms`);
    }

    // Schedule next poll (with possible rate limit backoff)
    if (this.isRunning) {
      const nextInterval = this.config.pollInterval + this.rateLimitBackoff;
      this.pollTimer = setTimeout(() => {
        this._poll();
      }, nextInterval);
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

console.log("₿ CoinCapSource class ready");
