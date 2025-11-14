// src/textSignalProvider.js
// Text & NLP Signal Provider
// Parses sentiment, tone, rhythm from live text streams
// Maps linguistic features to visual signals

console.log("📝 textSignalProvider.js loaded");

/**
 * Sentiment Lexicon - Basic positive/negative word lists
 */
const SENTIMENT_LEXICON = {
  positive: [
    'love', 'joy', 'happy', 'wonderful', 'beautiful', 'amazing', 'excellent',
    'great', 'good', 'brilliant', 'fantastic', 'delightful', 'pleasant', 'lovely',
    'perfect', 'radiant', 'blissful', 'euphoric', 'ecstatic', 'gleeful',
    'bright', 'light', 'vibrant', 'alive', 'free', 'peaceful', 'calm', 'serene'
  ],
  negative: [
    'hate', 'sad', 'angry', 'terrible', 'awful', 'horrible', 'bad', 'evil',
    'dark', 'fear', 'pain', 'death', 'destroy', 'hurt', 'cruel', 'harsh',
    'grim', 'bleak', 'despair', 'anguish', 'torment', 'suffering', 'agony',
    'dread', 'shadow', 'void', 'empty', 'lost', 'broken', 'shattered'
  ]
};

/**
 * Tone Keywords - Emotional tone categories
 */
const TONE_KEYWORDS = {
  aggressive: ['attack', 'fight', 'war', 'battle', 'rage', 'fury', 'strike', 'destroy', 'crush', 'force'],
  calm: ['peace', 'quiet', 'still', 'gentle', 'soft', 'tranquil', 'serene', 'rest', 'breathe', 'float'],
  excited: ['energy', 'rush', 'burst', 'explode', 'lightning', 'spark', 'pulse', 'vibrate', 'surge', 'wild'],
  melancholic: ['lonely', 'sorrow', 'mourn', 'weep', 'fade', 'distant', 'ghost', 'memory', 'echo', 'loss'],
  mystical: ['magic', 'spirit', 'cosmic', 'divine', 'sacred', 'eternal', 'infinite', 'oracle', 'vision', 'dream']
};

/**
 * Mythic Keywords - Trigger myth state transitions
 */
const MYTHIC_KEYWORDS = {
  journey: ['journey', 'path', 'road', 'quest', 'adventure', 'voyage', 'travel', 'wander'],
  transformation: ['transform', 'change', 'become', 'evolve', 'shift', 'morph', 'metamorphosis', 'rebirth'],
  death: ['death', 'end', 'die', 'perish', 'fade', 'vanish', 'cease', 'expire'],
  rebirth: ['rebirth', 'rise', 'phoenix', 'awaken', 'emerge', 'resurrect', 'renew', 'reborn'],
  threshold: ['door', 'gate', 'portal', 'threshold', 'crossing', 'boundary', 'edge', 'border'],
  mentor: ['guide', 'teacher', 'mentor', 'master', 'sage', 'oracle', 'wisdom', 'elder'],
  shadow: ['shadow', 'dark', 'mirror', 'enemy', 'adversary', 'opponent', 'nemesis', 'rival']
};

/**
 * Text Signal Provider
 */
export class TextSignalProvider {
  constructor() {
    this.textBuffer = [];
    this.maxBufferSize = 100; // Keep last 100 words

    // Current signals
    this.signals = {
      sentiment: 0.0,        // -1.0 (negative) to 1.0 (positive)
      sentimentStrength: 0.0, // 0.0 to 1.0 (intensity)
      tone: 'neutral',       // 'aggressive', 'calm', 'excited', etc.
      toneStrength: 0.0,     // 0.0 to 1.0
      rhythm: 0.0,           // 0.0 to 1.0 (word rate)
      wordCount: 0,
      avgWordLength: 0,
      syllableRate: 0,       // Syllables per second
      lastWord: '',
      lastPhrase: '',
      mythicTrigger: null    // Detected mythic keyword category
    };

    // Rhythm tracking
    this.wordTimestamps = [];
    this.maxTimestamps = 20;

    // Signal history for smoothing
    this.sentimentHistory = [];
    this.historySize = 10;

    // Event listeners
    this.listeners = new Map();

    console.log("📝 TextSignalProvider initialized");
  }

