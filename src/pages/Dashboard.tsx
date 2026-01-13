import React from "react";
import Navbar from "../components/Navbar";
import ChapterCard from "../components/ChapterCard";
import { Chapter } from "../types";

const chapters: Chapter[] = [
  {
    id: "01",
    title: "Units & Measurements",
    class: "11",
    category: "mechanics",
    status: "active",
    description:
      "Fundamental dimensions, error analysis, and significant figures.",
    route: "/learn/units",
  },
  {
    id: "03",
    title: "Start: Kinematics 1D",
    class: "11",
    category: "mechanics",
    status: "locked",
    description: "Motion in a straight line, velocity, and acceleration.",
  },
  {
    id: "04",
    title: "Projectile Motion",
    class: "11",
    category: "mechanics",
    status: "active",
    description:
      "Motion in a plane, trajectory analysis, and range calculations.",
    route: "/learn/projectile-motion",
  },
  {
    id: "05",
    title: "Laws of Motion",
    class: "11",
    category: "mechanics",
    status: "coming_soon",
    description: "Newton’s laws, friction, and dynamics of circular motion.",
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

const Dashboard: React.FC = () => {
  const class11 = chapters.filter((c) => c.class === "11");
  const class12 = chapters.filter((c) => c.class === "12");

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 overflow-x-hidden">
      <Navbar />

      <main className="pt-20 sm:pt-24 px-3 sm:px-4 md:px-6 lg:px-8 max-w-[1440px] mx-auto">
        {/* Header */}
        <header className="mb-10 sm:mb-12 text-center relative">
          <div
            className="
              absolute top-1/2 left-1/2 
              -translate-x-1/2 -translate-y-1/2 
              w-[280px] h-[160px] 
              sm:w-[400px] sm:h-[220px] 
              md:w-[600px] md:h-[300px]
              bg-primary/10 blur-[80px] sm:blur-[100px]
              rounded-full pointer-events-none -z-10
            "
          />

          <h1
            className="
              text-2xl sm:text-3xl md:text-4xl lg:text-5xl
              font-light mb-3 sm:mb-4
              text-transparent bg-clip-text 
              bg-gradient-to-b from-white to-white/50
            "
          >
            Physics Curriculum
          </h1>

          <p
            className="
              text-sm sm:text-base md:text-lg
              text-muted-foreground 
              max-w-xl sm:max-w-2xl 
              mx-auto font-light
            "
          >
            Advanced simulation-based learning for JEE Main & Advanced.
          </p>
        </header>

        <div className="space-y-12 sm:space-y-16">
          {/* Class 11 */}
          <section>
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-medium">Class 11</h2>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <div
              className="
                grid grid-cols-1 
                sm:grid-cols-2 
                lg:grid-cols-3 
                xl:grid-cols-4 
                gap-4 sm:gap-6
              "
            >
              {class11.map((chapter) => (
                <ChapterCard key={chapter.id} chapter={chapter} />
              ))}
            </div>
          </section>

          {/* Class 12 */}
          <section className="opacity-60 hover:opacity-100 transition-opacity duration-500">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-medium">Class 12</h2>
              <div className="h-px bg-white/10 flex-1"></div>
              <span
                className="
                  text-[10px] sm:text-xs 
                  uppercase tracking-widest 
                  text-muted-foreground 
                  bg-secondary px-2 py-1 rounded
                "
              >
                Locked
              </span>
            </div>

            <div
              className="
                grid grid-cols-1 
                sm:grid-cols-2 
                lg:grid-cols-3 
                xl:grid-cols-4 
                gap-4 sm:gap-6 
                grayscale hover:grayscale-0 
                transition-all duration-500
              "
            >
              {class12.map((chapter) => (
                <ChapterCard key={chapter.id} chapter={chapter} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
