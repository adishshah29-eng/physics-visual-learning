import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { chemistryChapters, type ChemistryChapter } from '../data/chemistryChapters';
import Navbar from '@/components/Navbar';

const categories = [
  { id: 'all', label: 'All Units' },
  { id: 'physical', label: 'Physical Chemistry' },
  { id: 'inorganic', label: 'Inorganic Chemistry' },
  { id: 'organic', label: 'Organic Chemistry' }
];

function ChemistryChapterCard({ chapter, onClick }: { chapter: ChemistryChapter; onClick: () => void }) {
  const isActive = chapter.hasVisualization;
  
  return (
    <div 
      className={`relative group rounded-xl p-6 border transition-all duration-300 ${
        isActive 
          ? 'bg-slate-900/50 backdrop-blur-sm border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)] hover:border-emerald-500/50' 
          : 'bg-slate-900/20 border-white/5 opacity-70 hover:opacity-100'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`text-xs font-mono px-2 py-1 rounded ${
          isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500'
        }`}>
          Unit {chapter.unit}
        </span>

        {isActive && (
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,1)] animate-pulse" />
        )}
      </div>

      <h3 className={`text-lg font-medium mb-2 ${
        isActive ? 'text-slate-100' : 'text-slate-500'
      }`}>
        {chapter.title}
      </h3>

      <p className="text-xs text-slate-400 line-clamp-2 mb-6">
        {chapter.description || "Master the concepts needed for JEE/NEET."}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold group-hover:text-emerald-500/50 transition-colors">
          {chapter.category}
        </div>

        {isActive ? (
          <button onClick={onClick} className="flex items-center gap-2 text-sm text-emerald-400 font-medium group-hover:gap-3 transition-all cursor-pointer">
            Enter Lab <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={onClick} className="flex items-center gap-2 text-sm text-slate-500 font-medium group-hover:gap-3 transition-all cursor-pointer hover:text-slate-300">
            Read Topic <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function ChemistryPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredChapters = useMemo(() => {
    return chemistryChapters.filter(
      (c) => selectedCategory === "all" || c.category === selectedCategory
    );
  }, [selectedCategory]);

  const physical = filteredChapters.filter((c) => c.category === "physical");
  const inorganic = filteredChapters.filter((c) => c.category === "inorganic");
  const organic = filteredChapters.filter((c) => c.category === "organic");

  const totalCount = chemistryChapters.length;
  const interactiveCount = chemistryChapters.filter(c => c.hasVisualization).length;

  return (
    <div className="min-h-screen bg-transparent text-slate-100 pb-20 overflow-x-hidden selection:bg-emerald-500/30">
      <Navbar currentChapter="Chemistry" />

      <main className="relative z-10 pt-28 md:pt-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-display tracking-wide text-white mb-2">
              CHEMISTRY.
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                LAB
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl font-light">
              Interactive learning simulations for MHT-CET and JEE chemistry.
            </p>
          </div>

          {/* STATS BOX */}
          <div className="flex gap-6 p-4 glass-panel rounded-xl">
            <div className="text-center px-2">
              <div className="text-2xl font-mono font-bold text-emerald-400">
                {interactiveCount}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                Interactive
              </div>
            </div>
            <div className="w-px bg-slate-800"></div>
            <div className="text-center px-2">
              <div className="text-2xl font-mono font-bold text-white">{totalCount}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                Units
              </div>
            </div>
          </div>
        </header>

        {/* FILTER TABS */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border cursor-pointer
                ${
                  selectedCategory === cat.id
                    ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                    : "glass-panel text-slate-400 hover:border-emerald-500/30 transition-colors hover:text-white"
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="space-y-16">
          {/* PHYSICAL */}
          {physical.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-lg">⚗️</div>
                <h2 className="text-2xl font-display tracking-wide text-white">Physical Chemistry</h2>
                <span className="hidden sm:inline text-xs font-mono text-slate-500 ml-auto border border-slate-800 px-2 py-1 rounded">
                  {physical.length} Units
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {physical.map((chapter) => (
                  <ChemistryChapterCard key={chapter.id} chapter={chapter} onClick={() => navigate(`/chemistry/${chapter.id}`)} />
                ))}
              </div>
            </section>
          )}

          {/* INORGANIC */}
          {inorganic.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-violet-500/10 rounded-lg text-lg">🧲</div>
                <h2 className="text-2xl font-display tracking-wide text-white">Inorganic Chemistry</h2>
                <span className="hidden sm:inline text-xs font-mono text-slate-500 ml-auto border border-slate-800 px-2 py-1 rounded">
                  {inorganic.length} Units
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {inorganic.map((chapter) => (
                  <ChemistryChapterCard key={chapter.id} chapter={chapter} onClick={() => navigate(`/chemistry/${chapter.id}`)} />
                ))}
              </div>
            </section>
          )}

          {/* ORGANIC */}
          {organic.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-500/10 rounded-lg text-lg">🌿</div>
                <h2 className="text-2xl font-display tracking-wide text-white">Organic Chemistry</h2>
                <span className="hidden sm:inline text-xs font-mono text-slate-500 ml-auto border border-slate-800 px-2 py-1 rounded">
                  {organic.length} Units
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {organic.map((chapter) => (
                  <ChemistryChapterCard key={chapter.id} chapter={chapter} onClick={() => navigate(`/chemistry/${chapter.id}`)} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
