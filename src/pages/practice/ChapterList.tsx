import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Search, ChevronRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getKnowledgeState } from '@/lib/supabase-helpers';
import { getMasteryLabel, getMasteryBgColor } from '@/services/ml/knowledgeTracing';
import { supabase, type KnowledgeState } from '@/lib/supabase';
import Navbar from '@/components/Navbar';

interface ChapterInfo {
  name: string;
  slug: string;
  questionCount: number;
  mastery: number;
}

const allChapters: Record<string, string[]> = {
  physics: [
    'Units & Measurements::units', 'Kinematics (1D)::kinematics-1d',
    'Projectile Motion::projectile-motion', 'Laws of Motion::laws-of-motion',
    'Work Energy & Power::work-energy', 'Circular Motion::circular-motion',
    'Simple Harmonic Motion::shm', 'Rotational Motion::rotational-motion',
    'Gravitation::gravitation', 'Thermodynamics::thermodynamics',
    'Waves::waves', 'Electrostatics::electrostatics',
    'Current Electricity::current-electricity', 'Ray Optics::ray-optics',
    'Semiconductors::semiconductors',
  ],
  chemistry: [
    'Some Basic Concepts of Chemistry::some-basic-concepts-of-chemistry',
    'Structure of Atom::structure-of-atom',
    'Classification of Elements and Periodicity::classification-of-elements-and-periodicity',
    'Chemical Bonding and Molecular Structure::chemical-bonding-and-molecular-structure',
    'States of Matter::states-of-matter',
    'Thermodynamics::thermodynamics-c',
    'Chemical Equilibrium::chemical-equilibrium',
    'Ionic Equilibrium::ionic-equilibrium',
    'Redox Reactions::redox-reactions',
    'p Block Elements (Group 13 & 14)::p-block-elements-group-13-14',
    'General Organic Chemistry::general-organic-chemistry',
    'Hydrocarbons::hydrocarbons',
    'Solutions::solutions',
    'Electrochemistry::electrochemistry',
    'Chemical Kinetics::chemical-kinetics',
    'p Block Elements (Group 15, 16, 17 & 18)::p-block-elements-group-15-16-17-18',
    'd and f Block Elements::d-and-f-block-elements',
    'Coordination Compounds::coordination-compounds',
    'Haloalkanes and Haloarenes::haloalkanes-and-haloarenes',
    'Alcohols Phenols and Ethers::alcohols-phenols-and-ethers',
    'Aldehydes and Ketones::aldehydes-and-ketones',
    'Carboxylic Acid Derivatives::carboxylic-acid-derivatives',
    'Amines::amines',
    'Biomolecules::biomolecules',
    'Practical Chemistry::practical-chemistry'
  ],
  maths: [
    'Basic of Mathematics::basic-of-mathematics',
    'Quadratic Equation::quadratic-equation',
    'Complex Number::complex-number',
    'Permutation Combination::permutation-combination',
    'Sequences and Series::sequences-and-series',
    'Binomial Theorem::binomial-theorem',
    'Trigonometric Ratios & Identities::trigonometric-ratios-identities',
    'Trigonometric Equations::trigonometric-equations',
    'Straight Lines::straight-lines',
    'Circle::circle',
    'Parabola::parabola',
    'Ellipse::ellipse',
    'Hyperbola::hyperbola',
    'Limits::limits',
    'Statistics::statistics',
    'Sets and Relations::sets-and-relations',
    'Matrices::matrices',
    'Determinants::determinants',
    'Inverse Trigonometric Functions::inverse-trigonometric-functions',
    'Functions::functions',
    'Continuity and Differentiability::continuity-and-differentiability',
    'Differentiation::differentiation',
    'Application of Derivatives::application-of-derivatives',
    'Indefinite Integration::indefinite-integration',
    'Definite Integration::definite-integration',
    'Area Under Curves::area-under-curves',
    'Differential Equations::differential-equations',
    'Vector Algebra::vector-algebra',
    'Three Dimensional Geometry::three-dimensional-geometry',
    'Probability::probability'
  ],
};

type SortKey = 'name' | 'mastery' | 'questions';

const ChapterList: React.FC = () => {
  const { exam, subject } = useParams<{ exam: string; subject: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('name');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChapters = async () => {
      setIsLoading(true);
      try {
        const chapterDefs = allChapters[subject || 'physics'] || [];
        const ks: KnowledgeState[] = user ? await getKnowledgeState(user.id) : [];

        // Fetch all questions for this subject to count them locally
        const { data: allQuestions } = await supabase
          .from('questions')
          .select('chapter')
          .eq('exam', exam || '')
          .eq('subject', subject || '');

        const questionCounts: Record<string, number> = {};
        if (allQuestions) {
          (allQuestions as { chapter: string }[]).forEach((q) => {
            questionCounts[q.chapter] = (questionCounts[q.chapter] || 0) + 1;
          });
        }

        const results: ChapterInfo[] = chapterDefs.map((def) => {
          const [name, slug] = def.split('::');
          const chapterKs = ks.find((k) => k.chapter === slug && k.subject === subject);

          return {
            name,
            slug,
            questionCount: questionCounts[slug] || 0,
            mastery: chapterKs?.mastery || 0,
          };
        });

        setChapters(results);
      } catch (err) {
        console.error('Error loading chapters:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadChapters();
  }, [exam, subject, user]);

  const filteredChapters = useMemo(() => {
    let result = chapters.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'mastery') return b.mastery - a.mastery;
      return b.questionCount - a.questionCount;
    });

    return result;
  }, [chapters, searchQuery, sortBy]);

  const subjectLabel = subject === 'physics' ? 'Physics' : subject === 'chemistry' ? 'Chemistry' : 'Mathematics';
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
      <main className="pt-24 pb-16 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to={`/practice/${exam}/subject`} className="text-sm text-slate-500 hover:text-slate-400 mb-4 inline-block">
            ← Back to Subjects
          </Link>
          <h1 className="text-3xl font-bold mb-1">{subjectLabel} Chapters</h1>
          <p className="text-slate-400 text-sm">{examLabel} • {filteredChapters.length} chapters</p>
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chapters..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 outline-none text-sm"
            />
          </div>
          <div className="flex gap-2">
            {(['name', 'mastery', 'questions'] as SortKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize ${
                  sortBy === key
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Chapter List */}
        <div className="space-y-3">
          {filteredChapters.map((chapter) => {
            const label = getMasteryLabel(chapter.mastery);
            const barColor = getMasteryBgColor(chapter.mastery);

            return (
              <button
                key={chapter.slug}
                onClick={() => navigate(`/practice/${exam}/${subject}/${chapter.slug}`)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-left hover:border-slate-700 transition-all flex items-center gap-4 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-white truncate">{chapter.name}</h3>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      label === 'Beginner' ? 'bg-red-500/10 text-red-400' :
                      label === 'Developing' ? 'bg-orange-500/10 text-orange-400' :
                      label === 'Proficient' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{chapter.questionCount} questions</span>
                    <span>{Math.round(chapter.mastery * 100)}% mastery</span>
                  </div>
                  {/* Mastery bar */}
                  <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${Math.max(2, chapter.mastery * 100)}%` }}
                    />
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
              </button>
            );
          })}

          {filteredChapters.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              No chapters found matching your search.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChapterList;
