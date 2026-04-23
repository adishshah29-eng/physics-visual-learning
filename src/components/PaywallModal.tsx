import React, { useState, useEffect, useCallback } from 'react';
import {
  X, Check, Sparkles, Zap, BookOpen, BarChart3, Clock,
  Brain, Repeat, Trophy, Shield, Star
} from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { PRICING, type PricingPlan } from '@/lib/supabase';
import { openRazorpayCheckout } from '@/services/payment';
import { useAuthStore } from '@/store/authStore';

// ─── JEE Exam Countdown ────────────────────────────────────────────────────────

function getDaysToJEE(): number {
  // JEE Main Session 2 approximate: April of next year
  const now = new Date();
  const year = now.getMonth() >= 3 ? now.getFullYear() + 1 : now.getFullYear();
  const jee = new Date(year, 3, 15); // April 15
  return Math.max(0, Math.ceil((jee.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

// ─── Feature list ─────────────────────────────────────────────────────────────

const proFeatures = [
  { icon: BookOpen,  text: 'Unlimited MCQs — Physics, Chemistry & Maths',   highlight: true },
  { icon: Zap,       text: 'All exams: JEE Main, JEE Advanced & MHT-CET',   highlight: true },
  { icon: Brain,     text: 'AI Tutor powered by Google Gemini',              highlight: false },
  { icon: BarChart3, text: 'Full analytics with ML-based predictions',       highlight: false },
  { icon: Repeat,    text: 'Spaced repetition review queue',                 highlight: false },
  { icon: Clock,     text: 'Timed session mode with question palette',       highlight: false },
  { icon: Star,      text: 'Bookmarks & personalised weak-chapter review',   highlight: false },
  { icon: Trophy,    text: 'Leaderboard participation & ranking',            highlight: false },
];

// ─── PaywallModal ──────────────────────────────────────────────────────────────

const PaywallModal: React.FC = () => {
  const { paywallOpen, paywallFeature, isTrialing, closePaywall, refreshSubscription } =
    useSubscription();
  const { user, profile } = useAuthStore();

  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>('quarterly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const daysToJEE = getDaysToJEE();

  // Close on Escape key
  useEffect(() => {
    if (!paywallOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePaywall();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [paywallOpen, closePaywall]);

  // Lock scroll when open
  useEffect(() => {
    if (paywallOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [paywallOpen]);

  const handleUpgrade = useCallback(async () => {
    if (!user || !profile) return;
    setIsProcessing(true);
    setPaymentError(null);

    try {
      await openRazorpayCheckout({
        plan: selectedPlan,
        user: { id: user.id, email: profile.email, name: profile.name },
        onSuccess: async () => {
          setPaymentSuccess(true);
          await refreshSubscription();
          setTimeout(() => {
            closePaywall();
            setPaymentSuccess(false);
          }, 2200);
        },
        onError: (msg: string) => {
          setPaymentError(msg);
          setIsProcessing(false);
        },
        onDismiss: () => {
          setIsProcessing(false);
        },
      });
    } catch (err: any) {
      setPaymentError(err.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  }, [user, profile, selectedPlan, refreshSubscription, closePaywall]);

  if (!paywallOpen) return null;

  const pricing = PRICING[selectedPlan];

  const featureLabel = paywallFeature
    ? ({
        chemistry: 'Chemistry Practice',
        maths: 'Mathematics Practice',
        'jee-advanced': 'JEE Advanced Questions',
        'mht-cet': 'MHT-CET Questions',
        'ai-tutor': 'AI Tutor',
        'session-mode': 'Session Mode',
        bookmarks: 'Bookmarks',
        'spaced-repetition': 'Spaced Repetition',
        'full-analytics': 'Full Analytics',
      } as Record<string, string>)[paywallFeature] ?? null
    : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Upgrade to Pro"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
        onClick={closePaywall}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-violet-500/15 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative p-6 pb-0 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                Physics.Lab Pro
              </span>
            </div>
            <h2 className="text-2xl font-display text-white mb-1">
              {featureLabel
                ? `Unlock ${featureLabel}`
                : 'Unlock Your Full Potential'}
            </h2>
            <p className="text-slate-400 text-sm">
              {daysToJEE > 0 && (
                <span className="text-amber-400 font-semibold">
                  JEE Main Session 2 is in {daysToJEE} days.{' '}
                </span>
              )}
              Start your 10-day free trial — no card required.
            </p>
          </div>
          <button
            onClick={closePaywall}
            className="text-slate-500 hover:text-white transition-colors p-1.5 hover:bg-slate-800 rounded-lg ml-4 shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left: Feature list */}
          <div className="space-y-2.5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              Everything in Pro
            </p>
            {proFeatures.map((f, i) => (
              <div key={i} className={`flex items-start gap-3 ${f.highlight ? 'opacity-100' : 'opacity-80'}`}>
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5
                  ${f.highlight ? 'bg-violet-500/20 text-violet-400' : 'bg-slate-800 text-slate-400'}`}>
                  <f.icon className="w-3.5 h-3.5" />
                </div>
                <span className={`text-sm ${f.highlight ? 'text-white font-medium' : 'text-slate-300'}`}>
                  {f.text}
                </span>
              </div>
            ))}
          </div>

          {/* Right: Pricing + CTA */}
          <div className="flex flex-col">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              Choose a plan
            </p>

            <div className="space-y-2 mb-5">
              {(Object.keys(PRICING) as PricingPlan[]).map((planKey) => {
                const p = PRICING[planKey];
                const isSelected = selectedPlan === planKey;
                return (
                  <button
                    key={planKey}
                    onClick={() => setSelectedPlan(planKey)}
                    className={`w-full relative flex items-center justify-between p-3.5 rounded-xl border transition-all
                      ${isSelected
                        ? 'border-violet-500/60 bg-violet-500/10 shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                        : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600'
                      }`}
                  >
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white capitalize">
                          {planKey}
                        </span>
                        {p.tag && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider
                            ${planKey === 'quarterly' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                            {p.tag}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        ₹{p.perMonth}/month
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-bold text-white">{p.label}</div>
                    </div>
                    {isSelected && (
                      <div className="absolute right-3 top-3">
                        <Check className="w-4 h-4 text-violet-400" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Error */}
            {paymentError && (
              <p className="text-red-400 text-xs mb-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {paymentError}
              </p>
            )}

            {/* Success */}
            {paymentSuccess && (
              <div className="text-emerald-400 text-sm mb-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-3 flex items-center gap-2">
                <Check className="w-4 h-4" />
                Payment successful! Welcome to Pro 🎉
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleUpgrade}
              disabled={isProcessing || paymentSuccess}
              className="w-full relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500
                disabled:opacity-60 disabled:cursor-not-allowed
                text-white font-bold py-3.5 rounded-xl transition-all text-sm
                shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30
                hover:scale-[1.01] active:scale-[0.99]"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {isTrialing ? 'Upgrade Now' : 'Start 10-day Free Trial'}
                </span>
              )}
              {/* Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2.5s_linear_infinite] pointer-events-none" />
            </button>

            <p className="text-xs text-slate-500 text-center mt-3">
              {isTrialing
                ? `Billed ${pricing.label}. Cancel anytime.`
                : '10 days free, then billed ' + pricing.label + '. No card required for trial.'
              }
            </p>

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Shield className="w-3.5 h-3.5 text-slate-600" />
                Secured by Razorpay
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Check className="w-3.5 h-3.5 text-slate-600" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaywallModal;
