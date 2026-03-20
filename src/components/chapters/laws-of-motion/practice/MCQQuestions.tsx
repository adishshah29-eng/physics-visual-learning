import React, { useState } from "react";
import { Question, Difficulty } from "./questionBank";

interface Props {
  questions: Question[];
}

const difficultyTabs: { label: string; value: Difficulty }[] = [
  { label: "Easy", value: "easy" },
  { label: "JEE Main", value: "jee-main" },
  { label: "JEE Advanced", value: "jee-advanced" },
];

const MCQQuestions: React.FC<Props> = ({ questions }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = questions.filter(q => q.difficulty === difficulty);
  const current = filtered[index];

  const handleNext = () => {
    setSelected(null);
    setIndex((prev) => Math.min(prev + 1, filtered.length - 1));
  };

  if (!current) {
    return (
      <div className="text-center text-sm text-slate-400">
        No questions available.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Difficulty Tabs */}
      <div className="flex gap-2">
        {difficultyTabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => {
              setDifficulty(tab.value);
              setIndex(0);
              setSelected(null);
            }}
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
      <div className="text-base font-display tracking-wide text-white">
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

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={selected === null}
          className="px-6 py-2 rounded-full bg-primary text-primary-foreground disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MCQQuestions;
