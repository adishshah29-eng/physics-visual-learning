// ─── Bayesian Knowledge Tracing ────────────────────────────────────────────────
// BKT estimates the probability that a student has "learned" a skill based on
// their sequence of correct/incorrect answers.

const P_TRANSIT = 0.1; // Probability of learning (transitioning from unlearned to learned)
const P_SLIP = 0.1;    // Probability of error despite knowing the material
const P_GUESS = 0.2;   // Probability of correct answer despite not knowing

/**
 * Update mastery level using Bayesian Knowledge Tracing.
 * @param currentMastery - Current probability of mastery (0.0 to 1.0)
 * @param isCorrect - Whether the student answered correctly
 * @returns Updated mastery probability (0.0 to 1.0)
 */
export function updateMastery(currentMastery: number, isCorrect: boolean): number {
  // Clamp input
  const pL = Math.max(0, Math.min(1, currentMastery));

  let posteriorLearned: number;

  if (isCorrect) {
    // P(L_n | correct) = P(correct | L_n) * P(L_n) / P(correct)
    const pCorrectGivenLearned = 1 - P_SLIP;
    const pCorrectGivenNotLearned = P_GUESS;
    const pCorrect = pCorrectGivenLearned * pL + pCorrectGivenNotLearned * (1 - pL);
    posteriorLearned = (pCorrectGivenLearned * pL) / pCorrect;
  } else {
    // P(L_n | incorrect) = P(incorrect | L_n) * P(L_n) / P(incorrect)
    const pIncorrectGivenLearned = P_SLIP;
    const pIncorrectGivenNotLearned = 1 - P_GUESS;
    const pIncorrect = pIncorrectGivenLearned * pL + pIncorrectGivenNotLearned * (1 - pL);
    posteriorLearned = (pIncorrectGivenLearned * pL) / pIncorrect;
  }

  // Apply learning transition: P(L_n+1) = P(L_n | obs) + P(T) * (1 - P(L_n | obs))
  const updatedMastery = posteriorLearned + P_TRANSIT * (1 - posteriorLearned);

  return Math.max(0, Math.min(1, updatedMastery));
}

/**
 * Get a human-readable label for a mastery level.
 */
export function getMasteryLabel(mastery: number): 'Beginner' | 'Developing' | 'Proficient' | 'Mastered' {
  if (mastery < 0.25) return 'Beginner';
  if (mastery < 0.50) return 'Developing';
  if (mastery < 0.75) return 'Proficient';
  return 'Mastered';
}

/**
 * Get a Tailwind color class for a mastery level.
 */
export function getMasteryColor(mastery: number): string {
  if (mastery < 0.25) return 'text-red-500';
  if (mastery < 0.50) return 'text-orange-500';
  if (mastery < 0.75) return 'text-amber-500';
  return 'text-emerald-500';
}

/**
 * Get the background variant for mastery level.
 */
export function getMasteryBgColor(mastery: number): string {
  if (mastery < 0.25) return 'bg-red-500';
  if (mastery < 0.50) return 'bg-orange-500';
  if (mastery < 0.75) return 'bg-amber-500';
  return 'bg-emerald-500';
}

/**
 * Predict the next appropriate difficulty level based on mastery.
 */
export function predictNextDifficulty(mastery: number): 'easy' | 'jee-main' | 'jee-advanced' {
  if (mastery < 0.4) return 'easy';
  if (mastery < 0.75) return 'jee-main';
  return 'jee-advanced';
}
