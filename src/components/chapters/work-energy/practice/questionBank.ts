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
      "A 5 kg block is pushed 4 m by a constant 20 N force on a " +
      "frictionless horizontal surface. What is the work done?",
    options: ["40 J", "80 J", "100 J", "20 J"],
    answer: 1,
    solution: [
      "Given: F = 20 N, d = 4 m, frictionless surface",
      "W = F × d",
      "W = 20 × 4",
      "W = 80 J",
    ],
  },
  {
    id: 2,
    difficulty: "jee-main",
    question:
      "A car of mass 1000 kg accelerates from rest to 20 m/s in 10 s. " +
      "Find the average power developed by the engine. (ignore friction)",
    options: ["10,000 W", "20,000 W", "40,000 W", "5,000 W"],
    answer: 1,
    solution: [
      "Given: m = 1000 kg, u = 0, v = 20 m/s, t = 10 s",
      "KE gained = ½mv² = ½ × 1000 × 400 = 200,000 J",
      "Work done = KE gained = 200,000 J (no friction)",
      "Average Power = W/t = 200,000 / 10 = 20,000 W",
    ],
  },
  {
    id: 3,
    difficulty: "jee-advanced",
    question:
      "A 2 kg block slides down a frictionless incline of height 5 m, " +
      "then moves on a rough horizontal surface (μ = 0.2) until it stops. " +
      "How far does it travel on the horizontal surface? (g = 10 m/s²)",
    options: ["10 m", "20 m", "25 m", "50 m"],
    answer: 2,
    solution: [
      "Given: m = 2 kg, h = 5 m, μ = 0.2, g = 10 m/s²",
      "PE at top of incline = mgh = 2 × 10 × 5 = 100 J",
      "This converts fully to KE at bottom (frictionless incline)",
      "On horizontal surface, friction force = μmg = 0.2 × 2 × 10 = 4 N",
      "Work done by friction = friction force × distance",
      "100 = 4 × d",
      "d = 100 / 4 = 25 m",
    ],
  },
];