// src/components/chemistry/understand/ChemUnderstandTab.tsx
// Shared syllabus accordion used by ALL chemistry chapter Understand tabs
import { useState } from 'react';
import type { ChemistryChapter } from '../../../data/chemistryChapters';

interface Props {
  chapter: ChemistryChapter;
}

export default function ChemUnderstandTab({ chapter }: Props) {
  const [openTopic, setOpenTopic] = useState<number | null>(0);

  const categoryGradient: Record<string, string> = {
    physical: 'from-cyan-500/10 to-cyan-500/0 border-cyan-500/20',
    inorganic: 'from-violet-500/10 to-violet-500/0 border-violet-500/20',
    organic: 'from-orange-500/10 to-orange-500/0 border-orange-500/20',
  };

  const bulletColor: Record<string, string> = {
    physical: 'text-cyan-400/70',
    inorganic: 'text-violet-400/70',
    organic: 'text-orange-400/70',
  };

  const activeColor: Record<string, string> = {
    physical: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    inorganic: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
    organic: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  };

  const gradient = categoryGradient[chapter.category] ?? 'from-emerald-500/10 to-emerald-500/0 border-emerald-500/20';
  const bullet = bulletColor[chapter.category] ?? 'text-emerald-400/70';
  const active = activeColor[chapter.category] ?? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';

  return (
    <div className="space-y-3">
      {/* Chapter intro banner */}
      <div className={`rounded-xl border bg-gradient-to-br ${gradient} px-5 py-4 mb-6`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{chapter.icon}</span>
          <div>
            <p className="text-white/50 text-xs font-mono uppercase tracking-widest">{chapter.category} chemistry · unit {chapter.unit}</p>
            <h2 className="text-white font-bold text-lg leading-tight mt-0.5">{chapter.title}</h2>
            <p className="text-white/40 text-xs mt-1">{chapter.description}</p>
          </div>
        </div>
      </div>

      {/* Topics accordion */}
      {chapter.topics.map((topic, i) => (
        <div
          key={i}
          className={`rounded-xl border overflow-hidden transition-all duration-200 ${
            openTopic === i ? 'border-white/20 bg-white/5' : 'border-white/8 bg-white/2 hover:bg-white/4'
          }`}
        >
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left group"
            onClick={() => setOpenTopic(openTopic === i ? null : i)}
          >
            <div className="flex items-center gap-3">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 transition-all ${
                openTopic === i ? active : 'text-white/30 border-white/10'
              }`}>
                {i + 1}
              </span>
              <span className={`font-semibold text-sm transition-colors ${openTopic === i ? 'text-white' : 'text-white/70 group-hover:text-white/90'}`}>
                {topic.title}
              </span>
            </div>
            <span className={`text-xs font-mono shrink-0 ml-2 transition-all ${openTopic === i ? 'text-white/50' : 'text-white/25'}`}>
              {topic.subtopics.length} topics {openTopic === i ? '▲' : '▼'}
            </span>
          </button>

          {openTopic === i && (
            <div className="px-5 pb-5 border-t border-white/5">
              <ul className="mt-4 space-y-2.5">
                {topic.subtopics.map((sub, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-white/60 leading-relaxed">
                    <span className={`mt-1.5 text-[8px] shrink-0 ${bullet}`}>◆</span>
                    <span className="font-mono text-xs bg-white/3 rounded px-2 py-1 border border-white/5 w-full">{sub}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
