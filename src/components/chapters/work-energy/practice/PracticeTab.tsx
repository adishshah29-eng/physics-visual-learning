import React, { useState } from "react";
import { questionBank, Question, Difficulty } from "./questionBank";

const difficultyTabs: { label: string; value: Difficulty }[] = [
  { label: "Easy", value: "easy" },
  { label: "JEE Main", value: "jee-main" },
  { label: "JEE Advanced", value: "jee-advanced" },
];

const WorkEnergyPractice: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = questionBank.filter((q) => q.difficulty === difficulty);
  const current: Question | undefined = filtered[index];

  const handleNext = () => {
    setSelected(null);
    setIndex((prev) => Math.min(prev + 1, filtered.length - 1));
  };

  const handleTabChange = (d: Difficulty) => {
    setDifficulty(d);
    setIndex(0);
    setSelected(null);
  };

  if (!current) {
    return (
      <div className="text-center text-sm text-slate-400 p-4">
        No questions available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Difficulty Tabs */}
      <div className="flex gap-2 flex-wrap">
        {difficultyTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`px-4 py-1.5 rounded-full text-sm border transition ${
              difficulty === tab.value
                ? "bg-primary/20 text-primary border-sky-400"
                : "border-border text-slate-400 hover:bg-secondary/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Question */}
      <div className="text-base font-display tracking-wide text-white leading-relaxed">
        {current.question}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {current.options.map((opt, i) => {
          const isCorrect = selected !== null && i === current.answer;
          const isWrong = selected === i && i !== current.answer;
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              disabled={selected !== null}
              className={`w-full text-left px-4 py-3 rounded-xl border transition
                ${
                  isCorrect
                    ? "border-green-500 bg-green-500/10 text-green-400"
                    : isWrong
                    ? "border-red-500 bg-red-500/10 text-red-400"
                    : "border-border hover:glass-panel"
                }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Solution */}
      {selected !== null && (
        <div className="space-y-3">
          <div
            className={`text-sm font-medium ${
              selected === current.answer ? "text-green-400" : "text-red-400"
            }`}
          >
            {selected === current.answer
              ? "Correct Answer ✅"
              : "Wrong Answer ❌"}
          </div>
          <div className="bg-black/40 border border-border rounded-lg p-4 space-y-1">
            <div className="text-xs uppercase text-slate-400 mb-2">
              Solution
            </div>
            {current.solution.map((step, i) => (
              <div key={i} className="text-sm text-white">
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={selected === null || index === filtered.length - 1}
          className="px-6 py-2 rounded-full bg-primary text-primary-foreground 
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default WorkEnergyPractice;