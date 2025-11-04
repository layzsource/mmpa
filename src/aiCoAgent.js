// src/aiCoAgent.js
// AI Co-Agent Integration - Generative AI for authoring presets, skyboxes, and narratives
// Provider-agnostic router with hooks for Claude, Gemini, OpenAI, etc.

console.log("🤖 aiCoAgent.js loaded");

/**
 * Abstract AI Provider interface
 */
export class AIProvider {
  constructor(config = {}) {
    this.name = config.name || 'Unknown';
    this.apiKey = config.apiKey;
    this.model = config.model;
    this.endpoint = config.endpoint;
  }

  async generateText(prompt, options = {}) {
    throw new Error('generateText must be implemented by provider');
  }

  async generateJSON(prompt, schema, options = {}) {
    throw new Error('generateJSON must be implemented by provider');
  }

  isConfigured() {
    return !!this.apiKey;
  }
}

/**
 * Claude (Anthropic) provider
 */
export class ClaudeProvider extends AIProvider {
  constructor(config = {}) {
    super({
      name: 'Claude',
      apiKey: config.apiKey,
      model: config.model || 'claude-3-5-sonnet-20241022',
      endpoint: 'https://api.anthropic.com/v1/messages'
    });
    this.apiVersion = '2023-06-01';
  }

  async generateText(prompt, options = {}) {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': this.apiVersion
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: options.maxTokens || 4096,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  async generateJSON(prompt, schema, options = {}) {
    const jsonPrompt = `${prompt}\n\nRespond with valid JSON matching this schema:\n${JSON.stringify(schema, null, 2)}\n\nRespond with ONLY the JSON, no explanation.`;
    const text = await this.generateText(jsonPrompt, options);

    // Extract JSON from response (might be wrapped in markdown)
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    return JSON.parse(jsonMatch[1] || jsonMatch[0]);
  }
}

/**
 * OpenAI provider
 */
export class OpenAIProvider extends AIProvider {
  constructor(config = {}) {
    super({
      name: 'OpenAI',
      apiKey: config.apiKey,
      model: config.model || 'gpt-4-turbo-preview',
      endpoint: 'https://api.openai.com/v1/chat/completions'
    });
  }

  async generateText(prompt, options = {}) {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: options.maxTokens || 4096,
        temperature: options.temperature || 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async generateJSON(prompt, schema, options = {}) {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: options.maxTokens || 4096,
        temperature: options.temperature || 0.7,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }
}

/**
 * Gemini (Google) provider
 */
export class GeminiProvider extends AIProvider {
  constructor(config = {}) {
    super({
      name: 'Gemini',
      apiKey: config.apiKey,
      model: config.model || 'gemini-pro',
      endpoint: 'https://generativelanguage.googleapis.com/v1/models'
    });
  }

