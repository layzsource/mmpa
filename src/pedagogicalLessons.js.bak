// src/pedagogicalLessons.js
// Example lessons for pedagogical mode
// Music theory, geometry, and mythic structure

import { Lesson, LessonStep, LearningObjective } from './pedagogicalCore.js';

console.log("📚 pedagogicalLessons.js loaded");

// ========================================
// MUSIC THEORY LESSONS
// ========================================

/**
 * Lesson: Introduction to Musical Intervals
 */
export function createIntervalsLesson() {
  const lesson = new Lesson({
    id: 'music_intervals_intro',
    name: 'Musical Intervals',
    description: 'Learn the relationship between musical notes through visual morphing',
    category: 'music',
    difficulty: 1,
    estimatedTime: 15,
    tags: ['music theory', 'intervals', 'harmony']
  });

  // Step 1: Introduction
  const intro = new LessonStep({
    id: 'intro',
    type: 'explanation',
    title: 'What are Musical Intervals?',
    content: 'Musical intervals are the distance between two notes. They form the foundation of melody and harmony. Watch as the geometry transforms to represent different intervals.',
    visualState: {
      morphWeights: { sphere: 1.0 },
      rotation: 0.2
    },
    nextStep: 'unison'
  });

  // Step 2: Unison (0 semitones)
  const unison = new LessonStep({
    id: 'unison',
    type: 'demonstration',
    title: 'Unison - Two Notes, Same Pitch',
    content: 'Unison means playing the same note. The geometry is perfectly spherical, representing unity and oneness.',
    visualState: {
      morphWeights: { sphere: 1.0 },
      rotation: 0
    },
    highlightElements: ['audio.frequency'],
    previousStep: 'intro',
    nextStep: 'minor_third'
  });

  // Step 3: Minor Third (3 semitones)
  const minorThird = new LessonStep({
    id: 'minor_third',
    type: 'demonstration',
    title: 'Minor Third - The Sound of Melancholy',
    content: 'A minor third interval (3 semitones) creates a sad or contemplative feeling. Watch the geometry shift to a more angular, introspective form.',
    visualState: {
      morphWeights: { sphere: 0.3, cube: 0.7 },
      rotation: 0.3
    },
    highlightElements: ['morph.cube', 'audio.frequency'],
    previousStep: 'unison',
    nextStep: 'major_third'
  });

  // Step 4: Major Third (4 semitones)
  const majorThird = new LessonStep({
    id: 'major_third',
    type: 'demonstration',
    title: 'Major Third - The Sound of Joy',
    content: 'A major third interval (4 semitones) sounds bright and happy. The geometry becomes more expansive and radiant.',
    visualState: {
      morphWeights: { sphere: 0.6, octahedron: 0.4 },
      rotation: 0.4,
      scale: 1.2
    },
    highlightElements: ['morph.octahedron', 'audio.frequency'],
    previousStep: 'minor_third',
    nextStep: 'perfect_fifth'
  });

  // Step 5: Perfect Fifth (7 semitones)
  const perfectFifth = new LessonStep({
    id: 'perfect_fifth',
    type: 'demonstration',
    title: 'Perfect Fifth - The Power Chord',
    content: 'The perfect fifth (7 semitones) is the most consonant interval after the octave. It sounds strong, stable, and powerful.',
    visualState: {
      morphWeights: { octahedron: 0.8, dodecahedron: 0.2 },
      rotation: 0.5,
      scale: 1.5
    },
    highlightElements: ['morph.octahedron', 'morph.dodecahedron'],
    previousStep: 'major_third',
    nextStep: 'octave'
  });

  // Step 6: Octave (12 semitones)
  const octave = new LessonStep({
    id: 'octave',
    type: 'demonstration',
    title: 'Octave - Completing the Cycle',
    content: 'An octave (12 semitones) is the same note at double the frequency. The geometry returns to a sphere at a larger scale, representing completion and return.',
    visualState: {
      morphWeights: { sphere: 1.0 },
      rotation: 1.0,
      scale: 2.0
    },
    highlightElements: ['morph.sphere', 'audio.frequency'],
    previousStep: 'perfect_fifth',
    nextStep: 'practice'
  });

  // Step 7: Practice
  const practice = new LessonStep({
    id: 'practice',
    type: 'interaction',
    title: 'Practice: Identify the Interval',
    content: 'Listen to each interval and identify it by its sound and visual representation. Can you recognize the pattern?',
    interaction: {
      type: 'interval_quiz',
      target: 'audio.frequency'
    },
    hints: [
      'Minor intervals tend to sound sad or dark',
      'Major intervals sound bright and happy',
      'Perfect intervals sound stable and powerful'
    ],
    previousStep: 'octave',
    nextStep: 'complete'
  });

  // Step 8: Complete
  const complete = new LessonStep({
    id: 'complete',
    type: 'explanation',
    title: 'Lesson Complete!',
    content: 'You\'ve learned the basic musical intervals and their visual representations. Practice recognizing these intervals in music you listen to.',
    previousStep: 'practice'
  });

  lesson.addStep(intro);
  lesson.addStep(unison);
  lesson.addStep(minorThird);
  lesson.addStep(majorThird);
  lesson.addStep(perfectFifth);
  lesson.addStep(octave);
  lesson.addStep(practice);
  lesson.addStep(complete);

  lesson.startStepId = 'intro';
  return lesson;
}

