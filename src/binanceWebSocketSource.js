console.log("₿ binanceWebSocketSource.js loaded");

/**
 * Binance WebSocket Data Source
 *
 * Connects to Binance public WebSocket API for real-time Bitcoin price data.
 * No authentication required for public market data.
 *
 * WebSocket endpoint: wss://stream.binance.com:9443/ws/btcusdt@trade
 *
 * Trade stream message format:
 * {
 *   "e": "trade",
 *   "E": 123456789,   // Event time
 *   "s": "BTCUSDT",   // Symbol
 *   "t": 12345,       // Trade ID
 *   "p": "110000.00", // Price
 *   "q": "0.001",     // Quantity
 *   "T": 123456785,   // Trade time
 * }
 */

import { MarketTick } from './financialDataPipeline.js';

export class BinanceWebSocketSource {
  constructor(config = {}) {
    this.config = {
      symbol: config.symbol || 'BTCUSDT',
      reconnectDelay: config.reconnectDelay || 3000,
      maxReconnectAttempts: config.maxReconnectAttempts || 10,
      aggregateInterval: config.aggregateInterval || 1000, // Aggregate trades every 1 second
      ...config
    };

    this.ws = null;
    this.listeners = [];
    this.reconnectAttempts = 0;
    this.isConnecting = false;
    this.isRunning = false;

    // Trade aggregation state
    this.aggregation = {
      lastPrice: null,
      volumeSum: 0,
      tradeCount: 0,
      vwap: 0,           // Volume-weighted average price
      lastEmit: Date.now()
    };

    this.aggregationTimer = null;

    console.log(`₿ BinanceWebSocketSource initialized for ${this.config.symbol}`);
  }

  /**
   * Start WebSocket connection
   */
  start() {
    if (this.isRunning) {
      console.warn("₿ Binance WebSocket already running");
      return;
    }

    this.isRunning = true;
    this._connect();
  }

  /**
   * Stop WebSocket connection
   */
  stop() {
    console.log("₿ Stopping Binance WebSocket");
    this.isRunning = false;

    if (this.aggregationTimer) {
      clearInterval(this.aggregationTimer);
      this.aggregationTimer = null;
    }

    if (this.ws) {
      this.ws.close();
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
   * Connect to Binance WebSocket
   */
  _connect() {
    if (this.isConnecting) return;

    this.isConnecting = true;
    const endpoint = `wss://stream.binance.com:9443/ws/${this.config.symbol.toLowerCase()}@trade`;

    console.log(`₿ Connecting to Binance WebSocket: ${endpoint}`);

    try {
      this.ws = new WebSocket(endpoint);

      this.ws.onopen = () => {
        console.log(`₿ Connected to Binance (${this.config.symbol})`);
        this.isConnecting = false;
        this.reconnectAttempts = 0;

        // Start aggregation timer
        this._startAggregation();
      };

      this.ws.onmessage = (event) => {
        this._handleMessage(event.data);
      };

      this.ws.onerror = (error) => {
        console.error("₿ Binance WebSocket error:", error);
      };

      this.ws.onclose = () => {
        console.log("₿ Binance WebSocket closed");
        this.isConnecting = false;

        // Stop aggregation timer
        if (this.aggregationTimer) {
          clearInterval(this.aggregationTimer);
          this.aggregationTimer = null;
        }

        // Attempt reconnection if still running
        if (this.isRunning) {
          this._attemptReconnect();
        }
      };
    } catch (error) {
      console.error("₿ Failed to create WebSocket:", error);
      this.isConnecting = false;
      this._attemptReconnect();
    }
  }

  /**
   * Handle incoming WebSocket message
   */
  _handleMessage(data) {
    try {
      const msg = JSON.parse(data);

      // Only process trade events
      if (msg.e === 'trade') {
        const price = parseFloat(msg.p);
        const quantity = parseFloat(msg.q);
        const timestamp = msg.T;

        // Aggregate trades
        this._aggregateTrade(price, quantity, timestamp);
      }
    } catch (error) {
      console.error("₿ Error parsing message:", error);
    }
  }

  /**
   * Aggregate trades over interval
   */
  _aggregateTrade(price, quantity, timestamp) {
    // Update aggregation state
    this.aggregation.lastPrice = price;
    this.aggregation.volumeSum += quantity;
    this.aggregation.tradeCount++;

    // Update VWAP (volume-weighted average price)
    if (this.aggregation.tradeCount === 1) {
      this.aggregation.vwap = price;
    } else {
      // Incremental VWAP calculation
      const totalVolume = this.aggregation.volumeSum;
      const prevVwap = this.aggregation.vwap;
      const prevVolume = totalVolume - quantity;

      this.aggregation.vwap = (prevVwap * prevVolume + price * quantity) / totalVolume;
    }
  }

  /**
   * Start aggregation timer
   */
  _startAggregation() {
    this.aggregationTimer = setInterval(() => {
      this._emitAggregatedTick();
    }, this.config.aggregateInterval);
  }

  /**
   * Emit aggregated tick
   */
  _emitAggregatedTick() {
    // If no trades in this interval, use last known price with zero volume
    let price, volumeUSD;

    if (this.aggregation.tradeCount === 0) {
      // No new trades - use last known price
      if (this.aggregation.lastPrice === null) {
        return; // No data yet, skip
      }
      price = this.aggregation.lastPrice;
      volumeUSD = 0; // No volume in this interval
    } else {
      // Use VWAP as the tick price (more stable than last trade)
      price = this.aggregation.vwap;
      const volume = this.aggregation.volumeSum;
      // Convert BTC volume to USD volume for consistency
      volumeUSD = volume * price;
    }

    // Create tick
    const tick = new MarketTick(
      'BTC',
      price,
      volumeUSD,
      Date.now()
    );

    // Emit to listeners
    this.listeners.forEach(callback => callback(tick));

    // Reset aggregation state (but keep lastPrice)
    this.aggregation.volumeSum = 0;
    this.aggregation.tradeCount = 0;
    this.aggregation.lastEmit = Date.now();
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
      price: this.aggregation.lastPrice,
      volumeSum: this.aggregation.volumeSum,
      tradeCount: this.aggregation.tradeCount,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

console.log("₿ BinanceWebSocketSource class ready");
