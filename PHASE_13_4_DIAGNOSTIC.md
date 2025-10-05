# Phase 13.4 Diagnostic Guide

## Problem: "Nothing is functional"

### Files Modified in Phase 13.4:
1. `src/hud.js` - Fixed `notifyHUDUpdate()` to accept and pass data
2. `src/audio.js` - Added event emitter with frame loop
3. `src/audioRouter.js` - Changed from polling to event-driven pattern
4. `src/main.js` - Added `initAudioRouter()` call

### Critical Diagnostics to Check in Electron DevTools Console

Open Electron app and press **Cmd+Option+I** to open DevTools.

#### 1. Check for JavaScript Errors
Look for any red error messages, especially:
- Import/export errors
- Undefined function errors
- Circular dependency warnings

#### 2. Check Module Loading
Look for these console.log messages in order:
```
📟 hud.js: HUD Signal Bridge online
📟 HUD registry initialized
📟 hud.js loaded
📟 hudRouter.js loaded
📟 HUD router callback registered    ← CRITICAL - must appear
🎶 audioRouter.js loaded (Phase 13.4)
🎶 Audio routing configured (Phase 13.4)
🎧 Initializing audio router event relay...
✅ Audio router event relay registered
```

#### 3. Test HUD Controls Manually
In DevTools Console, type:
```javascript
// Check if hudRouter callback is registered
window._hudRouterCallback
// Should output: function

// Test manual HUD update
window._hudRouterCallback({ audioEnabled: true })
// Should trigger audio initialization logs

// Check AudioEngine state
AudioProbe.info()
```

#### 4. Expected Behavior When Clicking Audio Toggle:
```
🪗 HUD audio toggle clicked
📟 notifyHUDUpdate called with: ["audioEnabled"]
🎵 Audio Reactive: true
🔍 Phase 13.1a: Calling enableAudio() from hudRouter
```

#### 5. Expected Behavior for Sliders:
When moving ANY slider, you should see:
```
📟 notifyHUDUpdate called with: ["particlesSize"]  (or whatever property changed)
```

### Common Issues:

**If `window._hudRouterCallback` is undefined:**
- hudRouter.js didn't execute
- Import order issue
- JavaScript error before hudRouter loads

**If clicking controls produces no console output:**
- Event listeners not attached
- HUD not initialized
- DOM elements not created

**If you see "⚠️ No hudRouter callback registered!":**
- Timing issue - HUD controls tried to fire before hudRouter loaded

### Quick Fix Test:
In DevTools console:
```javascript
// Manually register a test callback
window._hudRouterCallback = (update) => {
  console.log("🧪 TEST CALLBACK:", update);
};

// Click any HUD control
// You should see the test callback fire
```

If the test callback works, the issue is with hudRouter.js not executing.
If the test callback doesn't fire, the issue is with HUD controls not calling notifyHUDUpdate.

### Rollback Instructions:
If Phase 13.4 broke everything, revert:
```bash
git diff src/hud.js
git diff src/audio.js
git diff src/audioRouter.js
git diff src/main.js
```

The key change was in `src/hud.js` line 18:
```javascript
// OLD (broken):
export function notifyHUDUpdate() { HUD.notify(); }

// NEW (fixed):
export function notifyHUDUpdate(update) {
  if (update && typeof update === 'object') {
    console.log('📟 notifyHUDUpdate called with:', Object.keys(update));
    if (typeof window._hudRouterCallback === "function") {
      window._hudRouterCallback(update);
    }
  } else {
    HUD.notify();
  }
}
```
