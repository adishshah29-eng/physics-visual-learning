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
      "Calculate the escape velocity from the surface of the Earth. " +
      "(G = 6.67×10⁻¹¹ N·m²/kg², M = 6×10²⁴ kg, R = 6.4×10⁶ m)",
    options: ["7.9 km/s", "11.2 km/s", "8.0 km/s", "15.8 km/s"],
    answer: 1,
    solution: [
      "Given: G = 6.67×10⁻¹¹, M = 6×10²⁴ kg, R = 6.4×10⁶ m",
      "v_esc = √(2GM/R)",
      "2GM = 2 × 6.67×10⁻¹¹ × 6×10²⁴ = 8.004×10¹⁴",
      "2GM/R = 8.004×10¹⁴ / 6.4×10⁶ = 1.2506×10⁸",
      "v_esc = √(1.2506×10⁸) ≈ 11,185 m/s ≈ 11.2 km/s",
      "Note: 7.9 km/s is the low-orbit velocity, not escape velocity.",
    ],
  },
  {
    id: 2,
    difficulty: "jee-main",
    question:
      "A satellite orbits Earth at height h = R (one Earth radius above surface). " +
      "What is its orbital speed? (g = 10 m/s², R = 6.4×10⁶ m)",
    options: ["8 km/s", "4√2 km/s", "4 km/s", "8√2 km/s"],
    answer: 1,
    solution: [
      "Given: h = R, so orbital radius = R + h = 2R",
      "v = √(GM / 2R) = √(gR² / 2R) = √(gR / 2)",
      "Near-surface orbital speed: v₀ = √(gR) = √(10 × 6.4×10⁶) = 8000 m/s = 8 km/s",
      "v at h=R = v₀ / √2 = 8000/√2 = 4000√2 m/s = 4√2 km/s ≈ 5657 m/s",
      "Answer: 4√2 km/s",
    ],
  },
  {
    id: 3,
    difficulty: "jee-advanced",
    question:
      "A satellite of mass m is in circular orbit at radius R from Earth's center. " +
      "It is to be transferred to a circular orbit at radius 2R. " +
      "What is the minimum energy required? (g = surface gravity, R = Earth's radius)",
    options: ["mgR/2", "mgR/4", "mgR", "mgR/8"],
    answer: 1,
    solution: [
      "Total orbital energy: E = −GMm/(2r)",
      "Using GM = gR² (from surface gravity definition):",
      "E₁ = −gR²m / (2R) = −mgR/2",
      "E₂ = −gR²m / (2×2R) = −mgR/4",
      "ΔE = E₂ − E₁ = −mgR/4 − (−mgR/2)",
      "ΔE = −mgR/4 + mgR/2 = mgR/4",
      "Minimum energy required = mgR/4 (positive → must add energy to reach higher orbit)",
    ],
  },
];
