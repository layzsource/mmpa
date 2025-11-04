// src/pedagogicalCore.js
// Pedagogical Mode - Interactive learning system
// Structured lessons for music theory, geometry, and mythic structure

console.log("📚 pedagogicalCore.js loaded");

/**
 * Learning objective - individual skill or concept
 */
export class LearningObjective {
  constructor(config = {}) {
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;
    this.category = config.category; // 'music' | 'geometry' | 'myth' | 'visual'
    this.difficulty = config.difficulty || 1; // 1-5
    this.prerequisites = config.prerequisites || []; // Other objective IDs
    this.tags = config.tags || [];
  }
}

/**
 * Interactive lesson step
 */
export class LessonStep {
  constructor(config = {}) {
    this.id = config.id;
    this.type = config.type; // 'explanation' | 'demonstration' | 'interaction' | 'quiz' | 'practice'
    this.title = config.title;
    this.content = config.content; // Text content or instructions
    this.visualState = config.visualState; // Visual configuration for this step
    this.presetName = config.presetName; // Or reference preset
    this.destinationId = config.destinationId; // Or reference destination
    this.mythNodeId = config.mythNodeId; // Or reference myth node

    // Interactive elements
    this.interaction = config.interaction; // { type, target, validation }
    this.hints = config.hints || [];
    this.successCriteria = config.successCriteria; // Function or criteria object

    // Audio/visual cues
    this.highlightElements = config.highlightElements || []; // ['morph.sphere', 'audio.frequency']
    this.audioExample = config.audioExample; // Audio demonstration

    // Navigation
    this.nextStep = config.nextStep;
    this.previousStep = config.previousStep;
    this.branchSteps = config.branchSteps || {}; // Conditional branching
  }
}

/**
 * Complete lesson with progression
 */
export class Lesson {
  constructor(config = {}) {
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;
    this.category = config.category; // 'music' | 'geometry' | 'myth'
    this.difficulty = config.difficulty || 1;
    this.objectives = config.objectives || []; // LearningObjective IDs
    this.estimatedTime = config.estimatedTime || 10; // minutes
    this.author = config.author || 'System';
    this.tags = config.tags || [];

    // Lesson structure
    this.steps = new Map(); // stepId -> LessonStep
    this.startStepId = config.startStepId;
    this.currentStepId = null;
    this.completedSteps = new Set();

    // Progress tracking
    this.attempts = 0;
    this.hintsUsed = 0;
    this.startTime = null;
    this.endTime = null;
    this.score = 0;
  }

  addStep(step) {
    this.steps.set(step.id, step);
  }

  getStep(stepId) {
    return this.steps.get(stepId);
  }

  getCurrentStep() {
    if (!this.currentStepId) return null;
    return this.steps.get(this.currentStepId);
  }

  startLesson() {
    this.currentStepId = this.startStepId;
    this.startTime = Date.now();
    this.completedSteps.clear();
    this.attempts = 0;
    this.hintsUsed = 0;
    this.score = 0;
    return this.getCurrentStep();
  }

  nextStep() {
    const current = this.getCurrentStep();
    if (!current) return null;

    this.completedSteps.add(this.currentStepId);

    if (current.nextStep) {
      this.currentStepId = current.nextStep;
      return this.getCurrentStep();
    }

    // Lesson complete
    this.endTime = Date.now();
    return null;
  }

  previousStep() {
    const current = this.getCurrentStep();
    if (!current || !current.previousStep) return null;

    this.currentStepId = current.previousStep;
    return this.getCurrentStep();
  }

  branchTo(branchId) {
    const current = this.getCurrentStep();
    if (!current || !current.branchSteps[branchId]) return null;

    this.currentStepId = current.branchSteps[branchId];
    return this.getCurrentStep();
  }

  getProgress() {
    if (this.steps.size === 0) return 0;
    return this.completedSteps.size / this.steps.size;
  }

  getDuration() {
    if (!this.startTime) return 0;
    const end = this.endTime || Date.now();
    return Math.floor((end - this.startTime) / 1000); // seconds
  }

