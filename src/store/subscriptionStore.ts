import { create } from 'zustand';
import { supabase, type Subscription, FREE_DAILY_LIMIT } from '@/lib/supabase';
import { useAuthStore } from './authStore';

// ─── Helpers ───────────────────────────────────────────────────────────────────

function isTrialingNow(trialEnd: string | null): boolean {
  if (!trialEnd) return false;
  return new Date(trialEnd) > new Date();
}

function trialDaysLeft(trialEnd: string | null): number {
  if (!trialEnd) return 0;
  const diff = new Date(trialEnd).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function isExpiredPro(sub: Subscription | null): boolean {
  if (!sub || sub.plan !== 'pro') return false;
  if (!sub.current_period_end) return false;
  return new Date(sub.current_period_end) < new Date();
}

// ─── Daily limit tracking (localStorage) ──────────────────────────────────────

const DAILY_KEY = 'ppix_daily_usage';

interface DailyUsage {
  date: string;  // YYYY-MM-DD
  count: number;
}

function getTodayUsage(): DailyUsage {
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (!raw) return { date: '', count: 0 };
    const parsed: DailyUsage = JSON.parse(raw);
    const today = new Date().toISOString().split('T')[0];
    if (parsed.date !== today) return { date: today, count: 0 };
    return parsed;
  } catch {
    return { date: '', count: 0 };
  }
}

function incrementDailyUsage(): number {
  const today = new Date().toISOString().split('T')[0];
  const usage = getTodayUsage();
  const newCount = usage.count + 1;
  localStorage.setItem(DAILY_KEY, JSON.stringify({ date: today, count: newCount }));
  return newCount;
}

function getDailyUsageCount(): number {
  return getTodayUsage().count;
}

// ─── Store ─────────────────────────────────────────────────────────────────────

interface SubscriptionState {
  subscription: Subscription | null;
  isLoading: boolean;
  paywallOpen: boolean;
  paywallFeature: string | null;

  // Derived
  isPro: boolean;
  isTrialing: boolean;
  trialDaysLeft: number;
  plan: 'free' | 'pro';

  // Actions
  initSubscription: (userId: string, profilePlan: 'free' | 'pro') => Promise<void>;
  refreshSubscription: () => Promise<void>;
  checkDailyLimit: (currentCount?: number) => boolean;
  incrementUsage: () => number;
  getDailyUsageCount: () => number;
  openPaywall: (feature?: string) => void;
  closePaywall: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscription: null,
  isLoading: false,
  paywallOpen: false,
  paywallFeature: null,

  isPro: false,
  isTrialing: false,
  trialDaysLeft: 0,
  plan: 'free',

  initSubscription: async (userId: string, profilePlan: 'free' | 'pro') => {
    // Fast path: use profile.plan for immediate UI render (zero extra call)
    const fastIsPro = profilePlan === 'pro';
    set({ plan: profilePlan, isPro: fastIsPro, isLoading: true });

    try {
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      const sub = data as Subscription | null;

      if (!sub) {
        // No subscription row — user needs backfill (shouldn't happen with trigger)
        set({ isLoading: false });
        return;
      }

      const trialing = isTrialingNow(sub.trial_end);
      const daysLeft = trialDaysLeft(sub.trial_end);

      // Detect stale Pro (period expired but DB not updated yet)
      const stalePro = isExpiredPro(sub);
      if (stalePro) {
        // Optimistically downgrade; refreshSubscription will sync
        set({
          subscription: { ...sub, plan: 'free', status: 'expired' },
          isPro: false,
          isTrialing: false,
          trialDaysLeft: 0,
          plan: 'free',
          isLoading: false,
        });
        // Async refresh without blocking
        get().refreshSubscription();
        return;
      }

      const effectivePro = sub.plan === 'pro' && sub.status === 'active';

      set({
        subscription: sub,
        isPro: effectivePro,
        isTrialing: trialing,
        trialDaysLeft: daysLeft,
        plan: sub.plan,
        isLoading: false,
      });
    } catch (err) {
      console.error('[Subscription] Init error:', err);
      set({ isLoading: false });
    }
  },

  refreshSubscription: async () => {
    const authStore = useAuthStore.getState();
    const userId = authStore.user?.id;
    if (!userId) return;

    set({ isLoading: true });
    try {
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      const sub = data as Subscription | null;
      if (!sub) { set({ isLoading: false }); return; }

      const trialing = isTrialingNow(sub.trial_end);
      const daysLeft = trialDaysLeft(sub.trial_end);
      const effectivePro = sub.plan === 'pro' && sub.status === 'active';

      set({
        subscription: sub,
        isPro: effectivePro,
        isTrialing: trialing,
        trialDaysLeft: daysLeft,
        plan: sub.plan,
        isLoading: false,
      });
    } catch (err) {
      console.error('[Subscription] Refresh error:', err);
      set({ isLoading: false });
    }
  },

  checkDailyLimit: (currentCount?: number) => {
    const { isPro, isTrialing } = get();
    if (isPro || isTrialing) return true; // unlimited
    const count = currentCount ?? getDailyUsageCount();
    return count < FREE_DAILY_LIMIT;
  },

  incrementUsage: () => incrementDailyUsage(),

  getDailyUsageCount: () => getDailyUsageCount(),

  openPaywall: (feature?: string) =>
    set({ paywallOpen: true, paywallFeature: feature ?? null }),

  closePaywall: () =>
    set({ paywallOpen: false, paywallFeature: null }),
}));
