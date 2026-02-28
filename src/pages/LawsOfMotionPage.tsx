import React from "react";
import Navbar from "../components/Navbar";
import TutorPanel from "../components/common/TutorPanel";
import PracticeTab from "@/components/chapters/laws-of-motion/practice/PracticeTab";
import LawsOfMotionPlayground from "@/components/chapters/laws-of-motion/playgrounds/LawsOfMotionPlayground";
import Explore from "@/components/chapters/laws-of-motion/Explore";
import Understand from "@/components/chapters/laws-of-motion/Understand";

const LawsOfMotion: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      <Navbar currentChapter="CH-05: Laws of Motion" />

      {/* SAME STRUCTURE AS PROJECTILE MOTION */}
      <main className="flex-1 pt-16 px-2 sm:px-4 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[calc(100vh-4rem)]">
          {/* LEFT: PLAYGROUND */}
          <div className="lg:col-span-2 border border-slate-800 rounded-xl bg-slate-900/50 overflow-hidden flex flex-col">
            <LawsOfMotionPlayground />
          </div>

          {/* RIGHT: TUTOR PANEL */}
          <div className="lg:col-span-1 border border-slate-800 rounded-xl bg-slate-900/80 backdrop-blur overflow-hidden flex flex-col">
            <TutorPanel
              Explore={<Explore />}
              Understand={<Understand />}
              Practice={<PracticeTab />}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default LawsOfMotion;
