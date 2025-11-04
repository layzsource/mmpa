/**
 * AI Provider System
 *
 * Supports multiple AI providers (Claude, OpenAI, etc.) with a unified interface
 */

console.log("🤖 AI Providers loading...");

/**
 * Base class for AI providers
 */
export class AIProvider {
  constructor(name, apiKey) {
    this.name = name;
    this.apiKey = apiKey;
    this.rateLimit = {
      requestsPerMinute: 60,
      lastRequest: 0,
      requestCount: 0
    };
  }

  /**
   * Generate a response from the AI
   * @param {string} prompt - The prompt to send
   * @param {object} options - Additional options (temperature, maxTokens, etc.)
   * @returns {Promise<string>} - The AI's response
   */
  async generate(prompt, options = {}) {
    throw new Error('generate() must be implemented by provider subclass');
  }

  /**
   * Check if rate limit allows request
   */
  checkRateLimit() {
    const now = Date.now();
    const minuteAgo = now - 60000;

    if (this.rateLimit.lastRequest < minuteAgo) {
      // Reset counter if more than a minute has passed
      this.rateLimit.requestCount = 0;
    }

    if (this.rateLimit.requestCount >= this.rateLimit.requestsPerMinute) {
      throw new Error(`Rate limit exceeded: ${this.rateLimit.requestsPerMinute} requests per minute`);
    }

    this.rateLimit.requestCount++;
    this.rateLimit.lastRequest = now;
  }

  /**
   * Validate API key format
   */
  validateApiKey() {
    if (!this.apiKey || this.apiKey.length < 10) {
      throw new Error('Invalid API key');
    }
  }

  /**
   * Get provider info
   */
  getInfo() {
    return {
      name: this.name,
      hasApiKey: !!this.apiKey,
      rateLimit: this.rateLimit.requestsPerMinute
    };
  }
}

/**
 * Claude (Anthropic) Provider
 */
export class ClaudeProvider extends AIProvider {
  constructor(apiKey, options = {}) {
    super('Claude', apiKey);
    this.model = options.model || 'claude-3-5-sonnet-20240620';
    this.apiEndpoint = 'https://api.anthropic.com/v1/messages';
    this.apiVersion = '2023-06-01';
    this.maxTokens = options.maxTokens || 4096;
    this.temperature = options.temperature || 1.0;
  }

  async generate(prompt, options = {}) {
    this.validateApiKey();
    this.checkRateLimit();

    const temperature = options.temperature ?? this.temperature;
    const maxTokens = options.maxTokens ?? this.maxTokens;
    const model = options.model ?? this.model;

    console.log(`🤖 Claude generating response (model: ${model}, temp: ${temperature}, maxTokens: ${maxTokens})`);

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': this.apiVersion
        },
        body: JSON.stringify({
          model: model,
          max_tokens: maxTokens,
          temperature: temperature,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
        throw new Error(`Claude API error (${response.status}): ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();

      if (!data.content || !data.content[0] || !data.content[0].text) {
        throw new Error('Invalid response format from Claude API');
      }

      console.log(`✅ Claude response received (${data.content[0].text.length} chars)`);
      return data.content[0].text;

    } catch (error) {
      console.error('❌ Claude API error:', error);
      throw error;
    }
  }

  getInfo() {
    return {
      ...super.getInfo(),
      model: this.model,
      endpoint: this.apiEndpoint,
      maxTokens: this.maxTokens,
      temperature: this.temperature
    };
  }
}

/**
 * OpenAI (ChatGPT) Provider
 */
export class OpenAIProvider extends AIProvider {
  constructor(apiKey, options = {}) {
    super('OpenAI', apiKey);
    this.model = options.model || 'gpt-4o';
    this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';
    this.maxTokens = options.maxTokens || 4096;
    this.temperature = options.temperature || 1.0;
  }

  async generate(prompt, options = {}) {
    this.validateApiKey();
    this.checkRateLimit();

    const temperature = options.temperature ?? this.temperature;
    const maxTokens = options.maxTokens ?? this.maxTokens;
    const model = options.model ?? this.model;

    console.log(`🤖 OpenAI generating response (model: ${model}, temp: ${temperature}, maxTokens: ${maxTokens})`);

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: model,
          max_tokens: maxTokens,
          temperature: temperature,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
        throw new Error(`OpenAI API error (${response.status}): ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from OpenAI API');
      }

      console.log(`✅ OpenAI response received (${data.choices[0].message.content.length} chars)`);
      return data.choices[0].message.content;

    } catch (error) {
      console.error('❌ OpenAI API error:', error);
      throw error;
    }
  }