  isComplete() {
    return this.completedSteps.size === this.steps.size;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      category: this.category,
      difficulty: this.difficulty,
      objectives: this.objectives,
      estimatedTime: this.estimatedTime,
      author: this.author,
      tags: this.tags,
      steps: Array.from(this.steps.values()).map(step => ({
        id: step.id,
        type: step.type,
        title: step.title,
        content: step.content,
        visualState: step.visualState,
        presetName: step.presetName,
        destinationId: step.destinationId,
        mythNodeId: step.mythNodeId,
        interaction: step.interaction,
        hints: step.hints,
        highlightElements: step.highlightElements,
        nextStep: step.nextStep,
        previousStep: step.previousStep,
        branchSteps: step.branchSteps
      })),
      startStepId: this.startStepId
    };
  }

  static fromJSON(data) {
    const lesson = new Lesson({
      id: data.id,
      name: data.name,
      description: data.description,
      category: data.category,
      difficulty: data.difficulty,
      objectives: data.objectives,
      estimatedTime: data.estimatedTime,
      author: data.author,
      tags: data.tags,
      startStepId: data.startStepId
    });

    if (data.steps) {
      data.steps.forEach(stepData => {
        const step = new LessonStep(stepData);
        lesson.addStep(step);
      });
    }

    return lesson;
  }

  export() {
    const json = JSON.stringify(this.toJSON(), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lesson_${this.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

/**
 * Student progress tracking
 */
export class StudentProgress {
  constructor() {
    this.completedObjectives = new Set();
    this.completedLessons = new Map(); // lessonId -> { score, duration, date }
    this.currentStreak = 0;
    this.totalTime = 0; // seconds
    this.achievements = new Set();
  }

  completeObjective(objectiveId) {
    this.completedObjectives.add(objectiveId);
  }

  completeLesson(lesson) {
    this.completedLessons.set(lesson.id, {
      score: lesson.score,
      duration: lesson.getDuration(),
      date: Date.now(),
      attempts: lesson.attempts,
      hintsUsed: lesson.hintsUsed
    });

    this.totalTime += lesson.getDuration();

    // Update objectives
    lesson.objectives.forEach(objId => this.completeObjective(objId));

    // Check achievements
    this.checkAchievements();
  }

  hasCompleted(lessonId) {
    return this.completedLessons.has(lessonId);
  }

  canAccess(lesson) {
    // Check if prerequisites are met
    return lesson.objectives.every(objId => {
      const obj = window.pedagogicalSystem?.getObjective(objId);
      if (!obj) return true;
      return obj.prerequisites.every(prereqId =>
        this.completedObjectives.has(prereqId)
      );
    });
  }

  checkAchievements() {
    // First lesson
    if (this.completedLessons.size === 1) {
      this.achievements.add('first_steps');
    }

    // Complete 10 lessons
    if (this.completedLessons.size >= 10) {
      this.achievements.add('dedicated_student');
    }

    // Complete 50 lessons
    if (this.completedLessons.size >= 50) {
      this.achievements.add('master_learner');
    }

    // 1 hour of study
    if (this.totalTime >= 3600) {
      this.achievements.add('focused');
    }
  }

  saveToStorage() {
    const data = {
      completedObjectives: Array.from(this.completedObjectives),
      completedLessons: Array.from(this.completedLessons.entries()),
      currentStreak: this.currentStreak,
      totalTime: this.totalTime,
      achievements: Array.from(this.achievements)
    };
    localStorage.setItem('pedagogical_progress', JSON.stringify(data));
  }

  loadFromStorage() {
    const stored = localStorage.getItem('pedagogical_progress');
    if (!stored) return;

    try {
      const data = JSON.parse(stored);
      this.completedObjectives = new Set(data.completedObjectives || []);
      this.completedLessons = new Map(data.completedLessons || []);
      this.currentStreak = data.currentStreak || 0;
      this.totalTime = data.totalTime || 0;
      this.achievements = new Set(data.achievements || []);
    } catch (err) {
      console.error("Error loading pedagogical progress:", err);
    }
  }
}

/**
 * Lesson library and curriculum management
 */
export class LessonLibrary {
  constructor() {
    this.lessons = new Map(); // lessonId -> Lesson
    this.objectives = new Map(); // objectiveId -> LearningObjective
    this.categories = new Map(); // category -> Set<lessonId>
  }

  addLesson(lesson) {
    this.lessons.set(lesson.id, lesson);

    // Index by category
    if (!this.categories.has(lesson.category)) {
      this.categories.set(lesson.category, new Set());
    }
    this.categories.get(lesson.category).add(lesson.id);
  }

  getLesson(lessonId) {
    return this.lessons.get(lessonId);
  }

  getAllLessons() {
    return Array.from(this.lessons.values());
  }

  getLessonsByCategory(category) {
    const lessonIds = this.categories.get(category);
    if (!lessonIds) return [];
    return Array.from(lessonIds).map(id => this.lessons.get(id));
  }

  getLessonsByDifficulty(difficulty) {
    return this.getAllLessons().filter(lesson => lesson.difficulty === difficulty);
  }

  searchLessons(query) {
    const q = query.toLowerCase();
    return this.getAllLessons().filter(lesson =>
      lesson.name.toLowerCase().includes(q) ||
      lesson.description.toLowerCase().includes(q) ||
      lesson.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }

  addObjective(objective) {
    this.objectives.set(objective.id, objective);
  }

  getObjective(objectiveId) {
    return this.objectives.get(objectiveId);
  }

  saveToStorage() {
    const data = {
      lessons: Array.from(this.lessons.values()).map(lesson => lesson.toJSON())
    };
    localStorage.setItem('pedagogical_library', JSON.stringify(data));
  }

  loadFromStorage() {
    const stored = localStorage.getItem('pedagogical_library');
    if (!stored) return;

    try {
      const data = JSON.parse(stored);
      if (data.lessons) {
        data.lessons.forEach(lessonData => {
          const lesson = Lesson.fromJSON(lessonData);
          this.addLesson(lesson);
        });
      }
    } catch (err) {
      console.error("Error loading pedagogical library:", err);
    }
  }
}

/**
 * Main pedagogical system
 */
export class PedagogicalSystem {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.library = new LessonLibrary();
    this.progress = new StudentProgress();
    this.currentLesson = null;
    this.listeners = [];

    // System integrations
    this.presetSystem = null;
    this.destinationSystem = null;
    this.mythCompiler = null;
    this.signalRouter = null;
  }

  setPresetSystem(presetSystem) {
    this.presetSystem = presetSystem;
  }

  setDestinationSystem(destinationSystem) {
    this.destinationSystem = destinationSystem;
  }

  setMythCompiler(mythCompiler) {
    this.mythCompiler = mythCompiler;
  }

  setSignalRouter(signalRouter) {
    this.signalRouter = signalRouter;
  }

  loadLibrary() {
    this.library.loadFromStorage();
    this.progress.loadFromStorage();
  }

  saveLibrary() {
    this.library.saveToStorage();
    this.progress.saveToStorage();
  }

  getLibrary() {
    return this.library;
  }

  getProgress() {
    return this.progress;
  }

  getObjective(objectiveId) {
    return this.library.getObjective(objectiveId);
  }

  startLesson(lessonId) {
    const lesson = this.library.getLesson(lessonId);
    if (!lesson) {
      console.error(`Lesson ${lessonId} not found`);
      return null;
    }

    if (!this.progress.canAccess(lesson)) {
      console.warn(`Prerequisites not met for lesson ${lessonId}`);
      return null;
    }

    this.currentLesson = lesson;
    const step = lesson.startLesson();
    this.applyStepState(step);
    this.emitStepChange(step, lesson);
    return step;
  }

  nextStep() {
    if (!this.currentLesson) return null;
    const step = this.currentLesson.nextStep();

    if (!step) {
      // Lesson complete
      this.completeLesson();
      return null;
    }

    this.applyStepState(step);
    this.emitStepChange(step, this.currentLesson);
    return step;
  }

  previousStep() {
    if (!this.currentLesson) return null;
    const step = this.currentLesson.previousStep();
    this.applyStepState(step);
    this.emitStepChange(step, this.currentLesson);
    return step;
  }

  branchTo(branchId) {
    if (!this.currentLesson) return null;
    const step = this.currentLesson.branchTo(branchId);
    this.applyStepState(step);
    this.emitStepChange(step, this.currentLesson);
    return step;
  }

  completeLesson() {
    if (!this.currentLesson) return;

    this.progress.completeLesson(this.currentLesson);
    this.emitLessonComplete(this.currentLesson);
    this.saveLibrary();
  }

  applyStepState(step) {
    if (!step) return;

    // Apply visual state
    if (step.visualState) {
      this.applyVisualState(step.visualState);
    } else if (step.presetName && this.presetSystem) {
      const preset = this.presetSystem.getPreset?.(step.presetName);
      if (preset) this.applyVisualState(preset);
    } else if (step.destinationId && this.destinationSystem) {
      const destination = this.destinationSystem.getDestination?.(step.destinationId);
      if (destination && window.destinationNavigator) {
        window.destinationNavigator.navigateTo(destination);
      }
    } else if (step.mythNodeId && this.mythCompiler) {
      this.mythCompiler.navigateToNode(step.mythNodeId);
    }
  }

  applyVisualState(visualState) {
    // Apply to global state (same as mythCompiler)
    if (!window.state) return;

    const state = window.state;
    if (visualState.morphWeights) {
      Object.assign(state.morphWeights, visualState.morphWeights);
    }
    if (visualState.rotation !== undefined) {
      state.rotation = visualState.rotation;
    }
    if (visualState.scale !== undefined) {
      state.scale = visualState.scale;
    }
    // ... additional state properties
  }

  getCurrentLesson() {
    return this.currentLesson;
  }

  getCurrentStep() {
    return this.currentLesson?.getCurrentStep();
  }

  // Event system
  onStepChange(callback) {
    this.listeners.push({ type: 'step', callback });
  }

  onLessonComplete(callback) {
    this.listeners.push({ type: 'complete', callback });
  }

  emitStepChange(step, lesson) {
    this.listeners
      .filter(l => l.type === 'step')
      .forEach(l => l.callback(step, lesson));
  }

  emitLessonComplete(lesson) {
    this.listeners
      .filter(l => l.type === 'complete')
      .forEach(l => l.callback(lesson));
  }

  // File import
  async loadLessonFromFile(file) {
    const text = await file.text();
    const data = JSON.parse(text);
    const lesson = Lesson.fromJSON(data);
    this.library.addLesson(lesson);
    this.saveLibrary();
    return lesson;
  }
}

console.log("📚 Pedagogical core system ready");
