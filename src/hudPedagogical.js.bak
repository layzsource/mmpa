// src/hudPedagogical.js
// HUD interface for Pedagogical Mode
// Interactive learning interface for music, geometry, and myth

console.log("📚 hudPedagogical.js loaded");

/**
 * Create Pedagogical HUD section
 */
export function createPedagogicalHUD(container) {
  const section = document.createElement('div');
  section.className = 'hud-section pedagogical-layer';
  section.style.maxWidth = '480px';

  const title = document.createElement('h3');
  title.textContent = '📚 Pedagogical Mode';
  section.appendChild(title);

  const intro = document.createElement('p');
  intro.textContent = 'Interactive lessons teaching music theory, geometry, and mythic structure through visual and auditory experience';
  intro.style.cssText = `
    font-size: 11px;
    margin-bottom: 12px;
    opacity: 0.8;
  `;
  section.appendChild(intro);

  // === LESSON LIBRARY ===
  const librarySection = document.createElement('div');
  librarySection.style.marginBottom = '16px';

  const libraryTitle = document.createElement('h4');
  libraryTitle.textContent = 'Lesson Library';
  libraryTitle.style.fontSize = '13px';
  libraryTitle.style.marginBottom = '8px';
  librarySection.appendChild(libraryTitle);

  // Category filter
  const categoryFilter = document.createElement('div');
  categoryFilter.style.cssText = `
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
  `;

  const categories = ['all', 'music', 'geometry', 'myth'];
  let selectedCategory = 'all';

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    btn.style.cssText = `
      flex: 1;
      padding: 4px 8px;
      font-size: 10px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      background: ${cat === 'all' ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
      color: white;
      cursor: pointer;
      border-radius: 4px;
    `;
    btn.addEventListener('click', () => {
      selectedCategory = cat;
      // Update all category buttons
      categoryFilter.querySelectorAll('button').forEach(b => {
        b.style.background = 'transparent';
      });
      btn.style.background = 'rgba(255, 255, 255, 0.2)';
      refreshLessonLibrary();
    });
    categoryFilter.appendChild(btn);
  });
  librarySection.appendChild(categoryFilter);

  // Lesson selector
  const lessonSelect = document.createElement('select');
  lessonSelect.size = 6;
  lessonSelect.style.width = '100%';
  lessonSelect.style.marginBottom = '8px';
  lessonSelect.style.fontFamily = 'monospace';
  lessonSelect.style.fontSize = '11px';
  librarySection.appendChild(lessonSelect);

  // Lesson info display
  const lessonInfoDisplay = document.createElement('div');
  lessonInfoDisplay.style.cssText = `
    background: rgba(0, 0, 0, 0.5);
    padding: 8px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 10px;
    margin-bottom: 8px;
    min-height: 60px;
  `;
  lessonInfoDisplay.textContent = 'Select a lesson to see details';
  librarySection.appendChild(lessonInfoDisplay);

  lessonSelect.addEventListener('change', () => {
    const selectedId = lessonSelect.value;
    if (!selectedId || !window.pedagogicalSystem) return;

    const lesson = window.pedagogicalSystem.getLibrary().getLesson(selectedId);
    if (lesson) {
      lessonInfoDisplay.innerHTML = `
        <div><strong>${lesson.name}</strong></div>
        <div style="opacity: 0.8; margin-top: 4px;">${lesson.description}</div>
        <div style="margin-top: 4px; opacity: 0.7;">
          Difficulty: ${'⭐'.repeat(lesson.difficulty)} • ${lesson.estimatedTime} min • ${lesson.steps.size} steps
        </div>
        <div style="margin-top: 4px; opacity: 0.7;">
          Category: ${lesson.category}
        </div>
      `;
    }
  });

  function refreshLessonLibrary() {
    if (!window.pedagogicalSystem) return;

    const library = window.pedagogicalSystem.getLibrary();
    let lessons;

    if (selectedCategory === 'all') {
      lessons = library.getAllLessons();
    } else {
      lessons = library.getLessonsByCategory(selectedCategory);
    }

    lessonSelect.innerHTML = '';

    if (lessons.length === 0) {
      const option = document.createElement('option');
      option.textContent = '(no lessons loaded)';
      option.disabled = true;
      lessonSelect.appendChild(option);
      return;
    }

    lessons.forEach(lesson => {
      const option = document.createElement('option');
      option.value = lesson.id;
      const difficulty = '⭐'.repeat(lesson.difficulty);
      option.textContent = `${lesson.name} ${difficulty} (${lesson.steps.size} steps)`;
      lessonSelect.appendChild(option);
    });
  }

  // Load library button grid
  const libraryButtons = document.createElement('div');
  libraryButtons.style.display = 'grid';
  libraryButtons.style.gridTemplateColumns = '1fr 1fr';
  libraryButtons.style.gap = '8px';
  libraryButtons.style.marginBottom = '12px';

  const loadExamplesButton = document.createElement('button');
  loadExamplesButton.textContent = '📚 Load Examples';
  loadExamplesButton.style.padding = '6px';
  loadExamplesButton.style.fontSize = '11px';
  loadExamplesButton.addEventListener('click', async () => {
    if (!window.pedagogicalSystem) return;

    const { getAllExampleLessons } = await import('./pedagogicalLessons.js');
    const examples = getAllExampleLessons();

    examples.forEach(lesson => {
      window.pedagogicalSystem.getLibrary().addLesson(lesson);
    });

    refreshLessonLibrary();
    alert(`Loaded ${examples.length} example lessons`);
  });
  libraryButtons.appendChild(loadExamplesButton);

  const importButton = document.createElement('button');
  importButton.textContent = '⬆ Import JSON';
  importButton.style.padding = '6px';
  importButton.style.fontSize = '11px';
  importButton.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      if (window.pedagogicalSystem && e.target.files[0]) {
        try {
          await window.pedagogicalSystem.loadLessonFromFile(e.target.files[0]);
          refreshLessonLibrary();
        } catch (err) {
          alert(`Error importing lesson: ${err.message}`);
        }
      }
    };
    input.click();
  });
  libraryButtons.appendChild(importButton);

  librarySection.appendChild(libraryButtons);
  section.appendChild(librarySection);

  // === CURRENT LESSON ===
  const currentLessonSection = document.createElement('div');
  currentLessonSection.style.marginBottom = '16px';

  const currentLessonTitle = document.createElement('h4');
  currentLessonTitle.textContent = 'Current Lesson';
  currentLessonTitle.style.fontSize = '13px';
  currentLessonTitle.style.marginBottom = '8px';
  currentLessonSection.appendChild(currentLessonTitle);

  // Start lesson button
  const startButton = document.createElement('button');
  startButton.textContent = '🚀 Start Lesson';
  startButton.style.cssText = `
    width: 100%;
    padding: 8px;
    background: #4169E1;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    margin-bottom: 8px;
  `;
  startButton.addEventListener('click', () => {
    const selectedId = lessonSelect.value;
    if (!selectedId || !window.pedagogicalSystem) return;

    const step = window.pedagogicalSystem.startLesson(selectedId);
    if (step) {
      updateStepDisplay();
    }
  });
  currentLessonSection.appendChild(startButton);

  // Progress bar
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
  `;
  const progressFill = document.createElement('div');
  progressFill.id = 'lesson-progress';
  progressFill.style.cssText = `
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #4169E1, #32CD32);
    transition: width 0.3s ease;
  `;
  progressBar.appendChild(progressFill);
  currentLessonSection.appendChild(progressBar);

  section.appendChild(currentLessonSection);

  // === LESSON STEP ===
  const stepSection = document.createElement('div');
  stepSection.style.marginBottom = '16px';

  const stepTitle = document.createElement('h4');
  stepTitle.textContent = 'Current Step';
  stepTitle.style.fontSize = '13px';
  stepTitle.style.marginBottom = '8px';
  stepSection.appendChild(stepTitle);

  // Step display
  const stepDisplay = document.createElement('div');
  stepDisplay.id = 'step-display';
  stepDisplay.style.cssText = `
    background: rgba(255, 255, 255, 0.1);
    padding: 12px;
    border-radius: 4px;
    font-size: 12px;
    margin-bottom: 12px;
    min-height: 120px;
  `;
  stepDisplay.innerHTML = '<div style="opacity: 0.6;">No lesson in progress</div>';
  stepSection.appendChild(stepDisplay);

  // Step controls
  const stepControls = document.createElement('div');
  stepControls.style.display = 'grid';
  stepControls.style.gridTemplateColumns = '1fr 2fr 1fr';
  stepControls.style.gap = '8px';
  stepControls.style.marginBottom = '12px';

  const previousButton = document.createElement('button');
  previousButton.textContent = '← Back';
  previousButton.style.padding = '8px';
  previousButton.style.fontSize = '11px';
  previousButton.addEventListener('click', () => {
    if (window.pedagogicalSystem) {
      window.pedagogicalSystem.previousStep();
      updateStepDisplay();
    }
  });
  stepControls.appendChild(previousButton);

  const hintButton = document.createElement('button');
  hintButton.textContent = '💡 Show Hint';
  hintButton.style.cssText = `
    padding: 8px;
    font-size: 11px;
    background: #FFD700;
    color: #000;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;
  hintButton.addEventListener('click', () => {
    const step = window.pedagogicalSystem?.getCurrentStep();
    if (step && step.hints && step.hints.length > 0) {
      const lesson = window.pedagogicalSystem.getCurrentLesson();
      const hintIndex = lesson.hintsUsed % step.hints.length;
      alert(step.hints[hintIndex]);
      lesson.hintsUsed++;
    } else {
      alert('No hints available for this step');
    }
  });
  stepControls.appendChild(hintButton);

  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next →';
  nextButton.style.padding = '8px';
  nextButton.style.fontSize = '11px';
  nextButton.addEventListener('click', () => {
    if (window.pedagogicalSystem) {
      const step = window.pedagogicalSystem.nextStep();
      if (!step) {
        // Lesson complete
        alert('Lesson Complete! 🎉');
      }
      updateStepDisplay();
    }
  });
  stepControls.appendChild(nextButton);

  stepSection.appendChild(stepControls);
  section.appendChild(stepSection);

  // === PROGRESS TRACKING ===
  const progressSection = document.createElement('div');
  progressSection.style.marginBottom = '16px';

  const progressTitle = document.createElement('h4');
  progressTitle.textContent = 'Your Progress';
  progressTitle.style.fontSize = '13px';
  progressTitle.style.marginBottom = '8px';
  progressSection.appendChild(progressTitle);

  const progressDisplay = document.createElement('div');
  progressDisplay.id = 'progress-display';
  progressDisplay.style.cssText = `
    background: rgba(0, 0, 0, 0.5);
    padding: 8px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 10px;
    margin-bottom: 8px;
  `;
  updateProgressDisplay();
  progressSection.appendChild(progressDisplay);

  function updateProgressDisplay() {
    if (!window.pedagogicalSystem) return;

    const progress = window.pedagogicalSystem.getProgress();
    const completedCount = progress.completedLessons.size;
    const totalTime = Math.floor(progress.totalTime / 60); // minutes

    progressDisplay.innerHTML = `
      <div><strong>📊 Learning Statistics</strong></div>
      <div style="margin-top: 4px;">Lessons Completed: ${completedCount}</div>
      <div>Total Study Time: ${totalTime} minutes</div>
      <div>Achievements: ${progress.achievements.size}</div>
    `;
  }

  section.appendChild(progressSection);

  // === EXPORT/SAVE ===
  const exportSection = document.createElement('div');
  exportSection.style.marginBottom = '16px';

  const exportButtons = document.createElement('div');
  exportButtons.style.display = 'grid';
  exportButtons.style.gridTemplateColumns = '1fr 1fr';
  exportButtons.style.gap = '8px';

  const exportLessonButton = document.createElement('button');
  exportLessonButton.textContent = '⬇ Export Lesson';
  exportLessonButton.style.padding = '6px';
  exportLessonButton.style.fontSize = '11px';
  exportLessonButton.addEventListener('click', () => {
    const lesson = window.pedagogicalSystem?.getCurrentLesson();
    if (lesson) {
      lesson.export();
    } else {
      alert('No lesson in progress to export');
    }
  });
  exportButtons.appendChild(exportLessonButton);

  const saveLibraryButton = document.createElement('button');
  saveLibraryButton.textContent = '💾 Save Progress';
  saveLibraryButton.style.padding = '6px';
  saveLibraryButton.style.fontSize = '11px';
  saveLibraryButton.addEventListener('click', () => {
    if (window.pedagogicalSystem) {
      window.pedagogicalSystem.saveLibrary();
      alert('Progress saved to localStorage');
    }
  });
  exportButtons.appendChild(saveLibraryButton);

  exportSection.appendChild(exportButtons);
  section.appendChild(exportSection);

  // === UPDATE FUNCTIONS ===
  function updateStepDisplay() {
    if (!window.pedagogicalSystem) return;

    const lesson = window.pedagogicalSystem.getCurrentLesson();
    const step = window.pedagogicalSystem.getCurrentStep();

    // Update progress bar
    if (lesson) {
      const progress = lesson.getProgress();
      progressFill.style.width = (progress * 100).toFixed(1) + '%';
    }

    if (!step) {
      stepDisplay.innerHTML = '<div style="opacity: 0.6;">No lesson in progress</div>';
      return;
    }

    const typeEmoji = {
      explanation: '📖',
      demonstration: '👁️',
      interaction: '🎮',
      quiz: '❓',
      practice: '✏️'
    }[step.type] || '📝';

    stepDisplay.innerHTML = `
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">
        ${typeEmoji} ${step.title}
      </div>
      <div style="opacity: 0.9; line-height: 1.4;">
        ${step.content}
      </div>
      <div style="margin-top: 8px; opacity: 0.7; font-size: 9px;">
        Type: ${step.type} ${step.hints.length > 0 ? `• ${step.hints.length} hints available` : ''}
      </div>
    `;

    updateProgressDisplay();
  }

  // Listen for pedagogical system events
  if (window.pedagogicalSystem) {
    window.pedagogicalSystem.onStepChange(() => {
      updateStepDisplay();
    });

    window.pedagogicalSystem.onLessonComplete((lesson) => {
      updateProgressDisplay();
      alert(`🎉 Lesson Complete!\n\n${lesson.name}\n\nScore: ${lesson.score}\nTime: ${lesson.getDuration()}s`);
    });
  }

  // Auto-refresh library on load
  refreshLessonLibrary();

  container.appendChild(section);
  console.log("📚 Pedagogical HUD created");
}

console.log("📚 Pedagogical HUD system ready");
