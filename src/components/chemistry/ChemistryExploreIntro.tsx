import { getChapterById } from '@/data/chemistryChapters';

type Props = {
  chapterId: string;
};

/**
 * Right-rail Explore tab: narrative intro (same role as physics chapter Explore.tsx).
 * Playground visuals stay in the left panel.
 */
export default function ChemistryExploreIntro({ chapterId }: Props) {
  const ch = getChapterById(chapterId);
  if (!ch) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-white mb-2">{ch.title}</h2>
        <p className="text-slate-400 leading-relaxed">{ch.description}</p>
        <p className="text-[10px] font-mono uppercase tracking-widest text-sky-400/70 mt-3">
          {ch.category} chemistry · unit {ch.unit}
        </p>
      </div>

      <div className="glass-panel p-5 rounded-lg border-l-4 border-sky-400">
        <h3 className="text-sm font-semibold text-primary uppercase mb-2">Using the playground</h3>
        <p className="text-sm text-white/90">
          The left panel is your interactive lab. Connect what you see there with definitions and exam-style reasoning in the{' '}
          <span className="text-slate-200 font-medium">Understand</span> tab.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-display tracking-wide text-white">How to study with it</h3>
        <ul className="text-sm text-slate-400 list-disc pl-5 space-y-2">
          <li>Change one control at a time and name what moved and why.</li>
          <li>After each interaction, close the loop by reading the matching topic in Understand.</li>
          <li>Use Ask AI for doubts once you have a specific quantity or trend to discuss.</li>
        </ul>
      </div>
    </div>
  );
}
