console.log("₿ binanceSource.js loaded");

/**
 * Binance Public API Data Source
 *
 * Binance has very generous rate limits for public endpoints:
 * - Weight-based system: 1200 weight/minute
 * - ticker/price endpoint: 1 weight per request = ~1200 requests/minute
 * - No API key required for public data
 *
 * REST endpoint: https://api.binance.com/api/v3/ticker/price
 *
 * Response format:
 * {
 *   "symbol": "BTCUSDT",
 *   "price": "110241.50"
 * }
 *
 * 24hr ticker (includes volume): https://api.binance.com/api/v3/ticker/24hr
 * {
 *   "symbol": "BTCUSDT",
 *   "lastPrice": "110241.50",
 *   "volume": "12345.67",
 *   "quoteVolume": "1234567890.12"
 * }
 */

import { MarketTick } from './financialDataPipeline.js';

export class BinanceSource {
  constructor(config = {}) {
    this.config = {
      symbol: config.symbol || 'BTCUSDT', // Binance uses different symbol format
      pollInterval: config.pollInterval || 3000, // Very generous: 3 seconds
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

    console.log(`₿ BinanceSource initialized for ${this.config.symbol}`);
  }

  /**
   * Start polling
   */
  start() {
    if (this.isRunning) {
      console.warn("₿ Binance already running");
      return;
    }

    this.isRunning = true;
    this.state.connected = true;
    console.log("₿ Starting Binance polling");

    // Start polling immediately
    this._poll();
  }

  /**
   * Stop polling
   */
  stop() {
    console.log("₿ Stopping Binance polling");
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
   * Poll Binance API
   */
  async _poll() {
    if (!this.isRunning) return;

    try {
      // Use 24hr ticker for volume data
      const endpoint = `https://api.binance.com/api/v3/ticker/24hr?symbol=${this.config.symbol}`;

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

      if (data && data.lastPrice) {
        const price = parseFloat(data.lastPrice);
        const volumeUsd = parseFloat(data.quoteVolume || 0); // Quote volume is in USD

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
          console.log(`₿ Binance connected - BTC price: $${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
        }
      }
    } catch (error) {
      // Check if it's a 429 rate limit error
      if (error.message.includes('429') || error.message.includes('418')) { // 418 = IP banned
        this.rateLimitBackoff = Math.min(this.rateLimitBackoff + 5000, 30000);
        console.warn(`₿ Binance rate limit hit - backing off for ${this.rateLimitBackoff / 1000}s`);

        // Schedule next poll with backoff
        if (this.isRunning) {
          this.pollTimer = setTimeout(() => {
            this._poll();
          }, this.config.pollInterval + this.rateLimitBackoff);
        }
        return;
      }

      console.error("₿ Binance error:", error.message);
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

console.log("₿ BinanceSource class ready");
