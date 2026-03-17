import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, Target, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { usePracticeStore } from '@/store/practiceStore';
import Navbar from '@/components/Navbar';

const SessionSummary: React.FC = () => {
  const navigate = useNavigate();
  const { sessionQuestions, sessionAttempts, sessionScore, sessionStartTime, selectedExam, selectedSubject, selectedChapter, resetSession } = usePracticeStore();
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const totalQuestions = sessionQuestions.length;
  const totalTime = sessionStartTime ? Date.now() - sessionStartTime : 0;
  const accuracy = totalQuestions > 0 ? Math.round((sessionScore / totalQuestions) * 100) : 0;
  const avgTimePerQuestion = totalQuestions > 0
    ? Math.round(sessionAttempts.reduce((sum, a) => sum + a.time_taken_ms, 0) / totalQuestions / 1000)
    : 0;

  const performanceLabel = accuracy >= 80 ? 'Excellent' : accuracy >= 50 ? 'Good' : 'Needs Work';
  const performanceColor = accuracy >= 80 ? 'text-emerald-400' : accuracy >= 50 ? 'text-amber-400' : 'text-red-400';

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}m ${s}s`;
  };

  const questionResults = useMemo(() => {
    return sessionQuestions.map((q) => {
      const attempt = sessionAttempts.find((a) => a.question_id === q.id);
      return {
        question: q,
        attempt,
        isCorrect: attempt?.is_correct || false,
        timeTaken: attempt?.time_taken_ms || 0,
      };
    });
  }, [sessionQuestions, sessionAttempts]);

  const handlePracticeAgain = () => {
    resetSession();
    navigate(-1);
  };

  const handleTryAnother = () => {
    resetSession();
    if (selectedExam && selectedSubject) {
      navigate(`/practice/${selectedExam}/${selectedSubject}/chapters`);
    } else {
      navigate('/practice');
    }
  };

  if (totalQuestions === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-32">
          <p className="text-slate-400 mb-4">No session data available.</p>
          <Link to="/practice" className="bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-lg px-6 py-2.5 text-sm transition-colors">
            Start Practicing
          </Link>
        </div>
      </div>
    );
  }

  // Circle progress component
  const circumference = 2 * Math.PI * 60;
  const progress = (sessionScore / totalQuestions) * circumference;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center">Session Summary</h1>

        {/* Score Circle */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-40 h-40 mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
              <circle
                cx="64" cy="64" r="60"
                strokeWidth="8"
                fill="none"
                className="stroke-slate-800"
              />
              <circle
                cx="64" cy="64" r="60"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className={accuracy >= 80 ? 'stroke-emerald-500' : accuracy >= 50 ? 'stroke-amber-500' : 'stroke-red-500'}
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{sessionScore}/{totalQuestions}</span>
              <span className="text-xs text-slate-400">{accuracy}%</span>
            </div>
          </div>
          <span className={`text-lg font-semibold ${performanceColor}`}>{performanceLabel}</span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <Clock className="w-4 h-4 text-slate-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{formatTime(totalTime)}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Time Taken</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <Target className="w-4 h-4 text-slate-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{accuracy}%</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Accuracy</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <BarChart3 className="w-4 h-4 text-slate-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{avgTimePerQuestion}s</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Avg/Question</div>
          </div>
        </div>

        {/* Question Review */}
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Question Review</h2>
        <div className="space-y-2 mb-10">
          {questionResults.map((result, idx) => (
            <div key={result.question.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedQuestion(
                  expandedQuestion === result.question.id ? null : result.question.id
                )}
                className="w-full p-4 flex items-center gap-3 text-left hover:bg-slate-800/30 transition-colors"
              >
                {result.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                )}
                <span className="text-sm text-slate-300 flex-1 truncate">
                  Q{idx + 1}. {result.question.question_text}
                </span>
                <span className="text-xs text-slate-500 shrink-0">
                  {Math.round(result.timeTaken / 1000)}s
                </span>
                {expandedQuestion === result.question.id ? (
                  <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>

              {expandedQuestion === result.question.id && (
                <div className="px-4 pb-4 border-t border-slate-800 pt-3">
                  <p className="text-sm text-slate-300 mb-3">{result.question.question_text}</p>
                  <div className="space-y-2 mb-3">
                    {(['a', 'b', 'c', 'd'] as const).map((opt) => {
                      const optText = result.question[`option_${opt}` as keyof typeof result.question] as string;
                      const isCorrectOpt = opt === result.question.correct_option;
                      const isSelectedOpt = opt === result.attempt?.selected_option;
                      return (
                        <div
                          key={opt}
                          className={`text-xs p-2 rounded-lg border ${
                            isCorrectOpt ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' :
                            isSelectedOpt ? 'border-red-500/30 bg-red-500/10 text-red-300' :
                            'border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="font-semibold mr-2">{opt.toUpperCase()}.</span>
                          {optText}
                        </div>
                      );
                    })}
                  </div>
                  {result.question.explanation && (
                    <div className="text-xs text-slate-400 bg-slate-800/50 p-3 rounded-lg">
                      <span className="font-semibold text-slate-300">Explanation: </span>
                      {result.question.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handlePracticeAgain}
            className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
          >
            Practice Again
          </button>
          <button
            onClick={handleTryAnother}
            className="flex-1 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-lg py-2.5 text-sm transition-colors"
          >
            Try Another Chapter
          </button>
          <Link
            to="/analytics"
            className="flex-1 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-lg py-2.5 text-sm transition-colors text-center"
          >
            View Analytics
          </Link>
        </div>
      </main>
    </div>
  );
};

export default SessionSummary;
