import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Atom, BookOpen, BarChart3, Clock, Flame, Target, TrendingUp, ChevronRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getKnowledgeState, getAttemptsByUser } from '@/lib/supabase-helpers';
import { getReadinessPercentage, predictJEEScore } from '@/services/ml/performancePredictor';
import { getDueItems } from '@/services/ml/spacedRepetition';
import { supabase, type KnowledgeState, type ReviewQueueItem } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import UpgradeBanner from '@/components/UpgradeBanner';

const Home: React.FC = () => {
  const { profile, user } = useAuthStore();
  const [stats, setStats] = useState({
    solvedToday: 0,
    streak: 0,
    accuracy: 0,
    predictedScore: 0,
  });
  const [lastChapter, setLastChapter] = useState<string | null>(null);
  const [dueReviewCount, setDueReviewCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      setIsLoading(true);

      try {
        // Get knowledge states for predicted score
        const knowledgeStates: KnowledgeState[] = await getKnowledgeState(user.id);
        const predicted = predictJEEScore(knowledgeStates, profile?.target_exam || 'jee-main');
        const readiness = getReadinessPercentage(knowledgeStates);

        // Today's attempts
        const today = new Date().toISOString().split('T')[0];
        const todayAttempts = await getAttemptsByUser(user.id, {
          startDate: today + 'T00:00:00',
        });

        const correctToday = todayAttempts.filter((a) => a.is_correct).length;
        const accuracyVal = todayAttempts.length > 0
          ? Math.round((correctToday / todayAttempts.length) * 100)
          : 0;

        // Get review queue
        const { data: reviewQueue } = await supabase
          .from('review_queue')
          .select('*')
          .eq('user_id', user.id);

        const dueItems = getDueItems<ReviewQueueItem>(reviewQueue || []);

        // Get streak from leaderboard
        const { data: leaderboard } = await supabase
          .from('leaderboard_scores')
          .select('streak_days')
          .eq('user_id', user.id)
          .single();
        const streakDays = (leaderboard as any)?.streak_days ?? 0;

        setStats({
          solvedToday: todayAttempts.length,
          streak: streakDays ?? 0,
          accuracy: accuracyVal || readiness,
          predictedScore: predicted,
        });
        setDueReviewCount(dueItems.length);

        // Last chapter from localStorage
        const saved = localStorage.getItem('lastChapter');
        setLastChapter(saved);

        // Recent activity
        const activities = await getAttemptsByUser(user.id, { limit: 3 });
        setRecentActivity(activities);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, profile]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getExamDaysLeft = () => {
    if (!profile?.batch) return null;
    const year = parseInt(profile.batch.replace(/\D/g, ''));
    if (isNaN(year)) return null;
    // Approximate exam date: April of the target year
    const examDate = new Date(year, 3, 15);
    const today = new Date();
    const diff = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : null;
  };

  const daysLeft = getExamDaysLeft();

  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <Navbar />

      <main className="pt-28 md:pt-24 pb-16 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-display tracking-wide text-white mb-2">
            {getGreeting()}, {profile?.name?.split(' ')[0] || 'Student'} 👋
          </h1>
          {daysLeft && (
            <p className="text-slate-400">
              Your {profile?.target_exam?.replace('-', ' ').toUpperCase()} {profile?.batch?.replace(/\D/g, '')} exam is in{' '}
              <span className="text-sky-400 font-semibold">{daysLeft} days</span>. Keep going.
            </p>
          )}
        </div>

        {/* Upgrade banner for free post-trial users */}
        <UpgradeBanner />

        {/* Main Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Visual Learning */}
          <Link
            to="/learn"
            className="group glass-panel rounded-xl p-6 hover:border-sky-500/40 transition-all duration-300 relative overflow-hidden"
          >
            <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sky-500/20 transition-colors">
              <Atom className="w-6 h-6 text-sky-400 group-hover:animate-pulse-sky" />
            </div>
            <h3 className="text-lg font-display tracking-wide mb-2">Visual Learning</h3>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              Interactive physics simulations with AI tutor.
            </p>
            <div className="text-xs text-slate-500 mb-4 font-mono">7 chapters available</div>
            <div className="flex items-center text-sky-400 text-sm font-medium group-hover:gap-2 transition-all">
              Explore Simulations <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* MCQ Practice */}
          <Link
            to="/practice"
            className="group glass-panel rounded-xl p-6 hover:border-violet-500/40 transition-all duration-300 relative overflow-hidden"
          >
            <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
              <BookOpen className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="text-lg font-display tracking-wide mb-2">MCQ Practice</h3>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              Year-wise PYQs for JEE Main, Advanced &amp; MHT CET.
            </p>
            <div className="text-xs text-slate-500 mb-4 font-mono">10,000+ questions</div>
            <div className="flex items-center text-violet-400 text-sm font-medium group-hover:gap-2 transition-all">
              Start Practicing <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Mock Test */}
          <div className="group glass-panel rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                Coming Soon
              </span>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-display tracking-wide mb-2">Mock Test</h3>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              Full length timed tests with detailed analysis.
            </p>
            <div className="text-xs text-slate-500 mb-4 font-mono">Full syllabus coverage</div>
            <div className="flex items-center text-emerald-400/50 text-sm font-medium">
              Coming Soon
            </div>
          </div>
        </div>

        {/* Today's Summary */}
        <section className="mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 font-sans">
            Today&apos;s Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="glass-panel rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-2">
                <Target className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">Questions Solved</span>
              </div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-white">
                {isLoading ? '—' : stats.solvedToday}
              </div>
            </div>
            <div className="glass-panel rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-2">
                <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" /> Streak
              </div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-white">
                {isLoading ? '—' : `${stats.streak} days`}
              </div>
            </div>
            <div className="glass-panel rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-2">
                <BarChart3 className="w-3.5 h-3.5 shrink-0" /> Accuracy
              </div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-white">
                {isLoading ? '—' : `${stats.accuracy}%`}
              </div>
            </div>
            <div className="glass-panel rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-sky-400 shrink-0" /> <span className="truncate">Predicted Score</span>
              </div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-white">
                {isLoading ? '—' : stats.predictedScore}
                <span className="text-sm text-slate-500 font-sans font-normal ml-1">
                  / {profile?.target_exam === 'mht-cet' ? 200 : 300}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">
              Recent Activity
            </h2>
            <Link to="/profile" className="text-xs text-sky-400 hover:text-sky-300 transition-colors">View All</Link>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              <div className="glass-panel rounded-xl p-8 flex flex-col items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-sky-400 mb-2" />
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Syncing progress...</p>
              </div>
            ) : recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="glass-panel rounded-xl p-4 flex items-center justify-between group hover:border-sky-500/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.is_correct ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white capitalize">
                        {activity.questions?.chapter?.replace(/-/g, ' ')}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                        {activity.questions?.subject} • {new Date(activity.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-bold font-mono ${
                      activity.is_correct ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {activity.is_correct ? 'CORRECT' : 'WRONG'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-panel border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-slate-500">
                <Clock className="w-8 h-8 opacity-20 mb-3" />
                <p className="text-sm">No recent activity detected.</p>
                <p className="text-[10px] uppercase tracking-widest font-bold mt-1">Start a simulation to see it here</p>
              </div>
            )}
          </div>
        </section>

        {/* Continue Where You Left Off */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 font-sans">
            Continue Where You Left Off
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lastChapter && (
              <Link
                to={`/learn/${lastChapter}`}
                className="glass-panel rounded-xl p-5 hover:border-sky-500/30 transition-all flex items-center justify-between"
              >
                <div>
                  <div className="text-xs text-slate-500 mb-1">Last Chapter Studied</div>
                  <div className="text-white font-medium capitalize">
                    {lastChapter.replace(/-/g, ' ')}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </Link>
            )}
            {dueReviewCount > 0 && (
              <Link
                to="/practice"
                className="glass-panel rounded-xl p-5 hover:border-amber-500/30 transition-all flex items-center justify-between"
              >
                <div>
                  <div className="text-xs text-slate-500 mb-1">Questions Due for Review</div>
                  <div className="text-white font-medium">
                    {dueReviewCount} question{dueReviewCount !== 1 ? 's' : ''} due today
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </Link>
            )}
            {!lastChapter && dueReviewCount === 0 && (
              <div className="glass-panel rounded-xl opacity-80 p-5 col-span-full text-center text-slate-500">
                Start a chapter or practice questions to see your progress here.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
