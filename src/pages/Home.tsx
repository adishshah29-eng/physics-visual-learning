import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Atom, BookOpen, BarChart3, Clock, Flame, Target, TrendingUp, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getKnowledgeState, getAttemptsByUser } from '@/lib/supabase-helpers';
import { getReadinessPercentage, predictJEEScore } from '@/services/ml/performancePredictor';
import { getDueItems } from '@/services/ml/spacedRepetition';
import { supabase, type KnowledgeState, type ReviewQueueItem } from '@/lib/supabase';
import Navbar from '@/components/Navbar';

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

        setStats({
          solvedToday: todayAttempts.length,
          streak: leaderboard?.streak_days || 0,
          accuracy: accuracyVal || readiness,
          predictedScore: predicted,
        });
        setDueReviewCount(dueItems.length);

        // Last chapter from localStorage
        const saved = localStorage.getItem('lastChapter');
        setLastChapter(saved);
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
        {/* Greeting */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {getGreeting()}, {profile?.name?.split(' ')[0] || 'Student'} 👋
          </h1>
          {daysLeft && (
            <p className="text-slate-400">
              Your {profile?.target_exam?.replace('-', ' ').toUpperCase()} {profile?.batch?.replace(/\D/g, '')} exam is in{' '}
              <span className="text-sky-400 font-semibold">{daysLeft} days</span>. Keep going.
            </p>
          )}
        </div>

        {/* Main Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Visual Learning */}
          <Link
            to="/learn"
            className="group bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-sky-500/40 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sky-500/20 transition-colors">
              <Atom className="w-6 h-6 text-sky-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Visual Learning</h3>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              Interactive physics simulations with AI tutor.
            </p>
            <div className="text-xs text-slate-500 mb-4">7 chapters available</div>
            <div className="flex items-center text-sky-400 text-sm font-medium group-hover:gap-2 transition-all">
              Explore Simulations <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* MCQ Practice */}
          <Link
            to="/practice"
            className="group bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-violet-500/40 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
              <BookOpen className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">MCQ Practice</h3>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              Year-wise PYQs for JEE Main, Advanced &amp; MHT CET.
            </p>
            <div className="text-xs text-slate-500 mb-4">10,000+ questions</div>
            <div className="flex items-center text-violet-400 text-sm font-medium group-hover:gap-2 transition-all">
              Start Practicing <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Mock Test */}
          <div className="group bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                Coming Soon
              </span>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Mock Test</h3>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              Full length timed tests with detailed analysis.
            </p>
            <div className="text-xs text-slate-500 mb-4">Full syllabus coverage</div>
            <div className="flex items-center text-emerald-400/50 text-sm font-medium">
              Coming Soon
            </div>
          </div>
        </div>

        {/* Today's Summary */}
        <section className="mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Today&apos;s Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                <Target className="w-3.5 h-3.5" /> Questions Solved
              </div>
              <div className="text-2xl font-bold text-white">
                {isLoading ? '—' : stats.solvedToday}
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                <Flame className="w-3.5 h-3.5 text-orange-400" /> Streak
              </div>
              <div className="text-2xl font-bold text-white">
                {isLoading ? '—' : `${stats.streak} days`}
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                <BarChart3 className="w-3.5 h-3.5" /> Accuracy
              </div>
              <div className="text-2xl font-bold text-white">
                {isLoading ? '—' : `${stats.accuracy}%`}
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-sky-400" /> Predicted Score
              </div>
              <div className="text-2xl font-bold text-white">
                {isLoading ? '—' : stats.predictedScore}
                <span className="text-sm text-slate-500 font-normal ml-1">
                  / {profile?.target_exam === 'mht-cet' ? 200 : 300}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Continue Where You Left Off */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Continue Where You Left Off
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lastChapter && (
              <Link
                to={`/learn/${lastChapter}`}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-sky-500/30 transition-all flex items-center justify-between"
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
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-amber-500/30 transition-all flex items-center justify-between"
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
              <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5 col-span-full text-center text-slate-500">
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
