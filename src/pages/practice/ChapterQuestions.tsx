import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronRight, Loader2, BookOpen, Clock, Play } from 'lucide-react';
import { supabase, type Question } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import MathRenderer from '@/components/ui/MathRenderer';

const ChapterQuestions: React.FC = () => {
  const { exam, subject, chapter } = useParams<{ exam: string; subject: string; chapter: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('exam', exam || '')
          .eq('subject', subject || '')
          .eq('chapter', chapter || '')
          .order('year', { ascending: false })
          .limit(1000);

        if (error) throw error;
        setQuestions((data as Question[]) || []);
      } catch (err) {
        console.error('Error fetching questions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [exam, subject, chapter]);

  const subjectLabel = subject === 'physics' ? 'Physics' : subject === 'chemistry' ? 'Chemistry' : 'Mathematics';
  const chapterLabel = chapter?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || '';

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

  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <Navbar />
      <main className="pt-28 md:pt-24 pb-16 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to={`/practice/${exam}/${subject}/chapters`} className="text-sm text-slate-500 hover:text-slate-400 mb-4 inline-block font-sans">
            ← Back to Chapter List
          </Link>
          <h1 className="text-3xl font-display tracking-wide mb-1 flex items-center gap-3">
            {chapterLabel}
          </h1>
          <p className="text-slate-400 text-sm font-sans">{subjectLabel} • <span className="font-mono text-sky-400">{questions.length}</span> questions available</p>
        </div>

        {/* Practice Modes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <button
            onClick={() => navigate(`/practice/${exam}/${subject}/${chapter}?mode=practice`)}
            className="flex flex-col items-center justify-center p-6 rounded-2xl glass-panel hover:bg-sky-500/10 hover:border-sky-500/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.1)] transition-all group"
          >
            <BookOpen className="w-10 h-10 text-sky-400 mb-4 group-hover:scale-110 transition-transform" />
            <span className="text-lg font-bold text-white mb-2">Casual Practice</span>
            <span className="text-sm text-slate-400 text-center">Solve at your own pace.<br/>No timer. Unlimited questions.</span>
          </button>

          <div className="flex flex-col items-center justify-center p-6 rounded-2xl glass-panel border border-amber-500/20 bg-amber-500/5 relative overflow-hidden">
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-amber-500/0 via-amber-500/50 to-amber-500/0"></div>
            <Clock className="w-10 h-10 text-amber-500 mb-4" />
            <span className="text-lg font-bold text-white mb-2">Timed Session</span>
            <span className="text-sm text-slate-400 text-center mb-4">Ranked style test.<br/>Choose your question limit.</span>
            
            <div className="flex gap-2 w-full mt-auto max-w-[200px]">
              {[10, 25, 50].map(limit => (
                <button
                  key={limit}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/practice/${exam}/${subject}/${chapter}?mode=session&limit=${limit}`);
                  }}
                  className="flex-1 py-1.5 text-sm font-mono font-bold rounded-lg border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-white transition-colors"
                >
                  {limit}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Question List */}
        <div className="mb-6 flex justify-between items-end">
          <h2 className="text-xl font-display text-white">All Questions</h2>
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-12 text-slate-500 glass-panel rounded-xl">
            No questions found for this chapter.
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => navigate(`/practice/${exam}/${subject}/${chapter}?mode=practice&start=${idx}`)}
                className="w-full text-left glass-panel rounded-xl p-5 hover:bg-slate-800/40 hover:border-sky-500/30 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center font-mono font-bold text-slate-400 group-hover:bg-sky-500/20 group-hover:text-sky-400 transition-colors shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      {q.year && (
                        <span className="text-xs font-medium text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 rounded-md">
                          {q.year}
                        </span>
                      )}
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${
                        q.difficulty === '1' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' :
                        q.difficulty === '2' ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' :
                        'text-violet-400 bg-violet-500/10 border border-violet-500/20'
                      }`}>
                        Level {q.difficulty}
                      </span>
                    </div>
                    
                    {/* Snippet (limiting height) */}
                    <div className="text-sm text-slate-300 line-clamp-2 md:line-clamp-3 overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
                      <MathRenderer content={q.question_text} />
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center justify-center pt-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white text-slate-500 transition-all">
                      <Play className="w-4 h-4 ml-0.5" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ChapterQuestions;
