import { HUD, notifyHUDUpdate, registerHUDCallback } from "./hud.js";
import { state } from "./state.js";

console.log("💹 hudFinancial.js loaded");

/**
 * Phase 13.27: Financial Data Pipeline HUD Section
 *
 * Provides UI controls for:
 * - Toggling between Audio and Financial mode
 * - Selecting financial symbol (SPY, QQQ, BTC, TSLA)
 * - Displaying real-time financial metrics
 */

// Helper to create a control with consistent styling
function createControl(labelText) {
  const container = document.createElement('div');
  container.style.cssText = 'margin-bottom: 12px;';

  const label = document.createElement('label');
  label.textContent = labelText;
  label.style.cssText = 'display: block; margin-bottom: 5px;';

  return { container, label };
}

function createToggleControl(labelText, defaultValue, onChange) {
  const { container, label } = createControl(labelText);

  const toggle = document.createElement('input');
  toggle.type = 'checkbox';
  toggle.checked = defaultValue;
  toggle.style.cssText = 'margin-left: 10px;';
  toggle.addEventListener('change', (e) => onChange(e.target.checked));

  container.appendChild(label);
  label.appendChild(toggle);

  return container;
}

function createSelectControl(labelText, options, defaultValue, onChange) {
  const { container, label } = createControl(labelText);

  const select = document.createElement('select');
  select.style.cssText = 'width: 100%; padding: 5px; background: #1a1a1a; color: #00ff00; border: 1px solid #333; margin-top: 5px;';

  options.forEach(opt => {
    const option = document.createElement('option');
    option.value = opt.value;
    option.textContent = opt.label;
    if (opt.value === defaultValue) option.selected = true;
    select.appendChild(option);
  });

  select.addEventListener('change', (e) => onChange(e.target.value));

  container.appendChild(label);
  container.appendChild(select);

  return select;
}

// Financial pipeline state
let financialPipeline = null;
let financialModeEnabled = false;

// Metric display elements
let priceDisplay = null;
let sigmaRDisplay = null;
let regimeDisplay = null;
let symbolDisplay = null;
// Phase 13.28: Bifurcation prediction displays
let sigmaStarDisplay = null;
let bifurcationRiskDisplay = null;
let phiRatioDisplay = null;
// Phase 13.30: Forecasting displays
let crisisProbabilityDisplay = null;
let expectedLeadTimeDisplay = null;
let alertDisplay = null;
let precisionDisplay = null;
let recallDisplay = null;
let avgLeadTimeDisplay = null;
// Live data connection status
let connectionStatusDisplay = null;
// Phase 13.31: XAI displays
let totalInstabilityDisplay = null;
let xaiTop3Container = null;
let xaiFullBreakdownContainer = null;
let xaiToggleButton = null;
let xaiFullBreakdownExpanded = false;

/**
 * Initialize financial data pipeline
 */
export async function initFinancialPipeline(source = 'managed', symbol = 'BTC') {
  // Dynamic import to avoid loading if not needed
  const { FinancialDataPipeline } = await import('./financialDataPipeline.js');

  financialPipeline = new FinancialDataPipeline({
    source: source,           // Use 'managed' for multi-source support
    symbol: symbol,
    updateInterval: 1000,
    autoStart: false
  });

  // Subscribe to features
  financialPipeline.onFeatures((features, tick) => {
    if (financialModeEnabled) {
      updateMMPAFeatures(features);
      updateMetricDisplays(features, tick);
    }
  });

  console.log("💹 Financial pipeline initialized (mock mode)");
  return financialPipeline;
}

/**
 * Map financial features to MMPA feature structure
 */
function updateMMPAFeatures(financialFeatures) {
  const f = financialFeatures.features;

  state.mmpaFeatures = {
    enabled: true,
    source: 'financial',

    // Map financial forces to MMPA structure
    identity: {
      fundamentalFreq: Math.abs(f.identity.strength) * 880 + 220,  // Map to 220-1100 Hz range
      harmonics: [440, 880, 1320],
      strength: Math.abs(f.identity.strength)
    },

    relationship: {
      ratios: ["2:1", "3:2", "4:3"],
      consonance: f.relationship.consonance,
      complexity: Math.floor(f.relationship.complexity * 10)
    },

    complexity: {
      centroid: f.complexity.brightness * 3000 + 500,  // Map to 500-3500 Hz
      bandwidth: 2000,
      brightness: f.complexity.brightness
    },

    transformation: {
      flux: f.transformation.flux,
      velocity: f.transformation.velocity || 0.15,
      acceleration: 0.03
    },

    alignment: {
      coherence: f.alignment.coherence,
      stability: f.alignment.stability || 0.65,
      synchrony: f.alignment.synchrony || 0.82
    },

    // Map Resolution (Sigma_R) to Potential (entropy)
    potential: {
      entropy: 1 - f.resolution.sigma_R,  // Inverse: low stability = high entropy
      unpredictability: 1 - f.resolution.sigma_R,
      freedom: 1 - f.resolution.sigma_C
    }
  };

  notifyHUDUpdate();
}

