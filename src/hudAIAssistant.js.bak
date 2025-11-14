// src/hudAIAssistant.js
// AI Assistant HUD - State-aware AI suggestions for scene evolution

import { providerManager } from './ai/providers.js';

console.log("🧠 hudAIAssistant.js loaded");

/**
 * Proposal types available for AI suggestions
 */
const PROPOSAL_TYPES = {
  'evolve-geometry': {
    name: 'Evolve Geometry',
    description: 'Suggest geometric objects that complement the current scene',
    icon: '🔺',
    category: 'creation'
  },
  'suggest-waveform': {
    name: 'Suggest Waveform',
    description: 'Recommend waveform fields based on scene context',
    icon: '🌊',
    category: 'creation'
  },
  'advance-narrative': {
    name: 'Advance Narrative',
    description: 'Suggest next steps in the mythic journey',
    icon: '🌟',
    category: 'narrative'
  },
  'mutate-particles': {
    name: 'Mutate Particles',
    description: 'Evolve particle system without destroying the vibe',
    icon: '✨',
    category: 'evolution'
  },
  'suggest-audio-binding': {
    name: 'Audio Binding',
    description: 'Map audio to visual parameters for expressiveness',
    icon: '🎵',
    category: 'connection'
  },
  'suggest-portal': {
    name: 'New Portal',
    description: 'Create contrasting or complementary destination',
    icon: '🚪',
    category: 'navigation'
  },
  'optimize-scene': {
    name: 'Optimize Scene',
    description: 'Suggest performance and aesthetic improvements',
    icon: '⚡',
    category: 'refinement'
  },
  'surprise-me': {
    name: 'Surprise Me',
    description: 'Let AI make a creative leap based on context',
    icon: '🎲',
    category: 'creative'
  }
};

/**
 * Create AI Assistant HUD section
 */
