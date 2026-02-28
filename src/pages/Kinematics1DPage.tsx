import React from "react";
import Navbar from "../components/Navbar";
import TutorPanel from "../components/common/TutorPanel";

import Explore from "@/components/chapters/Kinematics1d/Explore";
import Understand from "@/components/chapters/Kinematics1d/Understand";
import Playground from "@/components/chapters/Kinematics1d/Playground";
import PracticeTab from "@/components/chapters/Kinematics1d/practice/PracticeTab";
const Kinematics1D: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar currentChapter="CH-02: Kinematics (1D)" />

      <main className="flex-1 pt-16 px-2 sm:px-4 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          {/* Playground */}
          <div className="lg:col-span-2 border border-border rounded-lg bg-secondary/10 p-4">
            <Playground />
          </div>

          {/* Tutor */}
          <div className="lg:col-span-1 border border-border bg-card/10 backdrop-blur-xl rounded-lg overflow-hidden">
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

export default Kinematics1D;
