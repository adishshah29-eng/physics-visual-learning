import React, { useState } from "react";
import PracticeTab from "./practice/PracticeTab";
import { BookOpen, Compass, Target, ChevronRight } from "lucide-react";

type Tab = "explore" | "understand" | "practice";

const TutorPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("explore");

  return (
    <div className="h-full flex flex-col bg-background/50 backdrop-blur-sm">

      {/* ================= TABS ================= */}
      <div className="flex border-b border-border">
        <TabButton
          active={activeTab === "explore"}
          onClick={() => setActiveTab("explore")}
          icon={<Compass className="w-4 h-4" />}
          label="Explore"
        />
        <TabButton
          active={activeTab === "understand"}
          onClick={() => setActiveTab("understand")}
          icon={<BookOpen className="w-4 h-4" />}
          label="Understand"
        />
        <TabButton
          active={activeTab === "practice"}
          onClick={() => setActiveTab("practice")}
          icon={<Target className="w-4 h-4" />}
          label="Practice"
        />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar">

        {/* ---------- EXPLORE ---------- */}
        {activeTab === "explore" && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">

            <div>
              <h2 className="text-2xl font-light text-foreground mb-4">
                Projectile Motion
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Projectile motion describes the motion of an object projected
                into air that moves under the influence of gravity alone.
                The path followed by such an object is called its trajectory.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-xl border-l-4 border-l-primary">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                Key Concept
              </h3>
              <p className="text-sm text-foreground/90">
                Horizontal and vertical motions are independent.
                Gravity acts only in the vertical direction.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-xl">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                Why is this important?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Projectile motion is the first topic where motion in two
                dimensions is analyzed. It forms the foundation for circular
                motion, gravitation, and orbital mechanics.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">
                Real World Applications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ApplicationCard
                  emoji="⚽️"
                  title="Sports"
                  desc="Football kicks, basketball throws, cricket shots"
                />
                <ApplicationCard
                  emoji="🚀"
                  title="Defense & Space"
                  desc="Missile trajectories and satellite launches"
                />
              </div>
            </div>

            <button className="w-full py-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20 flex items-center justify-center gap-2">
              Visualize this in Simulation
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ---------- UNDERSTAND ---------- */}
        {activeTab === "understand" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">

            <ConceptCard
              index="01"
              title="Horizontal Component"
              desc="There is no horizontal acceleration, so horizontal velocity remains constant."
              formula="Vₓ = V₀ cosθ"
            />

            <ConceptCard
              index="02"
              title="Vertical Component"
              desc="Vertical velocity changes uniformly due to gravity."
              formula="Vᵧ = V₀ sinθ − gt"
            />

            <div className="glass-panel p-6 rounded-xl">
              <h3 className="text-lg font-medium text-foreground mb-4">
                Important Results (Exam Use)
              </h3>

              <div className="space-y-3 font-mono text-sm text-primary">
                <div>Time of Flight: T = 2V₀ sinθ / g</div>
                <div>Maximum Height: H = V₀² sin²θ / 2g</div>
                <div>Horizontal Range: R = V₀² sin2θ / g</div>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-xl border border-border">
              <h4 className="text-sm font-semibold text-primary mb-2">
                JEE / CET Exam Notes
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>Maximum range occurs at θ = 45°</li>
                <li>Same range for complementary angles</li>
                <li>At maximum height, vertical velocity is zero</li>
              </ul>
            </div>
          </div>
        )}

        {/* ---------- PRACTICE ---------- */}
        {activeTab === "practice" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <PracticeTab />
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorPanel;



/* ================= HELPER COMPONENTS ================= */

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-all relative
      ${
        active
          ? "text-primary bg-primary/5"
          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
      }`}
  >
    {icon}
    {label}
    {active && (
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_-2px_10px_rgba(56,189,248,0.5)]" />
    )}
  </button>
);

const ApplicationCard = ({ emoji, title, desc }: any) => (
  <div className="bg-secondary p-4 rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer">
    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-3">
      {emoji}
    </div>
    <h4 className="text-sm font-medium text-foreground">{title}</h4>
    <p className="text-xs text-muted-foreground mt-1">{desc}</p>
  </div>
);

const ConceptCard = ({ index, title, desc, formula }: any) => (
  <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30">
    <div className="mt-1 bg-primary/20 p-1.5 rounded text-primary text-xs font-mono">
      {index}
    </div>
    <div>
      <h3 className="text-md font-medium text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{desc}</p>
      <div className="mt-3 font-mono text-xs text-primary bg-black/20 p-2 rounded inline-block">
        {formula}
      </div>
    </div>
  </div>
);