  /**
   * Process text input - can be word, phrase, or paragraph
   */
  processText(text) {
    if (!text || text.trim().length === 0) return;

    const timestamp = Date.now();
    const cleanText = text.toLowerCase().trim();
    const words = cleanText.split(/\s+/);

    // Update buffer
    this.textBuffer.push(...words);
    if (this.textBuffer.length > this.maxBufferSize) {
      this.textBuffer = this.textBuffer.slice(-this.maxBufferSize);
    }

    // Track word timing for rhythm
    words.forEach(() => {
      this.wordTimestamps.push(timestamp);
      if (this.wordTimestamps.length > this.maxTimestamps) {
        this.wordTimestamps.shift();
      }
    });

    // Analyze text
    this.analyzeSentiment();
    this.analyzeTone();
    this.analyzeRhythm();
    this.detectMythicKeywords(words);

    // Update basic stats
    this.signals.wordCount = this.textBuffer.length;
    this.signals.avgWordLength = this.textBuffer.reduce((sum, w) => sum + w.length, 0) / this.textBuffer.length;
    this.signals.lastWord = words[words.length - 1];
    this.signals.lastPhrase = text.trim();

    // Emit signal update
    this.emitEvent('signalUpdate', this.signals);

    console.log(`📝 Text processed: "${text}" | Sentiment: ${this.signals.sentiment.toFixed(2)} | Tone: ${this.signals.tone}`);

    return this.signals;
  }

  /**
   * Analyze sentiment using lexicon-based approach
   */
  analyzeSentiment() {
    const recentWords = this.textBuffer.slice(-20); // Last 20 words

    let positiveCount = 0;
    let negativeCount = 0;

    recentWords.forEach(word => {
      if (SENTIMENT_LEXICON.positive.includes(word)) positiveCount++;
      if (SENTIMENT_LEXICON.negative.includes(word)) negativeCount++;
    });

    const totalSentimentWords = positiveCount + negativeCount;

    if (totalSentimentWords > 0) {
      // Calculate sentiment score (-1 to 1)
      const rawSentiment = (positiveCount - negativeCount) / recentWords.length;

      // Add to history for smoothing
      this.sentimentHistory.push(rawSentiment);
      if (this.sentimentHistory.length > this.historySize) {
        this.sentimentHistory.shift();
      }

      // Smooth sentiment with moving average
      const smoothedSentiment = this.sentimentHistory.reduce((a, b) => a + b, 0) / this.sentimentHistory.length;

      this.signals.sentiment = Math.max(-1, Math.min(1, smoothedSentiment * 5)); // Amplify
      this.signals.sentimentStrength = Math.abs(this.signals.sentiment);
    } else {
      // Decay toward neutral
      this.signals.sentiment *= 0.95;
      this.signals.sentimentStrength *= 0.95;
    }
  }

  /**
   * Analyze tone based on keyword categories
   */
  analyzeTone() {
    const recentWords = this.textBuffer.slice(-15);
    const toneScores = {};

    // Count matches for each tone category
    Object.entries(TONE_KEYWORDS).forEach(([tone, keywords]) => {
      const matches = recentWords.filter(word => keywords.includes(word)).length;
      toneScores[tone] = matches;
    });

    // Find dominant tone
    let maxScore = 0;
    let dominantTone = 'neutral';

    Object.entries(toneScores).forEach(([tone, score]) => {
      if (score > maxScore) {
        maxScore = score;
        dominantTone = tone;
      }
    });

    this.signals.tone = dominantTone;
    this.signals.toneStrength = Math.min(1.0, maxScore / 3); // Normalize
  }

  /**
   * Analyze rhythm - word rate and syllable density
   */
  analyzeRhythm() {
    if (this.wordTimestamps.length < 2) {
      this.signals.rhythm = 0;
      this.signals.syllableRate = 0;
      return;
    }

    // Calculate word rate (words per second)
    const timeSpan = (this.wordTimestamps[this.wordTimestamps.length - 1] - this.wordTimestamps[0]) / 1000; // seconds
    const wordRate = this.wordTimestamps.length / timeSpan;

    // Normalize to 0-1 (assuming 0-5 words per second is normal range)
    this.signals.rhythm = Math.min(1.0, wordRate / 5);

    // Estimate syllable rate (rough approximation)
    const recentWords = this.textBuffer.slice(-20);
    const totalSyllables = recentWords.reduce((sum, word) => sum + this.countSyllables(word), 0);
    this.signals.syllableRate = totalSyllables / timeSpan;
  }

