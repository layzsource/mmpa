# MMPA Deployment Guide

**Complete Deployment Instructions for MMPA Platform v1.0**

---

## Table of Contents

1. [Local Development](#local-development)
2. [Production Build](#production-build)
3. [Cloud Deployment](#cloud-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Performance Tuning](#performance-tuning)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)

---

## Local Development

### Prerequisites

- **Node.js** ≥ 14.0.0 ([Download](https://nodejs.org/))
- **npm** ≥ 6.0.0 (comes with Node.js)
- **Git** (for cloning repository)
- **Modern Browser** with WebGL 2.0:
  - Chrome 90+ (recommended)
  - Firefox 88+
  - Safari 14+

### Installation Steps

#### 1. Clone Repository

```bash
git clone https://github.com/yourusername/mmpa.git
cd mmpa
```

#### 2. Install Dependencies

```bash
npm install
```

**Expected Output**:
```
added 127 packages in 8s
```

#### 3. Run Development Server

```bash
npm run dev
```

**Expected Output**:
```
  VITE v4.x.x  ready in 523 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.x:3000/
```

#### 4. Open in Browser

Navigate to `http://localhost:3000`

#### 5. Verify Installation

**In Browser Console** (F12):

```javascript
// Check MMPA features
console.log('MMPA Features:', state.mmpaFeatures);

// Enable audio
state.audioEnabled = true;

// Enable MMPA
state.mmpaFeatures.enabled = true;
```

**Expected**: No errors, visualization active

---

## Production Build

### Build Process

#### 1. Create Production Build

```bash
npm run build
```

**Expected Output**:
```
vite v4.x.x building for production...
✓ 237 modules transformed.
dist/index.html                  2.14 kB
dist/assets/index-a3b4c5d6.js  543.27 kB │ gzip: 156.84 kB
✓ built in 4.23s
```

#### 2. Preview Production Build

```bash
npm run preview
```

Opens at `http://localhost:4173`

#### 3. Verify Production Build

**Checks**:
- ✅ Assets minified
- ✅ Source maps generated
- ✅ No console errors
- ✅ 60 FPS performance
- ✅ Audio input working
- ✅ MMPA features functional

### Build Configuration

**File**: `vite.config.js` (if using Vite)

```javascript
export default {
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'audio': [
            './src/audio/audioEngine.js',
            './src/audio/audioContext.js'
          ],
          'bioacoustics': [
            './src/bioacoustics/differentialForms.js',
            './src/bioacoustics/homology.js'
          ]
        }
      }
    }
  }
}
```

---

## Cloud Deployment

### Option 1: Vercel (Recommended)

**Best for**: Quick deployment, automatic HTTPS, CDN

#### Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts:
# ? Set up and deploy? Yes
# ? Which scope? Your Username
# ? Link to existing project? No
# ? What's your project's name? mmpa
# ? In which directory is your code located? ./
```

**Result**: Live at `https://mmpa-xyz.vercel.app`

#### Deploy with Git

1. Push to GitHub/GitLab/Bitbucket
2. Import project in Vercel dashboard
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy

**Environment Variables** (Vercel Dashboard):
```
NODE_ENV=production
VITE_API_URL=https://api.example.com
```

### Option 2: Netlify

**Best for**: Built-in forms, serverless functions

#### Deploy with Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod

# Follow prompts
# ? Publish directory? dist
```

**Result**: Live at `https://mmpa.netlify.app`

#### Deploy with Git

1. Push to GitHub
2. Connect repository in Netlify
3. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Deploy

### Option 3: AWS S3 + CloudFront

**Best for**: Full AWS integration, scalability

#### Setup Steps

1. **Create S3 Bucket**:
```bash
aws s3 mb s3://mmpa-app
aws s3 website s3://mmpa-app --index-document index.html
```

2. **Upload Build**:
```bash
npm run build
aws s3 sync dist/ s3://mmpa-app --delete
```

3. **Create CloudFront Distribution**:
```bash
aws cloudfront create-distribution \
  --origin-domain-name mmpa-app.s3.amazonaws.com \
  --default-root-object index.html
```

4. **Update DNS** (Route 53 or your registrar):
```
CNAME: mmpa.yourdomain.com → d1a2b3c4d5e6f7.cloudfront.net
```

**Result**: Live at `https://mmpa.yourdomain.com`

### Option 4: GitHub Pages

**Best for**: Free hosting, simple setup

#### Setup Steps

1. **Install gh-pages**:
```bash
npm install --save-dev gh-pages
```

2. **Add Deploy Script** (`package.json`):
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. **Deploy**:
```bash
npm run deploy
```

4. **Enable GitHub Pages** (Repository Settings):
   - Source: `gh-pages` branch
   - Path: `/` (root)

**Result**: Live at `https://yourusername.github.io/mmpa`

---

## Docker Deployment

### Dockerfile

**File**: `Dockerfile`

```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

**File**: `nginx.conf`

```nginx
events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  gzip on;
  gzip_types text/plain text/css application/json application/javascript;

  server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # SPA fallback
    location / {
      try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }
  }
}
```

### Build & Run

```bash
# Build Docker image
docker build -t mmpa:latest .

# Run container
docker run -d -p 8080:80 --name mmpa mmpa:latest

# Access at http://localhost:8080
```

### Docker Compose

**File**: `docker-compose.yml`

```yaml
version: '3.8'

services:
  mmpa:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

**Run**:
```bash
docker-compose up -d
```

---

## Performance Tuning

### Browser Optimization

#### 1. Enable Hardware Acceleration

**Chrome**: `chrome://settings` → Advanced → System → Use hardware acceleration

**Firefox**: `about:preferences` → General → Performance → Use recommended performance settings

#### 2. Disable Extensions

Temporarily disable browser extensions during use for optimal performance.

#### 3. Close Other Tabs

MMPA is resource-intensive; close unnecessary tabs.

### Application Optimization

#### 1. Adjust FFT Size

**File**: `src/audio/audioEngine.js`

```javascript
// Lower for better performance, higher for better frequency resolution
const fftSize = 2048;  // Options: 256, 512, 1024, 2048, 4096
```

**Recommendation**:
- Performance: 1024
- Quality: 2048
- Best quality: 4096 (may drop FPS)

#### 2. Reduce Particle Count

**File**: `src/visualization/particles.js`

```javascript
const particleCount = 5000;  // Lower = better performance
```

#### 3. Lower Spectrogram Resolution

**File**: `src/bioacoustics/spectrogramPipeline.js`

```javascript
const timeFrames = 50;       // Lower = faster
const frequencyBins = 512;   // Lower = faster
```

#### 4. Disable Expensive Features

```javascript
// Disable persistent homology (expensive)
state.topologyEnabled = false;

// Simplify differential forms
state.maxFormDegree = 1;  // Only compute 0-forms and 1-forms
```

### Server Optimization

#### 1. Enable Gzip Compression

**Nginx**:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 256;
```

#### 2. Set Cache Headers

```nginx
location ~* \.(js|css)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

#### 3. Use HTTP/2

```nginx
listen 443 ssl http2;
```

---

## Monitoring

### Performance Monitoring

#### Browser DevTools

**Chrome DevTools**:
1. F12 → Performance tab
2. Click Record
3. Interact with app
4. Stop recording
5. Analyze:
   - FPS: Target 60
   - Frame time: Target <16.67ms
   - Memory: Should be stable

#### Custom Metrics

**File**: `src/telemetry.js`

```javascript
// FPS counter
let lastTime = performance.now();
let frames = 0;

function measureFPS() {
  frames++;
  const now = performance.now();

  if (now - lastTime >= 1000) {
    console.log(`FPS: ${frames}`);
    frames = 0;
    lastTime = now;
  }

  requestAnimationFrame(measureFPS);
}

measureFPS();
```

### Memory Monitoring

```javascript
// Check memory usage
if (performance.memory) {
  console.log(`Heap: ${(performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Limit: ${(performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`);
}
```

### Error Tracking

#### Sentry Integration

```bash
npm install @sentry/browser
```

```javascript
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production"
});
```

---

## Troubleshooting

### Common Issues

#### 1. Audio Not Working

**Problem**: No audio input detected

**Solutions**:
- Grant microphone permissions
- Check browser audio settings
- Try different browser
- Verify audio device in system settings

**Debug**:
```javascript
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(() => console.log('Audio access granted'))
  .catch(err => console.error('Audio error:', err));
```

#### 2. Low FPS

**Problem**: Performance below 30 FPS

**Solutions**:
- Lower particle count
- Reduce FFT size
- Disable persistent homology
- Close other applications
- Use dedicated GPU

**Debug**:
```javascript
// Check frame time
const start = performance.now();
renderFrame();
console.log(`Frame time: ${performance.now() - start}ms`);
```

#### 3. Memory Leak

**Problem**: Memory grows over time

**Solutions**:
- Verify cache limits enforced
- Check for event listener leaks
- Run validation tests

**Debug**:
```bash
# Run memory profiling test
node test_memory_profiling.js

# Should see: Memory growth < 50 MB
```

#### 4. WebSocket Reconnection Fails

**Problem**: OSC connection doesn't reconnect

**Solutions**:
- Check server is running
- Verify WebSocket URL
- Test manual test guide

**Debug**:
```javascript
// Check reconnection status
console.log('OSC connected:', cameraSignalRouter.oscAdapter.connected);
console.log('Reconnect attempts:', cameraSignalRouter.oscAdapter.reconnectAttempts);
```

### Browser Compatibility

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | 90+ | ✅ Recommended | Best performance |
| Firefox | 88+ | ✅ Good | May need GPU tweaks |
| Safari | 14+ | ⚠️ Limited | WebGL performance varies |
| Edge | 90+ | ✅ Good | Chromium-based |

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2.0 GHz dual-core | 3.0 GHz quad-core+ |
| RAM | 4 GB | 8 GB+ |
| GPU | Integrated WebGL 2.0 | Dedicated GPU |
| Network | 1 Mbps | 10 Mbps+ (for WebSocket) |

---

## Security Considerations

### HTTPS

**Always use HTTPS in production**:
- Prevents MITM attacks
- Required for microphone access
- Better browser compatibility

### CORS

**File**: `server.js` (if using custom server)

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://yourdomain.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  next();
});
```

### Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-eval';
  connect-src 'self' wss://osc.example.com;
  media-src 'self' blob:;
">
```

---

## Checklist

### Pre-Deployment

- [ ] All tests passing (`npm test`)
- [ ] Production build successful (`npm run build`)
- [ ] No console errors
- [ ] Performance ≥ 30 FPS
- [ ] Audio input working
- [ ] MMPA features functional
- [ ] Memory stable (<100 MB growth/hour)

### Post-Deployment

- [ ] HTTPS enabled
- [ ] Custom domain configured
- [ ] Monitoring setup
- [ ] Error tracking active
- [ ] Backups configured
- [ ] Documentation updated

---

**Deployment Guide Version**: 1.0
**Last Updated**: 2025-11-14
**Status**: Production Ready ✅
