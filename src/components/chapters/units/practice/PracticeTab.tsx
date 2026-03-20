import { useState } from "react";
import MCQQuestion from "./MCQQuestion";
import { unitsMCQs, Difficulty } from "./questionBank";

const PracticeTab = () => {
  const [level, setLevel] = useState<Difficulty>("easy");

  const filtered = unitsMCQs.filter(q => q.difficulty === level);

  return (
    <div className="space-y-6">

      {/* Difficulty Selector */}
      <div className="flex gap-2">
        {(["easy", "jee", "advanced"] as Difficulty[]).map(l => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={`px-4 py-2 text-xs rounded-lg border ${
              level === l
                ? "bg-primary/20 border-sky-400 text-primary"
                : "border-border text-slate-400"
            }`}
          >
            {l === "easy" ? "Easy" : l === "jee" ? "JEE Main" : "JEE Advanced"}
          </button>
        ))}
      </div>

      {/* Questions */}
      {filtered.map(q => (
        <MCQQuestion key={q.id} question={q} />
      ))}

      {filtered.length === 0 && (
        <div className="text-sm text-slate-400">
          No questions available for this level.
        </div>
      )}
    </div>
  );
};

export default PracticeTab;
