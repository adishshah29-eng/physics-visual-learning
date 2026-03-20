import {
  supabase,
  type Profile,
  type ProfileInsert,
  type ProfileUpdate,
  type AttemptInsert,
  type Attempt,
  type KnowledgeState,
  type LeaderboardScore,
} from './supabase';
import { updateMastery } from '@/services/ml/knowledgeTracing';

/*
══════════════════════════════════════════════════════════════════════════════════
SQL MIGRATION — Run this in Supabase SQL Editor to create all tables with RLS
══════════════════════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── profiles ────────────────────────────────────────────────────────────────
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  batch TEXT NOT NULL DEFAULT 'JEE2026',
  target_exam TEXT NOT NULL DEFAULT 'jee-main',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ─── questions ───────────────────────────────────────────────────────────────
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam TEXT NOT NULL CHECK (exam IN ('jee-main','jee-advanced','mht-cet')),
  subject TEXT NOT NULL CHECK (subject IN ('physics','chemistry','maths')),
  chapter TEXT NOT NULL,
  year INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option TEXT NOT NULL CHECK (correct_option IN ('a','b','c','d')),
  explanation TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy','jee-main','jee-advanced')),
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Questions are readable by authenticated users" ON public.questions
  FOR SELECT USING (auth.role() = 'authenticated');

-- ─── attempts ────────────────────────────────────────────────────────────────
CREATE TABLE public.attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_option TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken_ms INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own attempts" ON public.attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attempts" ON public.attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─── knowledge_state ─────────────────────────────────────────────────────────
CREATE TABLE public.knowledge_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  chapter TEXT NOT NULL,
  mastery FLOAT NOT NULL DEFAULT 0.0,
  total_attempts INTEGER NOT NULL DEFAULT 0,
  correct_attempts INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, subject, chapter)
);
ALTER TABLE public.knowledge_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own knowledge" ON public.knowledge_state FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own knowledge" ON public.knowledge_state FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own knowledge" ON public.knowledge_state FOR UPDATE USING (auth.uid() = user_id);

-- ─── review_queue ────────────────────────────────────────────────────────────
CREATE TABLE public.review_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  next_review TIMESTAMPTZ NOT NULL DEFAULT now(),
  interval_days INTEGER NOT NULL DEFAULT 1,
  ease_factor FLOAT NOT NULL DEFAULT 2.5,
  repetitions INTEGER NOT NULL DEFAULT 0
);
ALTER TABLE public.review_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own review queue" ON public.review_queue FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own review queue" ON public.review_queue FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own review queue" ON public.review_queue FOR UPDATE USING (auth.uid() = user_id);

-- ─── test_sessions ───────────────────────────────────────────────────────────
CREATE TABLE public.test_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam TEXT NOT NULL,
  subject TEXT,
  total_questions INTEGER NOT NULL,
  correct INTEGER NOT NULL,
  time_taken_ms INTEGER NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.test_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own sessions" ON public.test_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON public.test_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─── leaderboard_scores ──────────────────────────────────────────────────────
CREATE TABLE public.leaderboard_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  batch TEXT NOT NULL,
  total_score INTEGER NOT NULL DEFAULT 0,
  accuracy FLOAT NOT NULL DEFAULT 0.0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  questions_solved INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE public.leaderboard_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leaderboard readable by authenticated" ON public.leaderboard_scores
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert own leaderboard" ON public.leaderboard_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own leaderboard" ON public.leaderboard_scores
  FOR UPDATE USING (auth.uid() = user_id);

══════════════════════════════════════════════════════════════════════════════════
*/

// ─── Profile Helpers ───────────────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
}

export async function upsertProfile(
  profile: ProfileInsert | ProfileUpdate & { id: string }
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile as any)
    .select()
    .single();

  if (error) {
    console.error('Error upserting profile:', error);
    return null;
  }
  return data;
}

// ─── Attempt Helpers ───────────────────────────────────────────────────────────

export async function saveAttempt(attempt: AttemptInsert): Promise<Attempt | null> {
  const { data, error } = await supabase
    .from('attempts')
    .insert(attempt as any)
    .select()
    .single();

  if (error) {
    console.error('Error saving attempt:', error);
    return null;
  }
  return data;
}

export async function getAttemptsByUser(
  userId: string,
  filters?: {
    exam?: string;
    subject?: string;
    chapter?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }
): Promise<Attempt[]> {
  let query = supabase
    .from('attempts')
    .select('*, questions!inner(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (filters?.exam) {
    query = query.eq('questions.exam', filters.exam);
  }
  if (filters?.subject) {
    query = query.eq('questions.subject', filters.subject);
  }
  if (filters?.chapter) {
    query = query.eq('questions.chapter', filters.chapter);
  }
  if (filters?.startDate) {
    query = query.gte('created_at', filters.startDate);
  }
  if (filters?.endDate) {
    query = query.lte('created_at', filters.endDate);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching attempts:', error);
    return [];
  }
  return (data as unknown as Attempt[]) || [];
}