/**
 * Lesson: Circle of Fifths
 */
export function createCircleOfFifthsLesson() {
  const lesson = new Lesson({
    id: 'music_circle_of_fifths',
    name: 'Circle of Fifths',
    description: 'Understand key relationships through circular geometry',
    category: 'music',
    difficulty: 2,
    estimatedTime: 20,
    tags: ['music theory', 'keys', 'harmony', 'circle']
  });

  const intro = new LessonStep({
    id: 'intro',
    type: 'explanation',
    title: 'The Circle of Fifths',
    content: 'The circle of fifths shows the relationship between the 12 tones of the chromatic scale. Moving clockwise, each key is a perfect fifth higher.',
    visualState: {
      morphWeights: { torus: 0.8, dodecahedron: 0.2 },
      rotation: 0
    },
    nextStep: 'c_major'
  });

  const cMajor = new LessonStep({
    id: 'c_major',
    type: 'demonstration',
    title: 'C Major - The Starting Point',
    content: 'C Major has no sharps or flats. It\'s at the top of the circle (12 o\'clock position).',
    visualState: {
      morphWeights: { torus: 1.0 },
      rotation: 0,
      color: '#FFFFFF'
    },
    previousStep: 'intro',
    nextStep: 'g_major'
  });

  const gMajor = new LessonStep({
    id: 'g_major',
    type: 'demonstration',
    title: 'G Major - One Sharp',
    content: 'Moving clockwise to G Major (1 o\'clock), we add F#. The geometry rotates 30 degrees.',
    visualState: {
      morphWeights: { torus: 1.0 },
      rotation: Math.PI / 6, // 30 degrees
      color: '#FFD700'
    },
    previousStep: 'c_major',
    nextStep: 'complete'
  });

  const complete = new LessonStep({
    id: 'complete',
    type: 'explanation',
    title: 'Continue Exploring',
    content: 'The circle continues through all 12 keys. Each step adds a sharp (clockwise) or flat (counterclockwise).',
    previousStep: 'g_major'
  });

  lesson.addStep(intro);
  lesson.addStep(cMajor);
  lesson.addStep(gMajor);
  lesson.addStep(complete);

  lesson.startStepId = 'intro';
  return lesson;
}

// ========================================
// GEOMETRY LESSONS
// ========================================

/**
 * Lesson: Platonic Solids
 */
export function createPlatonicSolidsLesson() {
  const lesson = new Lesson({
    id: 'geometry_platonic_solids',
    name: 'The Platonic Solids',
    description: 'Explore the five perfect polyhedra and their sacred geometry',
    category: 'geometry',
    difficulty: 1,
    estimatedTime: 20,
    tags: ['geometry', 'platonic solids', 'sacred geometry']
  });

  const intro = new LessonStep({
    id: 'intro',
    type: 'explanation',
    title: 'The Five Platonic Solids',
    content: 'Platonic solids are 3D shapes where all faces are identical regular polygons. There are only five: tetrahedron, cube, octahedron, dodecahedron, and icosahedron.',
    visualState: {
      morphWeights: { sphere: 1.0 },
      rotation: 0.2
    },
    nextStep: 'tetrahedron'
  });

  const tetrahedron = new LessonStep({
    id: 'tetrahedron',
    type: 'demonstration',
    title: 'Tetrahedron - Fire',
    content: 'The tetrahedron has 4 triangular faces. Ancient Greeks associated it with fire due to its sharp, pointed form.',
    visualState: {
      morphWeights: { tetrahedron: 1.0 },
      rotation: 0.3,
      color: '#FF4500'
    },
    highlightElements: ['morph.tetrahedron'],
    previousStep: 'intro',
    nextStep: 'cube'
  });

  const cube = new LessonStep({
    id: 'cube',
    type: 'demonstration',
    title: 'Cube - Earth',
    content: 'The cube (hexahedron) has 6 square faces. Its stability represents earth and grounding.',
    visualState: {
      morphWeights: { cube: 1.0 },
      rotation: 0.4,
      color: '#8B4513'
    },
    highlightElements: ['morph.cube'],
    previousStep: 'tetrahedron',
    nextStep: 'octahedron'
  });

  const octahedron = new LessonStep({
    id: 'octahedron',
    type: 'demonstration',
    title: 'Octahedron - Air',
    content: 'The octahedron has 8 triangular faces. It represents air and balance between fire and earth.',
    visualState: {
      morphWeights: { octahedron: 1.0 },
      rotation: 0.5,
      color: '#87CEEB'
    },
    highlightElements: ['morph.octahedron'],
    previousStep: 'cube',
    nextStep: 'icosahedron'
  });

  const icosahedron = new LessonStep({
    id: 'icosahedron',
    type: 'demonstration',
    title: 'Icosahedron - Water',
    content: 'The icosahedron has 20 triangular faces. Its smooth, spherical form represents water and flow.',
    visualState: {
      morphWeights: { icosahedron: 1.0 },
      rotation: 0.6,
      color: '#1E90FF'
    },
    highlightElements: ['morph.icosahedron'],
    previousStep: 'octahedron',
    nextStep: 'dodecahedron'
  });

  const dodecahedron = new LessonStep({
    id: 'dodecahedron',
    type: 'demonstration',
    title: 'Dodecahedron - Cosmos',
    content: 'The dodecahedron has 12 pentagonal faces. Greeks believed it represented the cosmos itself - the universe as a whole.',
    visualState: {
      morphWeights: { dodecahedron: 1.0 },
      rotation: 0.7,
      color: '#9370DB'
    },
    highlightElements: ['morph.dodecahedron'],
    previousStep: 'icosahedron',
    nextStep: 'practice'
  });

  const practice = new LessonStep({
    id: 'practice',
    type: 'interaction',
    title: 'Practice: Identify the Solid',
    content: 'Can you identify each Platonic solid by sight? Match the shape to its name and element.',
    interaction: {
      type: 'shape_quiz',
      target: 'morph'
    },
    hints: [
      'Count the number of faces',
      'Look at the shape of each face (triangle, square, pentagon)',
      'Remember the elemental associations'
    ],
    previousStep: 'dodecahedron',
    nextStep: 'complete'
  });

  const complete = new LessonStep({
    id: 'complete',
    type: 'explanation',
    title: 'Sacred Geometry Mastered',
    content: 'You now know the five Platonic solids! These shapes appear throughout nature, from molecular structures to sacred architecture.',
    previousStep: 'practice'
  });

  lesson.addStep(intro);
  lesson.addStep(tetrahedron);
  lesson.addStep(cube);
  lesson.addStep(octahedron);
  lesson.addStep(icosahedron);
  lesson.addStep(dodecahedron);
  lesson.addStep(practice);
  lesson.addStep(complete);

  lesson.startStepId = 'intro';
  return lesson;
}

/**
 * Lesson: Morphing and Interpolation
 */
export function createMorphingLesson() {
  const lesson = new Lesson({
    id: 'geometry_morphing',
    name: 'Morphing Between Shapes',
    description: 'Understand geometric transformation and interpolation',
    category: 'geometry',
    difficulty: 2,
    estimatedTime: 15,
    tags: ['geometry', 'morphing', 'transformation']
  });

  const intro = new LessonStep({
    id: 'intro',
    type: 'explanation',
    title: 'What is Morphing?',
    content: 'Morphing is the smooth transformation from one shape to another. Each vertex moves along a path from its start to end position.',
    visualState: {
      morphWeights: { sphere: 1.0 },
      rotation: 0.2
    },
    nextStep: 'sphere_to_cube'
  });

  const sphereToCube = new LessonStep({
    id: 'sphere_to_cube',
    type: 'demonstration',
    title: 'Sphere to Cube - Organic to Structured',
    content: 'Watch the smooth, organic sphere transform into the rigid, structured cube. Notice how the surface gradually flattens.',
    visualState: {
      morphWeights: { sphere: 0.5, cube: 0.5 },
      rotation: 0.3
    },
    previousStep: 'intro',
    nextStep: 'complete'
  });

  const complete = new LessonStep({
    id: 'complete',
    type: 'explanation',
    title: 'Transformation Complete',
    content: 'You\'ve seen how smooth transformation works. The morphing system blends between geometries using weighted interpolation.',
    previousStep: 'sphere_to_cube'
  });

  lesson.addStep(intro);
  lesson.addStep(sphereToCube);
  lesson.addStep(complete);

  lesson.startStepId = 'intro';
  return lesson;
}

// ========================================
// MYTHIC STRUCTURE LESSONS
// ========================================

/**
 * Lesson: Hero's Journey Introduction
 */
export function createHerosJourneyLesson() {
  const lesson = new Lesson({
    id: 'myth_heros_journey',
    name: "The Hero's Journey",
    description: 'Learn Joseph Campbell\'s monomyth through interactive storytelling',
    category: 'myth',
    difficulty: 1,
    estimatedTime: 25,
    tags: ['mythology', 'narrative', 'campbell', 'monomyth']
  });

  const intro = new LessonStep({
    id: 'intro',
    type: 'explanation',
    title: "Campbell's Monomyth",
    content: 'Joseph Campbell discovered that myths from all cultures share a common pattern: the Hero\'s Journey. This universal narrative structure has three major acts: Departure, Initiation, and Return.',
    visualState: {
      morphWeights: { sphere: 1.0 },
      rotation: 0.2
    },
    nextStep: 'ordinary_world'
  });

  const ordinaryWorld = new LessonStep({
    id: 'ordinary_world',
    type: 'demonstration',
    title: 'Act I: Departure - The Ordinary World',
    content: 'Every hero starts in the Ordinary World - their normal, everyday existence before the adventure begins.',
    mythNodeId: 'ordinary_world', // Reference to Hero's Journey myth
    highlightElements: ['myth.ordinary_world'],
    previousStep: 'intro',
    nextStep: 'call_to_adventure'
  });

  const callToAdventure = new LessonStep({
    id: 'call_to_adventure',
    type: 'demonstration',
    title: 'The Call to Adventure',
    content: 'Something disrupts the ordinary world - a challenge, a crisis, or an opportunity. This is the Call to Adventure.',
    mythNodeId: 'call_to_adventure',
    previousStep: 'ordinary_world',
    nextStep: 'ordeal'
  });

  const ordeal = new LessonStep({
    id: 'ordeal',
    type: 'demonstration',
    title: 'Act II: Initiation - The Ordeal',
    content: 'The hero faces their greatest challenge - a metaphorical death and rebirth. This is the turning point of the journey.',
    mythNodeId: 'ordeal',
    previousStep: 'call_to_adventure',
    nextStep: 'return'
  });

  const returnStep = new LessonStep({
    id: 'return',
    type: 'demonstration',
    title: 'Act III: Return - Sharing the Boon',
    content: 'The hero returns to the ordinary world, transformed and bearing gifts (wisdom, power, healing) to share with the community.',
    mythNodeId: 'return_with_elixir',
    previousStep: 'ordeal',
    nextStep: 'practice'
  });

  const practice = new LessonStep({
    id: 'practice',
    type: 'interaction',
    title: 'Practice: Identify the Stage',
    content: 'Think of your favorite story (movie, book, myth). Can you identify these stages in that narrative?',
    interaction: {
      type: 'story_analysis',
      target: 'myth'
    },
    hints: [
      'Star Wars: Luke starts on Tatooine (Ordinary World), receives message from Leia (Call)',
      'Harry Potter: Starts with the Dursleys (Ordinary), receives Hogwarts letter (Call)',
      'Every story has a beginning, middle, and end that mirror these stages'
    ],
    previousStep: 'return',
    nextStep: 'complete'
  });

  const complete = new LessonStep({
    id: 'complete',
    type: 'explanation',
    title: 'The Universal Pattern',
    content: 'You now understand the Hero\'s Journey! This pattern appears in stories across all cultures and times, from ancient myths to modern films.',
    previousStep: 'practice'
  });

  lesson.addStep(intro);
  lesson.addStep(ordinaryWorld);
  lesson.addStep(callToAdventure);
  lesson.addStep(ordeal);
  lesson.addStep(returnStep);
  lesson.addStep(practice);
  lesson.addStep(complete);

  lesson.startStepId = 'intro';
  return lesson;
}

