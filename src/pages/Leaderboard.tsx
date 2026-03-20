import React, { useEffect, useState } from 'react';
import { Loader2, Trophy, Medal, Award } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getLeaderboard } from '@/lib/supabase-helpers';
import { supabase, type LeaderboardScore, type Profile } from '@/lib/supabase';
import Navbar from '@/components/Navbar';

type LeaderboardEntry = LeaderboardScore & {
  profiles: Pick<Profile, 'name' | 'avatar_url'>;
};

const batchTabs = [
  { value: 'all', label: 'All' },
  { value: 'JEE2025', label: 'JEE 2025' },
  { value: 'JEE2026', label: 'JEE 2026' },
  { value: 'MHT2025', label: 'MHT 2025' },
];

const timeTabs = [
  { value: 'all', label: 'All Time' },
  { value: 'month', label: 'This Month' },
  { value: 'week', label: 'This Week' },
];

const Leaderboard: React.FC = () => {
  const { user } = useAuthStore();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedTime, setSelectedTime] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userEntry, setUserEntry] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true);
      try {
        const data = await getLeaderboard(
          selectedBatch === 'all' ? undefined : selectedBatch,
          100
        );
        setEntries(data as LeaderboardEntry[]);

        // Find current user's rank
        if (user) {
          const userIdx = data.findIndex((e) => e.user_id === user.id);
          if (userIdx >= 0) {
            setUserRank(userIdx + 1);
            setUserEntry(data[userIdx] as LeaderboardEntry);
          } else {
            // User might not be in leaderboard yet, fetch their data
            const { data: userLb } = await supabase
              .from('leaderboard_scores')
              .select('*, profiles!inner(name, avatar_url)')
              .eq('user_id', user.id)
              .single();

            if (userLb) {
              setUserEntry(userLb as unknown as LeaderboardEntry);
              setUserRank(data.length + 1); // approximate
            } else {
              setUserRank(null);
              setUserEntry(null);
            }
          }
        }
      } catch (err) {
        console.error('Error loading leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, [user, selectedBatch, selectedTime]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-300" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="text-sm font-mono text-slate-500 w-5 text-center">{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'glass-panel bg-yellow-500/10 border-yellow-500/30';
    if (rank === 2) return 'glass-panel bg-slate-400/10 border-slate-400/30';
    if (rank === 3) return 'glass-panel bg-amber-600/10 border-amber-600/30';
    return 'glass-panel hover:bg-slate-800/20';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <Navbar />
      <main className="pt-28 md:pt-24 pb-16 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-display tracking-wide mb-2">Leaderboard</h1>
        <p className="text-slate-400 mb-8 font-sans">See how you rank among your peers.</p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-8">
          <div className="flex flex-wrap gap-2">
            {batchTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedBatch(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedBatch === tab.value
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {timeTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedTime(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedTime === tab.value
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
          </div>
        ) : entries.length === 0 ? (
          <div className="glass-panel rounded-xl p-8 text-center shadow-lg">
            <Trophy className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 mb-2">No leaderboard data yet</p>
            <p className="text-slate-500 text-sm">
              Start solving questions to appear on the leaderboard!
            </p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-[50px_1fr_100px_80px_80px_80px] gap-2 px-4 py-3 glass-nav rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
              <span>Rank</span>
              <span>Name</span>
              <span className="text-right">Score</span>
              <span className="text-right">Questions</span>
              <span className="text-right">Accuracy</span>
              <span className="text-right">Streak</span>
            </div>

            {/* Entries */}
            <div className="space-y-2 mb-8">
              {entries.map((entry, idx) => {
                const rank = idx + 1;
                const isCurrentUser = user?.id === entry.user_id;

                return (
                  <div
                    key={entry.id}
                    className={`grid grid-cols-[50px_1fr] sm:grid-cols-[50px_1fr_100px_80px_80px_80px] gap-2 items-center px-4 py-3 rounded-xl border transition-all ${
                      isCurrentUser ? 'glass-panel bg-sky-500/10 border-sky-500/50 shadow-[0_0_15px_rgba(56,189,248,0.15)] ring-1 ring-sky-500/20' : getRankBg(rank)
                    }`}
                  >
                    <div className="flex items-center">{getRankIcon(rank)}</div>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold text-sky-400 shrink-0">
                        {entry.profiles?.avatar_url ? (
                          <img src={entry.profiles.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          getInitials(entry.profiles?.name || 'U')
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-white truncate">
                          {entry.profiles?.name || 'Anonymous'}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs text-sky-400">(You)</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 sm:hidden font-mono">
                          {entry.total_score} pts • {entry.questions_solved} solved
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:block text-right text-sm font-mono font-bold text-white">
                      {entry.total_score}
                    </div>
                    <div className="hidden sm:block text-right text-sm font-mono text-slate-400">
                      {entry.questions_solved}
                    </div>
                    <div className="hidden sm:block text-right text-sm font-mono text-slate-400">
                      {Math.round(entry.accuracy * 100)}%
                    </div>
                    <div className="hidden sm:block text-right text-sm font-mono text-slate-400">
                      🔥 {entry.streak_days}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* User's own card (sticky) */}
            {userEntry && userRank && userRank > 10 && (
              <div className="sticky bottom-4 glass-panel bg-sky-500/10 border-sky-500/40 border-2 rounded-xl p-4 shadow-[0_0_30px_rgba(56,189,248,0.2)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-sky-400">Your Rank: #{userRank}</span>
                    <span className="text-xs text-slate-400 font-mono">{userEntry.total_score} pts</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                    <span>{userEntry.questions_solved} solved</span>
                    <span>{Math.round(userEntry.accuracy * 100)}% acc</span>
                    <span>🔥 {userEntry.streak_days}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Score Formula */}
        <div className="mt-8 glass-panel rounded-xl p-5 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2 font-sans">Score Formula</p>
          <p className="text-sm text-slate-400 font-sans">
            Score = Correct × Difficulty Multiplier{' '}
            <span className="text-slate-500">(Easy = 1pt, JEE Main = 2pt, Advanced = 3pt)</span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
