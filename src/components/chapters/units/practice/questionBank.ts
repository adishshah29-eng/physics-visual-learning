export type Difficulty = "easy" | "jee" | "advanced";

export interface MCQ {
  id: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctIndex: number;
  solution: string[];
}

export const unitsMCQs: MCQ[] = [
  {
    id: "u1",
    difficulty: "easy",
    question: "Which of the following is NOT a fundamental quantity?",
    options: ["Length", "Mass", "Time", "Force"],
    correctIndex: 3,
    solution: [
      "Fundamental quantities are independent physical quantities.",
      "Length, mass, and time are fundamental quantities.",
      "Force is a derived quantity as it depends on mass and acceleration."
    ],
  },
  {
    id: "u2",
    difficulty: "jee",
    question: "The dimensional formula of pressure is:",
    options: [
      "ML⁻¹T⁻²",
      "MLT⁻²",
      "M⁻¹LT⁻²",
      "ML²T⁻²"
    ],
    correctIndex: 0,
    solution: [
      "Pressure = Force / Area",
      "Force has dimensions MLT⁻²",
      "Area has dimensions L²",
      "So pressure = M L⁻¹ T⁻²"
    ],
  },
  {
    id: "u3",
    difficulty: "advanced",
    question: "If the percentage error in measuring length and time are 2% and 3%, the maximum percentage error in velocity is:",
    options: ["1%", "5%", "6%", "0.5%"],
    correctIndex: 1,
    solution: [
      "Velocity = Length / Time",
      "Percentage errors add in division",
      "Total error = 2% + 3% = 5%"
    ],
  },
];
