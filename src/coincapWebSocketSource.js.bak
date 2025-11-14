console.log("₿ coincapWebSocketSource.js loaded");

/**
 * CoinCap WebSocket Data Source
 *
 * Connects to CoinCap.io public WebSocket API for real-time Bitcoin price data.
 * No authentication required. Works globally (no geographic restrictions).
 *
 * WebSocket endpoint: wss://ws.coincap.io/prices?assets=bitcoin
 *
 * Message format:
 * {
 *   "bitcoin": "110241.50"
 * }
 */

import { MarketTick } from './financialDataPipeline.js';

export class CoinCapWebSocketSource {
  constructor(config = {}) {
    this.config = {
      symbol: config.symbol || 'bitcoin',
      reconnectDelay: config.reconnectDelay || 3000,
      maxReconnectAttempts: config.maxReconnectAttempts || 10,
      aggregateInterval: config.aggregateInterval || 1000, // Emit every 1 second
      ...config
    };

    this.ws = null;
    this.listeners = [];
    this.reconnectAttempts = 0;
    this.isConnecting = false;
    this.isRunning = false;

    // Price state
    this.state = {
      lastPrice: null,
      lastUpdate: Date.now(),
      updateCount: 0
    };

    this.emitTimer = null;

    console.log(`₿ CoinCapWebSocketSource initialized for ${this.config.symbol}`);
  }

  /**
   * Start WebSocket connection
   */
  start() {
    if (this.isRunning) {
      console.warn("₿ CoinCap WebSocket already running");
      return;
    }

    this.isRunning = true;
    this._connect();
  }

  /**
   * Stop WebSocket connection
   */
  stop() {
    console.log("₿ Stopping CoinCap WebSocket");
    this.isRunning = false;
    this.isConnecting = false;

    if (this.emitTimer) {
      clearInterval(this.emitTimer);
      this.emitTimer = null;
    }

    if (this.ws) {
      // Only close if connection is open or connecting
      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        try {
          this.ws.close();
        } catch (error) {
          console.warn("₿ Error closing WebSocket:", error);
        }
      }
      this.ws = null;
    }
  }

  /**
   * Subscribe to tick events
   */
  onTick(callback) {
    this.listeners.push(callback);
  }

  /**
   * Connect to CoinCap WebSocket
   */
  _connect() {
    if (this.isConnecting || !this.isRunning) return;

    this.isConnecting = true;
    const endpoint = `wss://ws.coincap.io/prices?assets=${this.config.symbol}`;

    console.log(`₿ Connecting to CoinCap WebSocket: ${endpoint}`);

    try {
      this.ws = new WebSocket(endpoint);

      this.ws.onopen = () => {
        console.log(`₿ Connected to CoinCap (${this.config.symbol})`);
        this.isConnecting = false;
        this.reconnectAttempts = 0;

        // Start emit timer
        this._startEmitTimer();
      };

      this.ws.onmessage = (event) => {
        this._handleMessage(event.data);
      };

      this.ws.onerror = (error) => {
        console.error("₿ CoinCap WebSocket error:", error);
      };

      this.ws.onclose = () => {
        console.log("₿ CoinCap WebSocket closed");
        this.isConnecting = false;

        // Stop emit timer
        if (this.emitTimer) {
          clearInterval(this.emitTimer);
          this.emitTimer = null;
        }

        // Attempt reconnection if still running
        if (this.isRunning) {
          this._attemptReconnect();
        }
      };
    } catch (error) {
      console.error("₿ Failed to create WebSocket:", error);
      this.isConnecting = false;
      if (this.isRunning) {
        this._attemptReconnect();
      }
    }
  }

  /**
   * Handle incoming WebSocket message
   */
  _handleMessage(data) {
    try {
      const msg = JSON.parse(data);

      // CoinCap sends: { "bitcoin": "110241.50" }
      if (msg[this.config.symbol]) {
        const price = parseFloat(msg[this.config.symbol]);

        this.state.lastPrice = price;
        this.state.lastUpdate = Date.now();
        this.state.updateCount++;
      }
    } catch (error) {
      console.error("₿ Error parsing message:", error);
    }
  }

  /**
   * Start emit timer (emit tick every interval)
   */
  _startEmitTimer() {
    this.emitTimer = setInterval(() => {
      this._emitTick();
    }, this.config.aggregateInterval);
  }

  /**
   * Emit tick to listeners
   */
  _emitTick() {
    // Skip if no price data yet
    if (this.state.lastPrice === null) {
      return;
    }

    // Create tick
    // Note: CoinCap doesn't provide volume, so we use 0
    const tick = new MarketTick(
      'BTC',
      this.state.lastPrice,
      0, // Volume not available from CoinCap
      Date.now()
    );

    // Emit to listeners
    this.listeners.forEach(callback => callback(tick));
  }

  /**
   * Attempt reconnection with exponential backoff
   */
  _attemptReconnect() {
    if (!this.isRunning) return;

    this.reconnectAttempts++;

    if (this.reconnectAttempts > this.config.maxReconnectAttempts) {
      console.error(`₿ Max reconnection attempts (${this.config.maxReconnectAttempts}) reached. Giving up.`);
      this.isRunning = false;
      return;
    }

    const delay = Math.min(
      this.config.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      30000 // Max 30 seconds
    );

    console.log(`₿ Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`);

    setTimeout(() => {
      this._connect();
    }, delay);
  }

  /**
   * Get current state
   */
  getState() {
    return {
      symbol: this.config.symbol,
      connected: this.ws && this.ws.readyState === WebSocket.OPEN,
      price: this.state.lastPrice,
      updateCount: this.state.updateCount,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

console.log("₿ CoinCapWebSocketSource class ready");
