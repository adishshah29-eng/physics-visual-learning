import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { getKnowledgeState } from '@/lib/supabase-helpers';
import Navbar from '@/components/Navbar';

interface ExamInfo {
  id: string;
  label: string;
  fullName: string;
  subjects: string;
  color: string;
  questionCount: number;
  accuracy: number;
}

const ExamSelect: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [exams, setExams] = useState<ExamInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExamData = async () => {
      setIsLoading(true);
      try {
        const examDefs = [
          { id: 'jee-main', label: 'JEE Main', fullName: 'Joint Entrance Examination (Main)', subjects: 'Physics, Chemistry, Maths', color: 'sky' },
          { id: 'jee-advanced', label: 'JEE Advanced', fullName: 'Joint Entrance Examination (Advanced)', subjects: 'Physics, Chemistry, Maths', color: 'violet' },
          { id: 'mht-cet', label: 'MHT CET', fullName: 'Maharashtra Common Entrance Test', subjects: 'Physics, Chemistry, Maths', color: 'emerald' },
        ];

        const results: ExamInfo[] = [];

        for (const exam of examDefs) {
          // Get question count
          const { count } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true })
            .eq('exam', exam.id);

          // Get user accuracy
          let accuracy = 0;
          if (user) {
            const ks = await getKnowledgeState(user.id);
            const examKs = ks.filter(k => k.total_attempts > 0);
            if (examKs.length > 0) {
              const totalCorrect = examKs.reduce((s, k) => s + k.correct_attempts, 0);
              const totalAttempts = examKs.reduce((s, k) => s + k.total_attempts, 0);
              accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
            }
          }

          results.push({
            ...exam,
            questionCount: count || 0,
            accuracy,
          });
        }

        setExams(results);
      } catch (err) {
        console.error('Error loading exam data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadExamData();
  }, [user]);

  const getColorClasses = (color: string) => ({
    border: color === 'sky' ? 'hover:border-sky-500/40' : color === 'violet' ? 'hover:border-violet-500/40' : 'hover:border-emerald-500/40',
    icon: color === 'sky' ? 'bg-sky-500/10 text-sky-400' : color === 'violet' ? 'bg-violet-500/10 text-violet-400' : 'bg-emerald-500/10 text-emerald-400',
    text: color === 'sky' ? 'text-sky-400' : color === 'violet' ? 'text-violet-400' : 'text-emerald-400',
  });

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="pt-24 pb-16 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">MCQ Practice</h1>
        <p className="text-slate-400 mb-10">Choose your exam to start practicing.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {exams.map((exam) => {
            const colors = getColorClasses(exam.color);
            return (
              <button
                key={exam.id}
                onClick={() => navigate(`/practice/${exam.id}/subject`)}
                className={`bg-slate-900 border border-slate-800 rounded-xl p-6 text-left transition-all duration-300 ${colors.border} group`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colors.icon}`}>
                  <span className="text-xl font-bold">{exam.label.charAt(0)}</span>
                </div>
                <h3 className="text-xl font-semibold mb-1">{exam.label}</h3>
                <p className="text-slate-400 text-xs mb-4">{exam.fullName}</p>
                <p className="text-slate-500 text-xs mb-1">{exam.subjects}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                  <span className="text-xs text-slate-500">
                    {exam.questionCount > 0 ? `${exam.questionCount} questions` : 'Questions loading...'}
                  </span>
                  {exam.accuracy > 0 && (
                    <span className={`text-xs font-medium ${colors.text}`}>
                      {exam.accuracy}% accuracy
                    </span>
                  )}
                </div>
                <div className={`flex items-center mt-3 text-sm font-medium ${colors.text} group-hover:gap-2 transition-all`}>
                  Select <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          <Link to="/home" className="text-sm text-slate-500 hover:text-slate-400 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ExamSelect;
