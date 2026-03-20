// components/practice/PracticeTab.tsx

import { useState } from "react";
import { questions, Difficulty } from "./questionBank";
import MCQQuestion from "./MCQQuestion";

const PracticeTab: React.FC = () => {
  const [level, setLevel] = useState<Difficulty>("easy");
  const [index, setIndex] = useState(0);

  const filtered = questions.filter((q) => q.level === level);
  const current = filtered[index];

  return (
    <div className="space-y-6">
      {/* Level Selector */}
      <div className="flex gap-2">
        {(["easy", "jee", "advanced"] as Difficulty[]).map((l) => (
          <button
            key={l}
            onClick={() => {
              setLevel(l);
              setIndex(0);
            }}
            className={`px-4 py-2 rounded-lg text-sm ${
              level === l
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-slate-400"
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Question */}
      {current ? (
        <>
          <MCQQuestion key={`${level}-${current.id}`} question={current} />

          {/* Next */}
          <button
            onClick={() => setIndex((i) => (i + 1) % filtered.length)}
            className="px-4 py-2 bg-secondary rounded-lg text-sm"
          >
            Next Question
          </button>
        </>
      ) : (
        <div className="text-slate-400 text-sm">
          No questions available.
        </div>
      )}
    </div>
  );
};

export default PracticeTab;
