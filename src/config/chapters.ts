export interface Chapter {
  id: string;
  code: string;
  title: string;
  class: '11' | '12';
  category: 'mechanics' | 'electromagnetism' | 'optics' | 'thermodynamics' | 'modern';
  status: 'active' | 'coming_soon' | 'locked';
  description: string;
  simulationComponent: string;
  difficulty: 'foundation' | 'intermediate' | 'advanced';
}

export const chapters: Chapter[] = [
  {
    id: "units",
    code: "CH-01",
    title: "Units & Measurements",
    class: "11",
    category: "mechanics",
    status: "active",
    description: "Fundamental dimensions, error analysis, SI units.",
    simulationComponent: "units",
    difficulty: "foundation"
  },
  {
    id: "kinematics-1d",
    code: "CH-02",
    title: "Kinematics (1D)",
    class: "11",
    category: "mechanics",
    status: "active",
    description: "Motion in a straight line, equations of motion, graphs.",
    simulationComponent: "kinematics-1d",
    difficulty: "foundation"
  },
  {
    id: "projectile-motion",
    code: "CH-04",
    title: "Projectile Motion",
    class: "11",
    category: "mechanics",
    status: "active",
    description: "Trajectory, time of flight, range, max height.",
    simulationComponent: "projectile-motion",
    difficulty: "intermediate"
  },
  {
    id: "laws-of-motion",
    code: "CH-05",
    title: "Laws of Motion",
    class: "11",
    category: "mechanics",
    status: "active",
    description: "Newton's laws, free body diagrams, friction.",
    simulationComponent: "laws-of-motion",
    difficulty: "intermediate"
  },
  {
    id: "work-energy",
    code: "CH-06",
    title: "Work, Energy & Power",
    class: "11",
    category: "mechanics",
    status: "active",
    description: "Work-energy theorem, conservation of energy, power.",
    simulationComponent: "work-energy",
    difficulty: "intermediate"
  },
  {
    id: "circular-motion",
    code: "CH-07",
    title: "Circular Motion",
    class: "11",
    category: "mechanics",
    status: "active",
    description: "Centripetal force, angular velocity, banking.",
    simulationComponent: "circular-motion",
    difficulty: "intermediate"
  },
  {
    id: "shm",
    code: "CH-08",
    title: "Simple Harmonic Motion",
    class: "11",
    category: "mechanics",
    status: "active",
    description: "Spring-mass systems, pendulums, energy in SHM.",
    simulationComponent: "shm",
    difficulty: "advanced"
  },
  {
    id: "rotational-motion",
    code: "CH-09",
    title: "Rotational Motion",
    class: "11",
    category: "mechanics",
    status: "active",
    description: "Moment of inertia, torque, angular momentum, rolling motion.",
    simulationComponent: "",
    difficulty: "advanced"
  },
  {
    id: "gravitation",
    code: "CH-10",
    title: "Gravitation",
    class: "11",
    category: "mechanics",
    status: "active",
    description: "Kepler's laws, universal law of gravitation, gravitational potential.",
    simulationComponent: "",
    difficulty: "foundation"
  },
  {
    id: "thermodynamics",
    code: "CH-11",
    title: "Thermodynamics",
    class: "11",
    category: "thermodynamics",
    status: "active",
    description: "Laws of thermodynamics, heat engines, entropy.",
    simulationComponent: "",
    difficulty: "intermediate"
  },
  {
    id: "waves",
    code: "CH-12",
    title: "Waves",
    class: "11",
    category: "mechanics",
    status: "active",
    description: "Wave equation, superposition, Doppler effect, sound waves.",
    simulationComponent: "",
    difficulty: "intermediate"
  },
  {
    id: "electrostatics",
    code: "CH-13",
    title: "Electrostatics",
    class: "12",
    category: "electromagnetism",
    status: "locked",
    description: "Coulomb's law, electric fields, potential, capacitance.",
    simulationComponent: "",
    difficulty: "intermediate"
  },
  {
    id: "current-electricity",
    code: "CH-14",
    title: "Current Electricity",
    class: "12",
    category: "electromagnetism",
    status: "locked",
    description: "Ohm's law, Kirchhoff's rules, Wheatstone bridge.",
    simulationComponent: "",
    difficulty: "foundation"
  },
  {
    id: "ray-optics",
    code: "CH-15",
    title: "Ray Optics",
    class: "12",
    category: "optics",
    status: "locked",
    description: "Reflection, refraction, lenses, optical instruments.",
    simulationComponent: "",
    difficulty: "intermediate"
  },
  {
    id: "semiconductors",
    code: "CH-16",
    title: "Semiconductors",
    class: "12",
    category: "modern",
    status: "locked",
    description: "P-N junction, diodes, transistors, logic gates.",
    simulationComponent: "",
    difficulty: "intermediate"
  }
];

export const categories = Array.from(
  new Set(chapters.map(c => c.category))
);

export const getChapterById = (id: string) =>
  chapters.find(c => c.id === id);

export const getActiveChapters = () =>
  chapters.filter(c => c.status === 'active');