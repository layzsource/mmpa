// src/hudAI.js
// HUD interface for AI Co-Agent
// Generative controls for presets, destinations, myths, and lessons

console.log("🤖 hudAI.js loaded");

/**
 * Create AI Co-Agent HUD section
 */
export function createAIHUD(container) {
  const section = document.createElement('div');
  section.className = 'hud-section ai-coagent';
  section.style.maxWidth = '480px';

  const title = document.createElement('h3');
  title.textContent = '🤖 AI Co-Agent';
  section.appendChild(title);

  const intro = document.createElement('p');
  intro.textContent = 'Use AI to generate presets, destinations, myths, and lessons. Connect your preferred AI provider to enable generation.';
  intro.style.cssText = `
    font-size: 11px;
    margin-bottom: 12px;
    opacity: 0.8;
  `;
  section.appendChild(intro);

  // === AI PROVIDER SELECTION ===
  const providerSection = document.createElement('div');
  providerSection.style.marginBottom = '16px';

  const providerTitle = document.createElement('h4');
  providerTitle.textContent = 'AI Provider';
  providerTitle.style.fontSize = '13px';
  providerTitle.style.marginBottom = '8px';
  providerSection.appendChild(providerTitle);

  const providerSelect = document.createElement('select');
  providerSelect.style.cssText = `
    width: 100%;
    padding: 6px;
    margin-bottom: 8px;
    font-family: monospace;
    font-size: 11px;
  `;

  function refreshProviders() {
    if (!window.aiCoAgent) return;

    const providers = window.aiCoAgent.getProviders();
    providerSelect.innerHTML = '';

    providers.forEach(({ id, name, configured }) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = `${name} ${configured ? '✓' : '(not configured)'}`;
      if (!configured && id !== 'mock') {
        option.disabled = true;
      }
      providerSelect.appendChild(option);
    });

    const activeProvider = window.aiCoAgent.getActiveProvider();
    if (activeProvider) {
      providerSelect.value = Array.from(window.aiCoAgent.providers.entries())
        .find(([_, p]) => p === activeProvider)?.[0];
    }
  }

  providerSelect.addEventListener('change', () => {
    if (window.aiCoAgent) {
      window.aiCoAgent.setActiveProvider(providerSelect.value);
      window.aiCoAgent.saveSettings();
    }
  });

  providerSection.appendChild(providerSelect);

  // API Key configuration
  const apiKeyInfo = document.createElement('div');
  apiKeyInfo.style.cssText = `
    background: rgba(0, 0, 0, 0.5);
    padding: 8px;
    border-radius: 4px;
    font-size: 10px;
    margin-bottom: 8px;
    opacity: 0.8;
  `;
  apiKeyInfo.innerHTML = `
    <div><strong>ℹ️ API Configuration</strong></div>
    <div style="margin-top: 4px;">To use Claude, OpenAI, or Gemini, configure API keys via browser console:</div>
    <div style="margin-top: 4px; font-family: monospace; color: #FFD700;">
      aiCoAgent.registerProvider('claude', new ClaudeProvider({ apiKey: 'your-key' }))
    </div>
    <div style="margin-top: 4px;">The Mock provider is always available for testing.</div>
  `;
  providerSection.appendChild(apiKeyInfo);

  section.appendChild(providerSection);

  // === GENERATION TABS ===
  const tabsContainer = document.createElement('div');
  tabsContainer.style.marginBottom = '16px';

  const tabs = ['Presets', 'Destinations', 'Myths', 'Lessons'];
  let activeTab = 'Presets';

  const tabButtons = document.createElement('div');
  tabButtons.style.cssText = `
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    margin-bottom: 12px;
  `;

  const tabContents = {};

  tabs.forEach(tab => {
    const btn = document.createElement('button');
    btn.textContent = tab;
    btn.style.cssText = `
      padding: 6px;
      font-size: 10px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      background: ${tab === activeTab ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
      color: white;
      cursor: pointer;
      border-radius: 4px;
    `;
    btn.addEventListener('click', () => {
      activeTab = tab;
      tabButtons.querySelectorAll('button').forEach(b => {
        b.style.background = 'transparent';
      });
      btn.style.background = 'rgba(255, 255, 255, 0.2)';

      Object.values(tabContents).forEach(content => {
        content.style.display = 'none';
      });
      tabContents[tab].style.display = 'block';
    });
    tabButtons.appendChild(btn);
  });

  tabsContainer.appendChild(tabButtons);
  section.appendChild(tabsContainer);

  // === PRESET GENERATION ===
  const presetContent = document.createElement('div');
  presetContent.style.display = activeTab === 'Presets' ? 'block' : 'none';
  tabContents['Presets'] = presetContent;

  const presetTitle = document.createElement('h4');
  presetTitle.textContent = 'Generate Preset';
  presetTitle.style.fontSize = '13px';
  presetTitle.style.marginBottom = '8px';
  presetContent.appendChild(presetTitle);

  const presetForm = document.createElement('div');
  presetForm.style.marginBottom = '12px';

  const presetDescInput = createInput('Description', 'text', 'A psychedelic spiral of fractals');
  const presetMoodInput = createInput('Mood', 'text', 'energetic, vibrant');
  const presetStyleInput = createInput('Style', 'text', 'abstract, geometric');

  presetForm.appendChild(presetDescInput.container);
  presetForm.appendChild(presetMoodInput.container);
  presetForm.appendChild(presetStyleInput.container);

  const presetGenerateButton = document.createElement('button');
  presetGenerateButton.textContent = '✨ Generate Preset';
  presetGenerateButton.style.cssText = `
    width: 100%;
    padding: 8px;
    background: #9370DB;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 8px;
  `;
  presetGenerateButton.addEventListener('click', async () => {
    if (!window.aiCoAgent) return;

    presetGenerateButton.disabled = true;
    presetGenerateButton.textContent = '⏳ Generating...';

    try {
      const data = await window.aiCoAgent.generatePreset(
        presetDescInput.input.value,
        presetMoodInput.input.value,
        presetStyleInput.input.value
      );

      showGenerationResult('Preset Generated', data);

      // Optionally add to preset system
      if (window.presets && confirm('Add this preset to your library?')) {
        // Would need to integrate with preset system
        alert('Preset generation complete! Copy the JSON to add manually.');
      }
    } catch (err) {
      alert(`Generation failed: ${err.message}`);
    } finally {
      presetGenerateButton.disabled = false;
      presetGenerateButton.textContent = '✨ Generate Preset';
    }
  });
  presetForm.appendChild(presetGenerateButton);

  presetContent.appendChild(presetForm);
  section.appendChild(presetContent);

  // === DESTINATION GENERATION ===
  const destinationContent = document.createElement('div');
  destinationContent.style.display = 'none';
  tabContents['Destinations'] = destinationContent;

  const destTitle = document.createElement('h4');
  destTitle.textContent = 'Generate Destination';
  destTitle.style.fontSize = '13px';
  destTitle.style.marginBottom = '8px';
  destinationContent.appendChild(destTitle);

  const destForm = document.createElement('div');
  destForm.style.marginBottom = '12px';

  const destLocationInput = createInput('Location', 'text', 'Ancient temple in the clouds');
  const destAtmosphereInput = createInput('Atmosphere', 'text', 'mystical, serene');
  const destThemeInput = createInput('Theme', 'text', 'sacred, celestial');

  destForm.appendChild(destLocationInput.container);
  destForm.appendChild(destAtmosphereInput.container);
  destForm.appendChild(destThemeInput.container);

  const destGenerateButton = document.createElement('button');
  destGenerateButton.textContent = '✨ Generate Destination';
  destGenerateButton.style.cssText = `
    width: 100%;
    padding: 8px;
    background: #4169E1;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 8px;
  `;
  destGenerateButton.addEventListener('click', async () => {
    if (!window.aiCoAgent) return;

    destGenerateButton.disabled = true;
    destGenerateButton.textContent = '⏳ Generating...';

    try {
      const data = await window.aiCoAgent.generateDestination(
        destLocationInput.input.value,
        destAtmosphereInput.input.value,
        destThemeInput.input.value
      );

      showGenerationResult('Destination Generated', data);

      if (window.destinationAuthoring && confirm('Add this destination to your library?')) {
        alert('Destination generation complete! Copy the JSON to add manually.');
      }
    } catch (err) {
      alert(`Generation failed: ${err.message}`);
    } finally {
      destGenerateButton.disabled = false;
      destGenerateButton.textContent = '✨ Generate Destination';
    }
  });
  destForm.appendChild(destGenerateButton);

  destinationContent.appendChild(destForm);
  section.appendChild(destinationContent);

  // === MYTH GENERATION ===
  const mythContent = document.createElement('div');
  mythContent.style.display = 'none';
  tabContents['Myths'] = mythContent;

  const mythTitle = document.createElement('h4');
  mythTitle.textContent = 'Generate Myth';
  mythTitle.style.fontSize = '13px';
  mythTitle.style.marginBottom = '8px';
  mythContent.appendChild(mythTitle);

  const mythForm = document.createElement('div');
  mythForm.style.marginBottom = '12px';

  const mythTypeInput = createInput('Myth Type', 'text', 'creation, transformation');
  const mythCultureInput = createInput('Culture', 'text', 'universal');
  const mythArchetypesInput = createInput('Archetypes', 'text', 'creator, trickster, guardian');

  mythForm.appendChild(mythTypeInput.container);
  mythForm.appendChild(mythCultureInput.container);
  mythForm.appendChild(mythArchetypesInput.container);

  const mythGenerateButton = document.createElement('button');
  mythGenerateButton.textContent = '✨ Generate Myth';
  mythGenerateButton.style.cssText = `
    width: 100%;
    padding: 8px;
    background: #FFD700;
    color: #000;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 8px;
  `;
  mythGenerateButton.addEventListener('click', async () => {
    if (!window.aiCoAgent) return;

    mythGenerateButton.disabled = true;
    mythGenerateButton.textContent = '⏳ Generating...';

    try {
      const archetypes = mythArchetypesInput.input.value.split(',').map(s => s.trim());
      const data = await window.aiCoAgent.generateMyth(
        mythTypeInput.input.value,
        mythCultureInput.input.value,
        archetypes
      );

      showGenerationResult('Myth Generated', data);

      if (window.mythCompiler && confirm('Add this myth to your library?')) {
        alert('Myth generation complete! Copy the JSON to add manually.');
      }
    } catch (err) {
      alert(`Generation failed: ${err.message}`);
    } finally {
      mythGenerateButton.disabled = false;
      mythGenerateButton.textContent = '✨ Generate Myth';
    }
  });
  mythForm.appendChild(mythGenerateButton);

  mythContent.appendChild(mythForm);
  section.appendChild(mythContent);

  // === LESSON GENERATION ===
  const lessonContent = document.createElement('div');
  lessonContent.style.display = 'none';
  tabContents['Lessons'] = lessonContent;

  const lessonTitle = document.createElement('h4');
  lessonTitle.textContent = 'Generate Lesson';
  lessonTitle.style.fontSize = '13px';
  lessonTitle.style.marginBottom = '8px';
  lessonContent.appendChild(lessonTitle);

  const lessonForm = document.createElement('div');
  lessonForm.style.marginBottom = '12px';

  const lessonTopicInput = createInput('Topic', 'text', 'harmonic series and overtones');
  const lessonDifficultyInput = createInput('Difficulty', 'number', '2');
  lessonDifficultyInput.input.min = '1';
  lessonDifficultyInput.input.max = '5';

  const lessonCategorySelect = document.createElement('select');
  lessonCategorySelect.style.cssText = `
    width: 100%;
    padding: 6px;
    margin-bottom: 8px;
    font-size: 11px;
  `;
  ['music', 'geometry', 'myth', 'visual'].forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    lessonCategorySelect.appendChild(option);
  });

  const categoryLabel = document.createElement('label');
  categoryLabel.textContent = 'Category';
  categoryLabel.style.cssText = `
    display: block;
    font-size: 11px;
    margin-bottom: 4px;
  `;

  lessonForm.appendChild(lessonTopicInput.container);
  lessonForm.appendChild(lessonDifficultyInput.container);
  lessonForm.appendChild(categoryLabel);
  lessonForm.appendChild(lessonCategorySelect);

  const lessonGenerateButton = document.createElement('button');
  lessonGenerateButton.textContent = '✨ Generate Lesson';
  lessonGenerateButton.style.cssText = `
    width: 100%;
    padding: 8px;
    background: #32CD32;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 8px;
  `;
  lessonGenerateButton.addEventListener('click', async () => {
    if (!window.aiCoAgent) return;

    lessonGenerateButton.disabled = true;
    lessonGenerateButton.textContent = '⏳ Generating...';

    try {
      const data = await window.aiCoAgent.generateLesson(
        lessonTopicInput.input.value,
        parseInt(lessonDifficultyInput.input.value),
        lessonCategorySelect.value
      );

      showGenerationResult('Lesson Generated', data);

      if (window.pedagogicalSystem && confirm('Add this lesson to your library?')) {
        alert('Lesson generation complete! Copy the JSON to add manually.');
      }
    } catch (err) {
      alert(`Generation failed: ${err.message}`);
    } finally {
      lessonGenerateButton.disabled = false;
      lessonGenerateButton.textContent = '✨ Generate Lesson';
    }
  });
  lessonForm.appendChild(lessonGenerateButton);

  lessonContent.appendChild(lessonForm);
  section.appendChild(lessonContent);

  // === GENERATION RESULT ===
  const resultSection = document.createElement('div');
  resultSection.style.marginBottom = '16px';

  const resultTitle = document.createElement('h4');
  resultTitle.textContent = 'Generated Result';
  resultTitle.style.fontSize = '13px';
  resultTitle.style.marginBottom = '8px';
  resultSection.appendChild(resultTitle);

  const resultDisplay = document.createElement('textarea');
  resultDisplay.id = 'ai-result-display';
  resultDisplay.readOnly = true;
  resultDisplay.style.cssText = `
    width: 100%;
    height: 200px;
    padding: 8px;
    background: rgba(0, 0, 0, 0.7);
    color: #32CD32;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    font-family: monospace;
    font-size: 10px;
    resize: vertical;
    margin-bottom: 8px;
  `;
  resultDisplay.placeholder = 'Generated JSON will appear here...';
  resultSection.appendChild(resultDisplay);

  const resultButtons = document.createElement('div');
  resultButtons.style.display = 'grid';
  resultButtons.style.gridTemplateColumns = '1fr 1fr';
  resultButtons.style.gap = '8px';

  const copyButton = document.createElement('button');
  copyButton.textContent = '📋 Copy JSON';
  copyButton.style.padding = '6px';
  copyButton.style.fontSize = '11px';
  copyButton.addEventListener('click', () => {
    resultDisplay.select();
    document.execCommand('copy');
    alert('JSON copied to clipboard!');
  });
  resultButtons.appendChild(copyButton);

  const downloadButton = document.createElement('button');
  downloadButton.textContent = '⬇ Download';
  downloadButton.style.padding = '6px';
  downloadButton.style.fontSize = '11px';
  downloadButton.addEventListener('click', () => {
    const blob = new Blob([resultDisplay.value], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai_generated_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
  resultButtons.appendChild(downloadButton);

  resultSection.appendChild(resultButtons);
  section.appendChild(resultSection);

  // === HELPER FUNCTIONS ===
  function createInput(label, type, placeholder) {
    const container = document.createElement('div');
    container.style.marginBottom = '8px';

    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    labelEl.style.cssText = `
      display: block;
      font-size: 11px;
      margin-bottom: 4px;
    `;
    container.appendChild(labelEl);

    const input = document.createElement('input');
    input.type = type;
    input.placeholder = placeholder;
    input.style.cssText = `
      width: 100%;
      padding: 6px;
      font-size: 11px;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 4px;
    `;
    container.appendChild(input);

    return { container, input };
  }

  function showGenerationResult(title, data) {
    resultDisplay.value = JSON.stringify(data, null, 2);
    alert(`${title}!\n\nCheck the Generated Result section below.`);
  }

  // Initialize
  refreshProviders();

  container.appendChild(section);
  console.log("🤖 AI Co-Agent HUD created");
}

console.log("🤖 AI HUD system ready");