  async generateText(prompt, options = {}) {
    const url = `${this.endpoint}/${this.model}:generateContent?key=${this.apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          maxOutputTokens: options.maxTokens || 4096,
          temperature: options.temperature || 0.7
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  async generateJSON(prompt, schema, options = {}) {
    const jsonPrompt = `${prompt}\n\nRespond with valid JSON matching this schema:\n${JSON.stringify(schema, null, 2)}\n\nRespond with ONLY the JSON, no explanation.`;
    const text = await this.generateText(jsonPrompt, options);

    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    return JSON.parse(jsonMatch[1] || jsonMatch[0]);
  }
}

/**
 * Local/Mock provider for testing without API keys
 */
export class MockProvider extends AIProvider {
  constructor(config = {}) {
    super({
      name: 'Mock',
      apiKey: 'mock-key',
      model: 'mock-model'
    });
  }

  async generateText(prompt, options = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return `Mock response to: ${prompt.substring(0, 50)}...`;
  }

  async generateJSON(prompt, schema, options = {}) {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate mock data based on schema
    if (prompt.includes('preset')) {
      return {
        name: 'AI Generated Preset',
        morphWeights: { sphere: 0.5, cube: 0.5 },
        rotation: 0.5,
        scale: 1.0
      };
    } else if (prompt.includes('destination')) {
      return {
        name: 'AI Generated Destination',
        description: 'A mystical location',
        skyboxUrl: '/skyboxes/default.jpg',
        visualState: { morphWeights: { octahedron: 1.0 } }
      };
    } else if (prompt.includes('myth')) {
      return {
        name: 'AI Generated Myth',
        description: 'A generated narrative',
        category: 'hero',
        nodes: []
      };
    }

    return { generated: true, mock: true };
  }

  isConfigured() {
    return true; // Mock is always configured
  }
}

/**
 * Prompt templates for different generation tasks
 */
export const PromptTemplates = {
  preset: (description, mood, style) => `
Generate a visual preset configuration for a morphing geometry interface based on this description:

Description: ${description}
Mood: ${mood || 'neutral'}
Style: ${style || 'abstract'}

The preset should control morphing between geometric shapes (sphere, cube, octahedron, tetrahedron, icosahedron, dodecahedron, torus, cone, cylinder).

Return a JSON object with this structure:
{
  "name": "string",
  "description": "string",
  "morphWeights": {
    "sphere": 0.0-1.0,
    "cube": 0.0-1.0,
    "octahedron": 0.0-1.0,
    "tetrahedron": 0.0-1.0,
    "icosahedron": 0.0-1.0,
    "dodecahedron": 0.0-1.0,
    "torus": 0.0-1.0,
    "cone": 0.0-1.0,
    "cylinder": 0.0-1.0
  },
  "rotation": 0.0-1.0,
  "scale": 0.5-3.0,
  "color": "#RRGGBB",
  "tags": ["array", "of", "tags"]
}

Morphweights should sum to approximately 1.0. Choose shapes and weights that match the mood and style.
`,

  destination: (location, atmosphere, theme) => `
Generate a destination (skybox location) for a 3D visualization interface based on this description:

Location: ${location}
Atmosphere: ${atmosphere || 'mysterious'}
Theme: ${theme || 'abstract'}

Return a JSON object with this structure:
{
  "name": "string",
  "description": "string (2-3 sentences)",
  "category": "natural|abstract|cosmic|architectural|mythological",
  "tags": ["array", "of", "tags"],
  "visualState": {
    "morphWeights": { "sphere": 0.0-1.0, ... },
    "rotation": 0.0-1.0,
    "scale": 0.5-3.0,
    "color": "#RRGGBB"
  },
  "ambiance": {
    "mood": "string",
    "energy": "calm|moderate|intense",
    "timeOfDay": "dawn|day|dusk|night|eternal"
  }
}

Note: Skybox images would need to be provided separately. Focus on the metadata and visual state.
`,

  myth: (mythType, culture, archetypes) => `
Generate a mythic narrative structure based on this description:

Myth Type: ${mythType} (e.g., creation, hero's journey, trickster, seasonal)
Cultural Context: ${culture || 'universal'}
Archetypes: ${archetypes?.join(', ') || 'hero, mentor, shadow'}

Return a JSON object following this structure:
{
  "name": "string",
  "description": "string (2-3 sentences)",
  "category": "creation|hero|trickster|seasonal|cosmogony",
  "culture": "string",
  "tags": ["array", "of", "tags"],
  "archetypes": [
    {
      "id": "string_id",
      "name": "string",
      "category": "string",
      "description": "string",
      "color": "#RRGGBB",
      "glyph": "unicode character or emoji",
      "qualities": ["array", "of", "qualities"]
    }
  ],
  "nodes": [
    {
      "id": "string_id",
      "name": "string",
      "description": "string",
      "archetypeId": "string (references archetype)",
      "narrativeStage": "departure|initiation|return",
      "mytheme": "string (core theme)",
      "glyph": "unicode character or emoji",
      "nextNodes": ["array", "of", "node", "ids"],
      "previousNodes": ["array", "of", "node", "ids"]
    }
  ],
  "startNodeId": "string (id of first node)"
}

Create 5-12 nodes that form a complete narrative arc. Nodes should connect in a graph structure.
`,

  lesson: (topic, difficulty, category) => `
Generate an interactive lesson for teaching ${topic}.

Difficulty: ${difficulty} (1-5)
Category: ${category} (music, geometry, myth, visual)

Return a JSON object following this structure:
{
  "name": "string",
  "description": "string",
  "category": "${category}",
  "difficulty": ${difficulty},
  "estimatedTime": number (minutes),
  "tags": ["array", "of", "tags"],
  "steps": [
    {
      "id": "string_id",
      "type": "explanation|demonstration|interaction|quiz|practice",
      "title": "string",
      "content": "string (instructional content)",
      "visualState": {
        "morphWeights": { ... },
        "rotation": 0.0-1.0,
        "scale": 0.5-3.0
      },
      "hints": ["array", "of", "hint", "strings"],
      "nextStep": "string (next step id)",
      "previousStep": "string (previous step id)"
    }
  ],
  "startStepId": "string (id of first step)"
}

Create 5-10 steps that progressively teach the concept with clear explanations and demonstrations.
`
};

/**
 * Main AI Co-Agent system
 */
export class AICoAgent {
  constructor() {
    this.providers = new Map();
    this.activeProvider = null;
    this.generationHistory = [];
    this.listeners = [];

    // System integrations
    this.presetSystem = null;
    this.destinationSystem = null;
    this.mythCompiler = null;
    this.pedagogicalSystem = null;

    // Initialize mock provider by default
    this.registerProvider('mock', new MockProvider());
    this.setActiveProvider('mock');
  }

  registerProvider(id, provider) {
    this.providers.set(id, provider);
    console.log(`🤖 Registered AI provider: ${provider.name}`);
  }

  setActiveProvider(id) {
    const provider = this.providers.get(id);
    if (!provider) {
      console.error(`Provider ${id} not found`);
      return false;
    }

    if (!provider.isConfigured()) {
      console.warn(`Provider ${provider.name} is not configured (missing API key)`);
      return false;
    }

    this.activeProvider = provider;
    console.log(`🤖 Active AI provider: ${provider.name}`);
    return true;
  }

  getActiveProvider() {
    return this.activeProvider;
  }

  getProviders() {
    return Array.from(this.providers.entries()).map(([id, provider]) => ({
      id,
      name: provider.name,
      configured: provider.isConfigured()
    }));
  }

  // System integrations
  setPresetSystem(presetSystem) {
    this.presetSystem = presetSystem;
  }

  setDestinationSystem(destinationSystem) {
    this.destinationSystem = destinationSystem;
  }

  setMythCompiler(mythCompiler) {
    this.mythCompiler = mythCompiler;
  }

  setPedagogicalSystem(pedagogicalSystem) {
    this.pedagogicalSystem = pedagogicalSystem;
  }

  // Generation methods
  async generatePreset(description, mood, style) {
    if (!this.activeProvider) {
      throw new Error('No active AI provider');
    }

    this.emitGenerationStart('preset');

    try {
      const prompt = PromptTemplates.preset(description, mood, style);
      const schema = {
        name: 'string',
        description: 'string',
        morphWeights: {},
        rotation: 'number',
        scale: 'number',
        color: 'string',
        tags: []
      };

      const data = await this.activeProvider.generateJSON(prompt, schema);

      // Normalize morphWeights to sum to 1.0
      const total = Object.values(data.morphWeights || {}).reduce((sum, val) => sum + val, 0);
      if (total > 0) {
        Object.keys(data.morphWeights).forEach(key => {
          data.morphWeights[key] /= total;
        });
      }

      this.generationHistory.push({
        type: 'preset',
        timestamp: Date.now(),
        input: { description, mood, style },
        output: data
      });

      this.emitGenerationComplete('preset', data);
      return data;
    } catch (err) {
      this.emitGenerationError('preset', err);
      throw err;
    }
  }

  async generateDestination(location, atmosphere, theme) {
    if (!this.activeProvider) {
      throw new Error('No active AI provider');
    }

    this.emitGenerationStart('destination');

    try {
      const prompt = PromptTemplates.destination(location, atmosphere, theme);
      const data = await this.activeProvider.generateJSON(prompt, {});

      this.generationHistory.push({
        type: 'destination',
        timestamp: Date.now(),
        input: { location, atmosphere, theme },
        output: data
      });

      this.emitGenerationComplete('destination', data);
      return data;
    } catch (err) {
      this.emitGenerationError('destination', err);
      throw err;
    }
  }

  async generateMyth(mythType, culture, archetypes) {
    if (!this.activeProvider) {
      throw new Error('No active AI provider');
    }

    this.emitGenerationStart('myth');

    try {
      const prompt = PromptTemplates.myth(mythType, culture, archetypes);
      const data = await this.activeProvider.generateJSON(prompt, {});

      this.generationHistory.push({
        type: 'myth',
        timestamp: Date.now(),
        input: { mythType, culture, archetypes },
        output: data
      });

      this.emitGenerationComplete('myth', data);
      return data;
    } catch (err) {
      this.emitGenerationError('myth', err);
      throw err;
    }
  }

  async generateLesson(topic, difficulty, category) {
    if (!this.activeProvider) {
      throw new Error('No active AI provider');
    }

    this.emitGenerationStart('lesson');

    try {
      const prompt = PromptTemplates.lesson(topic, difficulty, category);
      const data = await this.activeProvider.generateJSON(prompt, {});

      this.generationHistory.push({
        type: 'lesson',
        timestamp: Date.now(),
        input: { topic, difficulty, category },
        output: data
      });

      this.emitGenerationComplete('lesson', data);
      return data;
    } catch (err) {
      this.emitGenerationError('lesson', err);
      throw err;
    }
  }

  // Event system
  onGenerationStart(callback) {
    this.listeners.push({ type: 'start', callback });
  }

  onGenerationComplete(callback) {
    this.listeners.push({ type: 'complete', callback });
  }

  onGenerationError(callback) {
    this.listeners.push({ type: 'error', callback });
  }

  emitGenerationStart(generationType) {
    this.listeners
      .filter(l => l.type === 'start')
      .forEach(l => l.callback(generationType));
  }

  emitGenerationComplete(generationType, data) {
    this.listeners
      .filter(l => l.type === 'complete')
      .forEach(l => l.callback(generationType, data));
  }

  emitGenerationError(generationType, error) {
    this.listeners
      .filter(l => l.type === 'error')
      .forEach(l => l.callback(generationType, error));
  }

  // History
  getHistory() {
    return this.generationHistory;
  }

  clearHistory() {
    this.generationHistory = [];
  }

  // Storage
  saveSettings() {
    const settings = {
      activeProvider: Array.from(this.providers.entries())
        .find(([id, provider]) => provider === this.activeProvider)?.[0] || 'mock'
    };
    localStorage.setItem('ai_coagent_settings', JSON.stringify(settings));
  }

  loadSettings() {
    const stored = localStorage.getItem('ai_coagent_settings');
    if (!stored) return;

    try {
      const settings = JSON.parse(stored);
      if (settings.activeProvider) {
        this.setActiveProvider(settings.activeProvider);
      }
    } catch (err) {
      console.error("Error loading AI co-agent settings:", err);
    }
  }
}

console.log("🤖 AI Co-Agent system ready");
