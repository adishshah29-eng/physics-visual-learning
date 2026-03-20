import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Search, ChevronRight, Loader2, X, Clock, BookOpen } from 'lucide-react';
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
    'Mathematics in Physics::mathematics-in-physics',
    'Units and Dimensions::units-and-dimensions',
    'Motion In One Dimension::motion-in-one-dimension',
    'Motion In Two Dimensions::motion-in-two-dimensions',
    'Laws of Motion::laws-of-motion',
    'Work Power Energy::work-power-energy',
    'Center of Mass Momentum and Collision::center-of-mass-momentum-and-collision',
    'Rotational Motion::rotational-motion',
    'Gravitation::gravitation',
    'Mechanical Properties of Solids::mechanical-properties-of-solids',
    'Mechanical Properties of Fluids::mechanical-properties-of-fluids',
    'Thermal Properties of Matter::thermal-properties-of-matter',
    'Thermodynamics::thermodynamics',
    'Kinetic Theory of Gases::kinetic-theory-of-gases',
    'Oscillations::oscillations',
    'Waves and Sound::waves-and-sound',
    'Electrostatics::electrostatics',
    'Capacitance::capacitance',
    'Current Electricity::current-electricity',
    'Magnetic Properties of Matter::magnetic-properties-of-matter',
    'Magnetic Effects of Current::magnetic-effects-of-current',
    'Electromagnetic Induction::electromagnetic-induction',
    'Alternating Current::alternating-current',
    'Electromagnetic Waves::electromagnetic-waves',
    'Ray Optics::ray-optics',
    'Wave Optics::wave-optics',
    'Dual Nature of Matter::dual-nature-of-matter',
    'Atomic Physics::atomic-physics',
    'Nuclear Physics::nuclear-physics',
    'Semiconductors::semiconductors',
    'Experimental Physics::experimental-physics'
  ],
  chemistry: [
    'Some Basic Concepts of Chemistry::some-basic-concepts-of-chemistry',
    'Structure of Atom::structure-of-atom',
    'Classification of Elements and Periodicity::classification-of-elements-and-periodicity',
    'Chemical Bonding and Molecular Structure::chemical-bonding-and-molecular-structure',
    'States of Matter::states-of-matter',
    'Thermodynamics (C)::thermodynamics-c',
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
    'Chemistry in Everyday Life::chemistry-in-everyday-life',
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

  // Modal State
  const [selectedChapterForPractice, setSelectedChapterForPractice] = useState<ChapterInfo | null>(null);
  const [sessionLimit, setSessionLimit] = useState(25);

  useEffect(() => {
    const loadChapters = async () => {
      setIsLoading(true);
      try {
        const chapterDefs = allChapters[subject || 'physics'] || [];
        const ks: KnowledgeState[] = user ? await getKnowledgeState(user.id) : [];

        // Fetch question counts locally in parallel without downloading any rows Data (head: true, count: 'exact')
        const questionCounts: Record<string, number> = {};
        
        const countPromises = chapterDefs.map(async (def) => {
          const [_, slug] = def.split('::');
          const { count } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true })
            .eq('exam', exam || '')
            .eq('subject', subject || '')
            .eq('chapter', slug);
            
          return { slug, count: count || 0 };
        });

        const countResults = await Promise.all(countPromises);
        countResults.forEach(r => {
          questionCounts[r.slug] = r.count;
        });

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
          <Link to={`/practice/${exam}/subject`} className="text-sm text-slate-500 hover:text-slate-400 mb-4 inline-block font-sans">
            ← Back to Subjects
          </Link>
          <h1 className="text-3xl font-display tracking-wide mb-1 flex items-center gap-3">
            {subjectLabel} Chapters
          </h1>
          <p className="text-slate-400 text-sm font-sans">{examLabel} • <span className="font-mono text-sky-400">{filteredChapters.length}</span> chapters</p>
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
              className="w-full glass-panel border border-slate-700/50 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 outline-none text-sm transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(['name', 'mastery', 'questions'] as SortKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize ${
                  sortBy === key
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/50 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                    : 'glass-panel text-slate-400 hover:text-white'
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
                onClick={() => navigate(`/practice/${exam}/${subject}/${chapter.slug}/list`)}
                className="w-full glass-panel hover:bg-slate-800/20 rounded-xl p-4 text-left hover:border-sky-500/30 transition-all flex items-center gap-4 group"
              >
                 <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h3 className="text-lg font-display tracking-wide text-white truncate">{chapter.name}</h3>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      label === 'Beginner' ? 'bg-red-500/10 text-red-400' :
                      label === 'Developing' ? 'bg-orange-500/10 text-orange-400' :
                      label === 'Proficient' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
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
