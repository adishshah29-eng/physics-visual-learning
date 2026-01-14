import React, { useState, ReactNode } from "react";
import { Compass, BookOpen, Target } from "lucide-react";

interface Props {
  Explore: ReactNode;
  Understand: ReactNode;
  Practice: ReactNode;
}

type Tab = "explore" | "understand" | "practice";

const TutorPanel: React.FC<Props> = ({ Explore, Understand, Practice }) => {
  const [activeTab, setActiveTab] = useState<Tab>("explore");

  return (
    <div className="h-full flex flex-col bg-background/50 backdrop-blur-sm">
      {/* Tabs */}
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === "explore" && Explore}
        {activeTab === "understand" && Understand}
        {activeTab === "practice" && Practice}
      </div>
    </div>
  );
};

export default TutorPanel;

/* ---------- Helper ---------- */

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 text-sm flex items-center justify-center gap-2 transition-all
      ${
        active
          ? "text-primary bg-primary/5"
          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
      }`}
  >
    {icon}
    {label}
  </button>
);
