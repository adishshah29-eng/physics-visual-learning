// ─── Performance Predictor ─────────────────────────────────────────────────────
// Uses knowledge state data to predict exam scores and provide study recommendations.

import type { KnowledgeState } from '@/types/index';

// Chapter weights for JEE — approximate marks distribution
const JEE_CHAPTER_WEIGHTS: Record<string, number> = {
  'units': 2, 'kinematics-1d': 4, 'projectile-motion': 4,
  'laws-of-motion': 6, 'work-energy': 6, 'circular-motion': 4,
  'shm': 4, 'rotational-motion': 6, 'gravitation': 4,
  'thermodynamics': 6, 'waves': 4, 'electrostatics': 6,
  'current-electricity': 6, 'ray-optics': 4, 'semiconductors': 4,
};

const MHT_CET_CHAPTER_WEIGHTS: Record<string, number> = {
  'units': 2, 'kinematics-1d': 3, 'projectile-motion': 3,
  'laws-of-motion': 5, 'work-energy': 5, 'circular-motion': 4,
  'shm': 4, 'rotational-motion': 5, 'gravitation': 3,
  'thermodynamics': 5, 'waves': 4, 'electrostatics': 5,
  'current-electricity': 5, 'ray-optics': 4, 'semiconductors': 3,
};

/**
 * Predict a JEE/MHT-CET score based on knowledge state mastery levels.
 * Returns a score out of the total possible (e.g., 300 for JEE).
 */
export function predictJEEScore(
  knowledgeStates: KnowledgeState[],
  targetExam: string
): number {
  const weights = targetExam === 'mht-cet' ? MHT_CET_CHAPTER_WEIGHTS : JEE_CHAPTER_WEIGHTS;
  const maxScore = targetExam === 'mht-cet' ? 200 : 300;

  if (knowledgeStates.length === 0) return 0;

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  let weightedMastery = 0;

  for (const ks of knowledgeStates) {
    const weight = weights[ks.chapter] || 3;
    weightedMastery += ks.mastery * weight;
  }

  // Normalize by total possible weight and scale to max score
  const score = (weightedMastery / totalWeight) * maxScore;
  return Math.round(score);
}

/**
 * Get chapters where mastery is below 50%.
 */
export function getWeakChapters(knowledgeStates: KnowledgeState[]): string[] {
  return knowledgeStates
    .filter((ks) => ks.mastery < 0.5)
    .sort((a, b) => a.mastery - b.mastery)
    .map((ks) => ks.chapter);
}

/**
 * Get chapters where mastery is above 70%.
 */
export function getStrongChapters(knowledgeStates: KnowledgeState[]): string[] {
  return knowledgeStates
    .filter((ks) => ks.mastery > 0.7)
    .sort((a, b) => b.mastery - a.mastery)
    .map((ks) => ks.chapter);
}

/**
 * Get overall readiness percentage (0-100) across all tracked chapters.
 */
export function getReadinessPercentage(knowledgeStates: KnowledgeState[]): number {
  if (knowledgeStates.length === 0) return 0;

  const avgMastery =
    knowledgeStates.reduce((sum, ks) => sum + ks.mastery, 0) / knowledgeStates.length;

  return Math.round(avgMastery * 100);
}

/**
 * Generate a personalized study recommendation based on performance data.
 */
export function getStudyRecommendation(knowledgeStates: KnowledgeState[]): string {
  if (knowledgeStates.length === 0) {
    return 'Start practicing questions to get personalized recommendations!';
  }

  const weakChapters = getWeakChapters(knowledgeStates);
  const readiness = getReadinessPercentage(knowledgeStates);

  if (weakChapters.length === 0) {
    return 'Great job! You have strong mastery across all chapters. Focus on timed practice for speed.';
  }

  // Find the highest-weight weak chapter
  const weights = JEE_CHAPTER_WEIGHTS;
  let bestChapter = weakChapters[0];
  let bestWeight = weights[bestChapter] || 0;

  for (const ch of weakChapters) {
    const w = weights[ch] || 0;
    if (w > bestWeight) {
      bestWeight = w;
      bestChapter = ch;
    }
  }

  const chapterName = formatChapterName(bestChapter);

  if (readiness < 30) {
    return `Focus on building fundamentals. Start with "${chapterName}" — it carries high weightage and needs the most attention.`;
  }

  if (readiness < 60) {
    return `Good progress! Prioritize "${chapterName}" to maximize your score — it's high-weightage and your mastery is still developing.`;
  }

  return `You're doing well! Fine-tune your weak spot in "${chapterName}" to push your predicted score even higher.`;
}

/** Format a chapter slug into a readable name */
function formatChapterName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