export async function getAnalyticsAttempts(userId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('attempts')
    .select('is_correct, time_taken_ms, created_at, questions!inner(difficulty)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching analytics attempts:', error);
    return [];
  }
  return data || [];
}

// ─── Knowledge State Helpers ───────────────────────────────────────────────────

export async function getKnowledgeState(userId: string): Promise<KnowledgeState[]> {
  const { data, error } = await supabase
    .from('knowledge_state')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching knowledge state:', error);
    return [];
  }
  return data || [];
}

export async function updateKnowledgeState(
  userId: string,
  subject: string,
  chapter: string,
  isCorrect: boolean
): Promise<KnowledgeState | null> {
  // Fetch existing state
  const { data: existing } = await supabase
    .from('knowledge_state')
    .select('*')
    .eq('user_id', userId)
    .eq('subject', subject)
    .eq('chapter', chapter)
    .maybeSingle();

  const currentMastery = (existing as any)?.mastery ?? 0.3; // Default starting mastery
  const totalAttempts = ((existing as any)?.total_attempts ?? 0) + 1;
  const correctAttempts = ((existing as any)?.correct_attempts ?? 0) + (isCorrect ? 1 : 0);
  const newMastery = updateMastery(currentMastery, isCorrect);

  const { data, error } = await supabase
    .from('knowledge_state')
    .upsert(
      {
        user_id: userId,
        subject,
        chapter,
        mastery: newMastery,
        total_attempts: totalAttempts,
        correct_attempts: correctAttempts,
        last_updated: new Date().toISOString(),
      } as any,
      { onConflict: 'user_id,subject,chapter' }
    )
    .select()
    .single();

  if (error) {
    console.error('Error updating knowledge state:', error);
    return null;
  }
  return data;
}

// ─── Leaderboard Helpers ───────────────────────────────────────────────────────

export async function getLeaderboard(
  batch?: string,
  limit = 50
): Promise<(LeaderboardScore & { profiles: Pick<Profile, 'name' | 'avatar_url'> })[]> {
  let query = supabase
    .from('leaderboard_scores')
    .select('*, profiles!inner(name, avatar_url)')
    .order('total_score', { ascending: false })
    .limit(limit);

  if (batch && batch !== 'all') {
    query = query.eq('batch', batch);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
  return (data as unknown as (LeaderboardScore & { profiles: Pick<Profile, 'name' | 'avatar_url'> })[]) || [];
}

export async function updateLeaderboardScore(userId: string): Promise<void> {
  // Fetch the user's profile for batch info
  const profile = await getProfile(userId);
  if (!profile) return;

  // Calculate aggregated stats from attempts
  const { data: attempts } = await supabase
    .from('attempts')
    .select('is_correct, questions!inner(difficulty)')
    .eq('user_id', userId);

  if (!attempts || attempts.length === 0) return;

  let totalScore = 0;
  let correctCount = 0;

  for (const attempt of attempts as any[]) {
    if (attempt.is_correct) {
      correctCount++;
      const diff = (attempt as any).questions?.difficulty;
      if (diff === 'easy') totalScore += 1;
      else if (diff === 'jee-main') totalScore += 2;
      else if (diff === 'jee-advanced') totalScore += 3;
    }
  }

  const accuracy = attempts.length > 0 ? correctCount / attempts.length : 0;

  // Calculate streak (consecutive days with at least 1 attempt)
  const { data: recentAttempts } = await supabase
    .from('attempts')
    .select('created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(365);

  let streakDays = 0;
  if (recentAttempts && recentAttempts.length > 0) {
    const dates = [...new Set(
      (recentAttempts as { created_at: string }[]).map(a => new Date(a.created_at).toISOString().split('T')[0])
    )].sort().reverse();

    const today = new Date().toISOString().split('T')[0];
    if (dates[0] === today || dates[0] === getYesterday()) {
      streakDays = 1;
      for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i - 1]);
        const currDate = new Date(dates[i]);
        const diffDays = Math.round(
          (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays === 1) {
          streakDays++;
        } else {
          break;
        }
      }
    }
  }

  await supabase.from('leaderboard_scores').upsert(
    {
      user_id: userId,
      batch: profile.batch,
      total_score: totalScore,
      accuracy: Math.round(accuracy * 100) / 100,
      streak_days: streakDays,
      questions_solved: (attempts as any[]).length,
      updated_at: new Date().toISOString(),
    } as any,
    { onConflict: 'user_id' }
  );
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}
