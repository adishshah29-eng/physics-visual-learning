import React from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import type { FeatureGate } from '@/lib/supabase';

interface PaywallGuardProps {
  feature: FeatureGate;
  /** 'blur' = overlay on top of blurred children; 'modal' = immediately open modal */
  variant?: 'blur' | 'modal';
  children: React.ReactNode;
  /** Optional custom label shown on the lock overlay */
  lockLabel?: string;
}

/**
 * PaywallGuard — wraps content that requires Pro or active trial.
 *
 * Usage:
 *   <PaywallGuard feature="chemistry" variant="blur">
 *     <ChemistryPage />
 *   </PaywallGuard>
 */
const PaywallGuard: React.FC<PaywallGuardProps> = ({
  feature,
  variant = 'blur',
  children,
  lockLabel,
}) => {
  const { canAccessFeature, openPaywall } = useSubscription();

  // Helper: map feature to readable label
  const getFeatureLabel = (f: FeatureGate): string => {
    const labels: Record<FeatureGate, string> = {
      chemistry: 'Chemistry Practice',
      maths: 'Mathematics Practice',
      'jee-advanced': 'JEE Advanced',
      'mht-cet': 'MHT-CET',
      'ai-tutor': 'AI Tutor',
      'session-mode': 'Session Mode',
      bookmarks: 'Bookmarks',
      'spaced-repetition': 'Spaced Repetition',
      'full-analytics': 'Full Analytics',
    };
    return labels[f];
  };

  const hasAccess = canAccessFeature(feature);

  if (hasAccess) return <>{children}</>;

  // ─── Modal variant: don't render children at all, just open modal ─────────
  if (variant === 'modal') {
    openPaywall(feature);
    return null;
  }

  // ─── Blur variant: render children blurred + lock overlay ─────────────────
  return (
    <div className="relative rounded-xl overflow-hidden">
      {/* Blurred content */}
      <div className="blur-sm pointer-events-none select-none opacity-60">
        {children}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-[2px] z-10">
        <div className="text-center p-6 max-w-xs">
          <div className="w-14 h-14 bg-violet-500/15 border border-violet-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-violet-400" />
          </div>
          <h3 className="text-white font-display text-lg mb-2">
            {lockLabel ?? `${getFeatureLabel(feature)} is Pro`}
          </h3>
          <p className="text-slate-400 text-sm mb-5">
            Unlock this feature with a Physics.Lab Pro subscription.
          </p>
          <button
            onClick={() => openPaywall(feature)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500
              text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all
              shadow-lg shadow-violet-500/20 hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            Start Free Trial
          </button>
          <p className="text-xs text-slate-500 mt-3">10 days free · No card required</p>
        </div>
      </div>
    </div>
  );
};

export default PaywallGuard;
