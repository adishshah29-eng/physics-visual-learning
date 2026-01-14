// src/pages/UnitsMeasurements.tsx
import React from "react";
import Navbar from "../components/Navbar";
import TutorPanel from "../components/common/TutorPanel";

import UnitsExplore from "../components/chapters/units/Explore";
import UnitsUnderstand from "../components/chapters/units/Understand";
import UnitsPractice from "../components/chapters/units/practice/PracticeTab";
import UnitConverter from "@/components/chapters/units/practice/playground/UnitConverter";

const UnitsMeasurements: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar currentChapter="CH-01: Units & Measurements" />

      <main className="flex-1 pt-16 px-2 sm:px-4 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">

          {/* LEFT — Playground */}
          <div className="lg:col-span-2 min-h-[60vh] lg:min-h-full">
            <UnitConverter />
          </div>

          {/* RIGHT — Tutor */}
          <div className="
            lg:col-span-1
            border border-border
            bg-card/10
            backdrop-blur-xl
            rounded-lg
            overflow-hidden
          ">
            <TutorPanel
              Explore={<UnitsExplore />}
              Understand={<UnitsUnderstand />}
              Practice={<UnitsPractice />}
            />
          </div>

        </div>
      </main>
    </div>
  );
};

export default UnitsMeasurements;
