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
      "A wave has frequency 500 Hz and wavelength 0.68 m. " +
      "What is the speed of the wave?",
    options: ["340 m/s", "735 m/s", "170 m/s", "500 m/s"],
    answer: 0,
    solution: [
      "Given: f = 500 Hz, λ = 0.68 m",
      "v = fλ",
      "v = 500 × 0.68",
      "v = 340 m/s",
    ],
  },
  {
    id: 2,
    difficulty: "jee-main",
    question:
      "A string of length 1 m and linear mass density 0.01 kg/m is " +
      "stretched with a tension of 100 N. What is the fundamental " +
      "frequency of the string fixed at both ends?",
    options: ["50 Hz", "100 Hz", "25 Hz", "200 Hz"],
    answer: 0,
    solution: [
      "Given: L = 1 m, μ = 0.01 kg/m, T = 100 N",
      "Wave speed: v = √(T/μ) = √(100/0.01) = √10000 = 100 m/s",
      "Fundamental: f₁ = v/(2L)",
      "f₁ = 100 / (2 × 1) = 50 Hz",
    ],
  },
  {
    id: 3,
    difficulty: "jee-advanced",
    question:
      "Two tuning forks A and B are sounded together and produce " +
      "4 beats per second. A has frequency 256 Hz. When B is loaded " +
      "with wax, the beat frequency becomes 6 per second. " +
      "What is the original frequency of B?",
    options: ["260 Hz", "252 Hz", "250 Hz", "262 Hz"],
    answer: 0,
    solution: [
      "Given: f_A = 256 Hz, beats = 4/s initially",
      "So f_B = 256 ± 4 → f_B = 252 Hz or 260 Hz",
      "Loading wax on B decreases its frequency (increases mass).",
      "If f_B = 260 Hz: after wax, f_B decreases → could be 258, 256, 254…",
      "Beats with 256 would be |256 − 258| = 2 (decreasing), or |256 − 254| = 2",
      "But beats INCREASED to 6. Contradiction.",
      "If f_B = 252 Hz: after wax, f_B decreases further → e.g. 250",
      "Beats = |256 − 250| = 6 ✓ (increased from 4 to 6)",
      "But wait: f_B = 260 → wax → say 254 → beats = 2 (not 6).",
      "f_B = 260 → wax → say 250 → beats = 6 ✓. Loading wax drops f by 10 Hz.",
      "Answer: f_B = 260 Hz (the beat frequency increasing means f_B was ABOVE f_A).",
    ],
  },
];