  /**
   * Rough syllable counter (heuristic)
   */
  countSyllables(word) {
    if (word.length <= 3) return 1;

    // Count vowel groups
    const vowels = word.match(/[aeiouy]+/gi);
    let count = vowels ? vowels.length : 1;

    // Adjust for silent e
    if (word.endsWith('e')) count--;

    return Math.max(1, count);
  }

  /**
   * Detect mythic keywords for state transitions
   */
  detectMythicKeywords(words) {
    this.signals.mythicTrigger = null;

    words.forEach(word => {
      Object.entries(MYTHIC_KEYWORDS).forEach(([category, keywords]) => {
        if (keywords.includes(word)) {
          this.signals.mythicTrigger = category;
          this.emitEvent('mythicTrigger', { category, word });
          console.log(`📝 Mythic trigger detected: ${category} (${word})`);
        }
      });
    });
  }

  /**
   * Clear text buffer
   */
  clear() {
    this.textBuffer = [];
    this.wordTimestamps = [];
    this.sentimentHistory = [];
    this.signals = {
      sentiment: 0.0,
      sentimentStrength: 0.0,
      tone: 'neutral',
      toneStrength: 0.0,
      rhythm: 0.0,
      wordCount: 0,
      avgWordLength: 0,
      syllableRate: 0,
      lastWord: '',
      lastPhrase: '',
      mythicTrigger: null
    };
    this.emitEvent('cleared', {});
  }

  /**
   * Get current signals
   */
  getSignals() {
    return { ...this.signals };
  }

  /**
   * Get signal value by name (for signal router integration)
   */
  getSignal(name) {
    return this.signals[name] !== undefined ? this.signals[name] : 0;
  }

  /**
   * Event system
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  emitEvent(event, data) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event).forEach(callback => {
      try {
        callback(data);
      } catch (err) {
        console.error(`📝 Event callback error (${event}):`, err);
      }
    });
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    return {
      bufferSize: this.textBuffer.length,
      recentText: this.textBuffer.slice(-10).join(' '),
      signals: this.signals,
      wordRate: this.wordTimestamps.length > 1
        ? (this.wordTimestamps.length / ((this.wordTimestamps[this.wordTimestamps.length - 1] - this.wordTimestamps[0]) / 1000)).toFixed(2)
        : 0
    };
  }
}

/**
 * Text Signal Bindings - Map text signals to visual parameters
 */
export class TextSignalBindings {
  constructor(textProvider) {
    this.textProvider = textProvider;
    this.bindings = [];
    this.enabled = true;

    console.log("📝 TextSignalBindings initialized");
  }

  /**
   * Bind sentiment to vessel morph weights
   * Positive sentiment → sphere, Negative → dodecahedron
   */
  bindSentimentToVessel(vessel) {
    const binding = {
      name: 'Sentiment → Vessel Morph',
      update: () => {
        if (!this.enabled) return;

        const sentiment = this.textProvider.getSignal('sentiment');
        const strength = this.textProvider.getSignal('sentimentStrength');

        if (sentiment > 0) {
          // Positive: shift toward sphere (smooth, unified)
          vessel.morphWeights.sphere = 0.5 + (sentiment * 0.5);
          vessel.morphWeights.dodecahedron = Math.max(0, 0.3 - (sentiment * 0.3));
        } else {
          // Negative: shift toward dodecahedron (complex, fragmented)
          vessel.morphWeights.dodecahedron = 0.5 + (Math.abs(sentiment) * 0.5);
          vessel.morphWeights.sphere = Math.max(0, 0.3 - (Math.abs(sentiment) * 0.3));
        }

        vessel.normalizeWeights();
      }
    };

    this.bindings.push(binding);
    this.textProvider.on('signalUpdate', binding.update);
    console.log("📝 Bound sentiment → vessel morph");
  }

