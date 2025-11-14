// Sexagenary Cycle Panel
// Dedicated window for Earthly Branches circular chart
// Shows chromatic scale mapped to MMPA forces

console.log("🌀 sexagenaryCyclePanel.js loaded");

/**
 * SexagenaryCyclePanel - Movable/collapsable window for the Earthly Branches chart
 * Displays 12 chromatic notes mapped to 6 MMPA forces with audio/optical bibibinary mapping
 */
export class SexagenaryCyclePanel {
  constructor() {
    this.isOpen = false;
    this.panel = null;
    this.chartCanvas = null;
    this.chartCtx = null;
    this._chartDebugLogged = false;

    // Time series history buffer (cylindrical/spiral time)
    this.historyBuffer = [];
    this.maxHistoryRings = 8; // Number of historical rings to display
    this.currentTimePosition = 0; // Current position in 60-step cycle (0-59)
    this.timeStepInterval = 100; // ms between time steps

    console.log("🌀 SexagenaryCyclePanel initialized");
  }

  open() {
    if (this.isOpen) return;

    // Create panel container
    this.panel = document.createElement('div');
    this.panel.id = 'sexagenaryCyclePanel';
    this.panel.style.cssText = `
      position: fixed;
      top: 60px;
      left: 20px;
      width: 580px;
      min-height: 600px;
      background: rgba(0, 0, 0, 0.95);
      border: 2px solid #FFD700;
      border-radius: 8px;
      padding: 10px;
      z-index: 1001;
      font-family: 'Courier New', monospace;
      color: #fff;
      box-shadow: 0 0 30px rgba(255, 215, 0, 0.7);
      display: flex;
      flex-direction: column;
    `;

    // Title bar with close button
    const titleBar = document.createElement('div');
    titleBar.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #FFD700;
      cursor: move;
    `;

    const title = document.createElement('div');
    title.style.cssText = `
      font-size: 14px;
      font-weight: bold;
      color: #FFD700;
      text-transform: uppercase;
      letter-spacing: 2px;
    `;
    title.textContent = '🌀 Sexagenary Cycle';

    const closeButton = document.createElement('button');
    closeButton.textContent = '✕';
    closeButton.style.cssText = `
      background: none;
      border: 1px solid #FFD700;
      color: #FFD700;
      font-size: 18px;
      cursor: pointer;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      transition: all 0.2s;
    `;
    closeButton.onmouseover = () => {
      closeButton.style.background = '#FFD700';
      closeButton.style.color = '#000';
    };
    closeButton.onmouseout = () => {
      closeButton.style.background = 'none';
      closeButton.style.color = '#FFD700';
    };
    closeButton.onclick = () => this.close();

    titleBar.appendChild(title);
    titleBar.appendChild(closeButton);
    this.panel.appendChild(titleBar);

    // Make panel draggable
    this.makeDraggable(this.panel, titleBar);

    // Description
    const description = document.createElement('div');
    description.style.cssText = `
      font-size: 11px;
      color: #ccc;
      margin-bottom: 15px;
      line-height: 1.5;
    `;
    description.innerHTML = `
      <strong>Cylindrical Time Series (60-Position Sexagenary Cycle)</strong><br>
      <strong>Angular:</strong> 12 chromatic notes × 5 force subdivisions = 60 positions<br>
      <strong>Radial:</strong> MMPA force magnitude (bar height)<br>
      <strong>Temporal:</strong> Concentric rings show history (inner=past, outer=present)<br>
      <strong>Color:</strong> Force type (I/R/C/T/A) with AM/PM polarity brightness
    `;
    this.panel.appendChild(description);

    // Chart container
    const chartContainer = document.createElement('div');
    chartContainer.style.cssText = `
      width: 100%;
      background: #000;
      border: 2px solid #FFD700;
      border-radius: 4px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
      box-sizing: border-box;
    `;

    // Create 2D canvas for circular chart - larger for 60 segments
    this.chartCanvas = document.createElement('canvas');
    this.chartCanvas.width = 520;
    this.chartCanvas.height = 520;
    this.chartCanvas.style.cssText = `
      image-rendering: crisp-edges;
      display: block;
      max-width: 100%;
      height: auto;
    `;
    chartContainer.appendChild(this.chartCanvas);
    this.chartCtx = this.chartCanvas.getContext('2d');

    this.panel.appendChild(chartContainer);

    // Legend
    const legend = document.createElement('div');
    legend.style.cssText = `
      margin-top: 15px;
      padding: 10px;
      background: rgba(255, 215, 0, 0.1);
      border: 1px solid #FFD700;
      border-radius: 4px;
      font-size: 10px;
      line-height: 1.6;
    `;
    legend.innerHTML = `
      <strong>MMPA Forces (6):</strong><br>
      <span style="color: #00FFFF;">■</span> Identity (I) - C/C# - Cyan<br>
      <span style="color: #00FF00;">■</span> Relationship (R) - D/D# - Green<br>
      <span style="color: #FF00FF;">■</span> Complexity (C) - E/F - Magenta<br>
      <span style="color: #FF4400;">■</span> Transformation (T) - F#/G - Orange-Red<br>
      <span style="color: #FFFF00;">■</span> Alignment (A) - G#/A - Yellow<br>
      <span style="color: #8800FF;">■</span> Potential (P) - A#/B - Violet<br>
      <strong>Polarities:</strong> Yang/AM (bright) | Yin/PM (dark)
    `;
    this.panel.appendChild(legend);

    console.log('✅ Sexagenary Cycle canvas created:', {
      canvas: !!this.chartCanvas,
      context: !!this.chartCtx,
      width: this.chartCanvas.width,
      height: this.chartCanvas.height
    });

    // Add to document
    document.body.appendChild(this.panel);
    this.isOpen = true;

    // Start render loop
    this.startRenderLoop();

    console.log('🌀 Sexagenary Cycle Panel opened');
  }

  /**
   * Make panel draggable
   */
  makeDraggable(panel, handle) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    handle.addEventListener('mousedown', (e) => {
      isDragging = true;
      initialX = e.clientX - panel.offsetLeft;
      initialY = e.clientY - panel.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        panel.style.left = currentX + 'px';
        panel.style.top = currentY + 'px';
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  /**
   * Draw 60-segment Sexagenary Cycle Chart
   * Combines 10 Heavenly Stems with 12 Earthly Branches (chromatic notes)
   */
  drawEarthlyBranchesChart(mmpaData) {
    if (!this.chartCtx) {
      console.warn('⚠️ Chart context not available');
      return;
    }

    const ctx = this.chartCtx;
    const centerX = this.chartCanvas.width / 2;
    const centerY = this.chartCanvas.height / 2;
    const maxRadius = 160;        // Maximum radius for full value (127)
    const baseRadius = 35;        // Base radius (zero value starts here)
    const innerRadius = 30;       // Inner circle

    // Clear canvas
    ctx.clearRect(0, 0, this.chartCanvas.width, this.chartCanvas.height);

    // 10 Heavenly Stems: 5 MMPA Forces × 2 Polarities (Yang/Yin = AM/PM)
    // Yang = AM Chain (RCP, Input, Algorithmic Ideal)
    // Yin = PM Chain (LCP, Output, Measured Reality)
    const heavenlyStems = [
      { force: 'Identity', polarity: 'Yang', chain: 'AM', color: '#00FFFF', label: 'I-AM' },
      { force: 'Identity', polarity: 'Yin', chain: 'PM', color: '#00AAAA', label: 'I-PM' },
      { force: 'Relationship', polarity: 'Yang', chain: 'AM', color: '#00FF00', label: 'R-AM' },
      { force: 'Relationship', polarity: 'Yin', chain: 'PM', color: '#00AA00', label: 'R-PM' },
      { force: 'Complexity', polarity: 'Yang', chain: 'AM', color: '#FF00FF', label: 'C-AM' },
      { force: 'Complexity', polarity: 'Yin', chain: 'PM', color: '#AA00AA', label: 'C-PM' },
      { force: 'Transformation', polarity: 'Yang', chain: 'AM', color: '#FF4400', label: 'T-AM' },
      { force: 'Transformation', polarity: 'Yin', chain: 'PM', color: '#AA2200', label: 'T-PM' },
      { force: 'Alignment', polarity: 'Yang', chain: 'AM', color: '#FFFF00', label: 'A-AM' },
      { force: 'Alignment', polarity: 'Yin', chain: 'PM', color: '#AAAA00', label: 'A-PM' }
    ];

    // 12 Earthly Branches: 12 chromatic notes mapped to 6 MMPA forces
    const earthlyBranches = [
      { note: 'C', force: 'Identity' },
      { note: 'C#', force: 'Identity' },
      { note: 'D', force: 'Relationship' },
      { note: 'D#', force: 'Relationship' },
      { note: 'E', force: 'Complexity' },
      { note: 'F', force: 'Complexity' },
      { note: 'F#', force: 'Transformation' },
      { note: 'G', force: 'Transformation' },
      { note: 'G#', force: 'Alignment' },
      { note: 'A', force: 'Alignment' },
      { note: 'A#', force: 'Potential' },
      { note: 'B', force: 'Potential' }
    ];

    // MMPA force mapping (each pair of chromatic notes = one MMPA force)
    const mmpaForceMap = {
      'C': { force: 'Identity', color: '#00FFFF', value: 0 },      // Cyan
      'C#': { force: 'Identity', color: '#FF00FF', value: 0 },    // Magenta
      'D': { force: 'Relationship', color: '#00FF00', value: 0 }, // Green
      'D#': { force: 'Relationship', color: '#00FF00', value: 0 },
      'E': { force: 'Complexity', color: '#FF00FF', value: 0 },   // Magenta
      'F': { force: 'Complexity', color: '#FF00FF', value: 0 },
      'F#': { force: 'Transformation', color: '#FF4400', value: 0 }, // Orange-Red
      'G': { force: 'Transformation', color: '#FF4400', value: 0 },
      'G#': { force: 'Alignment', color: '#FFFF00', value: 0 },   // Yellow
      'A': { force: 'Alignment', color: '#FFFF00', value: 0 },
      'A#': { force: 'Potential', color: '#8800FF', value: 0 },   // Violet
      'B': { force: 'Potential', color: '#8800FF', value: 0 }
    };

    // Extract MMPA values if available
    // Bibibinary mapping: alternate audio/optical for each MMPA force
    if (mmpaData) {
      const scaleFactor = 127; // MIDI scale (0-1 → 0-127)

      // Identity: C (audio) / C# (optical)
      mmpaForceMap['C'].value = (mmpaData.audio?.identity || 0) * scaleFactor;
      mmpaForceMap['C#'].value = (mmpaData.optical?.identity || 0) * scaleFactor;

      // Relationship: D (audio) / D# (optical)
      mmpaForceMap['D'].value = (mmpaData.audio?.relationship || 0) * scaleFactor;
      mmpaForceMap['D#'].value = (mmpaData.optical?.relationship || 0) * scaleFactor;

      // Complexity: E (audio) / F (optical)
      mmpaForceMap['E'].value = (mmpaData.audio?.complexity || 0) * scaleFactor;
      mmpaForceMap['F'].value = (mmpaData.optical?.complexity || 0) * scaleFactor;

      // Transformation: F# (audio) / G (optical)
      mmpaForceMap['F#'].value = (mmpaData.audio?.transformation || 0) * scaleFactor;
      mmpaForceMap['G'].value = (mmpaData.optical?.transformation || 0) * scaleFactor;

      // Alignment: G# (audio) / A (optical)
      mmpaForceMap['G#'].value = (mmpaData.audio?.alignment || 0) * scaleFactor;
      mmpaForceMap['A'].value = (mmpaData.optical?.alignment || 0) * scaleFactor;

      // Potential: A# (audio) / B (optical)
      mmpaForceMap['A#'].value = (mmpaData.audio?.potential || 0) * scaleFactor;
      mmpaForceMap['B'].value = (mmpaData.optical?.potential || 0) * scaleFactor;
    }

    // Store current MMPA snapshot in history buffer
    const currentSnapshot = {};
    for (const note in mmpaForceMap) {
      currentSnapshot[note] = mmpaForceMap[note]?.value || 0;
    }

    // Add to history buffer (newest at end)
    this.historyBuffer.push(currentSnapshot);
    if (this.historyBuffer.length > this.maxHistoryRings) {
      this.historyBuffer.shift(); // Remove oldest
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // DRAW CYLINDRICAL TIME SERIES (Historical Rings + Current Data)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    // Draw each historical ring (oldest to newest) creating cylindrical depth
    const numRings = this.historyBuffer.length;
    const ringRadiusStep = (maxRadius - baseRadius) / (numRings + 1);

    for (let ringIndex = 0; ringIndex < numRings; ringIndex++) {
      const snapshot = this.historyBuffer[ringIndex];
      const isCurrentRing = (ringIndex === numRings - 1);

      // Calculate ring position (innermost = oldest, outermost = newest)
      const ringOpacity = isCurrentRing ? 1.0 : (0.2 + (ringIndex / numRings) * 0.5);
      const ringBaseRadius = baseRadius + (ringIndex * ringRadiusStep);
      const ringMaxRadius = ringBaseRadius + ringRadiusStep;

      // Draw 12 main branch sections, each divided into 5 force subsections
      for (let branchIndex = 0; branchIndex < 12; branchIndex++) {
        const branch = earthlyBranches[branchIndex];

        // Each branch occupies 30 degrees (360 / 12)
        const branchAngle = (Math.PI * 2) / 12;
        const branchStartAngle = (branchIndex * branchAngle) - (Math.PI / 2);

        // Divide this branch into 5 force sections
        for (let forceIndex = 0; forceIndex < 5; forceIndex++) {
          // Each force occupies 6 degrees (30 / 5)
          const forceAngle = branchAngle / 5;
          const startAngle = branchStartAngle + (forceIndex * forceAngle);
          const endAngle = startAngle + forceAngle;

          // Get the stem for this position
          const stemPairIndex = forceIndex % 5; // 0-4 (I, R, C, T, A)
          const amStemIndex = stemPairIndex * 2; // Yang (AM)
          const pmStemIndex = amStemIndex + 1;   // Yin (PM)

          // Alternate between AM and PM based on branch position
          const stemIndex = (branchIndex % 2 === 0) ? amStemIndex : pmStemIndex;
          const stem = heavenlyStems[stemIndex];

          // Map this stem's force to its corresponding chromatic note
          // Each stem represents a force+polarity, which maps to a specific note
          const forceToNote = {
            'Identity': (stem.chain === 'AM') ? 'C' : 'C#',
            'Relationship': (stem.chain === 'AM') ? 'D' : 'D#',
            'Complexity': (stem.chain === 'AM') ? 'E' : 'F',
            'Transformation': (stem.chain === 'AM') ? 'F#' : 'G',
            'Alignment': (stem.chain === 'AM') ? 'G#' : 'A'
          };
          const noteForThisForce = forceToNote[stem.force];
          const forceValue = snapshot[noteForThisForce] || 0;

          // Calculate segment radius based on THIS FORCE's MMPA value (polar area chart)
          const normalizedValue = forceValue / 127; // 0-1
          const segmentRadius = ringBaseRadius + (normalizedValue * (ringMaxRadius - ringBaseRadius));

          // Draw segment arc (from ring base outward based on value)
          ctx.beginPath();
          ctx.arc(centerX, centerY, segmentRadius, startAngle, endAngle);
          ctx.arc(centerX, centerY, ringBaseRadius, endAngle, startAngle, true);
          ctx.closePath();

          // Fill with stem color (force color with AM/PM brightness + ring opacity)
          const stemColor = stem.color;
          const hex = stemColor.replace('#', '');
          const r = parseInt(hex.substr(0, 2), 16);
          const g = parseInt(hex.substr(2, 2), 16);
          const b = parseInt(hex.substr(4, 2), 16);
          const finalOpacity = isCurrentRing ? 0.9 : ringOpacity * 0.6;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalOpacity})`;
          ctx.fill();

          // Stroke segment border (more visible on current ring)
          ctx.strokeStyle = isCurrentRing ? 'rgba(255, 215, 0, 0.5)' : 'rgba(255, 215, 0, 0.2)';
          ctx.lineWidth = isCurrentRing ? 1 : 0.5;
          ctx.stroke();
        }

