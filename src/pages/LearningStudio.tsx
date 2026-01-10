import React from 'react';
import Navbar from '../components/Navbar';
import SimulationPanel from '../components/SimulationPanel';
import TutorPanel from '../components/TutorPanel';

    const LearningStudio: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar currentChapter="CH-04: Projectile Motion" />

      <main className="
        flex-1 
        pt-16 
        px-2 sm:px-4 
        pb-4
      ">
        <div
          className="
            grid grid-cols-1 
            lg:grid-cols-3 
            gap-4 
            h-full
          "
        >
          {/* Simulation */}
          <div className="lg:col-span-2 min-h-[60vh] lg:min-h-full">
            <SimulationPanel />
          </div>

          {/* Tutor */}
          <div
            className="
              lg:col-span-1 
              border border-border 
              bg-card/10 
              backdrop-blur-xl 
              rounded-lg
              overflow-hidden
            "
          >
            <TutorPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearningStudio;