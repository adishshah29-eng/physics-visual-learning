import TutorPanel from "../components/common/TutorPanel";
import Navbar from "../components/Navbar";

import UnitsExplore from "../components/chapters/units/Explore";
import UnitsUnderstand from "../components/chapters/units/Understand";
import PracticeTab from "@/components/chapters/units/practice/PracticeTab";
import UnitsPractice from "../components/chapters/units/practice/PracticeTab";
import UnitConverter from "@/components/chapters/units/practice/playground/UnitConverter";

/**
 * Units & Measurements page
 * No simulation yet
 * Same layout philosophy as Projectile
 */
const UnitsPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar currentChapter="CH-01: Units & Measurements" />

      <main className="flex-1 pt-16 px-4 pb-4">
        <div className="max-w-4xl mx-auto border border-border rounded-lg bg-card/10 backdrop-blur-xl overflow-hidden">
        <UnitConverter/>
          <TutorPanel
            Explore={UnitsExplore}
            Understand={UnitsUnderstand}
            Practice={UnitsPractice}
          />
        </div>
      </main>
    </div>
  );
};

export default UnitsPage;