        // Draw branch divider (thicker line between branches) on current ring only
        if (isCurrentRing) {
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          const dividerAngle = branchStartAngle;
          ctx.lineTo(
            centerX + Math.cos(dividerAngle) * maxRadius,
            centerY + Math.sin(dividerAngle) * maxRadius
          );
          ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // Draw ring separator (concentric circle between rings)
      if (!isCurrentRing) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringMaxRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 215, 0, ${ringOpacity * 0.3})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Draw base circle (innermost zero line)
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // DRAW 12 EARTHLY BRANCH SEGMENTS (Chromatic Notes) - Outer Ring Labels
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    for (let branchIndex = 0; branchIndex < 12; branchIndex++) {
      const branch = earthlyBranches[branchIndex];
      const branchAngle = (Math.PI * 2) / 12;
      const branchStartAngle = (branchIndex * branchAngle) - (Math.PI / 2);
      const labelAngle = branchStartAngle + (branchAngle / 2);

      // Get MMPA value and current radius for this branch
      const mmpaValue = mmpaForceMap[branch.note]?.value || 0;
      const normalizedValue = mmpaValue / 127;
      const currentRadius = baseRadius + (normalizedValue * (maxRadius - baseRadius));

      // Draw chromatic note label (outside the chart)
      const noteRadius = maxRadius + 25;
      const noteX = centerX + Math.cos(labelAngle) * noteRadius;
      const noteY = centerY + Math.sin(labelAngle) * noteRadius;

      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(branch.note, noteX, noteY);

      // Draw MMPA force abbreviation for this branch
      const forceRadius = maxRadius + 45;
      const forceX = centerX + Math.cos(labelAngle) * forceRadius;
      const forceY = centerY + Math.sin(labelAngle) * forceRadius;

      const mmpaColor = mmpaForceMap[branch.note]?.color || '#888';
      ctx.fillStyle = mmpaColor;
      ctx.font = 'bold 12px monospace';
      ctx.fillText(branch.force.charAt(0), forceX, forceY);

      // Draw MMPA value for this branch (on the actual segment)
      const valueRadius = Math.max(currentRadius + 10, baseRadius + 20);
      const valueX = centerX + Math.cos(labelAngle) * valueRadius;
      const valueY = centerY + Math.sin(labelAngle) * valueRadius;

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(Math.floor(mmpaValue), valueX, valueY);

      // Draw 5 force labels in the subdivisions
      const forceLabels = ['I', 'R', 'C', 'T', 'A'];
      for (let forceIndex = 0; forceIndex < 5; forceIndex++) {
        const forceAngle = branchAngle / 5;
        const forceStartAngle = branchStartAngle + (forceIndex * forceAngle);
        const forceLabelAngle = forceStartAngle + (forceAngle / 2);

        // Place force labels at a fixed middle radius
        const forceLabelRadius = baseRadius + ((maxRadius - baseRadius) * 0.3);
        const forceLabelX = centerX + Math.cos(forceLabelAngle) * forceLabelRadius;
        const forceLabelY = centerY + Math.sin(forceLabelAngle) * forceLabelRadius;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(forceLabels[forceIndex], forceLabelX, forceLabelY);
      }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // DRAW CENTER CIRCLE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fill();
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.stroke();

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // CENTER: YIN-YANG BIBIBINARY STATE INDICATOR
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    // Determine current chain state (AM/PM, Yang/Yin)
    // Cycle through positions: even = Yang/AM (RCP), odd = Yin/PM (LCP)
    const chainIsYang = (this.currentTimePosition % 2 === 0);
    const chainState = chainIsYang ? 'AM' : 'PM';
    const binaryState = chainIsYang ? '1' : '0';

    // Draw Yin-Yang symbol
    const yinYangRadius = 25;

    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, yinYangRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1a1a';
    ctx.fill();
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Yang half (white/bright - RCP/Algorithmic)
    ctx.beginPath();
    ctx.arc(centerX, centerY, yinYangRadius, -Math.PI / 2, Math.PI / 2);
    ctx.fillStyle = chainIsYang ? '#FFFFFF' : '#333333';
    ctx.fill();

    // Yin half (black/dark - LCP/Measured)
    ctx.beginPath();
    ctx.arc(centerX, centerY, yinYangRadius, Math.PI / 2, -Math.PI / 2);
    ctx.fillStyle = chainIsYang ? '#333333' : '#FFFFFF';
    ctx.fill();

    // Small circles (eyes)
    const eyeRadius = 3;
    const eyeOffset = yinYangRadius * 0.5;

    // Yang eye (dark in light half)
    ctx.beginPath();
    ctx.arc(centerX + eyeOffset, centerY, eyeRadius, 0, Math.PI * 2);
    ctx.fillStyle = chainIsYang ? '#333333' : '#FFFFFF';
    ctx.fill();

    // Yin eye (light in dark half)
    ctx.beginPath();
    ctx.arc(centerX - eyeOffset, centerY, eyeRadius, 0, Math.PI * 2);
    ctx.fillStyle = chainIsYang ? '#FFFFFF' : '#333333';
    ctx.fill();

    // Binary state label below
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(chainState, centerX, centerY + yinYangRadius + 15);

    ctx.font = '10px monospace';
    ctx.fillStyle = '#999';
    ctx.fillText(`[${binaryState}]`, centerX, centerY + yinYangRadius + 28);
  }

