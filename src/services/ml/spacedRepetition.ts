// ─── SM-2 Spaced Repetition Algorithm ──────────────────────────────────────────
// Based on the SuperMemo SM-2 algorithm by Piotr Wozniak.
// Schedules review intervals based on how well the student recalls material.

export interface ReviewItem {
  interval: number;      // Days until next review
  easeFactor: number;    // Ease factor (minimum 1.3)
  repetitions: number;   // Number of successful repetitions
}

/**
 * Calculate the next review schedule using the SM-2 algorithm.
 *
 * @param item - Current review item state
 * @param quality - Quality of response (0-5 scale):
 *   0 = complete blackout
 *   1 = incorrect but remembered upon seeing answer
 *   2 = incorrect but answer seemed easy to recall
 *   3 = correct with serious difficulty
 *   4 = correct with some hesitation
 *   5 = perfect response
 * @returns Updated ReviewItem with new interval, ease factor, and repetition count
 */
export function calculateNextReview(item: ReviewItem, quality: number): ReviewItem {
  // Clamp quality to valid range
  const q = Math.max(0, Math.min(5, Math.round(quality)));

  let { interval, easeFactor, repetitions } = item;

  if (q >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    // Incorrect response — reset
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor using SM-2 formula
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

  // Ensure ease factor never drops below 1.3
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  return {
    interval,
    easeFactor: Math.round(easeFactor * 100) / 100,
    repetitions,
  };
}

/**
 * Convert a correct/incorrect answer to a SM-2 quality score.
 */
export function answerToQuality(isCorrect: boolean, timeTakenMs?: number): number {
  if (!isCorrect) return 1;

  // If correct and quick (< 15s), quality is 5 (perfect)
  // If correct but slow (> 30s), quality is 3 (difficult)
  // Otherwise quality is 4 (hesitation)
  if (timeTakenMs !== undefined) {
    if (timeTakenMs < 15000) return 5;
    if (timeTakenMs > 30000) return 3;
  }
  return 4;
}

/**
 * Filter review queue items that are due for review.
 */
export function getDueItems<T extends { next_review: string }>(reviewQueue: T[]): T[] {
  const now = new Date();
  return reviewQueue.filter((item) => {
    const nextReview = new Date(item.next_review);
    return nextReview <= now;
  });
}

/**
 * Check if a specific review item is due.
 */
export function isItemDue(nextReview: Date): boolean {
  return nextReview <= new Date();
}

/**
 * Calculate the next review date from the current date and interval.
 */
export function getNextReviewDate(intervalDays: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + intervalDays);
  return date;
}
