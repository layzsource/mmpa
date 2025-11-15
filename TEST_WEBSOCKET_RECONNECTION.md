# WebSocket Reconnection Validation Test

**Purpose**: Verify OSC WebSocket adapter reconnects automatically with exponential backoff

**Duration**: ~5 minutes

---

## Prerequisites

1. **OSC Bridge Server** (optional, for full test):
   ```bash
   # If you have node-osc-bridge or similar
   npm install -g osc-websocket-bridge
   osc-websocket-bridge --port 8080
   ```

2. **Or use mock test** (no server needed):
   ```bash
   # Run the app
   npm run dev
   ```

---

## Test Procedure

### Part 1: Normal Connection (30 seconds)

1. Open browser console (F12)

2. Connect to OSC WebSocket:
   ```javascript
   // Try connecting to localhost OSC bridge
   const osc = new OSCSignalAdapter({
     reconnectDelay: 2000,      // 2s initial delay (faster for testing)
     maxReconnectAttempts: 5    // 5 attempts max
   });

   await osc.connect('ws://localhost:8080');
   ```

3. **Expected Output**:
   ```
   📡 Connecting to OSC WebSocket: ws://localhost:8080
   ```

4. **If server is running**:
   ```
   📡 OSC WebSocket connected: ws://localhost:8080
   ```

5. **If server is NOT running**:
   ```
   📡 OSC WebSocket error: ...
   📡 OSC WebSocket disconnected
   📡 OSC reconnecting in 2000ms (attempt 1/5)
   ```

---

### Part 2: Reconnection Test (2 minutes)

**Scenario A: Server Down at Start**

1. Ensure OSC server is NOT running

2. Try to connect:
   ```javascript
   const osc = new OSCSignalAdapter({
     reconnectDelay: 3000,
     maxReconnectAttempts: 5
   });

   await osc.connect('ws://localhost:8080');
   ```

3. **Watch the Console** - Should see exponential backoff:
   ```
   📡 Connecting to OSC WebSocket: ws://localhost:8080
   📡 OSC WebSocket error: ...
   📡 OSC WebSocket disconnected
   📡 OSC reconnecting in 3000ms (attempt 1/5)

   [Wait 3 seconds...]

   📡 Connecting to OSC WebSocket: ws://localhost:8080
   📡 OSC WebSocket error: ...
   📡 OSC reconnecting in 6000ms (attempt 2/5)

   [Wait 6 seconds...]

   📡 Connecting to OSC WebSocket: ws://localhost:8080
   📡 OSC reconnecting in 12000ms (attempt 3/5)

   [Wait 12 seconds...]

   📡 Connecting to OSC WebSocket: ws://localhost:8080
   📡 OSC reconnecting in 24000ms (attempt 4/5)

   [Wait 24 seconds...]

   📡 Connecting to OSC WebSocket: ws://localhost:8080
   📡 OSC reconnecting in 30000ms (attempt 5/5)

   [Wait 30 seconds - capped at max]

   📡 OSC max reconnection attempts (5) reached. Giving up.
   ```

4. **✅ PASS Criteria**:
   - Delays follow exponential pattern: 3s → 6s → 12s → 24s → 30s (capped)
   - Stops after max attempts
   - No errors or crashes

---

**Scenario B: Server Disconnect During Use**

1. Start OSC server

2. Connect:
   ```javascript
   const osc = new OSCSignalAdapter();
   await osc.connect('ws://localhost:8080');
   ```

3. **Verify connected**:
   ```
   📡 OSC WebSocket connected: ws://localhost:8080
   ```

4. **Kill the OSC server** (Ctrl+C in server terminal)

5. **Watch Console** - Should see automatic reconnection:
   ```
   📡 OSC WebSocket disconnected
   📡 OSC reconnecting in 3000ms (attempt 1/10)

   [Reconnection attempts continue...]
   ```

6. **Restart OSC server** (before max attempts reached)

7. **Should see successful reconnection**:
   ```
   📡 Connecting to OSC WebSocket: ws://localhost:8080
   📡 OSC WebSocket connected: ws://localhost:8080
   ```

