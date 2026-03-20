import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams, Link, useSearchParams } from 'react-router-dom';
import { X, Clock, ChevronRight, ChevronLeft, Loader2, CheckCircle2, XCircle, Bookmark, LayoutGrid } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { usePracticeStore } from '@/store/practiceStore';
import { supabase, type Question, type Attempt } from '@/lib/supabase';
import { saveAttempt, updateKnowledgeState, getAttemptsByUser } from '@/lib/supabase-helpers';
import Navbar from '@/components/Navbar';
import MathRenderer from '@/components/ui/MathRenderer';

const QuestionView: React.FC = () => {
  const { exam, subject, chapter } = useParams<{ exam: string; subject: string; chapter: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const mode = searchParams.get('mode') || 'practice';
  const limitParam = searchParams.get('limit');
  const questionLimit = mode === 'session' && limitParam ? parseInt(limitParam, 10) : 1000;
  const isSessionMode = mode === 'session';
  
  const { user } = useAuthStore();
  const {
    sessionQuestions, currentQuestion, currentQuestionIndex, sessionAttempts,
    startSession, submitAnswer, nextQuestion, previousQuestion, setQuestionIndex, setSessionAttempts
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
          .limit(questionLimit);

        if (data && data.length > 0) {
          const questions = data as Question[];
          startSession(questions);

          const startParam = searchParams.get('start');
          if (startParam && mode === 'practice') {
            const startIdx = parseInt(startParam, 10);
            if (!isNaN(startIdx) && startIdx >= 0 && startIdx < questions.length) {
              setQuestionIndex(startIdx);
            }
          }

          if (user) {
            // Load user's past attempts to pre-fill saved status
            const pastAttempts = await getAttemptsByUser(user.id, {
              exam: exam || undefined,
              subject: subject || undefined,
              chapter: chapter || undefined,
              limit: 500
            });

            const questionIds = new Set(questions.map(q => q.id));
            const relevantAttempts = pastAttempts.filter(a => questionIds.has(a.question_id));

            // Only keep the most recent attempt for each question
            const latestMap = new Map<string, Attempt>();
            relevantAttempts.forEach((a: Attempt) => {
              const existing = latestMap.get(a.question_id);
              if (!existing || new Date(a.created_at) > new Date(existing.created_at)) {
                latestMap.set(a.question_id, a);
              }
            });

            setSessionAttempts(Array.from(latestMap.values()));
          }
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
  }, [exam, subject, chapter, startSession, user, setSessionAttempts]);

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
    if (!currentQuestion) return;

    // Check if there's already an attempt for this question in the current session
    const existingAttempt = sessionAttempts.find(a => a.question_id === currentQuestion.id);

    if (existingAttempt) {
      setSelectedOption(existingAttempt.selected_option);
      setIsAnswered(true);
      setElapsedTime(Math.floor(existingAttempt.time_taken_ms / 1000));
    } else {
      setSelectedOption(null);
      setIsAnswered(false);
      setQuestionStartTime(Date.now());
      setElapsedTime(0);
    }

    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedQuestions') || '[]');
    setBookmarked(bookmarks.includes(currentQuestion.id));
  }, [currentQuestionIndex, currentQuestion, sessionAttempts]);

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
      if (isSessionMode) {
        navigate('/practice/session-summary');
      } else {
        navigate('/practice');
      }
    } else {
      nextQuestion();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      previousQuestion();
    }
  };

  const handleExit = () => {
    if (isSessionMode) {
      navigate('/practice/session-summary');
    } else {
      navigate('/practice');
    }
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

  const getPaletteClass = (idx: number, q: Question) => {
    const attempt = sessionAttempts.find(a => a.question_id === q.id);
    const isActive = idx === currentQuestionIndex;
    
    let base = "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold transition-all border ";
    
    if (isActive) {
      base += "ring-2 ring-sky-500 ring-offset-2 ring-offset-slate-950 ";
    }
    
    if (!attempt) {
      return base + (isActive ? "bg-slate-800 border-sky-500 text-sky-400" : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white");
    }
    
    if (attempt.is_correct) {
      return base + (isActive ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold" : "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-bold hover:bg-emerald-500/20");
    }
    
    return base + (isActive ? "bg-red-500/10 border-red-500 text-red-400 font-bold" : "bg-red-500/10 border-red-500/50 text-red-400 font-bold hover:bg-red-500/20");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-32">
          <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
        </div>
      </div>
    );
  }

  if (!currentQuestion || sessionQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-transparent text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center -mt-20 px-4">
          <div className="text-slate-400 text-center mb-6">
            <p className="text-xl font-display tracking-wide mb-2 text-slate-300">No questions available</p>
            <p className="text-sm font-sans">Questions for this chapter haven&apos;t been added yet.</p>
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <div className="pt-28 md:pt-24 pb-16 px-4 sm:px-6 w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 flex-1">
        
        {/* Main Content Area */}
        <div className="flex-1 max-w-3xl w-full mx-auto flex flex-col">
          {/* Top Bar */}
          <div className="flex glass-nav rounded-xl p-3 sm:p-4 items-center justify-between mb-6 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
            <div className="min-w-0 mr-2">
              <div className="text-sm font-semibold text-slate-300 truncate">{chapterLabel}</div>
              <div className="text-xs text-sky-400 font-medium tracking-wide uppercase mt-1">
                Question {currentQuestionIndex + 1} of {sessionQuestions.length}
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {isSessionMode && (
                <div className="flex items-center gap-2 text-slate-300 font-mono bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/50">
                  <Clock className="w-4 h-4 text-sky-400" />
                  {formatTime(elapsedTime)}
                </div>
              )}
              <button onClick={handleBookmark} className="hidden sm:flex text-slate-400 hover:text-amber-400 transition-colors p-2 hover:bg-slate-800 rounded-lg">
                <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
              </button>
              <button
                onClick={handleExit}
                className="text-slate-400 hover:text-red-400 transition-colors p-2 hover:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full mb-8 overflow-hidden border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / sessionQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="glass-panel rounded-xl p-6 sm:p-8 mb-6 shadow-2xl relative overflow-hidden">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-6">
              {currentQuestion.year && (
                <span className="text-xs font-medium text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full shadow-sm">
                  {exam?.replace('-', ' ').toUpperCase()} {currentQuestion.year}
                </span>
              )}
              <span className={`text-xs font-medium px-3 py-1 rounded-full shadow-sm ${
                currentQuestion.difficulty === '1'
                  ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                  : currentQuestion.difficulty === '2'
                  ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                  : 'text-violet-400 bg-violet-500/10 border border-violet-500/20'
              }`}>
                {currentQuestion.difficulty === '1' ? 'Level 1' :
                 currentQuestion.difficulty === '2' ? 'Level 2' : 'Level 3'}
              </span>
            </div>

            {/* Question Text */}
            <div className="text-slate-100 text-base sm:text-lg leading-relaxed mb-8">
              <MathRenderer content={currentQuestion.question_text} />
            </div>

            {/* Options */}
            <div className="space-y-3">
              {(['a', 'b', 'c', 'd'] as const).map((option, idx) => (
                <button
                  key={option}
                  onClick={() => handleOptionSelect(option)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-4 ${getOptionClass(option)} ${!isAnswered ? 'cursor-pointer hover:shadow-lg' : 'cursor-default'}`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                    isAnswered && option === currentQuestion.correct_option ? 'bg-emerald-500 text-white border-emerald-600' :
                    isAnswered && option === selectedOption ? 'bg-red-500 text-white border-red-600' :
                    selectedOption === option ? 'bg-sky-500 text-white border-sky-600' :
                    'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="text-sm sm:text-base text-slate-200 pt-1 flex-1">
                    <MathRenderer content={getOptionLabel(option)} />
                  </div>
                  {isAnswered && option === currentQuestion.correct_option && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  {isAnswered && option === selectedOption && option !== currentQuestion.correct_option && (
                    <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Explanation */}
          {isAnswered && currentQuestion.explanation && (
            <div className="glass-panel bg-sky-950/20 border-sky-900/50 rounded-xl p-6 mb-8 mt-2 transition-all shadow-[0_0_20px_rgba(56,189,248,0.05)]">
              <h4 className="text-sm font-bold text-sky-400 flex items-center gap-2 mb-3 tracking-wide uppercase font-sans">
                Explanation
              </h4>
              <div className="text-sm text-slate-300 leading-relaxed overflow-x-auto">
                  <MathRenderer content={currentQuestion.explanation} />
              </div>
            </div>
          )}

          {/* Spacer to push nav to bottom if content is short */}
          <div className="flex-1 min-h-4"></div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-auto pt-6 border-t border-slate-800/50">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-colors ${
                currentQuestionIndex === 0 
                ? 'bg-slate-900/50 text-slate-600 cursor-not-allowed border border-slate-800/50' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-md'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
              
            {currentQuestionIndex >= sessionQuestions.length - 1 ? (
              <button
                onClick={() => {
                  if (isSessionMode) navigate('/practice/session-summary');
                  else navigate(`/practice/${exam}/${subject}/chapters`);
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20 font-semibold rounded-xl px-6 py-3 text-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                {isSessionMode ? 'View Summary' : 'Finish Practice'}
                <CheckCircle2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20 font-semibold rounded-xl px-6 py-3 text-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                Next Question
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Side Palette */
        isSessionMode && (
        <div className="w-full lg:w-72 xl:w-80 shrink-0 mt-8 lg:mt-0">
          <div className="glass-panel rounded-xl p-5 lg:sticky top-28 shadow-2xl">
            <div className="flex items-center gap-2 mb-5 text-slate-200 font-semibold border-b border-slate-800/50 pb-4">
              <LayoutGrid className="w-5 h-5 text-sky-400" />
              <h3>Question Palette</h3>
            </div>
             
            <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 mb-6">
              {sessionQuestions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setQuestionIndex(idx)}
                  className={getPaletteClass(idx, q)}
                  title={`Question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
             
            {/* Legend */}
            <div className="flex flex-col gap-3 text-xs text-slate-400 border-t border-slate-800/50 bg-slate-900/40 -mx-5 -mb-5 p-5 rounded-b-xl backdrop-blur-sm">
              <div className="flex items-center gap-3 font-medium">
                <div className="w-4 h-4 rounded border border-slate-700 bg-slate-800/50"></div>
                <span>Unattempted</span>
              </div>
              <div className="flex items-center gap-3 font-medium">
                <div className="w-4 h-4 rounded border border-emerald-500/50 bg-emerald-500/10 flex items-center justify-center"></div>
                <span className="text-emerald-400/90">Correctly Answered</span>
              </div>
              <div className="flex items-center gap-3 font-medium">
                <div className="w-4 h-4 rounded border border-red-500/50 bg-red-500/10 flex items-center justify-center"></div>
                <span className="text-red-400/90">Incorrectly Answered</span>
              </div>
            </div>
          </div>
        </div>
        )}

      </div>
    </div>
  );
};

export default QuestionView;
