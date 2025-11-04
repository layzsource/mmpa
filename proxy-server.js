/**
 * Binance API Proxy Server
 *
 * Runs on Node.js to bypass browser CORS restrictions and network blocks.
 * Fetches Bitcoin price from Binance REST API and serves it to the frontend.
 */

const http = require('http');
const https = require('https');

const PORT = 3003;

// Cache to prevent excessive API calls
let priceCache = {
  price: null,
  timestamp: 0,
  cacheDuration: 1000 // 1 second cache
};

function fetchBinancePrice() {
  return new Promise((resolve, reject) => {
    // Check cache first
    const now = Date.now();
    if (priceCache.price && (now - priceCache.timestamp) < priceCache.cacheDuration) {
      resolve(priceCache.price);
      return;
    }

    const options = {
      hostname: 'api.binance.com',
      path: '/api/v3/ticker/price?symbol=BTCUSDT',
      method: 'GET',
      headers: {
        'User-Agent': 'MMPA-Visualizer/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.price) {
            const price = parseFloat(json.price);

            // Update cache
            priceCache = {
              price: price,
              timestamp: Date.now()
            };

            resolve(price);
          } else {
            reject(new Error('Invalid response from Binance'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Only handle GET requests to /api/btc
  if (req.method === 'GET' && req.url === '/api/btc') {
    try {
      const price = await fetchBinancePrice();

      res.writeHead(200);
      res.end(JSON.stringify({
        symbol: 'BTC',
        price: price,
        timestamp: Date.now(),
        source: 'Binance'
      }));

      console.log(`✓ BTC Price: $${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    } catch (error) {
      console.error('✗ Error fetching price:', error.message);

      res.writeHead(500);
      res.end(JSON.stringify({
        error: error.message
      }));
    }
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({
      error: 'Not found'
    }));
  }
});

server.listen(PORT, () => {
  console.log(`\n₿ Binance Proxy Server running on http://localhost:${PORT}`);
  console.log(`   Endpoint: http://localhost:${PORT}/api/btc`);
  console.log(`   Press Ctrl+C to stop\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n₿ Shutting down proxy server...');
  server.close(() => {
    console.log('₿ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n₿ Shutting down proxy server...');
  server.close(() => {
    console.log('₿ Server closed');
    process.exit(0);
  });
});
