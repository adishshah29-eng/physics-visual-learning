import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { X, Clock, ChevronRight, Loader2, CheckCircle2, XCircle, Bookmark } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { usePracticeStore } from '@/store/practiceStore';
import { supabase, type Question } from '@/lib/supabase';
import { saveAttempt, updateKnowledgeState } from '@/lib/supabase-helpers';
import Navbar from '@/components/Navbar';

const QuestionView: React.FC = () => {
  const { exam, subject, chapter } = useParams<{ exam: string; subject: string; chapter: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    sessionQuestions, currentQuestion, currentQuestionIndex,
    startSession, submitAnswer, nextQuestion,
  } = usePracticeStore();

  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  // Load questions
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase
          .from('questions')
          .select('*')
          .eq('exam', exam || '')
          .eq('subject', subject || '')
          .eq('chapter', chapter || '')
          .order('year', { ascending: false })
          .limit(20);

        if (data && data.length > 0) {
          startSession(data as Question[]);
        }
      } catch (err) {
        console.error('Error loading questions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
    // Store last chapter
    if (chapter) {
      localStorage.setItem('lastChapter', chapter);
    }
  }, [exam, subject, chapter, startSession]);

  // Timer
  useEffect(() => {
    if (isAnswered) return;
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - questionStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [questionStartTime, isAnswered]);

  // Reset state on question change
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    setQuestionStartTime(Date.now());
    setElapsedTime(0);
    setBookmarked(false);
  }, [currentQuestionIndex]);

  const handleOptionSelect = useCallback(async (option: string) => {
    if (isAnswered || !currentQuestion) return;

    const timeTaken = Date.now() - questionStartTime;
    const isCorrect = option === currentQuestion.correct_option;

    setSelectedOption(option);
    setIsAnswered(true);

    submitAnswer(currentQuestion.id, option, timeTaken, isCorrect);

    // Save to Supabase
    if (user) {
      await saveAttempt({
        user_id: user.id,
        question_id: currentQuestion.id,
        selected_option: option,
        is_correct: isCorrect,
        time_taken_ms: timeTaken,
      });

      if (subject && chapter) {
        await updateKnowledgeState(user.id, subject, chapter, isCorrect);
      }
    }
  }, [isAnswered, currentQuestion, questionStartTime, submitAnswer, user, subject, chapter]);

  const handleNext = () => {
    if (currentQuestionIndex >= sessionQuestions.length - 1) {
      navigate('/practice/session-summary');
    } else {
      nextQuestion();
    }
  };

  const handleExit = () => {
    navigate('/practice/session-summary');
  };

  const handleBookmark = () => {
    if (!currentQuestion) return;
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedQuestions') || '[]');
    if (bookmarked) {
      const filtered = bookmarks.filter((id: string) => id !== currentQuestion.id);
      localStorage.setItem('bookmarkedQuestions', JSON.stringify(filtered));
    } else {
      bookmarks.push(currentQuestion.id);
      localStorage.setItem('bookmarkedQuestions', JSON.stringify(bookmarks));
    }
    setBookmarked(!bookmarked);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getOptionClass = (option: string) => {
    if (!isAnswered) {
      return selectedOption === option
        ? 'border-sky-500 bg-sky-500/10'
        : 'border-slate-700 hover:border-slate-600 bg-slate-900';
    }

    if (option === currentQuestion?.correct_option) {
      return 'border-emerald-500 bg-emerald-500/10';
    }
    if (option === selectedOption && option !== currentQuestion?.correct_option) {
      return 'border-red-500 bg-red-500/10';
    }
    return 'border-slate-800 bg-slate-900/50 opacity-50';
  };

  const getOptionLabel = (option: string) => {
    if (!currentQuestion) return '';
    switch (option) {
      case 'a': return currentQuestion.option_a;
      case 'b': return currentQuestion.option_b;
      case 'c': return currentQuestion.option_c;
      case 'd': return currentQuestion.option_d;
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <div className="flex items-center justify-center pt-32">
          <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
        </div>
      </div>
    );
  }

  if (!currentQuestion || sessionQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-32 px-4">
          <div className="text-slate-400 text-center mb-6">
            <p className="text-lg font-medium mb-2">No questions available</p>
            <p className="text-sm">Questions for this chapter haven&apos;t been added yet.</p>
          </div>
          <Link
            to={`/practice/${exam}/${subject}/chapters`}
            className="bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-lg px-6 py-2.5 text-sm transition-colors"
          >
            Back to Chapters
          </Link>
        </div>
      </div>
    );
  }

  const chapterLabel = chapter?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || '';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <div className="pt-20 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-sm text-slate-400">{chapterLabel}</div>
            <div className="text-xs text-slate-500">
              Q{currentQuestionIndex + 1} of {sessionQuestions.length}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-400 text-sm">
              <Clock className="w-4 h-4" />
              {formatTime(elapsedTime)}
            </div>
            <button onClick={handleBookmark} className="text-slate-400 hover:text-amber-400 transition-colors">
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
            <button
              onClick={handleExit}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-slate-800 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-sky-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / sessionQuestions.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 mb-6">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            {currentQuestion.year && (
              <span className="text-xs font-medium text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 rounded-full">
                {exam?.replace('-', ' ').toUpperCase()} {currentQuestion.year}
              </span>
            )}
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
              currentQuestion.difficulty === 'easy'
                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                : currentQuestion.difficulty === 'jee-main'
                ? 'text-sky-400 bg-sky-500/10 border border-sky-500/20'
                : 'text-violet-400 bg-violet-500/10 border border-violet-500/20'
            }`}>
              {currentQuestion.difficulty === 'easy' ? 'Easy' :
               currentQuestion.difficulty === 'jee-main' ? 'JEE Main' : 'JEE Advanced'}
            </span>
          </div>

          {/* Question Text */}
          <p className="text-white text-base sm:text-lg leading-relaxed mb-8">
            {currentQuestion.question_text}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {(['a', 'b', 'c', 'd'] as const).map((option, idx) => (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3 ${getOptionClass(option)} ${!isAnswered ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm font-semibold text-slate-300 shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm sm:text-base text-slate-200 pt-1 flex-1">
                  {getOptionLabel(option)}
                </span>
                {isAnswered && option === currentQuestion.correct_option && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                )}
                {isAnswered && option === selectedOption && option !== currentQuestion.correct_option && (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-1" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Explanation */}
        {isAnswered && currentQuestion.explanation && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-6">
            <h4 className="text-sm font-semibold text-slate-300 mb-2">Explanation</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Next Button */}
        {isAnswered && (
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-lg px-6 py-2.5 text-sm transition-colors flex items-center gap-2"
            >
              {currentQuestionIndex >= sessionQuestions.length - 1 ? 'View Summary' : 'Next Question'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionView;
