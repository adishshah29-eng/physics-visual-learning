import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Target, TrendingUp, Flame, BookOpen, Clock, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { getKnowledgeState, getAnalyticsAttempts, getProfile } from '@/lib/supabase-helpers';
import {
  predictJEEScore, getWeakChapters, getStrongChapters,
  getReadinessPercentage, getStudyRecommendation,
} from '@/services/ml/performancePredictor';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from 'recharts';
import type { KnowledgeState, Profile } from '@/lib/supabase';

const UserDetailAnalytics: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [student, setStudent] = useState<Profile | null>(null);
  const [knowledgeStates, setKnowledgeStates] = useState<KnowledgeState[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) loadStudentData();
  }, [userId]);

  const loadStudentData = async () => {
    setIsLoading(true);
    try {
      const [prof, ks, atts] = await Promise.all([
        getProfile(userId!),
        getKnowledgeState(userId!),
        getAnalyticsAttempts(userId!)
      ]);
      setStudent(prof);
      setKnowledgeStates(ks);
      setAttempts(atts);
    } catch (err) {
      console.error('Error loading student data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const predictedScore = useMemo(() => predictJEEScore(knowledgeStates, student?.target_exam || 'jee-main'), [knowledgeStates, student]);
  const readiness = useMemo(() => getReadinessPercentage(knowledgeStates), [knowledgeStates]);
  const weakChapters = useMemo(() => getWeakChapters(knowledgeStates), [knowledgeStates]);
  const strongChapters = useMemo(() => getStrongChapters(knowledgeStates), [knowledgeStates]);

  const stats = useMemo(() => {
    const totalMs = attempts.reduce((s, a) => s + a.time_taken_ms, 0);
    const studyHours = Math.round(totalMs / (1000 * 60 * 60) * 10) / 10;
    const total = knowledgeStates.reduce((s, k) => s + k.total_attempts, 0);
    const correct = knowledgeStates.reduce((s, k) => s + k.correct_attempts, 0);
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    return { studyHours, total, correct, accuracy };
  }, [attempts, knowledgeStates]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent text-slate-100 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sky-400 mb-4" />
        <p className="text-xs uppercase tracking-widest font-bold">Loading Student Analytics...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-transparent text-slate-100 flex flex-col items-center justify-center">
        <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
        <p>Student not found.</p>
        <Link to="/admin" className="text-sky-400 mt-4 underline">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-28 md:pt-24 pb-16 px-4 sm:px-6 w-full max-w-5xl mx-auto">
        <Link to="/admin" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Students
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-2xl">
              {student.avatar_url ? <img src={student.avatar_url} className="w-full h-full rounded-2xl object-cover" /> : student.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-display text-white">{student.name}</h1>
              <p className="text-slate-400 text-sm">{student.email} • {student.batch || 'No Batch'}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
             <div className="glass-panel px-4 py-2 rounded-xl text-center">
              <div className="text-xl font-mono font-bold text-sky-400">{readiness}%</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Readiness</div>
            </div>
            <div className="glass-panel px-4 py-2 rounded-xl text-center">
              <div className="text-xl font-mono font-bold text-violet-400">{predictedScore}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Pred. Score</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Stats Cards */}
           <div className="glass-panel rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-sky-500/10 rounded-lg text-sky-400"><Target className="w-5 h-5" /></div>
            <div>
              <p className="text-lg font-mono font-bold text-white">{stats.total}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Questions</p>
            </div>
          </div>
          <div className="glass-panel rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400"><TrendingUp className="w-5 h-5" /></div>
            <div>
              <p className="text-lg font-mono font-bold text-white">{stats.accuracy}%</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Overall Accuracy</p>
            </div>
          </div>
          <div className="glass-panel rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400"><Clock className="w-5 h-5" /></div>
            <div>
              <p className="text-lg font-mono font-bold text-white">{stats.studyHours}h</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Study Time</p>
            </div>
          </div>
        </div>

        {/* Strong vs Weak */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="glass-panel p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Strong Topics
            </h3>
            {strongChapters.length > 0 ? (
              <ul className="space-y-2">
                {strongChapters.map(ch => (
                  <li key={ch} className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg px-3 py-2 text-sm text-slate-300 capitalize">
                    {ch.replace(/-/g, ' ')}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 text-sm">No strong topics detected yet.</p>
            )}
          </section>

          <section className="glass-panel p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Areas to Improve
            </h3>
             {weakChapters.length > 0 ? (
              <ul className="space-y-2">
                {weakChapters.map(ch => (
                  <li key={ch} className="bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2 text-sm text-slate-300 capitalize">
                    {ch.replace(/-/g, ' ')}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 text-sm">No weak topics detected.</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserDetailAnalytics;
