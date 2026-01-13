import { useState } from "react";
import { MCQ } from "./questionBank";

interface Props {
  question: MCQ;
}

const MCQQuestion: React.FC<Props> = ({ question }) => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="space-y-6">

      <div className="text-sm text-foreground leading-relaxed">
        {question.question}
      </div>

      <div className="space-y-3">
        {question.options.map((opt, idx) => {
          const isCorrect = idx === question.correctIndex;
          const isChosen = idx === selected;

          return (
            <button
              key={idx}
              onClick={() => setSelected(idx)}
              disabled={selected !== null}
              className={`w-full text-left p-3 rounded-lg border transition-all
                ${
                  selected === null
                    ? "border-border hover:bg-secondary/40"
                    : isCorrect
                    ? "border-green-500 bg-green-500/10"
                    : isChosen
                    ? "border-red-500 bg-red-500/10"
                    : "border-border opacity-50"
                }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="space-y-4">
          <div
            className={`text-sm font-medium ${
              selected === question.correctIndex
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {selected === question.correctIndex
              ? "Correct Answer ✅"
              : "Wrong Answer ❌"}
          </div>

          <div className="bg-black/40 border border-border rounded-lg p-4 space-y-2">
            <div className="text-xs uppercase text-muted-foreground">
              Solution
            </div>
            {question.solution.map((step, i) => (
              <div key={i} className="text-sm text-foreground">
                {step}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MCQQuestion;
