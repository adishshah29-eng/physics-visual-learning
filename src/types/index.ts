import { Chapter as ConfigChapter } from '../config/chapters';

export type Chapter = ConfigChapter;

export interface Message {
  role: 'user' | 'model';
  text: string;
}

// Re-export Supabase types for convenience
export type {
  Profile,
  ProfileInsert,
  ProfileUpdate,
  Question,
  QuestionInsert,
  Attempt,
  AttemptInsert,
  KnowledgeState,
  KnowledgeStateInsert,
  ReviewQueueItem,
  ReviewQueueInsert,
  TestSession,
  TestSessionInsert,
  LeaderboardScore,
  LeaderboardScoreInsert,
} from '../lib/supabase';