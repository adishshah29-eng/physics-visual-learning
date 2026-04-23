import { createClient } from '@supabase/supabase-js';

// ─── Database Type Definitions ─────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          batch: string;
          target_exam: string;
          avatar_url: string | null;
          role: string;
          streak_days: number;
          plan: 'free' | 'pro';
          created_at: string;
          last_seen: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          batch: string;
          target_exam: string;
          avatar_url?: string | null;
          role?: string;
          streak_days?: number;
          plan?: 'free' | 'pro';
          created_at?: string;
          last_seen?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          batch?: string;
          target_exam?: string;
          avatar_url?: string | null;
          role?: string;
          streak_days?: number;
          plan?: 'free' | 'pro';
          created_at?: string;
          last_seen?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: 'free' | 'pro';
          status: 'active' | 'cancelled' | 'expired' | 'trialing';
          razorpay_subscription_id: string | null;
          razorpay_payment_id: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          trial_end: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan?: 'free' | 'pro';
          status?: 'active' | 'cancelled' | 'expired' | 'trialing';
          razorpay_subscription_id?: string | null;
          razorpay_payment_id?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          trial_end?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan?: 'free' | 'pro';
          status?: 'active' | 'cancelled' | 'expired' | 'trialing';
          razorpay_subscription_id?: string | null;
          razorpay_payment_id?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          trial_end?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          exam: string;
          subject: string;
          chapter: string;
          year: number;
          question_text: string;
          option_a: string;
          option_b: string;
          option_c: string;
          option_d: string;
          correct_option: string;
          explanation: string | null;
          difficulty: string;
          tags: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          exam: string;
          subject: string;
          chapter: string;
          year: number;
          question_text: string;
          option_a: string;
          option_b: string;
          option_c: string;
          option_d: string;
          correct_option: string;
          explanation?: string | null;
          difficulty: string;
          tags?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          exam?: string;
          subject?: string;
          chapter?: string;
          year?: number;
          question_text?: string;
          option_a?: string;
          option_b?: string;
          option_c?: string;
          option_d?: string;
          correct_option?: string;
          explanation?: string | null;
          difficulty?: string;
          tags?: string[] | null;
          created_at?: string;
        };
      };
      attempts: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          selected_option: string;
          is_correct: boolean;
          time_taken_ms: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: string;
          selected_option: string;
          is_correct: boolean;
          time_taken_ms: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          question_id?: string;
          selected_option?: string;
          is_correct?: boolean;
          time_taken_ms?: number;
          created_at?: string;
        };
      };
      knowledge_state: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          chapter: string;
          mastery: number;
          total_attempts: number;
          correct_attempts: number;
          last_updated: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject: string;
          chapter: string;
          mastery?: number;
          total_attempts?: number;
          correct_attempts?: number;
          last_updated?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subject?: string;
          chapter?: string;
          mastery?: number;
          total_attempts?: number;
          correct_attempts?: number;
          last_updated?: string;
        };
      };
      review_queue: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          next_review: string;
          interval_days: number;
          ease_factor: number;
          repetitions: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: string;
          next_review: string;
          interval_days?: number;
          ease_factor?: number;
          repetitions?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          question_id?: string;
          next_review?: string;
          interval_days?: number;
          ease_factor?: number;
          repetitions?: number;
        };
      };
      test_sessions: {
        Row: {
          id: string;
          user_id: string;
          exam: string;
          subject: string | null;
          total_questions: number;
          correct: number;
          time_taken_ms: number;
          answers: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exam: string;
          subject?: string | null;
          total_questions: number;
          correct: number;
          time_taken_ms: number;
          answers: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          exam?: string;
          subject?: string | null;
          total_questions?: number;
          correct?: number;
          time_taken_ms?: number;
          answers?: Record<string, unknown>;
          created_at?: string;
        };
      };
      leaderboard_scores: {
        Row: {
          id: string;
          user_id: string;
          batch: string;
          total_score: number;
          accuracy: number;
          streak_days: number;
          questions_solved: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          batch: string;
          total_score?: number;
          accuracy?: number;
          streak_days?: number;
          questions_solved?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          batch?: string;
          total_score?: number;
          accuracy?: number;
          streak_days?: number;
          questions_solved?: number;
          updated_at?: string;
        };
      };
    };
  };
}

// ─── Supabase Client ───────────────────────────────────────────────────────────

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[PHYSICS.LAB] Missing Supabase credentials.\n' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local\n' +
    'See .env.example for reference.'
  );
}

export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// ─── Convenience Type Exports ──────────────────────────────────────────────────

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Question = Database['public']['Tables']['questions']['Row'];
export type QuestionInsert = Database['public']['Tables']['questions']['Insert'];

export type Attempt = Database['public']['Tables']['attempts']['Row'];
export type AttemptInsert = Database['public']['Tables']['attempts']['Insert'];

export type KnowledgeState = Database['public']['Tables']['knowledge_state']['Row'];
export type KnowledgeStateInsert = Database['public']['Tables']['knowledge_state']['Insert'];

export type ReviewQueueItem = Database['public']['Tables']['review_queue']['Row'];
export type ReviewQueueInsert = Database['public']['Tables']['review_queue']['Insert'];

export type TestSession = Database['public']['Tables']['test_sessions']['Row'];
export type TestSessionInsert = Database['public']['Tables']['test_sessions']['Insert'];

export type LeaderboardScore = Database['public']['Tables']['leaderboard_scores']['Row'];
export type LeaderboardScoreInsert = Database['public']['Tables']['leaderboard_scores']['Insert'];

export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
export type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert'];
export type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update'];

// Feature gate union — strict type for all gated features
export type FeatureGate =
  | 'chemistry'
  | 'maths'
  | 'jee-advanced'
  | 'mht-cet'
  | 'ai-tutor'
  | 'session-mode'
  | 'bookmarks'
  | 'spaced-repetition'
  | 'full-analytics';

export type PricingPlan = 'monthly' | 'quarterly' | 'annual';

export const PRICING = {
  monthly:   { amount: 19900, label: '₹199/mo',         perMonth: 199,  tag: null },
  quarterly: { amount: 44900, label: '₹449/qtr',        perMonth: 150,  tag: 'Best Value' },
  annual:    { amount: 99900, label: '₹999/yr',         perMonth: 83,   tag: 'Save ₹1,389' },
} as const;

export const FREE_DAILY_LIMIT = 5;
export const TRIAL_DAYS = 10;
