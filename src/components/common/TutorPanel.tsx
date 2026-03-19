import React, { useState, ReactNode } from "react";
import { Compass, BookOpen, Target, Sparkles } from "lucide-react";
import { AIChatTab } from "@/components/common/AIChatTab";

interface Props {
  Explore: ReactNode;
  Understand: ReactNode;
  chapterTitle: string;
}

type Tab = "explore" | "understand" | "ai";

const TutorPanel: React.FC<Props> = ({ Explore, Understand, chapterTitle }) => {
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
          active={activeTab === "ai"}
          onClick={() => setActiveTab("ai")}
          icon={<Sparkles className="w-4 h-4 text-sky-400" />}
          label={
            <div className="flex items-center gap-1">
              Ask AI
              <span className="text-[10px] bg-sky-500/20 text-sky-400 px-1 rounded border border-sky-500/30">
                ✨ AI
              </span>
            </div>
          }
          isAi={true}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === "explore" && Explore}
        {activeTab === "understand" && Understand}
        {activeTab === "ai" && <AIChatTab chapterTitle={chapterTitle} />}
      </div>
    </div>
  );
};

export default TutorPanel;

/* ---------- Helper ---------- */

const TabButton = ({ active, onClick, icon, label, isAi }: any) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 text-sm flex items-center justify-center gap-2 transition-all
      ${
        active
          ? isAi 
            ? "bg-gradient-to-r from-sky-600/30 to-indigo-600/30 text-sky-400 border-b-2 border-sky-400 font-medium"
            : "text-primary bg-primary/5 border-b-2 border-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
      }`}
  >
    {icon}
    {label}
  </button>
);