/**
 * Lesson: Archetypes
 */
export function createArchetypesLesson() {
  const lesson = new Lesson({
    id: 'myth_archetypes',
    name: 'Universal Archetypes',
    description: 'Explore the recurring character patterns in mythology',
    category: 'myth',
    difficulty: 2,
    estimatedTime: 20,
    tags: ['mythology', 'archetypes', 'jung', 'characters']
  });

  const intro = new LessonStep({
    id: 'intro',
    type: 'explanation',
    title: 'What are Archetypes?',
    content: 'Archetypes are universal patterns of character and behavior that appear across all stories. Carl Jung called them patterns in the "collective unconscious."',
    visualState: {
      morphWeights: { dodecahedron: 0.7, sphere: 0.3 },
      rotation: 0.2
    },
    nextStep: 'hero'
  });

  const hero = new LessonStep({
    id: 'hero',
    type: 'demonstration',
    title: 'The Hero',
    content: 'The protagonist who undergoes transformation through trials. Examples: Luke Skywalker, Frodo, Mulan.',
    visualState: {
      morphWeights: { sphere: 1.0 },
      color: '#FFD700'
    },
    previousStep: 'intro',
    nextStep: 'mentor'
  });

  const mentor = new LessonStep({
    id: 'mentor',
    type: 'demonstration',
    title: 'The Mentor',
    content: 'The wise guide who provides knowledge or gifts. Examples: Obi-Wan, Gandalf, Mr. Miyagi.',
    visualState: {
      morphWeights: { octahedron: 1.0 },
      color: '#9370DB'
    },
    previousStep: 'hero',
    nextStep: 'shadow'
  });

  const shadow = new LessonStep({
    id: 'shadow',
    type: 'demonstration',
    title: 'The Shadow',
    content: 'The antagonist or dark mirror of the hero. Often represents the hero\'s suppressed qualities. Examples: Darth Vader, Sauron, Voldemort.',
    visualState: {
      morphWeights: { dodecahedron: 1.0 },
      color: '#2F4F4F'
    },
    previousStep: 'mentor',
    nextStep: 'complete'
  });

  const complete = new LessonStep({
    id: 'complete',
    type: 'explanation',
    title: 'Patterns Everywhere',
    content: 'Archetypes are templates. Real characters combine multiple archetypes and add unique details, but the underlying patterns remain recognizable.',
    previousStep: 'shadow'
  });

  lesson.addStep(intro);
  lesson.addStep(hero);
  lesson.addStep(mentor);
  lesson.addStep(shadow);
  lesson.addStep(complete);

  lesson.startStepId = 'intro';
  return lesson;
}

/**
 * Get all example lessons
 */
export function getAllExampleLessons() {
  return [
    // Music Theory
    createIntervalsLesson(),
    createCircleOfFifthsLesson(),

    // Geometry
    createPlatonicSolidsLesson(),
    createMorphingLesson(),

    // Mythic Structure
    createHerosJourneyLesson(),
    createArchetypesLesson()
  ];
}

console.log("📚 Example lesson library ready");
