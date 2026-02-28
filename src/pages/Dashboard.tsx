import React, { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import ChapterCard from "../components/ChapterCard";
import { Chapter } from "../types";

// --- DATA ---
const chapters: Chapter[] = [
  {
    id: "01",
    title: "Units & Measurements",
    class: "11",
    category: "mechanics",
    status: "active",
    description:
      "Fundamental dimensions, error analysis, and unit consistency.",
    route: "/learn/units",
  },
  {
    id: "02",
    title: "Kinematics (1D)",
    class: "11",
    category: "mechanics",
    status: "active",
    description: "Motion in a straight line, graphs, equations of motion.",
    route: "/learn/kinematics-1d",
  },
  {
    id: "04",
    title: "Projectile Motion",
    class: "11",
    category: "mechanics",
    status: "active",
    description: "Trajectory, time of flight, range, and maximum height.",
    route: "/learn/projectile-motion",
  },
  {
    id: "05",
    title: "Laws of Motion",
    class: "11",
    category: "mechanics",
    status: "active",
    description: "Newton's laws, free body diagrams, friction.",
    route: "/learn/laws-of-motion",
  },
  {
    id: "06",
    title: "Work, Energy & Power",
    class: "11",
    category: "mechanics",
    status: "coming_soon",
  },
  {
    id: "07",
    title: "Rotational Motion",
    class: "11",
    category: "mechanics",
    status: "locked",
  },
  {
    id: "08",
    title: "Gravitation",
    class: "11",
    category: "mechanics",
    status: "locked",
  },
  {
    id: "09",
    title: "Thermodynamics",
    class: "11",
    category: "thermodynamics",
    status: "locked",
  },
  {
    id: "12",
    title: "Electrostatics",
    class: "12",
    category: "electromagnetism",
    status: "locked",
  },
  {
    id: "13",
    title: "Current Electricity",
    class: "12",
    category: "electromagnetism",
    status: "locked",
  },
  {
    id: "14",
    title: "Ray Optics",
    class: "12",
    category: "optics",
    status: "locked",
  },
  {
    id: "15",
    title: "Semiconductors",
    class: "12",
    category: "modern",
    status: "locked",
  },
];

const categories = [
  { id: "all", label: "All Topics" },
  { id: "mechanics", label: "Mechanics" },
  { id: "electromagnetism", label: "Electromagnetism" },
  { id: "thermodynamics", label: "Thermodynamics" },
  { id: "optics", label: "Optics" },
  { id: "modern", label: "Modern Physics" },
];

const Dashboard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter logic
  const filteredChapters = useMemo(() => {
    return chapters.filter(
      (c) => selectedCategory === "all" || c.category === selectedCategory
    );
  }, [selectedCategory]);

  const class11 = filteredChapters.filter((c) => c.class === "11");
  const class12 = filteredChapters.filter((c) => c.class === "12");

  // Stats logic
  const activeCount = chapters.filter((c) => c.status === "active").length;
  const totalCount = chapters.length;

  return (
    // 1. FORCED DARK THEME BACKGROUND
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 overflow-x-hidden selection:bg-indigo-500/30">
      <Navbar />

      {/* 2. BACKGROUND GRID EFFECT (Visual Change) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]"></div>
      </div>

      <main className="relative z-10 pt-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
              Physics{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                Curriculum
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl font-light">
              Interactive simulations for JEE Advanced.
            </p>
          </div>

          {/* 3. NEW STATS BOX (Visual Change) */}
          <div className="flex gap-6 p-4 bg-slate-900/50 rounded-xl border border-slate-800 backdrop-blur-sm">
            <div className="text-center px-2">
              <div className="text-2xl font-bold text-emerald-400">
                {activeCount}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                Unlocked
              </div>
            </div>
            <div className="w-px bg-slate-800"></div>
            <div className="text-center px-2">
              <div className="text-2xl font-bold text-white">{totalCount}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                Total
              </div>
            </div>
          </div>
        </header>

        {/* 4. NEW FILTER TABS (Visual Change) */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border
                ${
                  selectedCategory === cat.id
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                    : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white"
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="space-y-16">
          {/* CLASS 11 */}
          {class11.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-xl">
                  ⚡
                </div>{" "}
                {/* Emoji fallback */}
                <h2 className="text-2xl font-semibold text-white">Class 11</h2>
                <span className="text-xs font-mono text-slate-500 ml-auto border border-slate-800 px-2 py-1 rounded">
                  Mechanics & Thermodynamics
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {class11.map((chapter) => (
                  <ChapterCard key={chapter.id} chapter={chapter} />
                ))}
              </div>
            </section>
          )}

          {/* CLASS 12 */}
          {class12.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-pink-500/10 rounded-lg text-xl">📚</div>{" "}
                {/* Emoji fallback */}
                <h2 className="text-2xl font-semibold text-white">Class 12</h2>
                <div className="ml-auto flex items-center gap-2 text-xs font-bold text-amber-500/80 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  🔒 LOCKED
                </div>
              </div>

              {/* Dimmed section for locked content */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                {class12.map((chapter) => (
                  <ChapterCard key={chapter.id} chapter={chapter} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
