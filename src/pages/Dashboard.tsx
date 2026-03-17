import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import ChapterCard from "@/components/ChapterCard";
import { chapters, categories as chapterCategories } from "@/config/chapters";

const categories = [
  { id: "all", label: "All Topics" },
  ...chapterCategories.map(cat => ({
    id: cat,
    label: cat.charAt(0) + cat.slice(1)
  }))
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
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 overflow-x-hidden selection:bg-sky-500/30">
      <Navbar />

      {/* BACKGROUND GRID EFFECT */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-sky-500 opacity-10 blur-[100px]"></div>
      </div>

      <main className="relative z-10 pt-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
              PHYSICS.
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
                LAB
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl font-light">
              Interactive learning simulations for JEE/NEET physics.
            </p>
          </div>

          {/* STATS BOX */}
          <div className="flex gap-6 p-4 bg-slate-900/50 rounded-xl border border-slate-800 backdrop-blur-sm">
            <div className="text-center px-2">
              <div className="text-2xl font-bold text-sky-400">
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

        {/* FILTER TABS */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border cursor-pointer
                ${
                  selectedCategory === cat.id
                    ? "bg-sky-600 border-sky-500 text-white shadow-lg shadow-sky-500/25"
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
                <div className="p-2 bg-sky-500/10 rounded-lg text-lg">⚡</div>
                <h2 className="text-2xl font-semibold text-white">Class 11</h2>
                <span className="text-xs font-mono text-slate-500 ml-auto border border-slate-800 px-2 py-1 rounded">
                  Core Mechanics & Thermodynamics
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
                <div className="p-2 bg-indigo-500/10 rounded-lg text-lg">⚛️</div>
                <h2 className="text-2xl font-semibold text-white">Class 12</h2>
                <div className="ml-auto flex items-center gap-2 text-xs font-bold text-amber-500/80 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  🔒 LOCKED
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
