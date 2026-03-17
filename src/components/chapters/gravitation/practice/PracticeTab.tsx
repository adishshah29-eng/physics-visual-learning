import React, { useState } from "react";
import { questionBank, Question, Difficulty } from "./questionBank";

const tabs: { label: string; value: Difficulty }[] = [
  { label: "Easy", value: "easy" },
  { label: "JEE Main", value: "jee-main" },
  { label: "JEE Advanced", value: "jee-advanced" },
];

const GravitationPractice: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = questionBank.filter(q => q.difficulty === difficulty);
  const current: Question | undefined = filtered[index];

  const handleTab = (d: Difficulty) => { setDifficulty(d); setIndex(0); setSelected(null); };
  const handleNext = () => { setSelected(null); setIndex(p => Math.min(p + 1, filtered.length - 1)); };

  if (!current) return <div className="text-center text-sm text-muted-foreground p-4">No questions available.</div>;

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.value} onClick={() => handleTab(t.value)}
            className={`px-4 py-1.5 rounded-full text-sm border transition
              ${difficulty === t.value
                ? "bg-primary/20 text-primary border-primary"
                : "border-border text-muted-foreground hover:bg-secondary/40"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="text-base font-medium text-foreground leading-relaxed">{current.question}</div>

      <div className="space-y-3">
        {current.options.map((opt, i) => {
          const isCorrect = selected !== null && i === current.answer;
          const isWrong = selected === i && i !== current.answer;
          return (
            <button key={i} onClick={() => setSelected(i)} disabled={selected !== null}
              className={`w-full text-left px-4 py-3 rounded-xl border transition
                ${isCorrect ? "border-green-500 bg-green-500/10 text-green-400"
                  : isWrong ? "border-red-500 bg-red-500/10 text-red-400"
                  : "border-border hover:bg-secondary/30"}`}>
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="space-y-3">
          <div className={`text-sm font-medium ${selected === current.answer ? "text-green-400" : "text-red-400"}`}>
            {selected === current.answer ? "Correct ✅" : "Wrong ❌"}
          </div>
          <div className="bg-black/40 border border-border rounded-lg p-4 space-y-1">
            <div className="text-xs uppercase text-muted-foreground mb-2">Solution</div>
            {current.solution.map((step, i) => (
              <div key={i} className="text-sm text-foreground font-mono">{step}</div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={handleNext} disabled={selected === null || index === filtered.length - 1}
          className="px-6 py-2 rounded-full bg-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed">
          Next →
        </button>
      </div>
    </div>
  );
};

export default GravitationPractice;
