import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import { Target, TrendingUp, Flame, Clock, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getKnowledgeState, getAnalyticsAttempts } from '@/lib/supabase-helpers';
import {
  predictJEEScore, getWeakChapters, getStrongChapters,
  getReadinessPercentage, getStudyRecommendation,
} from '@/services/ml/performancePredictor';
import { getMasteryBgColor } from '@/services/ml/knowledgeTracing';
import { supabase, type KnowledgeState } from '@/lib/supabase';
import Navbar from '@/components/Navbar';

interface DailyData {
  date: string;
  attempted: number;
  correct: number;
  accuracy: number;
}

const SUBJECT_COLORS: Record<string, string> = {
  physics: '#38bdf8',
  chemistry: '#34d399',
  maths: '#a78bfa',
};

const DIFFICULTY_COLORS = ['#34d399', '#38bdf8', '#a78bfa'];

const Analytics: React.FC = () => {
  const { user, profile } = useAuthStore();
  const [knowledgeStates, setKnowledgeStates] = useState<KnowledgeState[]>([]);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [totalSolved, setTotalSolved] = useState(0);
  const [streak, setStreak] = useState(0);
  const [studyTime, setStudyTime] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState('physics');
  const [isLoading, setIsLoading] = useState(true);
  const [difficultyData, setDifficultyData] = useState<{name: string; value: number; accuracy: number}[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        // Knowledge states
        const ks = await getKnowledgeState(user.id);
        setKnowledgeStates(ks);

        // Optimized count only for total solved
        const { count, error: countError } = await supabase
          .from('attempts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        if (!countError) setTotalSolved(count || 0);

        // Lightweight attempts for analytics (essential fields only)
        const attempts = await getAnalyticsAttempts(user.id);

        // Study time (sum of time_taken_ms)
        const totalMs = attempts.reduce((s, a) => s + a.time_taken_ms, 0);
        setStudyTime(Math.round(totalMs / (1000 * 60 * 60) * 10) / 10);

        // Daily data for last 14 days
        const daily: Record<string, { attempted: number; correct: number }> = {};
        const now = new Date();
        for (let i = 13; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          const key = d.toISOString().split('T')[0];
          daily[key] = { attempted: 0, correct: 0 };
        }
        for (const a of attempts) {
          const key = new Date(a.created_at).toISOString().split('T')[0];
          if (daily[key]) {
            daily[key].attempted++;
            if (a.is_correct) daily[key].correct++;
          }
        }
        setDailyData(
          Object.entries(daily).map(([date, d]) => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            attempted: d.attempted,
            correct: d.correct,
            accuracy: d.attempted > 0 ? Math.round((d.correct / d.attempted) * 100) : 0,
          }))
        );

        // Streak
        const { data: lb } = await supabase
          .from('leaderboard_scores')
          .select('streak_days')
          .eq('user_id', user.id)
          .maybeSingle();
        setStreak((lb as any)?.streak_days ?? 0);

        // Actual Difficulty breakdown using joined questions data (minimal payload)
        let easyCount = 0;
        let mainCount = 0;
        let advCount = 0;

        for (const a of attempts) {
          const diff = (a as any).questions?.difficulty;
          if (diff === 'easy' || diff === '1') easyCount++;
          else if (diff === 'jee-main' || diff === '2') mainCount++;
          else if (diff === 'jee-advanced' || diff === '3') advCount++;
        }

        setDifficultyData([
          { name: 'Level 1 (Easy)', value: Math.max(easyCount, 0), accuracy: 85 },
          { name: 'Level 2 (Mains)', value: Math.max(mainCount, 0), accuracy: 65 },
          { name: 'Level 3 (Adv)', value: Math.max(advCount, 0), accuracy: 45 },
        ]);
      } catch (err) {
        console.error('Error loading analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  const overallAccuracy = useMemo(() => {
    const total = knowledgeStates.reduce((s, k) => s + k.total_attempts, 0);
    const correct = knowledgeStates.reduce((s, k) => s + k.correct_attempts, 0);
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  }, [knowledgeStates]);

  const predictedScore = useMemo(
    () => predictJEEScore(knowledgeStates, profile?.target_exam || 'jee-main'),
    [knowledgeStates, profile]
  );

  const readiness = useMemo(() => getReadinessPercentage(knowledgeStates), [knowledgeStates]);
  const recommendation = useMemo(() => getStudyRecommendation(knowledgeStates), [knowledgeStates]);
  const weakChapters = useMemo(() => getWeakChapters(knowledgeStates), [knowledgeStates]);
  const strongChapters = useMemo(() => getStrongChapters(knowledgeStates), [knowledgeStates]);

  const subjectKnowledgeStates = useMemo(
    () => knowledgeStates.filter((k) => k.subject === selectedSubject),
    [knowledgeStates, selectedSubject]
  );

  const subjectAccuracies = useMemo(() => {
    return ['physics', 'chemistry', 'maths'].map((sub) => {
      const subKs = knowledgeStates.filter((k) => k.subject === sub);
      const total = subKs.reduce((s, k) => s + k.total_attempts, 0);
      const correct = subKs.reduce((s, k) => s + k.correct_attempts, 0);
      return {
        subject: sub.charAt(0).toUpperCase() + sub.slice(1),
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
        color: SUBJECT_COLORS[sub],
      };
    });
  }, [knowledgeStates]);

  const formatChapterName = (slug: string) =>
    slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent text-slate-100">
        <Navbar />
        <div className="flex items-center justify-center pt-32">
          <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
        </div>
      </div>
    );
  }

  const hasData = totalSolved > 0 || knowledgeStates.length > 0;

  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <Navbar />
      <main className="pt-28 md:pt-24 pb-16 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-display tracking-wide mb-2">Analytics</h1>
        <p className="text-slate-400 mb-8 font-sans">Track your progress and performance.</p>

        {!hasData && (
          <div className="glass-panel rounded-xl p-8 text-center mb-8">
            <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 mb-2">No data yet</p>
            <p className="text-slate-500 text-sm mb-4">Start practicing to see your analytics here.</p>
            <Link
              to="/practice"
              className="bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-lg px-6 py-2.5 text-sm transition-colors inline-block"
            >
              Start Practicing
            </Link>
          </div>
        )}

        {/* Section 1: Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-10">
          {[
            { icon: Target, label: 'Questions Solved', value: totalSolved, color: 'text-sky-400' },
            { icon: TrendingUp, label: 'Accuracy', value: `${overallAccuracy}%`, color: 'text-emerald-400' },
            { icon: Flame, label: 'Streak', value: `${streak} days`, color: 'text-orange-400' },
            { icon: BookOpen, label: 'Pred. Score', value: predictedScore, color: 'text-violet-400' },
            { icon: Clock, label: 'Study Time', value: `${studyTime}h`, color: 'text-amber-400' },
          ].map((stat) => (
            <div key={stat.label} className="glass-panel rounded-xl p-3 sm:p-4 hover:border-sky-500/30 transition-colors">
              <stat.icon className={`w-4 h-4 ${stat.color} mb-2`} />
              <div className="text-lg sm:text-xl font-mono font-bold text-white">{stat.value}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>

        {hasData && (
          <>
            {/* Section 2: Performance Over Time */}
            <section className="mb-10">
              <h2 className="text-xs font-bold font-sans uppercase tracking-wider text-slate-400 mb-4">
                Performance Over Time (Last 14 Days)
              </h2>
              <div className="glass-panel rounded-xl p-6">
                {dailyData.some(d => d.attempted > 0) ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} interval="preserveStartEnd" />
                      <YAxis tick={{ fill: '#64748b', fontSize: 10 }} width={30} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#e2e8f0' }}
                      />
                      <Line type="monotone" dataKey="attempted" stroke="#38bdf8" strokeWidth={2} dot={false} name="Attempted" />
                      <Line type="monotone" dataKey="correct" stroke="#34d399" strokeWidth={2} dot={false} name="Correct" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[280px] flex items-center justify-center text-slate-500 text-sm">
                    No data yet — start practicing to see your trends.
                  </div>
                )}
              </div>
            </section>

            {/* Section 3: Subject Performance */}
            <section className="mb-10">
              <h2 className="text-xs font-bold font-sans uppercase tracking-wider text-slate-400 mb-4">
                Subject Performance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subjectAccuracies.map((sub) => (
                  <div key={sub.subject} className="glass-panel rounded-xl p-5 text-center">
                    <div className="text-3xl font-mono font-bold text-white mb-1">{sub.accuracy}%</div>
                    <div className="text-sm text-slate-400 mb-3">{sub.subject}</div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${sub.accuracy}%`, backgroundColor: sub.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4: Chapter Mastery */}
            <section className="mb-10">
              <h2 className="text-xs font-bold font-sans uppercase tracking-wider text-slate-400 mb-4">
                Chapter Mastery
              </h2>
              {/* Subject tabs */}
              <div className="flex gap-2 mb-4">
                {['physics', 'chemistry', 'maths'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
                      selectedSubject === sub
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
              <div className="glass-panel rounded-xl p-6">
                {subjectKnowledgeStates.length > 0 ? (
                  <ResponsiveContainer width="100%" height={Math.max(200, subjectKnowledgeStates.length * 40)}>
                    <BarChart data={subjectKnowledgeStates.map(k => ({
                      chapter: formatChapterName(k.chapter),
                      mastery: Math.round(k.mastery * 100),
                      fill: k.mastery < 0.4 ? '#ef4444' : k.mastery < 0.7 ? '#f59e0b' : '#10b981',
                    }))} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                      <YAxis type="category" dataKey="chapter" width={100} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#e2e8f0' }}
                        formatter={(value: number) => [`${value}%`, 'Mastery']}
                      />
                      <Bar dataKey="mastery" radius={[0, 4, 4, 0]}>
                        {subjectKnowledgeStates.map((k, i) => (
                          <Cell
                            key={i}
                            fill={k.mastery < 0.4 ? '#ef4444' : k.mastery < 0.7 ? '#f59e0b' : '#10b981'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
                    No mastery data for this subject yet.
                  </div>
                )}
              </div>
            </section>

            {/* Section 5: Weak vs Strong */}
            <section className="mb-10">
              <h2 className="text-xs font-bold font-sans uppercase tracking-wider text-slate-400 mb-4">
                Weak vs Strong Topics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-red-400 mb-3">⚠️ Needs Attention</h3>
                  {weakChapters.length > 0 ? (
                    <div className="space-y-2">
                      {weakChapters.slice(0, 5).map((ch) => {
                        const ks = knowledgeStates.find((k) => k.chapter === ch);
                        return (
                          <div key={ch} className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 flex items-center justify-between">
                            <div>
                              <div className="text-sm text-white">{formatChapterName(ch)}</div>
                              <div className="text-xs text-red-400">{Math.round((ks?.mastery || 0) * 100)}% mastery</div>
                            </div>
                            <Link
                              to="/practice"
                              className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-lg hover:bg-red-500/30 transition-colors"
                            >
                              Practice
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500 glass-panel rounded-lg p-4 text-center">
                      No weak topics detected! Great work.
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-emerald-400 mb-3">✅ Strong Topics</h3>
                  {strongChapters.length > 0 ? (
                    <div className="space-y-2">
                      {strongChapters.slice(0, 5).map((ch) => {
                        const ks = knowledgeStates.find((k) => k.chapter === ch);
                        return (
                          <div key={ch} className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                            <div className="text-sm text-white">{formatChapterName(ch)}</div>
                            <div className="text-xs text-emerald-400">{Math.round((ks?.mastery || 0) * 100)}% mastery</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500 glass-panel rounded-lg p-4 text-center">
                      Keep practicing to build strong topics!
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Section 6: Difficulty Breakdown */}
            <section className="mb-10">
              <h2 className="text-xs font-bold font-sans uppercase tracking-wider text-slate-400 mb-4">
                Difficulty Breakdown
              </h2>
              <div className="glass-panel rounded-xl p-4 sm:p-6 flex flex-col items-center md:flex-row gap-6">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={difficultyData}
                        cx="50%" cy="50%"
                        innerRadius={50} outerRadius={70}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {difficultyData.map((_, i) => (
                          <Cell key={i} fill={DIFFICULTY_COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#e2e8f0' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3">
                  {difficultyData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: DIFFICULTY_COLORS[i] }} />
                      <span className="text-sm text-slate-300 flex-1">{d.name}</span>
                      <span className="text-sm text-slate-400">{d.value} questions</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 7: ML Insights */}
            <section>
              <h2 className="text-xs font-bold font-sans uppercase tracking-wider text-slate-400 mb-4">
                ML Insights
              </h2>
              <div className="glass-panel rounded-xl p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-sky-950/20 pointer-events-none" />
                <p className="text-slate-400 text-sm mb-6 relative">Based on your performance:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 relative">
                  <div className="glass-panel bg-slate-900/40 rounded-lg p-4 text-center border-none">
                    <div className="text-2xl font-mono font-bold text-sky-400">{predictedScore}</div>
                    <div className="text-xs text-slate-500">Predicted Score</div>
                  </div>
                  <div className="glass-panel bg-slate-900/40 rounded-lg p-4 text-center border-none">
                    <div className="text-2xl font-mono font-bold text-emerald-400">{readiness}%</div>
                    <div className="text-xs text-slate-500">Readiness</div>
                  </div>
                  <div className="glass-panel bg-slate-900/40 rounded-lg p-4 text-center border-none">
                    <div className="text-2xl font-mono font-bold text-violet-400">{weakChapters.length}</div>
                    <div className="text-xs text-slate-500">Areas to Improve</div>
                  </div>
                </div>
                <div className="bg-slate-900/40 rounded-lg p-4 border border-slate-800/50 backdrop-blur-md relative">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    💡 {recommendation}
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Analytics;
