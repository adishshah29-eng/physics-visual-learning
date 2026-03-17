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
      "A solid disk of mass 4 kg and radius 0.5 m rotates about its " +
      "central axis. What is its moment of inertia?",
    options: ["0.25 kg·m²", "0.50 kg·m²", "1.00 kg·m²", "2.00 kg·m²"],
    answer: 1,
    solution: [
      "Given: m = 4 kg, R = 0.5 m",
      "For a solid disk: I = ½mR²",
      "I = ½ × 4 × (0.5)²",
      "I = ½ × 4 × 0.25",
      "I = 0.50 kg·m²",
    ],
  },
  {
    id: 2,
    difficulty: "jee-main",
    question:
      "A solid sphere rolls without slipping down an incline of angle 30°. " +
      "What is its linear acceleration? (g = 10 m/s²)",
    options: ["5/7 m/s²", "25/7 m/s²", "50/7 m/s²", "10/3 m/s²"],
    answer: 1,
    solution: [
      "Given: θ = 30°, g = 10 m/s²",
      "For a solid sphere: I = (2/5)mR²",
      "Rolling acceleration: a = g sinθ / (1 + I/(mR²))",
      "I/(mR²) = 2/5",
      "a = g sin30° / (1 + 2/5)",
      "a = 10 × 0.5 / (7/5)",
      "a = 5 / (7/5)",
      "a = 5 × 5/7",
      "a = 25/7 m/s² ≈ 3.57 m/s²",
    ],
  },
  {
    id: 3,
    difficulty: "jee-advanced",
    question:
      "A uniform rod of mass 6 kg and length 2 m is pivoted at one end. " +
      "It is released from a horizontal position. What is its angular " +
      "velocity when it becomes vertical? (g = 10 m/s²)",
    options: ["√10 rad/s", "√15 rad/s", "√20 rad/s", "√30 rad/s"],
    answer: 1,
    solution: [
      "Given: m = 6 kg, L = 2 m, g = 10 m/s²",
      "Rod pivoted at one end: I = (1/3)mL²",
      "I = (1/3)(6)(4) = 8 kg·m²",
      "COM falls by h = L/2 = 1 m",
      "Energy conservation: mg(L/2) = ½Iω²",
      "6 × 10 × 1 = ½ × 8 × ω²",
      "60 = 4ω²",
      "ω² = 15",
      "ω = √15 rad/s ≈ 3.87 rad/s",
    ],
  },
];
