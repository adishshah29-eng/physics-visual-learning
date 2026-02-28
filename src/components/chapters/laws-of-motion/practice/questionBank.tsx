export type Difficulty = "easy" | "jee-main" | "jee-advanced";

export interface Question {
  id: number;
  difficulty: Difficulty;
  question: string;
  options: string[];
  answer: number;
}

export const questionBank: Question[] = [
  {
    id: 1,
    difficulty: "easy",
    question:
      "A body starts from rest and moves with constant acceleration of 2 m/s². What is its velocity after 5 seconds?",
    options: ["5 m/s", "10 m/s", "15 m/s", "20 m/s"],
    answer: 1,
  },
  {
    id: 2,
    difficulty: "jee-main",
    question:
      "A force F acts on a mass m producing acceleration a. If the force is doubled, the acceleration becomes:",
    options: ["a/2", "a", "2a", "4a"],
    answer: 2,
  },
  {
    id: 3,
    difficulty: "jee-advanced",
    question:
      "Two blocks of masses m and 2m are connected by a string on a frictionless surface. Find the acceleration of the system when force F is applied.",
    options: ["F/3m", "F/2m", "F/m", "2F/3m"],
    answer: 0,
  },
];