export function createAIAssistantHUD(container) {
  const section = document.createElement('div');
  section.className = 'hud-section ai-assistant';
  section.style.maxWidth = '800px';

  const title = document.createElement('h3');
  title.textContent = '🧠 AI Assistant';
  section.appendChild(title);

  const intro = document.createElement('p');
  intro.textContent = 'AI-powered suggestions based on your current scene state. The AI analyzes geometry, audio, portals, and narrative context to suggest meaningful evolutions.';
  intro.style.cssText = `
    font-size: 11px;
    margin-bottom: 12px;
    opacity: 0.8;
  `;
  section.appendChild(intro);

  // === CURRENT STATE SUMMARY ===
  const statePanel = document.createElement('div');
  statePanel.style.cssText = `
    background: rgba(100, 200, 255, 0.1);
    border: 1px solid rgba(100, 200, 255, 0.3);
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 12px;
  `;

  const statePanelTitle = document.createElement('div');
  statePanelTitle.textContent = '📊 Current Scene State';
  statePanelTitle.style.cssText = `
    font-weight: bold;
    font-size: 12px;
    margin-bottom: 8px;
    color: #64C8FF;
  `;
  statePanel.appendChild(statePanelTitle);

  const stateSummary = document.createElement('div');
  stateSummary.id = 'ai-state-summary';
  stateSummary.style.cssText = `
    font-family: monospace;
    font-size: 10px;
    opacity: 0.9;
    line-height: 1.6;
  `;
  statePanel.appendChild(stateSummary);

  const captureStateButton = document.createElement('button');
  captureStateButton.textContent = '🔄 Refresh State';
  captureStateButton.style.cssText = `
    margin-top: 8px;
    padding: 4px 8px;
    font-size: 10px;
    background: rgba(100, 200, 255, 0.2);
    border: 1px solid rgba(100, 200, 255, 0.4);
    border-radius: 3px;
    cursor: pointer;
    color: white;
  `;
  captureStateButton.addEventListener('click', () => {
    updateStateSummary();
  });
  statePanel.appendChild(captureStateButton);

  section.appendChild(statePanel);

  // === SUGGESTION TYPE SELECTOR ===
  const suggestionTypePanel = document.createElement('div');
  suggestionTypePanel.style.cssText = `
    background: rgba(0, 0, 0, 0.3);
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 12px;
  `;

  const typeTitle = document.createElement('div');
  typeTitle.textContent = '💡 Suggestion Type';
  typeTitle.style.cssText = `
    font-weight: bold;
    font-size: 12px;
    margin-bottom: 8px;
  `;
  suggestionTypePanel.appendChild(typeTitle);

  const typeGrid = document.createElement('div');
  typeGrid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  `;

  Object.entries(PROPOSAL_TYPES).forEach(([key, type]) => {
    const button = document.createElement('button');
    button.className = 'suggestion-type-btn';
    button.dataset.type = key;
    button.innerHTML = `
      <div style="font-size: 16px; margin-bottom: 2px;">${type.icon}</div>
      <div style="font-size: 11px; font-weight: bold;">${type.name}</div>
      <div style="font-size: 9px; opacity: 0.7;">${type.description}</div>
    `;
    button.style.cssText = `
      padding: 8px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
      color: white;
    `;

    button.addEventListener('mouseenter', () => {
      button.style.background = 'rgba(100, 200, 255, 0.2)';
      button.style.borderColor = 'rgba(100, 200, 255, 0.5)';
    });

    button.addEventListener('mouseleave', () => {
      if (!button.classList.contains('selected')) {
        button.style.background = 'rgba(255, 255, 255, 0.05)';
        button.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      }
    });

    button.addEventListener('click', () => {
      // Deselect all
      document.querySelectorAll('.suggestion-type-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.style.background = 'rgba(255, 255, 255, 0.05)';
        btn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      });

      // Select this one
      button.classList.add('selected');
      button.style.background = 'rgba(100, 200, 255, 0.3)';
      button.style.borderColor = 'rgba(100, 200, 255, 0.6)';
    });

    typeGrid.appendChild(button);
  });

  suggestionTypePanel.appendChild(typeGrid);
  section.appendChild(suggestionTypePanel);

  // === GENERATE BUTTON ===
  const generateButton = document.createElement('button');
  generateButton.textContent = '✨ Generate AI Suggestion';
  generateButton.style.cssText = `
    width: 100%;
    padding: 12px;
    font-size: 13px;
    font-weight: bold;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 12px;
    transition: transform 0.2s, box-shadow 0.2s;
  `;

  generateButton.addEventListener('mouseenter', () => {
    generateButton.style.transform = 'translateY(-2px)';
    generateButton.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
  });

  generateButton.addEventListener('mouseleave', () => {
    generateButton.style.transform = 'translateY(0)';
    generateButton.style.boxShadow = 'none';
  });

  generateButton.addEventListener('click', async () => {
    const selectedBtn = document.querySelector('.suggestion-type-btn.selected');
    if (!selectedBtn) {
      alert('Please select a suggestion type first');
      return;
    }

    const proposalType = selectedBtn.dataset.type;
    await generateAISuggestion(proposalType);
  });

  section.appendChild(generateButton);

  // === PROPOSAL REVIEW AREA ===
  const reviewArea = document.createElement('div');
  reviewArea.id = 'ai-proposal-review';
  reviewArea.style.display = 'none';
  section.appendChild(reviewArea);

  // === SUGGESTION HISTORY ===
  const historyPanel = document.createElement('div');
  historyPanel.style.cssText = `
    background: rgba(0, 0, 0, 0.3);
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 12px;
  `;

  const historyTitle = document.createElement('div');
  historyTitle.textContent = '📜 Recent Suggestions';
  historyTitle.style.cssText = `
    font-weight: bold;
    font-size: 12px;
    margin-bottom: 8px;
  `;
  historyPanel.appendChild(historyTitle);

  const historyList = document.createElement('div');
  historyList.id = 'ai-suggestion-history';
  historyList.innerHTML = '<div style="opacity: 0.6; font-size: 11px;">No suggestions yet</div>';
  historyPanel.appendChild(historyList);

  section.appendChild(historyPanel);

  // === AI PROVIDER CONFIG ===
  const configPanel = document.createElement('div');
  configPanel.style.cssText = `
    background: rgba(0, 0, 0, 0.3);
    padding: 10px;
    border-radius: 4px;
  `;

  const configTitle = document.createElement('div');
  configTitle.textContent = '⚙️ AI Provider Configuration';
  configTitle.style.cssText = `
    font-weight: bold;
    font-size: 12px;
    margin-bottom: 8px;
  `;
  configPanel.appendChild(configTitle);

  // Provider status display
  const providerStatus = document.createElement('div');
  providerStatus.id = 'ai-provider-status';
  providerStatus.style.cssText = `
    font-size: 11px;
    padding: 6px;
    background: rgba(255, 165, 0, 0.2);
    border-left: 3px solid #FFA500;
    border-radius: 3px;
    margin-bottom: 8px;
  `;
  providerStatus.textContent = '⚠️ No AI provider configured';
  configPanel.appendChild(providerStatus);

  // Provider selection
  const providerTypeLabel = document.createElement('div');
  providerTypeLabel.textContent = 'Select Provider:';
  providerTypeLabel.style.cssText = `
    font-size: 11px;
    margin-bottom: 4px;
    font-weight: bold;
  `;
  configPanel.appendChild(providerTypeLabel);

  const providerSelect = document.createElement('select');
  providerSelect.id = 'ai-provider-select';
  providerSelect.style.cssText = `
    width: 100%;
    padding: 6px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    font-size: 11px;
    margin-bottom: 8px;
    cursor: pointer;
  `;
  providerSelect.innerHTML = `
    <option value="">-- Select AI Provider --</option>
    <option value="claude">Claude (Anthropic)</option>
    <option value="openai">ChatGPT (OpenAI)</option>
  `;
  configPanel.appendChild(providerSelect);

  // API Key input
  const apiKeyLabel = document.createElement('div');
  apiKeyLabel.textContent = 'API Key:';
  apiKeyLabel.style.cssText = `
    font-size: 11px;
    margin-bottom: 4px;
    font-weight: bold;
  `;
  configPanel.appendChild(apiKeyLabel);

  const apiKeyInput = document.createElement('input');
  apiKeyInput.id = 'ai-api-key-input';
  apiKeyInput.type = 'password';
  apiKeyInput.placeholder = 'Enter your API key...';
  apiKeyInput.style.cssText = `
    width: 100%;
    padding: 6px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    font-size: 11px;
    margin-bottom: 8px;
    font-family: monospace;
  `;
  configPanel.appendChild(apiKeyInput);

  // Model selection (optional)
  const modelLabel = document.createElement('div');
  modelLabel.textContent = 'Model (optional):';
  modelLabel.style.cssText = `
    font-size: 11px;
    margin-bottom: 4px;
    font-weight: bold;
  `;
  configPanel.appendChild(modelLabel);

  const modelInput = document.createElement('input');
  modelInput.id = 'ai-model-input';
  modelInput.type = 'text';
  modelInput.placeholder = 'Default: claude-3-5-sonnet-20240620 / gpt-4o';
  modelInput.style.cssText = `
    width: 100%;
    padding: 6px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    font-size: 11px;
    margin-bottom: 8px;
  `;
  configPanel.appendChild(modelInput);

  // Configure button
  const configureButton = document.createElement('button');
  configureButton.textContent = '💾 Save Configuration';
  configureButton.style.cssText = `
    width: 100%;
    padding: 8px;
    background: rgba(100, 200, 255, 0.3);
    color: white;
    border: 1px solid rgba(100, 200, 255, 0.5);
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    font-size: 11px;
    margin-bottom: 8px;
  `;
  configureButton.addEventListener('click', () => {
    const providerType = providerSelect.value;
    const apiKey = apiKeyInput.value;
    const model = modelInput.value;

    if (!providerType) {
      alert('Please select a provider');
      return;
    }

    if (!apiKey || apiKey.length < 10) {
      alert('Please enter a valid API key');
      return;
    }

    try {
      const options = {};
      if (model) {
        options.model = model;
      }

      providerManager.setProvider(providerType, apiKey, options);
      updateProviderStatus();
      alert(`✅ ${providerType === 'claude' ? 'Claude' : 'OpenAI'} provider configured successfully!`);
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  });
  configPanel.appendChild(configureButton);

  // Clear button
  const clearButton = document.createElement('button');
  clearButton.textContent = '🗑️ Clear Provider';
  clearButton.style.cssText = `
    width: 100%;
    padding: 8px;
    background: rgba(220, 20, 60, 0.3);
    color: white;
    border: 1px solid rgba(220, 20, 60, 0.5);
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    font-size: 11px;
  `;
  clearButton.addEventListener('click', () => {
    if (confirm('Clear AI provider configuration?')) {
      providerManager.clearProvider();
      providerSelect.value = '';
      apiKeyInput.value = '';
      modelInput.value = '';
      updateProviderStatus();
    }
  });
  configPanel.appendChild(clearButton);

  // Help text
  const helpText = document.createElement('div');
  helpText.style.cssText = `
    font-size: 9px;
    opacity: 0.6;
    margin-top: 8px;
    line-height: 1.4;
  `;
  helpText.innerHTML = `
    <div><strong>Get API Keys:</strong></div>
    <div>• Claude: <a href="https://console.anthropic.com" target="_blank" style="color: #64C8FF;">console.anthropic.com</a></div>
    <div>• OpenAI: <a href="https://platform.openai.com" target="_blank" style="color: #64C8FF;">platform.openai.com</a></div>
    <div style="margin-top: 4px;"><strong>Note:</strong> API keys are stored in browser localStorage</div>
  `;
  configPanel.appendChild(helpText);

  section.appendChild(configPanel);

  // Append to container
  container.appendChild(section);

  // Initialize
  updateStateSummary();
  updateProviderStatus();

  console.log("🧠 AI Assistant HUD created");
}

/**
 * Update state summary display
 */
function updateStateSummary() {
  const summaryDiv = document.getElementById('ai-state-summary');
  if (!summaryDiv || !window.stateSnapshotCapturer) return;

  const snapshot = window.stateSnapshotCapturer.captureState();
  const summary = snapshot.getSummary();

  summaryDiv.innerHTML = `
    <div style="margin-bottom: 4px;">
      <strong>Snapshot:</strong> ${new Date(snapshot.timestamp).toLocaleTimeString()}
    </div>
    <div style="opacity: 0.9;">
      ${summary || 'Empty scene'}
    </div>
  `;
}

/**
 * Update AI provider status
 */
function updateProviderStatus() {
  const statusDiv = document.getElementById('ai-provider-status');
  if (!statusDiv) return;

  const info = providerManager.getInfo();

  if (info.configured) {
    statusDiv.style.background = 'rgba(50, 205, 50, 0.2)';
    statusDiv.style.borderLeftColor = '#32CD32';
    statusDiv.textContent = `✅ ${info.name} configured (${info.model})`;
  } else {
    statusDiv.style.background = 'rgba(255, 165, 0, 0.2)';
    statusDiv.style.borderLeftColor = '#FFA500';
    statusDiv.textContent = '⚠️ No AI provider configured';
  }
}

/**
 * Generate AI suggestion
 */
async function generateAISuggestion(proposalType) {
  const reviewArea = document.getElementById('ai-proposal-review');
  if (!reviewArea) return;

  // Show loading state
  reviewArea.style.display = 'block';
  reviewArea.innerHTML = `
    <div style="
      background: rgba(100, 200, 255, 0.1);
      border: 1px solid rgba(100, 200, 255, 0.3);
      border-radius: 6px;
      padding: 20px;
      text-align: center;
    ">
      <div style="font-size: 32px; margin-bottom: 12px;">🤔</div>
      <div style="font-size: 13px; font-weight: bold; margin-bottom: 8px;">
        AI is analyzing your scene...
      </div>
      <div style="font-size: 11px; opacity: 0.7;">
        Generating ${PROPOSAL_TYPES[proposalType].name.toLowerCase()} suggestion
      </div>
    </div>
  `;

  try {
    // Capture current state
    const snapshot = window.stateSnapshotCapturer.captureState();
    const stateDescription = snapshot.getDetailedDescription();

    console.log('🧠 Generating AI suggestion for:', proposalType);
    console.log('🧠 Current state:', stateDescription);

    // Check if AI provider is configured
    if (!providerManager.hasProvider()) {
      showProposalError('No AI provider configured. Please configure Claude or OpenAI in the settings above.');
      return;
    }

    // Build AI prompt
    const prompt = buildAIPrompt(proposalType, snapshot, stateDescription);
    console.log('🧠 AI Prompt:', prompt);

    // Call AI
    const aiResponse = await providerManager.generate(prompt, {
      temperature: 0.8,
      maxTokens: 2048
    });

    console.log('🧠 AI Response:', aiResponse);

    // Parse AI response into proposal
    const proposal = parseAIResponse(proposalType, aiResponse);
    showProposalReview(proposal);

    // Add to history
    addToSuggestionHistory(proposalType, proposal);

  } catch (error) {
    console.error('🧠 AI suggestion error:', error);
    showProposalError(error.message);
  }
}

/**
 * Build AI prompt for suggestion
 */
function buildAIPrompt(proposalType, snapshot, stateDescription) {
  const proposalInfo = PROPOSAL_TYPES[proposalType];

  const basePrompt = `You are an AI assistant for a 3D morphing interface application. Your task is to suggest creative, context-aware evolutions to the current scene.

CURRENT SCENE STATE:
${stateDescription}

SUGGESTION TYPE: ${proposalInfo.name}
DESCRIPTION: ${proposalInfo.description}

Based on the current scene state, provide a single, specific suggestion for ${proposalInfo.name.toLowerCase()}.

Your response MUST be in the following JSON format:
{
  "reasoning": "A brief explanation (2-3 sentences) of why this suggestion makes sense for the current scene",
  "action": "The action type (e.g., addGeometry, createWaveform, progressMyth, etc.)",
  "data": {
    // Specific parameters for the action
  }
}

`;

  // Type-specific instructions
  const typeInstructions = {
    'evolve-geometry': `For geometry evolution, suggest a new 3D object that complements the scene. The "data" field should include:
- type: One of (sphere, cube, octahedron, icosahedron, dodecahedron, tetrahedron)
- position: [x, y, z] coordinates (consider camera position and existing objects)
- material: { color: "#RRGGBB", wireframe: boolean }
- audioReactive: boolean (whether it responds to audio)`,

    'suggest-waveform': `For waveform suggestions, recommend a waveform field. The "data" field should include:
- type: One of (floor, river, plasma, mist)
- gridSize: Number (32, 64, 128)
- amplitude: Number (0.5 - 2.0)
- audioBand: One of (bass, mid, treble)
- color: "#RRGGBB"`,

    'advance-narrative': `For narrative advancement, suggest the next step in the mythic journey. The "data" field should include:
- nextNode: The ID of the next mythic node
- transition: One of (fade, morph, instant)
- duration: Number in milliseconds`,

    'mutate-particles': `For particle mutations, suggest changes to the particle system. The "data" field should include:
- layout: One of (orbit, swarm, grid, sphere)
- organicFlow: Number (0.0 - 1.0)
- size: Number (0.5 - 1.5)`,

    'suggest-audio-binding': `For audio binding, suggest a mapping between audio and visual parameters. The "data" field should include:
- parameter: The visual parameter to bind (e.g., "morphWeights.octahedron")
- audioSource: One of (bass, mid, treble)
- range: [min, max] values
- smoothing: Number (0.0 - 1.0)`,

    'suggest-portal': `For portal creation, suggest a new destination. The "data" field should include:
- name: Portal name
- type: Portal type/mood
- position: [x, y, z] coordinates
- skybox: { type: "procedural", colors: ["#color1", "#color2"] }`,

    'optimize-scene': `For scene optimization, suggest performance improvements. The "data" field should include:
- reduceParticleCount: Number (or null)
- simplifyGeometry: boolean
- enableFrustumCulling: boolean
- otherOptimizations: Array of strings`,

    'surprise-me': `For creative surprises, suggest something unexpected but coherent. Be creative! The "data" field can include any appropriate parameters.`
  };

  return basePrompt + typeInstructions[proposalType];
}

/**
 * Parse AI response into proposal object
 */
function parseAIResponse(proposalType, aiResponse) {
  try {
    // Try to extract JSON from response (AI might wrap it in markdown code blocks)
    let jsonText = aiResponse.trim();

    // Remove markdown code blocks if present
    const jsonMatch = jsonText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }

    // Parse JSON
    const parsed = JSON.parse(jsonText);

    // Validate required fields
    if (!parsed.reasoning || !parsed.action || !parsed.data) {
      throw new Error('Invalid AI response format: missing required fields');
    }

    return {
      type: proposalType,
      reasoning: parsed.reasoning,
      action: parsed.action,
      data: parsed.data
    };

  } catch (error) {
    console.error('Failed to parse AI response:', error);
    console.error('Raw response:', aiResponse);

    // Fallback to mock proposal if parsing fails
    console.warn('Using fallback mock proposal due to parsing error');
    return generateMockProposal(proposalType, window.stateSnapshotCapturer.captureState());
  }
}

/**
 * Generate mock proposal (placeholder until AI integration)
 */
function generateMockProposal(proposalType, snapshot) {
  const proposals = {
    'evolve-geometry': {
      type: proposalType,
      action: 'addGeometry',
      data: {
        type: 'octahedron',
        position: [5, 2, -3],
        material: { color: '#FF00FF', wireframe: false },
        audioReactive: true
      },
      reasoning: 'Based on your current sphere-dominant scene, an octahedron would create interesting geometric tension while maintaining harmonic balance.'
    },
    'suggest-waveform': {
      type: proposalType,
      action: 'createWaveform',
      data: {
        type: 'plasma',
        gridSize: 64,
        amplitude: 1.2,
        audioBand: 'mid',
        color: '#00FFFF'
      },
      reasoning: 'The scene lacks mid-range audio responsiveness. A plasma field tuned to mid frequencies would add depth without overwhelming the existing river waveform.'
    },
    'advance-narrative': {
      type: proposalType,
      action: 'progressMyth',
      data: {
        nextNode: 'ordeal',
        transition: 'fade',
        duration: 3000
      },
      reasoning: 'The hero has gathered allies and is ready for the central challenge. Moving to the ordeal stage would create dramatic narrative tension.'
    },
    'mutate-particles': {
      type: proposalType,
      action: 'updateParticles',
      data: {
        layout: 'swarm',
        organicFlow: 0.6,
        size: 0.7
      },
      reasoning: 'Your orbit layout has been static. A swarm with organic flow would add dynamic life while preserving the particle count.'
    },
    'suggest-audio-binding': {
      type: proposalType,
      action: 'bindAudio',
      data: {
        parameter: 'morphWeights.octahedron',
        audioSource: 'treble',
        range: [0, 1],
        smoothing: 0.8
      },
      reasoning: 'Binding treble to octahedron morph weight would create high-frequency visual response that complements your bass-driven river waveform.'
    },
    'suggest-portal': {
      type: proposalType,
      action: 'createPortal',
      data: {
        name: 'Shadow Realm',
        type: 'Dark',
        position: [-20, 0, -20],
        skybox: { type: 'procedural', colors: ['#1a0033', '#000000'] }
      },
      reasoning: 'Your current bright, geometric space would contrast beautifully with a dark, mysterious portal. This creates narrative depth through opposition.'
    },
    'optimize-scene': {
      type: proposalType,
      action: 'optimizeScene',
      data: {
        reduceParticleCount: 3000,
        simplifyGeometry: true,
        enableFrustumCulling: true
      },
      reasoning: 'Scene complexity is high. Reducing particles and enabling frustum culling would improve performance by ~40% with minimal visual impact.'
    },
    'surprise-me': {
      type: proposalType,
      action: 'wildCard',
      data: {
        createMandala: true,
        rings: 5,
        symmetry: 8,
        emojis: ['🌙', '✨', '🔮', '🌟']
      },
      reasoning: 'Your scene has strong geometric structure but lacks symbolic elements. A mandala with mystical emojis would add unexpected depth and meaning.'
    }
  };

  return proposals[proposalType] || proposals['surprise-me'];
}

/**
 * Show proposal review interface
 */
function showProposalReview(proposal) {
  const reviewArea = document.getElementById('ai-proposal-review');
  if (!reviewArea) return;

  const proposalType = PROPOSAL_TYPES[proposal.type];

  reviewArea.innerHTML = `
    <div style="
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
      border: 1px solid rgba(102, 126, 234, 0.5);
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 12px;
    ">
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        <div style="font-size: 24px; margin-right: 12px;">${proposalType.icon}</div>
        <div>
          <div style="font-size: 14px; font-weight: bold;">${proposalType.name} Suggestion</div>
          <div style="font-size: 10px; opacity: 0.7;">${new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      <div style="
        background: rgba(0, 0, 0, 0.3);
        padding: 12px;
        border-radius: 4px;
        margin-bottom: 12px;
      ">
        <div style="font-size: 11px; font-weight: bold; margin-bottom: 8px;">💭 AI Reasoning:</div>
        <div style="font-size: 11px; line-height: 1.6; opacity: 0.9;">
          ${proposal.reasoning}
        </div>
      </div>

      <div style="
        background: rgba(0, 0, 0, 0.3);
        padding: 12px;
        border-radius: 4px;
        margin-bottom: 12px;
      ">
        <div style="font-size: 11px; font-weight: bold; margin-bottom: 8px;">📋 Proposal Details:</div>
        <pre style="
          font-size: 10px;
          font-family: monospace;
          line-height: 1.4;
          opacity: 0.9;
          overflow-x: auto;
          margin: 0;
        ">${JSON.stringify(proposal.data, null, 2)}</pre>
      </div>

      <div style="
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 8px;
      ">
        <button id="accept-proposal" style="
          padding: 10px;
          background: #32CD32;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-size: 11px;
        ">✓ Accept</button>

        <button id="edit-proposal" style="
          padding: 10px;
          background: rgba(100, 200, 255, 0.5);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-size: 11px;
        ">✎ Edit</button>

        <button id="reject-proposal" style="
          padding: 10px;
          background: #DC143C;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-size: 11px;
        ">✗ Reject</button>
      </div>
    </div>
  `;

  document.getElementById('accept-proposal').addEventListener('click', () => {
    applyProposal(proposal);
    reviewArea.style.display = 'none';
  });

  document.getElementById('edit-proposal').addEventListener('click', () => {
    openProposalEditor(proposal);
  });

  document.getElementById('reject-proposal').addEventListener('click', () => {
    console.log('🧠 Proposal rejected:', proposal.type);
    reviewArea.style.display = 'none';
  });
}

/**
 * Show proposal error
 */
function showProposalError(message) {
  const reviewArea = document.getElementById('ai-proposal-review');
  if (!reviewArea) return;

  reviewArea.innerHTML = `
    <div style="
      background: rgba(220, 20, 60, 0.2);
      border: 1px solid rgba(220, 20, 60, 0.5);
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 12px;
    ">
      <div style="font-size: 24px; text-align: center; margin-bottom: 12px;">❌</div>
      <div style="font-size: 13px; font-weight: bold; text-align: center; margin-bottom: 8px;">
        Error Generating Suggestion
      </div>
      <div style="font-size: 11px; opacity: 0.8; text-align: center;">
        ${message}
      </div>
    </div>
  `;
}

/**
 * Apply proposal to scene
 */
function applyProposal(proposal) {
  console.log('🧠 Applying proposal:', proposal);

  // Get current active portal
  const activePortalId = window.portalManager?.activePortalId || null;
  console.log(`🧠 Active portal: ${activePortalId}`);

  try {
    switch (proposal.action) {
      case 'addGeometry':
        if (window.geometryBuilder) {
          // Add portalId to the data if we have an active portal
          const geometryData = { ...proposal.data };
          if (activePortalId) {
            geometryData.portalId = activePortalId;
          }
          window.geometryBuilder.addObject(geometryData);
          console.log(`✅ Geometry added to portal ${activePortalId || 'home'}:`, proposal.data.type);
        }
        break;

      case 'createWaveform':
        if (window.waveformEditor) {
          // Add portalId to the data if we have an active portal
          const waveformData = { ...proposal.data };
          if (activePortalId) {
            waveformData.portalId = activePortalId;
          }
          window.waveformEditor.createField(waveformData);
          console.log(`✅ Waveform created at portal ${activePortalId || 'home'}:`, proposal.data.type);
        }
        break;

      case 'progressMyth':
        if (window.mythCompiler) {
          window.mythCompiler.advanceToNode(proposal.data.nextNode);
          console.log('✅ Myth progressed to:', proposal.data.nextNode);
        }
        break;

      case 'updateParticles':
        if (window.particles) {
          Object.assign(window.particles, proposal.data);
          console.log('✅ Particles updated');
        }
        break;

      case 'bindAudio':
        console.log('✅ Audio binding suggestion noted (manual implementation required)');
        alert('Audio binding: ' + proposal.data.parameter + ' → ' + proposal.data.audioSource);
        break;

      case 'createPortal':
        if (window.portalManager) {
          window.portalManager.createPortal(proposal.data);
          console.log('✅ Portal created:', proposal.data.name);
        }
        break;

      case 'optimizeScene':
        console.log('✅ Optimization suggestions noted (manual review recommended)');
        alert('Optimization: ' + JSON.stringify(proposal.data, null, 2));
        break;

      case 'wildCard':
        console.log('✅ Wild card suggestion:', proposal.data);
        alert('Surprise suggestion: ' + JSON.stringify(proposal.data, null, 2));
        break;

      default:
        console.warn('Unknown proposal action:', proposal.action);
    }

    alert('✅ Proposal applied successfully!');

  } catch (error) {
    console.error('❌ Error applying proposal:', error);
    alert('Error applying proposal: ' + error.message);
  }
}

/**
 * Open proposal editor (placeholder)
 */
function openProposalEditor(proposal) {
  console.log('🧠 Opening editor for proposal:', proposal);
  alert('Proposal editor coming soon!\n\nFor now, you can manually adjust the proposal in the console:\n\nwindow.lastProposal = ' + JSON.stringify(proposal, null, 2));
  window.lastProposal = proposal;
}

/**
 * Add suggestion to history
 */
function addToSuggestionHistory(proposalType, proposal) {
  const historyList = document.getElementById('ai-suggestion-history');
  if (!historyList) return;

  const proposalTypeName = PROPOSAL_TYPES[proposalType].name;
  const icon = PROPOSAL_TYPES[proposalType].icon;

  const entry = document.createElement('div');
  entry.style.cssText = `
    background: rgba(255, 255, 255, 0.05);
    padding: 8px;
    border-radius: 4px;
    margin-bottom: 6px;
    font-size: 10px;
  `;

  entry.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <span style="font-size: 14px; margin-right: 6px;">${icon}</span>
        <span style="font-weight: bold;">${proposalTypeName}</span>
      </div>
      <div style="opacity: 0.6;">
        ${new Date().toLocaleTimeString()}
      </div>
    </div>
    <div style="opacity: 0.7; margin-top: 4px;">
      ${proposal.reasoning.substring(0, 80)}...
    </div>
  `;

  // Keep only last 5 entries
  if (historyList.children.length >= 5) {
    historyList.removeChild(historyList.lastChild);
  }

  historyList.insertBefore(entry, historyList.firstChild);
}

console.log("🧠 AI Assistant HUD system ready");
