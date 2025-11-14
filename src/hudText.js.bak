// src/hudText.js
// Text/NLP Signal HUD
// Interface for text input and signal visualization

console.log("📝 hudText.js loaded");

/**
 * Create Text Signal HUD section
 */
export function createTextSignalHUD(container) {
  const section = document.createElement('div');
  section.className = 'hud-section text-signals';
  section.style.maxWidth = '700px';

  const title = document.createElement('h3');
  title.textContent = '📝 Text/NLP Signals';
  section.appendChild(title);

  const intro = document.createElement('p');
  intro.textContent = 'Words are signals. Type, paste, or speak to transform sentiment, tone, and rhythm into visual morphology.';
  intro.style.cssText = `
    font-size: 11px;
    margin-bottom: 12px;
    opacity: 0.8;
  `;
  section.appendChild(intro);

  // === TEXT INPUT AREA ===
  const inputContainer = document.createElement('div');
  inputContainer.style.cssText = `
    background: rgba(0, 0, 0, 0.5);
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 12px;
  `;

  const inputLabel = document.createElement('div');
  inputLabel.textContent = 'Text Input:';
  inputLabel.style.cssText = `
    font-size: 11px;
    margin-bottom: 6px;
    opacity: 0.8;
  `;
  inputContainer.appendChild(inputLabel);

  const textInput = document.createElement('textarea');
  textInput.id = 'text-signal-input';
  textInput.placeholder = 'Type or paste text here... Try: "I feel infinite joy" or "darkness falls, shadows grow"';
  textInput.style.cssText = `
    width: 100%;
    height: 80px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    color: white;
    padding: 8px;
    font-family: monospace;
    font-size: 11px;
    resize: vertical;
  `;
  inputContainer.appendChild(textInput);

  // Input controls
  const controlsRow = document.createElement('div');
  controlsRow.style.cssText = `
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    margin-top: 8px;
  `;

  const processButton = document.createElement('button');
  processButton.textContent = '▶ Process Text';
  processButton.style.cssText = `
    padding: 8px;
    background: #32CD32;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 11px;
  `;
  processButton.addEventListener('click', () => {
    const text = textInput.value;
    if (text && window.textSignalProvider) {
      window.textSignalProvider.processText(text);
      textInput.value = ''; // Clear after processing
    }
  });
  controlsRow.appendChild(processButton);

  const voiceButton = document.createElement('button');
  voiceButton.textContent = '🎤 Voice Input';
  voiceButton.style.cssText = `
    padding: 8px;
    background: rgba(100, 100, 255, 0.3);
    font-size: 11px;
  `;
  voiceButton.addEventListener('click', () => {
    startVoiceInput(textInput);
  });
  controlsRow.appendChild(voiceButton);

  const clearButton = document.createElement('button');
  clearButton.textContent = '🗑 Clear';
  clearButton.style.cssText = `
    padding: 8px;
    background: rgba(255, 50, 50, 0.3);
    font-size: 11px;
  `;
  clearButton.addEventListener('click', () => {
    if (window.textSignalProvider) {
      window.textSignalProvider.clear();
    }
    textInput.value = '';
  });
  controlsRow.appendChild(clearButton);

  inputContainer.appendChild(controlsRow);
  section.appendChild(inputContainer);

  // === SIGNAL VISUALIZATION ===
  const signalViz = document.createElement('div');
  signalViz.style.cssText = `
    background: rgba(0, 0, 0, 0.5);
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 12px;
  `;

  const vizTitle = document.createElement('div');
  vizTitle.textContent = 'Live Signals:';
  vizTitle.style.cssText = `
    font-size: 11px;
    margin-bottom: 8px;
    opacity: 0.8;
  `;
  signalViz.appendChild(vizTitle);

  // Sentiment gauge
  const sentimentRow = document.createElement('div');
  sentimentRow.style.cssText = `
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  `;

  const sentimentLabel = document.createElement('span');
  sentimentLabel.textContent = 'Sentiment:';
  sentimentLabel.style.cssText = `
    width: 100px;
    font-size: 10px;
  `;
  sentimentRow.appendChild(sentimentLabel);

  const sentimentBar = document.createElement('div');
  sentimentBar.style.cssText = `
    flex: 1;
    height: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    position: relative;
    overflow: hidden;
  `;

  const sentimentFill = document.createElement('div');
  sentimentFill.id = 'sentiment-fill';
  sentimentFill.style.cssText = `
    position: absolute;
    left: 50%;
    height: 100%;
    width: 0%;
    background: #32CD32;
    transition: all 0.3s ease;
  `;
  sentimentBar.appendChild(sentimentFill);

  const sentimentValue = document.createElement('span');
  sentimentValue.id = 'sentiment-value';
  sentimentValue.textContent = '0.00';
  sentimentValue.style.cssText = `
    position: absolute;
    top: 2px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    font-weight: bold;
  `;
  sentimentBar.appendChild(sentimentValue);

  sentimentRow.appendChild(sentimentBar);
  signalViz.appendChild(sentimentRow);

  // Tone indicator
  const toneRow = document.createElement('div');
  toneRow.style.cssText = `
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  `;

  const toneLabel = document.createElement('span');
  toneLabel.textContent = 'Tone:';
  toneLabel.style.cssText = `
    width: 100px;
    font-size: 10px;
  `;
  toneRow.appendChild(toneLabel);

  const toneValue = document.createElement('span');
  toneValue.id = 'tone-value';
  toneValue.textContent = 'neutral';
  toneValue.style.cssText = `
    flex: 1;
    font-size: 11px;
    font-weight: bold;
    color: #FFD700;
  `;
  toneRow.appendChild(toneValue);

  const toneStrength = document.createElement('span');
  toneStrength.id = 'tone-strength';
  toneStrength.textContent = '(0%)';
  toneStrength.style.cssText = `
    font-size: 10px;
    opacity: 0.7;
    margin-left: 8px;
  `;
  toneRow.appendChild(toneStrength);

  signalViz.appendChild(toneRow);

  // Rhythm meter
  const rhythmRow = document.createElement('div');
  rhythmRow.style.cssText = `
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  `;

  const rhythmLabel = document.createElement('span');
  rhythmLabel.textContent = 'Rhythm:';
  rhythmLabel.style.cssText = `
    width: 100px;
    font-size: 10px;
  `;
  rhythmRow.appendChild(rhythmLabel);

  const rhythmBar = document.createElement('div');
  rhythmBar.style.cssText = `
    flex: 1;
    height: 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    position: relative;
    overflow: hidden;
  `;

  const rhythmFill = document.createElement('div');
  rhythmFill.id = 'rhythm-fill';
  rhythmFill.style.cssText = `
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #FF6B6B, #FFD700);
    transition: width 0.2s ease;
  `;
  rhythmBar.appendChild(rhythmFill);

  rhythmRow.appendChild(rhythmBar);

  const rhythmValue = document.createElement('span');
  rhythmValue.id = 'rhythm-value';
  rhythmValue.textContent = '0.00';
  rhythmValue.style.cssText = `
    font-size: 10px;
    margin-left: 8px;
    width: 40px;
  `;
  rhythmRow.appendChild(rhythmValue);

  signalViz.appendChild(rhythmRow);

  // Recent words display
  const recentWords = document.createElement('div');
  recentWords.style.cssText = `
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  `;

  const recentLabel = document.createElement('div');
  recentLabel.textContent = 'Recent words:';
  recentLabel.style.cssText = `
    font-size: 10px;
    opacity: 0.7;
    margin-bottom: 4px;
  `;
  recentWords.appendChild(recentLabel);

  const recentText = document.createElement('div');
  recentText.id = 'recent-text';
  recentText.textContent = '(no text yet)';
  recentText.style.cssText = `
    font-size: 10px;
    font-style: italic;
    opacity: 0.8;
    min-height: 20px;
  `;
  recentWords.appendChild(recentText);

  signalViz.appendChild(recentWords);
  section.appendChild(signalViz);

  // === PRESET SAMPLES ===
  const samplesContainer = document.createElement('div');
  samplesContainer.style.cssText = `
    background: rgba(0, 0, 0, 0.5);
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 12px;
  `;

  const samplesTitle = document.createElement('div');
  samplesTitle.textContent = 'Sample Texts:';
  samplesTitle.style.cssText = `
    font-size: 11px;
    margin-bottom: 8px;
    opacity: 0.8;
  `;
  samplesContainer.appendChild(samplesTitle);

  const samples = [
    { name: 'Joy', text: 'infinite love radiates through cosmic wonder, brilliant light dancing in perfect harmony' },
    { name: 'Darkness', text: 'shadows creep through empty void, cold darkness swallows broken dreams in despair' },
    { name: 'Battle', text: 'rage explodes fury strikes destroy crush enemy attack fight war thunder' },
    { name: 'Peace', text: 'gentle breath flows softly calm tranquil serene quiet still peaceful rest' },
    { name: 'Journey', text: 'crossing the threshold, the traveler begins their quest through unknown paths' },
    { name: 'Transformation', text: 'phoenix rises reborn from ashes, metamorphosis complete, transformed into light' }
  ];

  const sampleGrid = document.createElement('div');
  sampleGrid.style.cssText = `
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 6px;
  `;

  samples.forEach(sample => {
    const button = document.createElement('button');
    button.textContent = sample.name;
    button.style.cssText = `
      padding: 6px;
      font-size: 10px;
      background: rgba(100, 100, 255, 0.2);
    `;
    button.addEventListener('click', () => {
      if (window.textSignalProvider) {
        window.textSignalProvider.processText(sample.text);
      }
    });
    sampleGrid.appendChild(button);
  });

  samplesContainer.appendChild(sampleGrid);
  section.appendChild(samplesContainer);

  // === BINDINGS CONTROLS ===
  const bindingsContainer = document.createElement('div');
  bindingsContainer.style.cssText = `
    background: rgba(0, 0, 0, 0.5);
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 12px;
  `;

  const bindingsTitle = document.createElement('div');
  bindingsTitle.textContent = 'Signal Bindings:';
  bindingsTitle.style.cssText = `
    font-size: 11px;
    margin-bottom: 8px;
    opacity: 0.8;
  `;
  bindingsContainer.appendChild(bindingsTitle);

  const bindingsInfo = document.createElement('div');
  bindingsInfo.id = 'bindings-info';
  bindingsInfo.style.cssText = `
    font-size: 10px;
    opacity: 0.7;
  `;
  bindingsInfo.innerHTML = `
    Active bindings:<br>
    • Sentiment → Vessel Morph<br>
    • Tone → Glyphs<br>
    • Rhythm → Particles<br>
  `;
  bindingsContainer.appendChild(bindingsInfo);

  const toggleBindings = document.createElement('button');
  toggleBindings.textContent = '✓ Bindings Enabled';
  toggleBindings.style.cssText = `
    width: 100%;
    padding: 8px;
    margin-top: 8px;
    background: rgba(50, 205, 50, 0.3);
    font-size: 11px;
  `;
  let bindingsEnabled = true;
  toggleBindings.addEventListener('click', () => {
    bindingsEnabled = !bindingsEnabled;
    if (window.textSignalBindings) {
      window.textSignalBindings.setEnabled(bindingsEnabled);
    }
    toggleBindings.textContent = bindingsEnabled ? '✓ Bindings Enabled' : '✗ Bindings Disabled';
    toggleBindings.style.background = bindingsEnabled ? 'rgba(50, 205, 50, 0.3)' : 'rgba(255, 50, 50, 0.3)';
  });
  bindingsContainer.appendChild(toggleBindings);

  section.appendChild(bindingsContainer);

  container.appendChild(section);

  // === UPDATE VISUALIZATION ===
  function updateVisualization() {
    if (!window.textSignalProvider) return;

    const signals = window.textSignalProvider.getSignals();

    // Update sentiment bar
    const sentimentPercent = Math.abs(signals.sentiment) * 50; // 0-50%
    const sentFill = document.getElementById('sentiment-fill');
    if (sentFill) {
      if (signals.sentiment >= 0) {
        // Positive: green bar to the right
        sentFill.style.left = '50%';
        sentFill.style.width = `${sentimentPercent}%`;
        sentFill.style.background = '#32CD32';
      } else {
        // Negative: red bar to the left
        sentFill.style.left = `${50 - sentimentPercent}%`;
        sentFill.style.width = `${sentimentPercent}%`;
        sentFill.style.background = '#FF4444';
      }
    }

    const sentValue = document.getElementById('sentiment-value');
    if (sentValue) {
      sentValue.textContent = signals.sentiment.toFixed(2);
    }

    // Update tone
    const toneVal = document.getElementById('tone-value');
    if (toneVal) {
      toneVal.textContent = signals.tone;
    }

    const toneStr = document.getElementById('tone-strength');
    if (toneStr) {
      toneStr.textContent = `(${(signals.toneStrength * 100).toFixed(0)}%)`;
    }

    // Update rhythm
    const rhythmFillEl = document.getElementById('rhythm-fill');
    if (rhythmFillEl) {
      rhythmFillEl.style.width = `${signals.rhythm * 100}%`;
    }

    const rhythmVal = document.getElementById('rhythm-value');
    if (rhythmVal) {
      rhythmVal.textContent = signals.rhythm.toFixed(2);
    }

    // Update recent text
    const recentEl = document.getElementById('recent-text');
    if (recentEl && signals.lastPhrase) {
      recentEl.textContent = signals.lastPhrase;
    }
  }

  // Update every 100ms
  setInterval(updateVisualization, 100);

  console.log("📝 Text Signal HUD created");
}

/**
 * Voice input using Web Speech API
 */
function startVoiceInput(textInput) {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert('Voice input not supported in this browser. Try Chrome.');
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  let finalTranscript = '';

  recognition.onresult = (event) => {
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
        // Process completed phrase
        if (window.textSignalProvider) {
          window.textSignalProvider.processText(transcript);
        }
      } else {
        interimTranscript += transcript;
      }
    }

    // Show interim results in text input
    textInput.value = finalTranscript + interimTranscript;
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    alert(`Voice input error: ${event.error}`);
  };

  recognition.onend = () => {
    console.log('Voice input ended');
  };

  recognition.start();
  console.log('Voice input started');

  // Stop after 30 seconds
  setTimeout(() => {
    recognition.stop();
  }, 30000);
}

console.log("📝 Text Signal HUD ready");
