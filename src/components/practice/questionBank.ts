// components/practice/questionBank.ts

export type Difficulty = "easy" | "jee" | "advanced";

export interface MCQ {
  id: string;
  level: Difficulty;
  question: string;
  options: string[];
  correctIndex: number;
  solution: string[];
}

export const questions: MCQ[] = [
  {
    id: "PM_E_01",
    level: "easy",
    question:
      "A projectile is thrown with speed 20 m/s at an angle of 45°. Find its range. (g = 10 m/s²)",
    options: ["40 m", "20 m", "30 m", "50 m"],
    correctIndex: 0,
    solution: [
      "Range R = u² sin 2θ / g",
      "u = 20 m/s, θ = 45° → sin 90° = 1",
      "R = (20² × 1) / 10 = 40 m",
    ],
  },
  {
    id: "PM_J_01",
    level: "jee",
    question:
      "A projectile is projected with velocity 25 m/s at 30°. Find the maximum height attained. (g = 9.8 m/s²)",
    options: ["7.9 m", "8.5 m", "6.3 m", "10.2 m"],
    correctIndex: 0,
    solution: [
      "Maximum height H = u² sin²θ / (2g)",
      "sin 30° = 0.5",
      "H = (25² × 0.25) / (2 × 9.8) ≈ 7.97 m",
    ],
  },
  {
    id: "PM_A_01",
    level: "advanced",
    question:
      "For a given speed of projection, the maximum range on an inclined plane is obtained when angle of projection is:",
    options: [
      "45°",
      "Angle equal to inclination",
      "45° + inclination/2",
      "45° − inclination/2",
    ],
    correctIndex: 3,
    solution: [
      "For inclined plane problems, symmetry breaks.",
      "Maximum range occurs at θ = 45° − α/2",
      "This result is derived using differentiation of range expression.",
    ],
  },
];
