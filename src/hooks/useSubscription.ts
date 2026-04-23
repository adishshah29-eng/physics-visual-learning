import { useSubscriptionStore } from '@/store/subscriptionStore';
import type { FeatureGate } from '@/lib/supabase';
import { FREE_DAILY_LIMIT } from '@/lib/supabase';

/**
 * Primary subscription hook. Use this everywhere in the UI — never access
 * useSubscriptionStore directly from page components.
 */
export function useSubscription() {
  const {
    isPro,
    isTrialing,
    trialDaysLeft,
    plan,
    isLoading,
    subscription,
    paywallOpen,
    paywallFeature,
    checkDailyLimit,
    incrementUsage,
    getDailyUsageCount,
    openPaywall,
    closePaywall,
    refreshSubscription,
  } = useSubscriptionStore();

  // Free tier is active (trial expired, not pro)
  const isFreeRestricted = !isPro && !isTrialing;

  /**
   * Returns true if the user can access the given subject.
   * During trial, all subjects are accessible.
   */
  function canAccessSubject(subject: 'physics' | 'chemistry' | 'maths'): boolean {
    if (isPro || isTrialing) return true;
    return subject === 'physics'; // free users only get physics
  }

  /**
   * Returns true if the user can access the given exam.
   * During trial, all exams are accessible.
   */
  function canAccessExam(exam: 'jee-main' | 'jee-advanced' | 'mht-cet'): boolean {
    if (isPro || isTrialing) return true;
    return exam === 'jee-main'; // free users only get JEE Main
  }

  /**
   * Returns true if the user can access a gated feature.
   */
  function canAccessFeature(feature: FeatureGate): boolean {
    if (isPro || isTrialing) return true;
    return false;
  }

  /**
   * How many free questions are left today.
   */
  const dailyUsed = getDailyUsageCount();
  const dailyQuestionsLeft = Math.max(0, FREE_DAILY_LIMIT - dailyUsed);
  const hasHitDailyLimit = isFreeRestricted && dailyUsed >= FREE_DAILY_LIMIT;

  /**
   * Call after each question answered on free tier.
   */
  function recordQuestion(): boolean {
    if (isPro || isTrialing) return true; // no limit
    const newCount = incrementUsage();
    return newCount <= FREE_DAILY_LIMIT;
  }

  /**
   * Renewal date formatted for display (Pro users).
   */
  const renewalDate: string | null = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  /**
   * Trial end date formatted for display.
   */
  const trialEndDate: string | null = subscription?.trial_end
    ? new Date(subscription.trial_end).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return {
    // State
    isPro,
    isTrialing,
    isFreeRestricted,
    trialDaysLeft,
    plan,
    isLoading,
    subscription,
    paywallOpen,
    paywallFeature,
    renewalDate,
    trialEndDate,

    // Feature gates
    canAccessSubject,
    canAccessExam,
    canAccessFeature,

    // Daily limits
    dailyQuestionsLeft,
    dailyUsed,
    hasHitDailyLimit,
    recordQuestion,
    checkDailyLimit,

    // Actions
    openPaywall,
    closePaywall,
    refreshSubscription,
  };
}
