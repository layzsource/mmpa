# Google Drive Integration Documentation

**Purpose**: Configurable save paths for exporting MMPA data to Google Drive (or any folder)
**Status**: ✅ Implemented and functional
**Date**: 2025-11-14

---

## Overview

MMPA doesn't use Google Drive API directly. Instead, it provides **configurable save paths** that users can point to their Google Drive folder (or any cloud storage folder mounted locally).

---

## Key Components

### 1. Settings System (`settings.js`)

**Default Save Paths**:
```javascript
trainingData: '~/MMPA_Data/training_data'
```

Users can configure this to point to:
- `~/Google Drive/MMPA_Data/training_data`
- `~/Dropbox/MMPA_Data/training_data`
- Any local or cloud-synced folder

**Location**: `src/settings.js`

### 2. Data Logger (`mmpaDataLogger.js`)

**Exports**:
- **JSON format**: Complete session data with timestamps
- **CSV format** (via `dataLogger.js`): Training data for ML

**Console Commands**:
```javascript
mmpaLogger.start()     // Start logging
mmpaLogger.stop()      // Stop logging
mmpaLogger.download()  // Download JSON
mmpaLogger.stats()     // Get statistics
mmpaLogger.clear()     // Clear log
```

**Data Structure**:
```json
{
  "sessionStart": 1699876543210,
  "sessionDuration": 3600,
  "sampleCount": 216000,
  "samplingRate": 60,
  "data": [
    {
      "timestamp": 1699876543210,
      "relativeTime": 0,
      "pi": 0.42,
      "phi": 0.58,
      "synchronicity": 0.24,
      "balance": 0.42,
      "archetype": "TRANSFORMATION",
      "confidence": 0.87
    }
    // ... up to 60,000 entries
  ]
}
```

### 3. Training Data Export (`dataLogger.js`)

**Purpose**: Export data for ML training
**Formats**:
- JSON: `mmpa_training_data_${timestamp}.json`
- CSV: `mmpa_training_data_${timestamp}.csv`

**Location**: `src/dataLogger.js`

### 4. Timeline Export (`hudPiPhi.js`)

**Exports**:
- Timeline JSON with π/φ history
- PNG snapshots of timeline visualization
- CSV for spreadsheet analysis

**Functions**:
- `downloadTimelineJSON()`
- `downloadTimelinePNG()`
- `downloadTimelineCSV()`
- `downloadCompleteMMPAData()` - Everything combined

---

## User Configuration

### HUD Settings Panel (`hudSettings.js`)

Users can configure:
1. **Save directory paths**
2. **Filename patterns**
3. **Auto-export settings**

**UI Description**: "Configure where timeline and training data files are saved"

---

## Testing Workflow

### Typical User Flow:

1. **Configure Save Path**:
   - Open Settings panel
   - Set path to `~/Google Drive/MMPA_Data/`
   - Save configuration

2. **Start Session**:
   - Open application
   - Enable MMPA analysis
   - Console: `mmpaLogger.start()`

3. **Run Performance/Test**:
   - Play audio or load financial data
   - System logs π/φ/synchronicity data
   - Up to 60,000 samples (1 hour)

4. **Export Data**:
   - Console: `mmpaLogger.download()`
   - Or use HUD export buttons
   - Files save to configured Google Drive path

5. **Access from Other Devices**:
   - Google Drive syncs files
   - Access data on phone/tablet/other computers
   - Import back into MMPA for replay

---

## File Formats

### 1. MMPA Data JSON
```json
{
  "sessionStart": timestamp,
  "sessionDuration": seconds,
  "sampleCount": count,
  "samplingRate": hz,
  "data": [...]
}
```

### 2. Timeline JSON
```json
{
  "version": "1.0.0",
  "exportDate": "ISO-8601",
  "timelineStartTime": timestamp,
  "history": [...],
  "peaks": [...],
  "currentMetrics": {...},
  "statistics": {...}
}
```

### 3. Complete Export
```json
{
  "version": "1.0.0",
  "type": "mmpa-complete-export",
  "palettes": {...},
  "timeline": {...}
}
```

### 4. Training Data CSV
```csv
Timestamp,Elapsed Time (s),Pi Score (Chaos),Phi Score (Harmony),Synchronicity,Balance,Archetype,Confidence
2025-11-14T...,0.00,0.4200,0.5800,0.2436,0.4200,TRANSFORMATION,0.8700
...
```

---

## Integration Points

### Files That Export Data:
1. `mmpaDataLogger.js` - Core logging
2. `dataLogger.js` - Training data export
3. `hudPiPhi.js` - Timeline exports
4. `colorPalettes.js` - Palette exports
5. `presetRouter.js` - Preset exports

### Files That Configure Paths:
1. `settings.js` - Default paths
2. `hudSettings.js` - UI for configuration

---

## Git History

**Relevant Commit**:
```
b757783 Add configurable save paths for timeline and training data
```

This added user-configurable paths instead of hardcoded downloads folder.

---

## Use Cases

### 1. Performance Recording
- VJ/musician records live performance
- Exports timeline data to Google Drive
- Reviews π/φ patterns later
- Identifies "golden moments" (high synchronicity)

### 2. ML Training Data Collection
- Run system for hours collecting data
- Export CSV to Google Drive
- Access from Python notebook (Colab)
- Train models on synchronicity patterns

### 3. Cross-Device Workflow
- Create preset on desktop
- Export to Google Drive
- Import on laptop for live show
- Consistent visuals across devices

### 4. Collaboration
- Share Google Drive folder with team
- Multiple people contribute training data
- Aggregate datasets for analysis
- Share interesting timeline snapshots

---

## Technical Notes

### Max Log Size
- **60,000 entries** = 1 hour at 60 Hz sampling
- Automatic FIFO (oldest removed when full)
- Prevents memory overflow

### Sampling Rate
- Default: ~60 Hz (every frame)
- Adjustable via ANLG throttling
- CSV export includes rate metadata

### File Naming
- Timestamps in ISO-8601 format
- Colons replaced with hyphens (filename-safe)
- Example: `mmpa_data_2025-11-14T15-30-00.json`

---

## Future Enhancements

### Potential Additions:
1. **Google Drive API Integration**:
   - Direct upload without mounting
   - OAuth authentication
   - Auto-sync during session

2. **Real-time Streaming**:
   - WebSocket to cloud storage
   - No manual export needed
   - Live collaboration features

3. **Auto-Backup**:
   - Periodic auto-exports
   - Configurable intervals
   - Prevents data loss

---

## Status

**Current**: ✅ Fully functional via configurable paths
**Limitation**: Requires Google Drive desktop client (or manual copy)
**Recommendation**: Works well for current use case

No changes needed unless you want direct API integration.
