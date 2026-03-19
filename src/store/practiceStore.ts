import { create } from 'zustand';
import type { Question, Attempt } from '@/types/index';
import { useAuthStore } from './authStore';

interface PracticeState {
  selectedExam: string | null;
  selectedSubject: string | null;
  selectedChapter: string | null;
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  sessionQuestions: Question[];
  sessionAttempts: Attempt[];
  sessionScore: number;
  sessionStartTime: number | null;

  setExam: (exam: string) => void;
  setSubject: (subject: string) => void;
  setChapter: (chapter: string) => void;
  startSession: (questions: Question[]) => void;
  submitAnswer: (questionId: string, option: string, timeTaken: number, isCorrect: boolean) => void;
  nextQuestion: () => void;
  endSession: () => void;
  resetSession: () => void;
}

export const usePracticeStore = create<PracticeState>((set, get) => ({
  selectedExam: null,
  selectedSubject: null,
  selectedChapter: null,
  currentQuestion: null,
  currentQuestionIndex: 0,
  sessionQuestions: [],
  sessionAttempts: [],
  sessionScore: 0,
  sessionStartTime: null,

  setExam: (exam: string) => set({ selectedExam: exam }),
  setSubject: (subject: string) => set({ selectedSubject: subject }),
  setChapter: (chapter: string) => set({ selectedChapter: chapter }),

  startSession: (questions: Question[]) => {
    set({
      sessionQuestions: questions,
      currentQuestion: questions[0] || null,
      currentQuestionIndex: 0,
      sessionAttempts: [],
      sessionScore: 0,
      sessionStartTime: Date.now(),
    });
  },

  submitAnswer: (questionId: string, option: string, timeTaken: number, isCorrect: boolean) => {
    const { sessionAttempts, sessionScore } = get();
    const { user } = useAuthStore.getState();

    const newAttempt: Attempt = {
      id: crypto.randomUUID(),
      user_id: user?.id || '',
      question_id: questionId,
      selected_option: option,
      is_correct: isCorrect,
      time_taken_ms: timeTaken,
      created_at: new Date().toISOString(),
    };

    set({
      sessionAttempts: [...sessionAttempts, newAttempt],
      sessionScore: isCorrect ? sessionScore + 1 : sessionScore,
    });
  },

  nextQuestion: () => {
    const { currentQuestionIndex, sessionQuestions } = get();
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < sessionQuestions.length) {
      set({
        currentQuestionIndex: nextIndex,
        currentQuestion: sessionQuestions[nextIndex],
      });
    }
  },

  endSession: () => {
    // Session data stays in state for summary display
  },

  resetSession: () => {
    set({
      selectedExam: null,
      selectedSubject: null,
      selectedChapter: null,
      currentQuestion: null,
      currentQuestionIndex: 0,
      sessionQuestions: [],
      sessionAttempts: [],
      sessionScore: 0,
      sessionStartTime: null,
    });
  },
}));