/**
 * Update metric displays
 */
function updateMetricDisplays(features, tick) {
  if (priceDisplay) {
    // Format price based on magnitude
    let priceText;
    if (tick.price >= 1000) {
      // For BTC or large prices, use commas and 2 decimals
      priceText = `$${tick.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      // For stocks, use simple 2 decimals
      priceText = `$${tick.price.toFixed(2)}`;
    }
    priceDisplay.textContent = priceText;
  }

  if (sigmaRDisplay) {
    const sigmaR = features.features.resolution.sigma_R;
    sigmaRDisplay.textContent = sigmaR.toFixed(4);

    // Color code: green (stable) → yellow (moderate) → red (crisis)
    if (sigmaR > 0.15) {
      sigmaRDisplay.style.color = '#00ff00';
    } else if (sigmaR > 0.10) {
      sigmaRDisplay.style.color = '#ffaa00';
    } else {
      sigmaRDisplay.style.color = '#ff0000';
    }
  }

  // Phase 13.29: Enhanced regime display with classifier output
  if (regimeDisplay && features.regimeState) {
    const regime = features.regimeState;
    const regimeName = regime.regimeState;
    const confidence = (regime.confidence * 100).toFixed(0);
    const ticks = regime.ticksSinceTransition;

    // Display regime with confidence and stability
    regimeDisplay.textContent = `${regimeName} (${confidence}% conf, ${ticks}t)`;

    if (regimeName === 'CRISIS') {
      regimeDisplay.style.color = '#ff0000';
      regimeDisplay.style.fontWeight = 'bold';
    } else {
      regimeDisplay.style.color = '#00ff00';
      regimeDisplay.style.fontWeight = 'normal';
    }
  } else if (regimeDisplay) {
    // Fallback to old mock state if regime classifier not available
    const state = financialPipeline.dataSource.getState();
    if (state.inCrisis) {
      regimeDisplay.textContent = `CRISIS (${state.crisisCountdown})`;
      regimeDisplay.style.color = '#ff0000';
      regimeDisplay.style.fontWeight = 'bold';
    } else {
      regimeDisplay.textContent = 'NORMAL';
      regimeDisplay.style.color = '#00ff00';
      regimeDisplay.style.fontWeight = 'normal';
    }
  }

  // Phase 13.28: Bifurcation prediction metrics
  if (sigmaStarDisplay && features.features.resolution.sigma_star !== undefined) {
    const sigmaStar = features.features.resolution.sigma_star;
    sigmaStarDisplay.textContent = sigmaStar.toFixed(4);

    // Color code based on latent stability
    if (sigmaStar > 0.8) {
      sigmaStarDisplay.style.color = '#00ff00'; // Very stable
    } else if (sigmaStar > 0.5) {
      sigmaStarDisplay.style.color = '#ffff00'; // Moderately stable
    } else if (sigmaStar > 0.3) {
      sigmaStarDisplay.style.color = '#ffaa00'; // Approaching bifurcation
    } else {
      sigmaStarDisplay.style.color = '#ff0000'; // Near bifurcation
    }
  }

  if (bifurcationRiskDisplay && features.features.resolution.bifurcation_risk !== undefined) {
    const risk = features.features.resolution.bifurcation_risk;
    bifurcationRiskDisplay.textContent = (risk * 100).toFixed(1) + '%';

    // Color code: green (low risk) → red (high risk)
    if (risk < 0.2) {
      bifurcationRiskDisplay.style.color = '#00ff00';
    } else if (risk < 0.5) {
      bifurcationRiskDisplay.style.color = '#ffff00';
    } else if (risk < 0.7) {
      bifurcationRiskDisplay.style.color = '#ffaa00';
    } else {
      bifurcationRiskDisplay.style.color = '#ff0000';
    }
  }

  if (phiRatioDisplay && features.features.resolution.phi_ratio !== undefined) {
    const phiRatio = features.features.resolution.phi_ratio;
    const phi = 1.618;
    const phi_error = Math.abs(phiRatio - phi);
    phiRatioDisplay.textContent = phiRatio.toFixed(4);

    // Color code based on φ convergence
    if (phi_error < 0.01) {
      phiRatioDisplay.style.color = '#00ff00'; // Converged to φ
    } else if (phi_error < 0.05) {
      phiRatioDisplay.style.color = '#ffff00'; // Close to φ
    } else {
      phiRatioDisplay.style.color = '#ffaa00'; // Still learning
    }
  }

  // Phase 13.30: Forecasting metrics
  if (features.forecast) {
    const forecast = features.forecast;

    // Crisis probability
    if (crisisProbabilityDisplay) {
      const crisisProb = forecast.crisisProbability;
      crisisProbabilityDisplay.textContent = (crisisProb * 100).toFixed(1) + '%';

      // Color code based on probability
      if (crisisProb < 0.3) {
        crisisProbabilityDisplay.style.color = '#00ff00'; // Low
      } else if (crisisProb < 0.65) {
        crisisProbabilityDisplay.style.color = '#ffff00'; // Moderate
      } else if (crisisProb < 0.70) {
        crisisProbabilityDisplay.style.color = '#ffaa00'; // Warning
      } else {
        crisisProbabilityDisplay.style.color = '#ff0000'; // Crisis
      }
    }

    // Expected lead time
    if (expectedLeadTimeDisplay) {
      const leadTime = forecast.expectedLeadTime;
      expectedLeadTimeDisplay.textContent = leadTime + ' ticks';

      // Color code based on lead time
      if (leadTime < 5) {
        expectedLeadTimeDisplay.style.color = '#ff0000'; // Imminent
      } else if (leadTime < 12) {
        expectedLeadTimeDisplay.style.color = '#ffaa00'; // Soon
      } else {
        expectedLeadTimeDisplay.style.color = '#00ff00'; // Far
      }
    }

    // Alert display
    if (alertDisplay && forecast.alert) {
      const alert = forecast.alert;
      alertDisplay.textContent = alert.message;
      alertDisplay.style.display = 'block';

      if (alert.type === 'CRISIS') {
        alertDisplay.style.color = '#ff0000';
        alertDisplay.style.fontWeight = 'bold';
      } else if (alert.type === 'WARNING') {
        alertDisplay.style.color = '#ffaa00';
        alertDisplay.style.fontWeight = 'bold';
      }
    } else if (alertDisplay) {
      alertDisplay.style.display = 'none';
    }
  }

  // Phase 13.30: Validation metrics
  if (features.validationMetrics) {
    const metrics = features.validationMetrics;

    if (precisionDisplay) {
      const precision = metrics.precision;
      precisionDisplay.textContent = (precision * 100).toFixed(1) + '%';

      // Color code based on quality
      if (precision > 0.8) {
        precisionDisplay.style.color = '#00ff00';
      } else if (precision > 0.5) {
        precisionDisplay.style.color = '#ffff00';
      } else {
        precisionDisplay.style.color = '#ffaa00';
      }
    }

    if (recallDisplay) {
      const recall = metrics.recall;
      recallDisplay.textContent = (recall * 100).toFixed(1) + '%';

      // Color code based on quality
      if (recall > 0.8) {
        recallDisplay.style.color = '#00ff00';
      } else if (recall > 0.5) {
        recallDisplay.style.color = '#ffff00';
      } else {
        recallDisplay.style.color = '#ffaa00';
      }
    }

    if (avgLeadTimeDisplay) {
      const avgLeadTime = metrics.avgLeadTime;
      avgLeadTimeDisplay.textContent = avgLeadTime > 0
        ? avgLeadTime.toFixed(1) + ' ticks'
        : 'N/A';
      avgLeadTimeDisplay.style.color = '#00ffff';
    }
  }

  // Phase 13.31: XAI Breakdown
  if (features.xai && totalInstabilityDisplay && xaiTop3Container) {
    const xai = features.xai;

    // Update total instability
    totalInstabilityDisplay.textContent = xai.total_instability.toFixed(3);

    // Color code based on magnitude
    if (xai.total_instability < 0.5) {
      totalInstabilityDisplay.style.color = '#00ff00'; // Low
    } else if (xai.total_instability < 1.0) {
      totalInstabilityDisplay.style.color = '#ffff00'; // Moderate
    } else if (xai.total_instability < 2.0) {
      totalInstabilityDisplay.style.color = '#ffaa00'; // High
    } else {
      totalInstabilityDisplay.style.color = '#ff0000'; // Critical
    }

    // Update top 3 contributors
    xaiTop3Container.innerHTML = '';
    if (xai.top_3 && xai.top_3.length > 0) {
      xai.top_3.forEach((contributor, idx) => {
        const contributorDiv = document.createElement('div');
        contributorDiv.style.cssText = 'margin-bottom: 8px;';

        // Feature name and percentage
        const nameSpan = document.createElement('div');
        nameSpan.textContent = `${contributor.name}: ${contributor.contribution_pct.toFixed(1)}%`;
        nameSpan.style.cssText = 'font-size: 0.85em; margin-bottom: 3px;';

        // Color code by rank
        if (idx === 0) {
          nameSpan.style.color = '#ff4444'; // Top contributor - red
        } else if (idx === 1) {
          nameSpan.style.color = '#ffaa00'; // Second - orange
        } else {
          nameSpan.style.color = '#ffff00'; // Third - yellow
        }

        // Progress bar
        const barContainer = document.createElement('div');
        barContainer.style.cssText = 'width: 100%; height: 8px; background: #1a1a1a; border: 1px solid #333; border-radius: 2px; overflow: hidden;';

        const barFill = document.createElement('div');
        barFill.style.cssText = `width: ${contributor.contribution_pct}%; height: 100%; transition: width 0.3s ease;`;

        // Color bar by rank
        if (idx === 0) {
          barFill.style.background = '#ff4444';
        } else if (idx === 1) {
          barFill.style.background = '#ffaa00';
        } else {
          barFill.style.background = '#ffff00';
        }

        barContainer.appendChild(barFill);
        contributorDiv.appendChild(nameSpan);
        contributorDiv.appendChild(barContainer);
        xaiTop3Container.appendChild(contributorDiv);
      });
    }

    // Update full breakdown (if expanded)
    if (xaiFullBreakdownExpanded && xaiFullBreakdownContainer && xai.all_6) {
      xaiFullBreakdownContainer.innerHTML = '';
      xai.all_6.forEach((contributor) => {
        const contributorDiv = document.createElement('div');
        contributorDiv.style.cssText = 'margin-bottom: 6px;';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = `${contributor.name}: `;
        nameSpan.style.cssText = 'font-size: 0.8em; color: #888;';

        const pctSpan = document.createElement('span');
        pctSpan.textContent = `${contributor.contribution_pct.toFixed(1)}%`;
        pctSpan.style.cssText = 'font-size: 0.8em; color: #00ffff;';

        contributorDiv.appendChild(nameSpan);
        contributorDiv.appendChild(pctSpan);
        xaiFullBreakdownContainer.appendChild(contributorDiv);
      });
    }
  }
}

/**
 * Toggle financial mode on/off
 */
export function toggleFinancialMode(enabled) {
  financialModeEnabled = enabled;

  if (enabled) {
    // Start financial pipeline
    if (!financialPipeline) {
      initFinancialPipeline().then(pipeline => {
        pipeline.start();
        console.log("💹 Financial mode ACTIVATED");
      });
    } else {
      financialPipeline.start();
      console.log("💹 Financial mode ACTIVATED");
    }
  } else {
    // Stop financial pipeline and restore audio mode
    if (financialPipeline) {
      financialPipeline.stop();
    }

    // Reset MMPA features to audio mode
    state.mmpaFeatures.enabled = false;
    state.mmpaFeatures.source = 'dummy';
    console.log("🎵 Audio mode ACTIVATED");
  }

  notifyHUDUpdate();
}

/**
 * Toggle live Bitcoin data
 */
export async function toggleLiveBitcoinData(enabled) {
  if (enabled) {
    // Stop existing pipeline
    if (financialPipeline) {
      financialPipeline.stop();
    }

    // Initialize with managed data source for Bitcoin
    await initFinancialPipeline('managed', 'BTC');

    // ALWAYS start when enabling live data (enables financial mode if needed)
    if (!financialModeEnabled) {
      financialModeEnabled = true;
      console.log("💹 Financial mode auto-enabled for live Bitcoin data");
    }

    financialPipeline.start();
    console.log("₿ Started CoinGecko API polling");

    // Update symbol display
    if (symbolDisplay) {
      symbolDisplay.textContent = 'BTC (LIVE)';
    }

    // Update connection status
    if (connectionStatusDisplay) {
      connectionStatusDisplay.textContent = '⏳ Connecting...';
      connectionStatusDisplay.style.color = '#ffaa00';
    }

    console.log("₿ Live Bitcoin data ENABLED (CoinGecko API)");

    // Update connection status after a short delay
    setTimeout(() => {
      if (connectionStatusDisplay && financialPipeline) {
        connectionStatusDisplay.textContent = '● CoinGecko';
        connectionStatusDisplay.style.color = '#00ff00';
      }
    }, 2000);
  } else {
    // Stop existing pipeline
    if (financialPipeline) {
      financialPipeline.stop();
    }

    // Switch to managed mode (user can select source via dropdown)
    await initFinancialPipeline('managed', 'BTC');

    // Start if financial mode is enabled
    if (financialModeEnabled) {
      financialPipeline.start();
    }

    // Update symbol display
    if (symbolDisplay) {
      symbolDisplay.textContent = 'SPY';
    }

    // Update connection status
    if (connectionStatusDisplay) {
      connectionStatusDisplay.textContent = 'Mock Data';
      connectionStatusDisplay.style.color = '#888';
    }

    console.log("💹 Switched back to mock data");
  }

  notifyHUDUpdate();
}

/**
 * Change financial symbol
 */
export function changeFinancialSymbol(symbol) {
  if (financialPipeline) {
    financialPipeline.setSymbol(symbol);
    if (symbolDisplay) {
      symbolDisplay.textContent = symbol;
    }
    console.log(`💹 Symbol changed to ${symbol}`);
  }
}

/**
 * Create Financial HUD section
 */
export function createFinancialHUD() {
  const section = document.createElement('div');
  section.id = 'financial-section';
  section.style.cssText = 'padding: 10px; border: 1px solid #333; margin-bottom: 10px; background: #0a0a0a;';

  const title = document.createElement('h4');
  title.textContent = '💹 Financial Mode';
  title.style.cssText = 'margin: 0 0 10px 0; color: #00ffff;';
  section.appendChild(title);

  // Toggle: Financial Mode On/Off
  const toggleControl = createToggleControl(
    'Financial Mode',
    false,
    (enabled) => toggleFinancialMode(enabled)
  );
  section.appendChild(toggleControl);

  // Toggle: Live Bitcoin Data
  const liveBitcoinToggle = createToggleControl(
    '₿ Live Bitcoin Data (CoinGecko)',
    false,
    (enabled) => toggleLiveBitcoinData(enabled)
  );
  section.appendChild(liveBitcoinToggle);

  // Symbol selector
  const symbolSelect = createSelectControl(
    'Symbol',
    [
      { value: 'SPY', label: 'SPY (S&P 500)' },
      { value: 'QQQ', label: 'QQQ (NASDAQ)' },
      { value: 'BTC', label: 'BTC (Bitcoin)' },
      { value: 'TSLA', label: 'TSLA (Tesla)' }
    ],
    'SPY',
    (symbol) => changeFinancialSymbol(symbol)
  );
  section.appendChild(symbolSelect.parentElement);

  // Phase 13.31: Filter Configuration Section
  const filterConfigHeader = document.createElement('h5');
  filterConfigHeader.textContent = '⚙️ Filter Configuration';
  filterConfigHeader.style.cssText = 'margin: 15px 0 10px 0; color: #ffaa00; font-size: 0.95em;';
  section.appendChild(filterConfigHeader);

  // Data Source selector (CoinGecko, CoinCap, Binance, Mock)
  const dataSourceSelect = createSelectControl(
    'Data Source',
    [
      { value: 'coincap', label: 'CoinCap (5s, generous limits)' },
      { value: 'binance', label: 'Binance (3s, very generous)' },
      { value: 'coingecko', label: 'CoinGecko (10s, moderate limits)' },
      { value: 'mock', label: 'Mock Data (1s, unlimited)' }
    ],
    'coincap',  // Default to CoinCap (better than CoinGecko)
    (sourceKey) => {
      console.log(`🔧 Data source selector changed to: ${sourceKey}`);
      if (financialPipeline && financialPipeline.switchDataSource) {
        const success = financialPipeline.switchDataSource(sourceKey);
        if (success) {
          console.log(`✅ Data source switched to: ${sourceKey}`);
        } else {
          console.warn(`⚠️ Failed to switch data source to: ${sourceKey}`);
        }
      } else {
        console.warn(`⚠️ Data source switching not available (pipeline not in managed mode)`);
      }
    }
  );
  section.appendChild(dataSourceSelect.parentElement);

  // Filter Type selector (LKF/UKF)
  const filterTypeSelect = createSelectControl(
    'Filter Type',
    [
      { value: 'LKF', label: 'LKF (Linear Kalman)' },
      { value: 'UKF', label: 'UKF (Unscented Kalman)' }
    ],
    'UKF',
    (filterType) => {
      console.log(`🔧 Filter type selector changed to: ${filterType}`);
      if (financialPipeline && financialPipeline.extractor) {
        financialPipeline.extractor.kalmanFilter.setFilterType(filterType);
        console.log(`✅ Filter type applied: ${filterType}`);
      } else {
        console.warn(`⚠️ Filter type will be applied when Financial Mode is enabled`);
      }
    }
  );
  section.appendChild(filterTypeSelect.parentElement);

  // φ-Regularization Weight slider
  const phiWeightContainer = createControl('φ-Regularization Weight');
  const phiWeightSlider = document.createElement('input');
  phiWeightSlider.type = 'range';
  phiWeightSlider.min = '0';
  phiWeightSlider.max = '1';
  phiWeightSlider.step = '0.01';
  phiWeightSlider.value = '0.1';
  phiWeightSlider.style.cssText = 'width: 100%; margin-top: 5px;';

  const phiWeightValue = document.createElement('span');
  phiWeightValue.textContent = '0.10';
  phiWeightValue.style.cssText = 'color: #00ff00; font-weight: bold; margin-left: 10px;';

  phiWeightSlider.addEventListener('input', (e) => {
    const weight = parseFloat(e.target.value);
    phiWeightValue.textContent = weight.toFixed(2);
    console.log(`🔧 φ-weight slider changed to: ${weight.toFixed(2)}`);
    if (financialPipeline && financialPipeline.extractor) {
      financialPipeline.extractor.kalmanFilter.setPhiRegWeight(weight);
      console.log(`✅ φ-regularization applied: ${weight.toFixed(2)}`);
    } else {
      console.warn(`⚠️ φ-weight will be applied when Financial Mode is enabled`);
    }
  });

  phiWeightContainer.container.appendChild(phiWeightSlider);
  phiWeightContainer.label.appendChild(phiWeightValue);
  section.appendChild(phiWeightContainer.container);

  // Info text for filter config
  const filterInfo = document.createElement('p');
  filterInfo.textContent = 'UKF handles non-linear dynamics. φ-weight controls golden ratio regularization (0=off, 1=strong).';
  filterInfo.style.cssText = 'margin-top: 8px; font-size: 0.75em; color: #666; line-height: 1.3;';
  section.appendChild(filterInfo);

  // Metrics display
  const metricsContainer = document.createElement('div');
  metricsContainer.style.cssText = 'margin-top: 15px; padding: 10px; background: #000; border: 1px solid #333; border-radius: 3px;';

  // Symbol display
  const symbolContainer = document.createElement('div');
  symbolContainer.style.cssText = 'margin-bottom: 8px;';
  const symbolLabel = document.createElement('span');
  symbolLabel.textContent = 'Symbol: ';
  symbolLabel.style.cssText = 'color: #888;';
  symbolDisplay = document.createElement('span');
  symbolDisplay.textContent = 'SPY';
  symbolDisplay.style.cssText = 'color: #00ffff; font-weight: bold;';
  symbolContainer.appendChild(symbolLabel);
  symbolContainer.appendChild(symbolDisplay);
  metricsContainer.appendChild(symbolContainer);

  // Connection status display
  const connectionContainer = document.createElement('div');
  connectionContainer.style.cssText = 'margin-bottom: 8px;';
  const connectionLabel = document.createElement('span');
  connectionLabel.textContent = 'Connection: ';
  connectionLabel.style.cssText = 'color: #888;';
  connectionStatusDisplay = document.createElement('span');
  connectionStatusDisplay.textContent = 'Mock Data';
  connectionStatusDisplay.style.cssText = 'color: #888; font-size: 0.9em;';
  connectionContainer.appendChild(connectionLabel);
  connectionContainer.appendChild(connectionStatusDisplay);
  metricsContainer.appendChild(connectionContainer);

  // Price display
  const priceContainer = document.createElement('div');
  priceContainer.style.cssText = 'margin-bottom: 8px;';
  const priceLabel = document.createElement('span');
  priceLabel.textContent = 'Price: ';
  priceLabel.style.cssText = 'color: #888;';
  priceDisplay = document.createElement('span');
  priceDisplay.textContent = '---.--';
  priceDisplay.style.cssText = 'color: #00ff00; font-size: 1.2em; font-weight: bold;';
  priceContainer.appendChild(priceLabel);
  priceContainer.appendChild(priceDisplay);
  metricsContainer.appendChild(priceContainer);

  // Sigma_R display
  const sigmaContainer = document.createElement('div');
  sigmaContainer.style.cssText = 'margin-bottom: 8px;';
  const sigmaLabel = document.createElement('span');
  sigmaLabel.textContent = 'Sigma_R: ';
  sigmaLabel.style.cssText = 'color: #888;';
  sigmaRDisplay = document.createElement('span');
  sigmaRDisplay.textContent = '-.----';
  sigmaRDisplay.style.cssText = 'color: #00ff00; font-size: 1.2em; font-weight: bold;';
  sigmaContainer.appendChild(sigmaLabel);
  sigmaContainer.appendChild(sigmaRDisplay);
  metricsContainer.appendChild(sigmaContainer);

  // Regime display
  const regimeContainer = document.createElement('div');
  regimeContainer.style.cssText = 'margin-bottom: 8px;';
  const regimeLabel = document.createElement('span');
  regimeLabel.textContent = 'Regime: ';
  regimeLabel.style.cssText = 'color: #888;';
  regimeDisplay = document.createElement('span');
  regimeDisplay.textContent = 'NORMAL';
  regimeDisplay.style.cssText = 'color: #00ff00; font-weight: bold;';
  regimeContainer.appendChild(regimeLabel);
  regimeContainer.appendChild(regimeDisplay);
  metricsContainer.appendChild(regimeContainer);

  // Phase 13.28: Bifurcation Prediction Section Header
  const bifurcationHeader = document.createElement('div');
  bifurcationHeader.textContent = '🔮 Bifurcation Prediction (Kalman Filter)';
  bifurcationHeader.style.cssText = 'margin-top: 12px; margin-bottom: 8px; color: #ff00ff; font-weight: bold; font-size: 0.9em; border-top: 1px solid #333; padding-top: 8px;';
  metricsContainer.appendChild(bifurcationHeader);

  // Sigma_* (Latent State) display
  const sigmaStarContainer = document.createElement('div');
  sigmaStarContainer.style.cssText = 'margin-bottom: 8px;';
  const sigmaStarLabel = document.createElement('span');
  sigmaStarLabel.textContent = 'Σ* (Latent): ';
  sigmaStarLabel.style.cssText = 'color: #888;';
  sigmaStarLabel.title = 'Latent bifurcation distance (unobservable state)';
  sigmaStarDisplay = document.createElement('span');
  sigmaStarDisplay.textContent = '-.----';
  sigmaStarDisplay.style.cssText = 'color: #00ff00; font-size: 1.1em; font-weight: bold;';
  sigmaStarContainer.appendChild(sigmaStarLabel);
  sigmaStarContainer.appendChild(sigmaStarDisplay);
  metricsContainer.appendChild(sigmaStarContainer);

  // Bifurcation Risk display
  const bifurcationRiskContainer = document.createElement('div');
  bifurcationRiskContainer.style.cssText = 'margin-bottom: 8px;';
  const bifurcationRiskLabel = document.createElement('span');
  bifurcationRiskLabel.textContent = 'Bifurcation Risk: ';
  bifurcationRiskLabel.style.cssText = 'color: #888;';
  bifurcationRiskLabel.title = 'Predicted probability of regime change';
  bifurcationRiskDisplay = document.createElement('span');
  bifurcationRiskDisplay.textContent = '-.-%';
  bifurcationRiskDisplay.style.cssText = 'color: #00ff00; font-size: 1.1em; font-weight: bold;';
  bifurcationRiskContainer.appendChild(bifurcationRiskLabel);
  bifurcationRiskContainer.appendChild(bifurcationRiskDisplay);
  metricsContainer.appendChild(bifurcationRiskContainer);

  // φ-Ratio (Golden Ratio Constraint) display
  const phiRatioContainer = document.createElement('div');
  phiRatioContainer.style.cssText = 'margin-bottom: 0;';
  const phiRatioLabel = document.createElement('span');
  phiRatioLabel.textContent = 'φ-Ratio: ';
  phiRatioLabel.style.cssText = 'color: #888;';
  phiRatioLabel.title = 'Golden ratio constraint (target: 1.618)';
  phiRatioDisplay = document.createElement('span');
  phiRatioDisplay.textContent = '-.----';
  phiRatioDisplay.style.cssText = 'color: #ffaa00; font-size: 1.0em; font-weight: bold;';
  phiRatioContainer.appendChild(phiRatioLabel);
  phiRatioContainer.appendChild(phiRatioDisplay);
  metricsContainer.appendChild(phiRatioContainer);

  // Phase 13.31: XAI Breakdown Section
  const xaiHeader = document.createElement('div');
  xaiHeader.textContent = '🔍 XAI Breakdown: Crisis Drivers';
  xaiHeader.style.cssText = 'margin-top: 12px; margin-bottom: 8px; color: #ff00ff; font-weight: bold; font-size: 0.9em; border-top: 1px solid #333; padding-top: 8px;';
  metricsContainer.appendChild(xaiHeader);

  // Total Instability display
  const totalInstabilityContainer = document.createElement('div');
  totalInstabilityContainer.style.cssText = 'margin-bottom: 10px;';
  const totalInstabilityLabel = document.createElement('span');
  totalInstabilityLabel.textContent = 'Total Instability: ';
  totalInstabilityLabel.style.cssText = 'color: #888;';
  totalInstabilityLabel.title = 'Combined magnitude of all crisis forces';
  totalInstabilityDisplay = document.createElement('span');
  totalInstabilityDisplay.textContent = '-.---';
  totalInstabilityDisplay.style.cssText = 'color: #00ff00; font-size: 1.1em; font-weight: bold;';
  totalInstabilityContainer.appendChild(totalInstabilityLabel);
  totalInstabilityContainer.appendChild(totalInstabilityDisplay);
  metricsContainer.appendChild(totalInstabilityContainer);

  // Top 3 Contributors container
  xaiTop3Container = document.createElement('div');
  xaiTop3Container.style.cssText = 'margin-bottom: 8px;';
  metricsContainer.appendChild(xaiTop3Container);

  // Toggle button for full breakdown
  xaiToggleButton = document.createElement('button');
  xaiToggleButton.textContent = '▼ Show All 6 Forces';
  xaiToggleButton.style.cssText = 'width: 100%; padding: 6px; background: #1a1a1a; color: #00ffff; border: 1px solid #333; border-radius: 3px; cursor: pointer; font-size: 0.85em; margin-bottom: 8px;';
  xaiToggleButton.addEventListener('click', () => {
    xaiFullBreakdownExpanded = !xaiFullBreakdownExpanded;
    if (xaiFullBreakdownExpanded) {
      xaiToggleButton.textContent = '▲ Hide Full Breakdown';
      xaiFullBreakdownContainer.style.display = 'block';
    } else {
      xaiToggleButton.textContent = '▼ Show All 6 Forces';
      xaiFullBreakdownContainer.style.display = 'none';
    }
  });
  metricsContainer.appendChild(xaiToggleButton);

  // Full breakdown container (initially hidden)
  xaiFullBreakdownContainer = document.createElement('div');
  xaiFullBreakdownContainer.style.cssText = 'display: none; padding: 10px; background: #0a0a0a; border: 1px solid #333; border-radius: 3px; margin-bottom: 8px;';
  metricsContainer.appendChild(xaiFullBreakdownContainer);

  // Phase 13.30: Predictive Forecasting Section Header
  const forecastHeader = document.createElement('div');
  forecastHeader.textContent = '🔮 Predictive Forecast (24-tick horizon)';
  forecastHeader.style.cssText = 'margin-top: 12px; margin-bottom: 8px; color: #00ffff; font-weight: bold; font-size: 0.9em; border-top: 1px solid #333; padding-top: 8px;';
  metricsContainer.appendChild(forecastHeader);

  // Crisis Probability display
  const crisisProbabilityContainer = document.createElement('div');
  crisisProbabilityContainer.style.cssText = 'margin-bottom: 8px;';
  const crisisProbabilityLabel = document.createElement('span');
  crisisProbabilityLabel.textContent = 'Crisis Probability: ';
  crisisProbabilityLabel.style.cssText = 'color: #888;';
  crisisProbabilityLabel.title = 'Predicted probability of crisis in next 24 ticks';
  crisisProbabilityDisplay = document.createElement('span');
  crisisProbabilityDisplay.textContent = '-.-%';
  crisisProbabilityDisplay.style.cssText = 'color: #00ff00; font-size: 1.1em; font-weight: bold;';
  crisisProbabilityContainer.appendChild(crisisProbabilityLabel);
  crisisProbabilityContainer.appendChild(crisisProbabilityDisplay);
  metricsContainer.appendChild(crisisProbabilityContainer);

  // Expected Lead Time display
  const expectedLeadTimeContainer = document.createElement('div');
  expectedLeadTimeContainer.style.cssText = 'margin-bottom: 8px;';
  const expectedLeadTimeLabel = document.createElement('span');
  expectedLeadTimeLabel.textContent = 'Expected Lead Time: ';
  expectedLeadTimeLabel.style.cssText = 'color: #888;';
  expectedLeadTimeLabel.title = 'Ticks until forecasted crisis';
  expectedLeadTimeDisplay = document.createElement('span');
  expectedLeadTimeDisplay.textContent = '-- ticks';
  expectedLeadTimeDisplay.style.cssText = 'color: #00ff00; font-size: 1.0em; font-weight: bold;';
  expectedLeadTimeContainer.appendChild(expectedLeadTimeLabel);
  expectedLeadTimeContainer.appendChild(expectedLeadTimeDisplay);
  metricsContainer.appendChild(expectedLeadTimeContainer);

  // Alert display (prominent)
  alertDisplay = document.createElement('div');
  alertDisplay.style.cssText = 'margin-top: 8px; padding: 8px; background: #1a1a1a; border: 2px solid #ff0000; border-radius: 3px; color: #ff0000; font-weight: bold; text-align: center; display: none;';
  alertDisplay.textContent = 'No active alerts';
  metricsContainer.appendChild(alertDisplay);

  // Phase 13.30: Validation Metrics Section Header
  const validationHeader = document.createElement('div');
  validationHeader.textContent = '📊 Empirical Validation';
  validationHeader.style.cssText = 'margin-top: 12px; margin-bottom: 8px; color: #ffaa00; font-weight: bold; font-size: 0.9em; border-top: 1px solid #333; padding-top: 8px;';
  metricsContainer.appendChild(validationHeader);

  // Precision display
  const precisionContainer = document.createElement('div');
  precisionContainer.style.cssText = 'margin-bottom: 6px;';
  const precisionLabel = document.createElement('span');
  precisionLabel.textContent = 'Precision: ';
  precisionLabel.style.cssText = 'color: #888; font-size: 0.9em;';
  precisionLabel.title = 'TP / (TP + FP)';
  precisionDisplay = document.createElement('span');
  precisionDisplay.textContent = '-.-%';
  precisionDisplay.style.cssText = 'color: #00ff00; font-size: 0.9em;';
  precisionContainer.appendChild(precisionLabel);
  precisionContainer.appendChild(precisionDisplay);
  metricsContainer.appendChild(precisionContainer);

  // Recall display
  const recallContainer = document.createElement('div');
  recallContainer.style.cssText = 'margin-bottom: 6px;';
  const recallLabel = document.createElement('span');
  recallLabel.textContent = 'Recall: ';
  recallLabel.style.cssText = 'color: #888; font-size: 0.9em;';
  recallLabel.title = 'TP / (TP + FN)';
  recallDisplay = document.createElement('span');
  recallDisplay.textContent = '-.-%';
  recallDisplay.style.cssText = 'color: #00ff00; font-size: 0.9em;';
  recallContainer.appendChild(recallLabel);
  recallContainer.appendChild(recallDisplay);
  metricsContainer.appendChild(recallContainer);

  // Avg Lead Time display
  const avgLeadTimeContainer = document.createElement('div');
  avgLeadTimeContainer.style.cssText = 'margin-bottom: 0;';
  const avgLeadTimeLabel = document.createElement('span');
  avgLeadTimeLabel.textContent = 'Avg Lead Time: ';
  avgLeadTimeLabel.style.cssText = 'color: #888; font-size: 0.9em;';
  avgLeadTimeLabel.title = 'Average prediction lead time for true positives';
  avgLeadTimeDisplay = document.createElement('span');
  avgLeadTimeDisplay.textContent = 'N/A';
  avgLeadTimeDisplay.style.cssText = 'color: #00ffff; font-size: 0.9em;';
  avgLeadTimeContainer.appendChild(avgLeadTimeLabel);
  avgLeadTimeContainer.appendChild(avgLeadTimeDisplay);
  metricsContainer.appendChild(avgLeadTimeContainer);

  section.appendChild(metricsContainer);

  // Info text
  const info = document.createElement('p');
  info.textContent = 'Financial mode drives the visualization with real-time market data using the Sigma_R stability framework.';
  info.style.cssText = 'margin-top: 10px; font-size: 0.85em; color: #666; line-height: 1.4;';
  section.appendChild(info);

  return section;
}

console.log("💹 hudFinancial.js loaded");
