console.log("₿ coingeckoRestSource.js loaded");

/**
 * CoinGecko REST API Data Source
 *
 * Polls CoinGecko API for Bitcoin price data.
 * CoinGecko is widely accessible and less likely to be blocked.
 *
 * REST endpoint: https://api.coingecko.com/api/v3/simple/price
 *
 * Response format:
 * {
 *   "bitcoin": {
 *     "usd": 110241.50
 *   }
 * }
 */

import { MarketTick } from './financialDataPipeline.js';

export class CoinGeckoRestSource {
  constructor(config = {}) {
    this.config = {
      symbol: config.symbol || 'bitcoin',
      pollInterval: config.pollInterval || 10000, // Poll every 10 seconds (CoinGecko free tier rate limit)
      maxRetries: config.maxRetries || 5,
      retryDelay: config.retryDelay || 15000, // 15 seconds for rate limit backoff
      ...config
    };

    this.listeners = [];
    this.isRunning = false;
    this.pollTimer = null;
    this.retryCount = 0;
    this.rateLimitBackoff = 0; // Additional backoff when hitting rate limits

    // Price state
    this.state = {
      lastPrice: null,
      lastUpdate: Date.now(),
      updateCount: 0,
      connected: false
    };

    console.log(`₿ CoinGeckoRestSource initialized for ${this.config.symbol}`);
  }

  /**
   * Start polling
   */
  start() {
    if (this.isRunning) {
      console.warn("₿ CoinGecko REST already running");
      return;
    }

    this.isRunning = true;
    this.state.connected = true;
    console.log("₿ Starting CoinGecko REST polling");

    // Start polling immediately
    this._poll();
  }

  /**
   * Stop polling
   */
  stop() {
    console.log("₿ Stopping CoinGecko REST polling");
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
   * Poll CoinGecko API
   */
  async _poll() {
    if (!this.isRunning) return;

    try {
      // CoinGecko simple price endpoint - no API key required
      const endpoint = `https://api.coingecko.com/api/v3/simple/price?ids=${this.config.symbol}&vs_currencies=usd&include_24hr_vol=true`;

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

      if (data && data[this.config.symbol] && data[this.config.symbol].usd) {
        const price = parseFloat(data[this.config.symbol].usd);
        const volumeUsd = data[this.config.symbol].usd_24h_vol || 0;

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
          console.log(`₿ CoinGecko REST connected - BTC price: $${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
        }
      }
    } catch (error) {
      // Check if it's a 429 rate limit error
      if (error.message.includes('429')) {
        this.rateLimitBackoff = Math.min(this.rateLimitBackoff + 10000, 60000); // Increase backoff up to 60s
        console.warn(`₿ CoinGecko rate limit hit - backing off for ${this.rateLimitBackoff / 1000}s`);

        // Schedule next poll with backoff
        if (this.isRunning) {
          this.pollTimer = setTimeout(() => {
            this._poll();
          }, this.config.pollInterval + this.rateLimitBackoff);
        }
        return;
      }

      console.error("₿ CoinGecko REST error:", error.message);
      this.retryCount++;

      if (this.retryCount >= this.config.maxRetries) {
        console.error(`₿ Max retries (${this.config.maxRetries}) reached. Stopping.`);
        console.error(`₿ Your network may be blocking cryptocurrency API access.`);
        console.error(`₿ Try using a VPN or different network if you need live data.`);
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

console.log("₿ CoinGeckoRestSource class ready");