  /**
   * Bind sentiment to color palette
   */
  bindSentimentToColor(colorSystem) {
    const binding = {
      name: 'Sentiment → Color',
      update: () => {
        if (!this.enabled) return;

        const sentiment = this.textProvider.getSignal('sentiment');

        if (sentiment > 0.3) {
          // Positive: warm, bright colors
          colorSystem.setMainColor('#FFD700'); // Gold
          colorSystem.setAccentColor('#FF6B6B'); // Coral
        } else if (sentiment < -0.3) {
          // Negative: cool, dark colors
          colorSystem.setMainColor('#1E3A8A'); // Deep blue
          colorSystem.setAccentColor('#6B21A8'); // Purple
        } else {
          // Neutral: balanced colors
          colorSystem.setMainColor('#10B981'); // Teal
          colorSystem.setAccentColor('#8B5CF6'); // Violet
        }
      }
    };

    this.bindings.push(binding);
    this.textProvider.on('signalUpdate', binding.update);
    console.log("📝 Bound sentiment → color");
  }

  /**
   * Bind rhythm to particle behavior
   */
  bindRhythmToParticles(particles) {
    const binding = {
      name: 'Rhythm → Particles',
      update: () => {
        if (!this.enabled || !particles) return;

        const rhythm = this.textProvider.getSignal('rhythm');
        const syllableRate = this.textProvider.getSignal('syllableRate');

        // Higher rhythm = more particle velocity
        if (particles.setSpeed) {
          particles.setSpeed(0.5 + rhythm * 2.0);
        }

        // Syllable rate affects particle emission
        if (particles.emissionRate) {
          particles.emissionRate = 10 + (syllableRate * 20);
        }
      }
    };

    this.bindings.push(binding);
    this.textProvider.on('signalUpdate', binding.update);
    console.log("📝 Bound rhythm → particles");
  }

  /**
   * Bind tone to glyph states
   */
  bindToneToGlyphs(glyphRenderer) {
    const toneGlyphMap = {
      aggressive: '⚔️',
      calm: '☮️',
      excited: '⚡',
      melancholic: '🌙',
      mystical: '✨',
      neutral: '◯'
    };

    const binding = {
      name: 'Tone → Glyphs',
      update: () => {
        if (!this.enabled || !glyphRenderer) return;

        const tone = this.textProvider.getSignal('tone');
        const toneStrength = this.textProvider.getSignal('toneStrength');

        if (toneStrength > 0.3) {
          const glyph = toneGlyphMap[tone] || '◯';

          // Update active glyphs
          if (glyphRenderer.setActiveGlyph) {
            glyphRenderer.setActiveGlyph(glyph);
          }
        }
      }
    };

    this.bindings.push(binding);
    this.textProvider.on('signalUpdate', binding.update);
    console.log("📝 Bound tone → glyphs");
  }

  /**
   * Bind mythic triggers to myth state transitions
   */
  bindMythicToStateTransitions(mythCompiler) {
    const binding = {
      name: 'Mythic Keywords → Myth State',
      update: () => {
        if (!this.enabled || !mythCompiler) return;

        const trigger = this.textProvider.getSignal('mythicTrigger');

        if (trigger) {
          // Find appropriate myth node based on trigger category
          // This would need mythCompiler to expose navigation methods
          console.log(`📝 Triggering myth transition: ${trigger}`);

          if (mythCompiler.navigateByKeyword) {
            mythCompiler.navigateByKeyword(trigger);
          }
        }
      }
    };

    this.bindings.push(binding);
    this.textProvider.on('mythicTrigger', binding.update);
    console.log("📝 Bound mythic keywords → myth state");
  }

  /**
   * Enable/disable all bindings
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    console.log(`📝 Text signal bindings ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Remove all bindings
   */
  clearBindings() {
    this.bindings.forEach(binding => {
      if (binding.update) {
        this.textProvider.off('signalUpdate', binding.update);
      }
    });
    this.bindings = [];
    console.log("📝 Text signal bindings cleared");
  }
}

console.log("📝 Text Signal Provider ready");
