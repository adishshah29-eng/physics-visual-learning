import React, { useState } from 'react';
import { X, Zap } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

/**
 * TrialBanner — shown during the 10-day free trial period.
 * Subtle, non-intrusive. Dismissible per session.
 */
const TRIAL_BANNER_KEY = 'ppix_trial_banner_dismissed';

const TrialBanner: React.FC = () => {
  const { isTrialing, trialDaysLeft, openPaywall } = useSubscription();
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(TRIAL_BANNER_KEY) === '1'
  );

  if (!isTrialing || dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(TRIAL_BANNER_KEY, '1');
    setDismissed(true);
  };

  const urgency = trialDaysLeft <= 2;

  return (
    <div
      className={`fixed top-[4.5rem] md:top-[4rem] left-0 right-0 z-40 transition-all
        ${urgency
          ? 'bg-gradient-to-r from-amber-900/80 via-orange-900/80 to-amber-900/80 border-b border-amber-500/30'
          : 'bg-gradient-to-r from-sky-900/70 via-indigo-900/70 to-sky-900/70 border-b border-sky-500/20'
        } backdrop-blur-sm`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Zap className={`w-4 h-4 shrink-0 ${urgency ? 'text-amber-400' : 'text-sky-400'}`} />
          <span className={urgency ? 'text-amber-200' : 'text-sky-200'}>
            {urgency
              ? `⚡ Only ${trialDaysLeft} day${trialDaysLeft !== 1 ? 's' : ''} left in your free trial!`
              : `🎉 Free trial active — ${trialDaysLeft} day${trialDaysLeft !== 1 ? 's' : ''} left. Enjoying unlimited access?`
            }
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => openPaywall('trial-banner')}
            className={`text-xs font-semibold px-3 py-1 rounded-full transition-all
              ${urgency
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-900'
                : 'bg-sky-500 hover:bg-sky-400 text-white'
              }`}
          >
            Upgrade Now
          </button>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white transition-colors p-1"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrialBanner;
