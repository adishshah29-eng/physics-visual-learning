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
      "A spring of spring constant 100 N/m has a 1 kg mass attached. " +
      "What is the time period of oscillation?",
    options: ["π/5 s", "π/10 s", "2π/10 s", "2π s"],
    answer: 2,
    solution: [
      "Given: k = 100 N/m, m = 1 kg",
      "T = 2π√(m/k)",
      "T = 2π√(1/100)",
      "T = 2π × (1/10)",
      "T = 2π/10 s ≈ 0.628 s",
    ],
  },
  {
    id: 2,
    difficulty: "jee-main",
    question:
      "A particle in SHM has amplitude 4 cm and time period 2s. " +
      "What is its velocity when displacement is 2 cm?",
    options: ["2π cm/s", "2π√3 cm/s", "4π cm/s", "π√3 cm/s"],
    answer: 1,
    solution: [
      "Given: A = 4 cm, T = 2s, x = 2 cm",
      "ω = 2π/T = 2π/2 = π rad/s",
      "v = ω√(A² - x²)",
      "v = π × √(16 - 4)",
      "v = π × √12",
      "v = π × 2√3",
      "v = 2π√3 cm/s",
    ],
  },
  {
    id: 3,
    difficulty: "jee-advanced",
    question:
      "In SHM with amplitude A, at what displacement is the kinetic " +
      "energy equal to three times the potential energy?",
    options: ["A/2", "A/√2", "A√3/2", "A/4"],
    answer: 0,
    solution: [
      "Given: KE = 3 × PE",
      "KE = ½mω²(A² - x²)",
      "PE = ½mω²x²",
      "Setting KE = 3PE:",
      "½mω²(A² - x²) = 3 × ½mω²x²",
      "A² - x² = 3x²",
      "A² = 4x²",
      "x² = A²/4",
      "x = A/2",
    ],
  },
];