8. **✅ PASS Criteria**:
   - Automatic reconnection triggered on disconnect
   - Successfully reconnects when server comes back
   - Reconnection counter resets to 0 after success

---

**Scenario C: Manual Disconnect**

1. Connect to OSC:
   ```javascript
   const osc = new OSCSignalAdapter();
   await osc.connect('ws://localhost:8080');
   ```

2. Manually disconnect:
   ```javascript
   osc.disconnect();
   ```

3. **Expected Output**:
   ```
   📡 Stopping OSC WebSocket
   📡 OSC WebSocket disconnected
   ```

4. **Should NOT see reconnection attempts** (because we called disconnect)

5. **✅ PASS Criteria**:
   - disconnect() stops reconnection attempts
   - Clean shutdown with no errors
   - isRunning = false

---

### Part 3: Integration with Camera Signal Provider (1 minute)

1. Test within the full app:
   ```javascript
   // In browser console
   const router = window.cameraSignalRouter;

   // Check if OSC adapter exists
   console.log('OSC adapter:', router?.oscAdapter);

   // Try connecting
   await router.oscAdapter.connect('ws://localhost:8080');
   ```

2. **If server running**: Should connect successfully

3. **If server down**: Should see reconnection attempts

4. **✅ PASS Criteria**:
   - Integration works within full app context
   - No console errors
   - Other systems (camera, biosignal) unaffected

---

## Expected Behavior Summary

| Event | Expected Behavior |
|-------|-------------------|
| **Initial connect (server up)** | Immediate connection, no reconnection |
| **Initial connect (server down)** | Exponential backoff reconnection |
| **Disconnect during use** | Automatic reconnection attempts |
| **Manual disconnect()** | No reconnection attempts |
| **Reconnect success** | Counter resets, normal operation |
| **Max attempts reached** | Stops trying, logs error |

---

## Validation Checklist

- [ ] **Exponential backoff works**: Delays follow 3s → 6s → 12s → 24s → 30s (max)
- [ ] **Max attempts respected**: Stops after configured max (default 10)
- [ ] **Auto-reconnect on disconnect**: Triggers automatically when connection drops
- [ ] **Manual disconnect stops reconnection**: disconnect() prevents auto-reconnect
- [ ] **Successful reconnection resets counter**: Counter goes back to 0
- [ ] **No crashes or errors**: Clean error handling throughout
- [ ] **Integrates with app**: Works within cameraSignalRouter context

---

## Troubleshooting

**Issue**: "WebSocket is not defined"
- **Solution**: Run in browser, not Node.js

**Issue**: Connection always fails
- **Solution**: OSC server not running, which is expected - test reconnection logic

**Issue**: Reconnection doesn't stop
- **Solution**: Check maxReconnectAttempts configuration

**Issue**: Reconnection too slow
- **Solution**: Lower reconnectDelay for testing (e.g., 1000ms instead of 3000ms)

---

## Quick Pass/Fail Test

**Fastest validation** (30 seconds):

```javascript
// In browser console
const osc = new OSCSignalAdapter({
  reconnectDelay: 1000,  // 1s for fast testing
  maxReconnectAttempts: 3
});

await osc.connect('ws://localhost:9999'); // Non-existent server

// Watch console for:
// ✓ "reconnecting in 1000ms (attempt 1/3)"
// ✓ "reconnecting in 2000ms (attempt 2/3)"
// ✓ "reconnecting in 4000ms (attempt 3/3)"
// ✓ "Max reconnection attempts (3) reached. Giving up."

// Then stop it:
osc.disconnect();

// ✓ Should see "Stopping OSC WebSocket" with no more reconnection attempts
```

**If you see all ✓ above**: **PASS** ✅

---

## Status

**Validation Status**: MANUAL TEST REQUIRED

**Next Steps**: Run this test in the browser/Electron app

**Estimated Time**: 5 minutes

**Automated Test**: Not possible without mock WebSocket server
