import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getKnowledgeState } from '@/lib/supabase-helpers';
import Navbar from '@/components/Navbar';

interface SubjectInfo {
  id: string;
  label: string;
  icon: string;
  color: string;
  chapterCount: number;
  mastery: number;
}

const subjectDefs = [
  { id: 'physics', label: 'Physics', icon: '⚡', color: 'sky' },
  { id: 'chemistry', label: 'Chemistry', icon: '🧪', color: 'emerald' },
  { id: 'maths', label: 'Mathematics', icon: '📐', color: 'violet' },
];

const physicsChapters = [
  'units', 'kinematics-1d', 'projectile-motion', 'laws-of-motion',
  'work-energy', 'circular-motion', 'shm', 'rotational-motion',
  'gravitation', 'thermodynamics', 'waves', 'electrostatics',
  'current-electricity', 'ray-optics', 'semiconductors',
];

const chemistryChapters = [
  'atomic-structure', 'chemical-bonding', 'states-of-matter', 'thermochemistry',
  'equilibrium', 'redox-reactions', 'electrochemistry', 'organic-chemistry',
  'polymers', 'biomolecules', 'surface-chemistry', 'coordination-compounds',
];

const mathsChapters = [
  'sets-relations', 'trigonometry', 'complex-numbers', 'quadratic-equations',
  'sequences-series', 'permutations-combinations', 'binomial-theorem',
  'straight-lines', 'circles', 'conic-sections', 'calculus-limits',
  'derivatives', 'integrals', 'differential-equations', 'vectors-3d',
  'probability', 'matrices-determinants', 'statistics',
];

function getChaptersForSubject(subject: string): string[] {
  switch (subject) {
    case 'physics': return physicsChapters;
    case 'chemistry': return chemistryChapters;
    case 'maths': return mathsChapters;
    default: return [];
  }
}

const SubjectSelect: React.FC = () => {
  const { exam } = useParams<{ exam: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [subjects, setSubjects] = useState<SubjectInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const ks = user ? await getKnowledgeState(user.id) : [];

        const results: SubjectInfo[] = subjectDefs.map((sub) => {
          const chapters = getChaptersForSubject(sub.id);
          const subKs = ks.filter((k) => k.subject === sub.id);
          const avgMastery =
            subKs.length > 0
              ? subKs.reduce((s, k) => s + k.mastery, 0) / subKs.length
              : 0;

          return {
            ...sub,
            chapterCount: chapters.length,
            mastery: Math.round(avgMastery * 100),
          };
        });

        setSubjects(results);
      } catch (err) {
        console.error('Error loading subjects:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  const getColorClasses = (color: string) => ({
    border: color === 'sky' ? 'hover:border-sky-500/40' : color === 'violet' ? 'hover:border-violet-500/40' : 'hover:border-emerald-500/40',
    bg: color === 'sky' ? 'bg-sky-500/10' : color === 'violet' ? 'bg-violet-500/10' : 'bg-emerald-500/10',
    text: color === 'sky' ? 'text-sky-400' : color === 'violet' ? 'text-violet-400' : 'text-emerald-400',
    bar: color === 'sky' ? 'bg-sky-500' : color === 'violet' ? 'bg-violet-500' : 'bg-emerald-500',
  });

  const examLabel = exam === 'jee-main' ? 'JEE Main' : exam === 'jee-advanced' ? 'JEE Advanced' : 'MHT CET';

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
        <div className="mb-10">
          <Link to="/practice" className="text-sm text-slate-500 hover:text-slate-400 mb-4 inline-block">
            ← Back to Exams
          </Link>
          <h1 className="text-3xl font-bold mb-2">{examLabel}</h1>
          <p className="text-slate-400">Choose a subject to practice.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subjects.map((sub) => {
            const colors = getColorClasses(sub.color);
            return (
              <button
                key={sub.id}
                onClick={() => navigate(`/practice/${exam}/${sub.id}/chapters`)}
                className={`bg-slate-900 border border-slate-800 rounded-xl p-6 text-left transition-all duration-300 ${colors.border} group`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colors.bg}`}>
                  <span className="text-2xl">{sub.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-1">{sub.label}</h3>
                <p className="text-slate-500 text-xs mb-4">
                  {sub.chapterCount} chapters
                </p>

                {/* Mastery bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Mastery</span>
                    <span className={colors.text}>{sub.mastery}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
                      style={{ width: `${sub.mastery}%` }}
                    />
                  </div>
                </div>

                <div className={`flex items-center mt-4 text-sm font-medium ${colors.text} group-hover:gap-2 transition-all`}>
                  Practice <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default SubjectSelect;
