-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/cvlqcvixjqdgmfojjisf/sql/new
-- Or use: npx supabase db push (if CLI is set up)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── profiles ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
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
CREATE TABLE IF NOT EXISTS public.questions (
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
CREATE POLICY "Questions readable by authenticated" ON public.questions FOR SELECT USING (auth.role() = 'authenticated');

-- ─── attempts ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_option TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken_ms INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own attempts" ON public.attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own attempts" ON public.attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─── knowledge_state ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.knowledge_state (
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
CREATE POLICY "Users read own knowledge" ON public.knowledge_state FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own knowledge" ON public.knowledge_state FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own knowledge" ON public.knowledge_state FOR UPDATE USING (auth.uid() = user_id);

-- ─── review_queue ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.review_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  next_review TIMESTAMPTZ NOT NULL DEFAULT now(),
  interval_days INTEGER NOT NULL DEFAULT 1,
  ease_factor FLOAT NOT NULL DEFAULT 2.5,
  repetitions INTEGER NOT NULL DEFAULT 0
);
ALTER TABLE public.review_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own review queue" ON public.review_queue FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own review queue" ON public.review_queue FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own review queue" ON public.review_queue FOR UPDATE USING (auth.uid() = user_id);

-- ─── test_sessions ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.test_sessions (
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
CREATE POLICY "Users read own sessions" ON public.test_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own sessions" ON public.test_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─── leaderboard_scores ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leaderboard_scores (
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
CREATE POLICY "Leaderboard readable by authenticated" ON public.leaderboard_scores FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users insert own leaderboard" ON public.leaderboard_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own leaderboard" ON public.leaderboard_scores FOR UPDATE USING (auth.uid() = user_id);
