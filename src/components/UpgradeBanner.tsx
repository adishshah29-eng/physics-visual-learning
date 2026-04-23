import React, { useState } from 'react';
import { X, Zap } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { FREE_DAILY_LIMIT } from '@/lib/supabase';

/**
 * UpgradeBanner — slim dismissible sticky banner for free post-trial users.
 * Shows how many questions remain today. Dismissible per session.
 */
const UPGRADE_BANNER_KEY = 'ppix_upgrade_banner_dismissed';

const UpgradeBanner: React.FC = () => {
  const { isFreeRestricted, dailyQuestionsLeft, openPaywall } = useSubscription();
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(UPGRADE_BANNER_KEY) === '1'
  );

  // Only show for restricted free users
  if (!isFreeRestricted || dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(UPGRADE_BANNER_KEY, '1');
    setDismissed(true);
  };

  const hitLimit = dailyQuestionsLeft === 0;

  return (
    <div className="w-full bg-gradient-to-r from-violet-900/60 via-indigo-900/60 to-violet-900/60 border border-violet-500/20 rounded-xl px-4 py-3 flex items-center justify-between gap-4 mb-6 relative overflow-hidden">
      {/* Shimmer line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[-100%] right-0 h-full w-[200%] bg-gradient-to-r from-transparent via-violet-400/5 to-transparent animate-[shimmer_3s_linear_infinite]" />
      </div>

      <div className="flex items-center gap-2 text-sm relative">
        <Zap className="w-4 h-4 text-violet-400 shrink-0" />
        <span className="text-slate-200">
          {hitLimit
            ? "You've hit today's limit of 5 free questions."
            : `${dailyQuestionsLeft} of ${FREE_DAILY_LIMIT} free questions left today.`}
          {' '}
          <span className="text-violet-300 font-medium">Go Pro for unlimited access.</span>
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0 relative">
        <button
          onClick={() => openPaywall('upgrade-banner')}
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-violet-500 hover:bg-violet-400 text-white transition-all hover:scale-105"
        >
          Upgrade
        </button>
        <button
          onClick={handleDismiss}
          className="text-slate-500 hover:text-white transition-colors p-1"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default UpgradeBanner;