  getInfo() {
    return {
      ...super.getInfo(),
      model: this.model,
      endpoint: this.apiEndpoint,
      maxTokens: this.maxTokens,
      temperature: this.temperature
    };
  }
}

/**
 * Provider Manager
 * Handles provider selection, API key storage, and provider instances
 */
export class ProviderManager {
  constructor() {
    this.currentProvider = null;
    this.loadFromStorage();
  }

  /**
   * Set the active provider
   */
  setProvider(providerType, apiKey, options = {}) {
    if (!apiKey || apiKey.length < 10) {
      throw new Error('Invalid API key provided');
    }

    switch (providerType.toLowerCase()) {
      case 'claude':
      case 'anthropic':
        this.currentProvider = new ClaudeProvider(apiKey, options);
        break;
      case 'openai':
      case 'chatgpt':
      case 'gpt':
        this.currentProvider = new OpenAIProvider(apiKey, options);
        break;
      default:
        throw new Error(`Unknown provider type: ${providerType}`);
    }

    // Save to localStorage
    this.saveToStorage(providerType, apiKey, options);

    console.log(`✅ AI Provider set: ${this.currentProvider.name}`);
    return this.currentProvider;
  }

  /**
   * Get the current provider
   */
  getProvider() {
    return this.currentProvider;
  }

  /**
   * Check if a provider is configured
   */
  hasProvider() {
    return this.currentProvider !== null;
  }

  /**
   * Generate with current provider
   */
  async generate(prompt, options = {}) {
    if (!this.currentProvider) {
      throw new Error('No AI provider configured. Please set a provider first.');
    }
    return this.currentProvider.generate(prompt, options);
  }

  /**
   * Clear current provider
   */
  clearProvider() {
    this.currentProvider = null;
    localStorage.removeItem('ai_provider_config');
    console.log('🗑️ AI Provider cleared');
  }

  /**
   * Save provider config to localStorage
   */
  saveToStorage(providerType, apiKey, options) {
    const config = {
      type: providerType,
      apiKey: apiKey,
      options: options,
      timestamp: Date.now()
    };
    localStorage.setItem('ai_provider_config', JSON.stringify(config));
    console.log('💾 Provider config saved to localStorage');
  }

  /**
   * Load provider config from localStorage
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('ai_provider_config');
      if (stored) {
        const config = JSON.parse(stored);
        this.setProvider(config.type, config.apiKey, config.options || {});
        console.log(`📂 Loaded provider config: ${config.type}`);
      }
    } catch (error) {
      console.warn('⚠️ Failed to load provider config:', error);
    }
  }

  /**
   * Get provider info
   */
  getInfo() {
    if (!this.currentProvider) {
      return { configured: false };
    }
    return {
      configured: true,
      ...this.currentProvider.getInfo()
    };
  }
}

// Create global provider manager
export const providerManager = new ProviderManager();

// Expose to window for console access
window.providerManager = providerManager;
window.ClaudeProvider = ClaudeProvider;
window.OpenAIProvider = OpenAIProvider;

console.log("✅ AI Providers ready");
console.log("💡 Tip: Use providerManager.setProvider('claude', 'your-api-key') or providerManager.setProvider('openai', 'your-api-key')");