  startRenderLoop() {
    this._lastTimeStep = Date.now();

    const animate = () => {
      if (!this.isOpen) return;

      requestAnimationFrame(animate);

      // Increment time position for bibibinary alternation
      const now = Date.now();
      if (now - this._lastTimeStep >= this.timeStepInterval) {
        this.currentTimePosition = (this.currentTimePosition + 1) % 60;
        this._lastTimeStep = now;
      }

      // Get live MMPA data from chronelixIntegrator
      let mmpaData = null;
      if (window.chronelixIntegrator && window.chronelixIntegrator.phaseSpace) {
        mmpaData = window.chronelixIntegrator.phaseSpace.state;

        // Debug logging (only log occasionally)
        if (!this._lastDebugLog || Date.now() - this._lastDebugLog > 5000) {
          const audioForces = mmpaData.audio || {};
          const opticalForces = mmpaData.optical || {};

          console.log('🌀═══════════════════════════════════════════════════════════');
          console.log('🌀 SEXAGENARY CYCLE - MMPA DATA SNAPSHOT');
          console.log('🌀 Audio Forces (scaled 0-127):');
          console.log(`   I (C):   ${((audioForces.identity || 0) * 127).toFixed(1)}`);
          console.log(`   R (D):   ${((audioForces.relationship || 0) * 127).toFixed(1)}`);
          console.log(`   C (E):   ${((audioForces.complexity || 0) * 127).toFixed(1)}`);
          console.log(`   T (F#):  ${((audioForces.transformation || 0) * 127).toFixed(1)}`);
          console.log(`   A (G#):  ${((audioForces.alignment || 0) * 127).toFixed(1)}`);
          console.log(`   P (A#):  ${((audioForces.potential || 0) * 127).toFixed(1)}`);
          console.log('🌀 Optical Forces (scaled 0-127):');
          console.log(`   I (C#):  ${((opticalForces.identity || 0) * 127).toFixed(1)}`);
          console.log(`   R (D#):  ${((opticalForces.relationship || 0) * 127).toFixed(1)}`);
          console.log(`   C (F):   ${((opticalForces.complexity || 0) * 127).toFixed(1)}`);
          console.log(`   T (G):   ${((opticalForces.transformation || 0) * 127).toFixed(1)}`);
          console.log(`   A (A):   ${((opticalForces.alignment || 0) * 127).toFixed(1)}`);
          console.log(`   P (B):   ${((opticalForces.potential || 0) * 127).toFixed(1)}`);
          console.log('🌀═══════════════════════════════════════════════════════════');
          this._lastDebugLog = Date.now();
        }
      }

      // Draw chart with live data
      this.drawEarthlyBranchesChart(mmpaData);
    };

    animate();
  }

  close() {
    if (!this.isOpen) return;

    // Remove panel from DOM
    if (this.panel && this.panel.parentNode) {
      this.panel.parentNode.removeChild(this.panel);
    }

    this.panel = null;
    this.chartCanvas = null;
    this.chartCtx = null;
    this.isOpen = false;

    console.log('🌀 Sexagenary Cycle Panel closed');
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}

// Create singleton instance
export const sexagenaryCyclePanel = new SexagenaryCyclePanel();

// Expose globally for easy access
if (typeof window !== 'undefined') {
  window.sexagenaryCyclePanel = sexagenaryCyclePanel;
}

console.log("🌀 Sexagenary Cycle Panel module ready");
