console.log("₿ binanceProxySource.js loaded");

/**
 * Binance Proxy Data Source
 *
 * Connects to local Node.js proxy server that fetches Binance data.
 * This bypasses browser CORS restrictions and network blocks.
 *
 * Local proxy endpoint: http://localhost:3003/api/btc
 */

import { MarketTick } from './financialDataPipeline.js';

export class BinanceProxySource {
  constructor(config = {}) {
    this.config = {
      proxyUrl: config.proxyUrl || 'http://localhost:3003/api/btc',
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

    console.log(`₿ BinanceProxySource initialized (proxy: ${this.config.proxyUrl})`);
  }

  /**
   * Start polling
   */
  start() {
    if (this.isRunning) {
      console.warn("₿ Binance Proxy already running");
      return;
    }

    this.isRunning = true;
    this.state.connected = true;
    console.log("₿ Starting Binance Proxy polling");

    // Start polling immediately
    this._poll();
  }

  /**
   * Stop polling
   */
  stop() {
    console.log("₿ Stopping Binance Proxy polling");
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
   * Poll local proxy server
   */
  async _poll() {
    if (!this.isRunning) return;

    try {
      const response = await fetch(this.config.proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data && data.price) {
        const price = parseFloat(data.price);

        // Update state
        this.state.lastPrice = price;
        this.state.lastUpdate = Date.now();
        this.state.updateCount++;

        // Create and emit tick
        const tick = new MarketTick(
          'BTC',
          price,
          0, // Volume not provided by simple price endpoint
          Date.now()
        );

        this.listeners.forEach(callback => callback(tick));

        // Reset retry count on success
        this.retryCount = 0;

        // Log first successful update
        if (this.state.updateCount === 1) {
          console.log(`₿ Binance Proxy connected - BTC price: $${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
        }
      }
    } catch (error) {
      console.error("₿ Binance Proxy error:", error.message);

      this.retryCount++;

      if (this.retryCount >= this.config.maxRetries) {
        console.error(`₿ Max retries (${this.config.maxRetries}) reached.`);
        console.error(`₿ Make sure the proxy server is running: node proxy-server.js`);
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
      symbol: 'BTC',
      connected: this.state.connected,
      price: this.state.lastPrice,
      updateCount: this.state.updateCount,
      retryCount: this.retryCount
    };
  }
}

console.log("₿ BinanceProxySource class ready");
