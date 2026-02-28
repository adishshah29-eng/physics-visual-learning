export type MCQ = {
  id: string;
  level: "easy" | "main" | "advanced";
  question: string;
  options: string[];
  correctIndex: number;
  solution: string[];
};

export const questions: MCQ[] = [
  {
    id: "k1d-e1",
    level: "easy",
    question:
      "A body starts from rest and moves with constant acceleration of 2 m/s². What is its velocity after 5 seconds?",
    options: ["5 m/s", "10 m/s", "15 m/s", "20 m/s"],
    correctIndex: 1,
    solution: [
      "Given:",
      "u = 0 m/s",
      "a = 2 m/s²",
      "t = 5 s",
      "",
      "Using first equation of motion:",
      "v = u + at",
      "v = 0 + (2 × 5)",
      "v = 10 m/s",
    ],
  },
  {
    id: "k1d-m1",
    level: "main",
    question:
      "A particle moves along a straight line with velocity v = 3t². Find the displacement in first 2 seconds.",
    options: ["4 m", "6 m", "8 m", "12 m"],
    correctIndex: 2,
    solution: [
      "Given:",
      "v = 3t²",
      "",
      "Displacement = ∫ v dt",
      "s = ∫ 3t² dt",
      "s = t³",
      "",
      "From t = 0 to t = 2:",
      "s = 2³ − 0 = 8 m",
    ],
  },
  {
    id: "k1d-a1",
    level: "advanced",
    question:
      "A particle moves with acceleration a = −kv where k > 0. What happens to its velocity with time?",
    options: [
      "Increases linearly",
      "Decreases linearly",
      "Decreases exponentially",
      "Becomes zero instantly",
    ],
    correctIndex: 2,
    solution: [
      "Given:",
      "a = dv/dt = −kv",
      "",
      "This is a differential equation:",
      "dv/v = −k dt",
      "",
      "Integrating:",
      "ln v = −kt + C",
      "",
      "v = v₀ e^(−kt)",
      "",
      "Hence velocity decreases exponentially.",
    ],
  },
];
