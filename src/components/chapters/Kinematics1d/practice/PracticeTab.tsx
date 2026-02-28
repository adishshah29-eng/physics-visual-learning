import { useState } from "react";
import MCQQuestion from "./MCQQuestion";
import { questions } from "./questionBank";

type Level = "easy" | "main" | "advanced";

const PracticeTab = () => {
  const [level, setLevel] = useState<Level>("easy");

  const filtered = questions.filter(q => q.level === level);

  return (
    <div className="p-4 space-y-6">

      {/* Level Selector */}
      <div className="flex gap-2 flex-wrap">
        {(["easy", "main", "advanced"] as Level[]).map(l => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={`px-3 py-1 text-xs rounded border capitalize ${
              level === l
                ? "bg-primary/20 text-primary border-primary"
                : "border-border text-muted-foreground"
            }`}
          >
            {l === "main" ? "JEE Main" : l === "advanced" ? "JEE Advanced" : "Easy"}
          </button>
        ))}
      </div>

      {/* Questions */}
      {filtered.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No questions available for this level.
        </div>
      ) : (
        filtered.map(q => (
          <MCQQuestion key={q.id} question={q} />
        ))
      )}
    </div>
  );
};

export default PracticeTab;
