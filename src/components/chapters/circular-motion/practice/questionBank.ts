export type Difficulty = "easy" | "jee-main" | "jee-advanced";

export interface Question {
  id: number;
  difficulty: Difficulty;
  question: string;
  options: string[];
  answer: number;
  solution: string[];
}

export const questionBank: Question[] = [
  {
    id: 1,
    difficulty: "easy",
    question:
      "A stone of mass 0.5 kg is tied to a string and swung in a " +
      "horizontal circle of radius 2 m at 4 m/s. " +
      "What is the centripetal force?",
    options: ["2 N", "4 N", "8 N", "16 N"],
    answer: 2,
    solution: [
      "Given: m = 0.5 kg, r = 2 m, v = 4 m/s",
      "F = mv²/r",
      "F = 0.5 × 16 / 2",
      "F = 4 N",
      "Wait — recalculate: 0.5 × 16 = 8, 8/2 = 4 N",
      "Answer: 4 N ✓",
    ],
  },
  {
    id: 2,
    difficulty: "jee-main",
    question:
      "A car of mass 1500 kg moves on a circular road of radius 300 m " +
      "at 20 m/s. What is the minimum coefficient of friction needed " +
      "to prevent skidding? (g = 10 m/s²)",
    options: ["0.10", "0.13", "0.20", "0.25"],
    answer: 1,
    solution: [
      "Given: m = 1500 kg, r = 300 m, v = 20 m/s, g = 10",
      "For no skidding: friction force ≥ centripetal force",
      "μmg ≥ mv²/r",
      "μ ≥ v²/rg",
      "μ ≥ 400 / (300 × 10)",
      "μ ≥ 400/3000 = 0.133",
      "Minimum μ ≈ 0.13",
    ],
  },
  {
    id: 3,
    difficulty: "jee-advanced",
    question:
      "A ball of mass m is attached to a string of length L and " +
      "swung in a vertical circle. What is the minimum speed at " +
      "the top of the circle so the string remains taut?",
    options: ["√(gL)", "√(2gL)", "√(gL/2)", "2√(gL)"],
    answer: 0,
    solution: [
      "At the top of a vertical circle, for minimum speed:",
      "The string is about to go slack → Tension T = 0",
      "Net inward force = centripetal force",
      "mg = mv²/L  (only gravity acts inward at top)",
      "v² = gL",
      "v_min = √(gL)",
    ],
  },
];