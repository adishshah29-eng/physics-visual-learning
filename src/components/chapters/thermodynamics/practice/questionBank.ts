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
      "2 moles of an ideal gas at 300 K are expanded isothermally to " +
      "double its volume. Find the work done by the gas. (R = 8.314 J/mol·K)",
    options: ["3456 J", "2494 J", "1247 J", "4988 J"],
    answer: 0,
    solution: [
      "Given: n = 2 mol, T = 300 K, V₂ = 2V₁",
      "W = nRT ln(V₂/V₁)",
      "W = 2 × 8.314 × 300 × ln(2)",
      "W = 4988.4 × 0.6931",
      "W = 3456.3 J ≈ 3456 J",
    ],
  },
  {
    id: 2,
    difficulty: "jee-main",
    question:
      "An ideal diatomic gas (γ = 7/5) at pressure 5 atm and volume 4 L " +
      "undergoes adiabatic expansion to volume 8 L. " +
      "What is the final pressure? (Answer to 2 decimal places in atm)",
    options: ["1.89 atm", "2.50 atm", "3.54 atm", "2.00 atm"],
    answer: 0,
    solution: [
      "Given: P₁ = 5 atm, V₁ = 4 L, V₂ = 8 L, γ = 1.4",
      "Adiabatic: P₁V₁^γ = P₂V₂^γ",
      "P₂ = P₁ × (V₁/V₂)^γ",
      "P₂ = 5 × (4/8)^1.4",
      "P₂ = 5 × (0.5)^1.4",
      "(0.5)^1.4 = 2^(−1.4) = 1/2^1.4",
      "2^1.4 = 2^1 × 2^0.4 = 2 × 1.3195 = 2.639",
      "P₂ = 5 / 2.639 = 1.894 atm ≈ 1.89 atm",
    ],
  },
  {
    id: 3,
    difficulty: "jee-advanced",
    question:
      "A Carnot engine operates between 600 K and 300 K. It absorbs 1000 J " +
      "of heat per cycle. What is the work output per cycle?",
    options: ["500 J", "300 J", "700 J", "600 J"],
    answer: 0,
    solution: [
      "Given: T_H = 600 K, T_C = 300 K, Q_H = 1000 J",
      "Carnot efficiency: η = 1 − T_C/T_H",
      "η = 1 − 300/600 = 1 − 0.5 = 0.5",
      "Work output: W = η × Q_H",
      "W = 0.5 × 1000 = 500 J",
      "Heat rejected: Q_C = Q_H − W = 1000 − 500 = 500 J",
      "Verify: η = W/Q_H = 500/1000 = 0.5 ✓",
    ],
  },
];
