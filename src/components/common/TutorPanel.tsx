import { useState } from "react";

interface Props {
  Explore: React.FC;
  Understand: React.FC;
  Practice: React.FC;
}

const TutorPanel: React.FC<Props> = ({ Explore, Understand, Practice }) => {
  const [tab, setTab] = useState<"explore" | "understand" | "practice">("explore");

  return (
    <div className="h-full flex flex-col bg-background/50 backdrop-blur-sm">

      <div className="flex border-b border-border">
        <Tab label="Explore" active={tab==="explore"} onClick={() => setTab("explore")} />
        <Tab label="Understand" active={tab==="understand"} onClick={() => setTab("understand")} />
        <Tab label="Practice" active={tab==="practice"} onClick={() => setTab("practice")} />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {tab === "explore" && <Explore />}
        {tab === "understand" && <Understand />}
        {tab === "practice" && <Practice />}
      </div>
    </div>
  );
};

export default TutorPanel;

const Tab = ({ label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex-1 py-4 text-sm font-medium ${
      active ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
    }`}
  >
    {label}
  </button>
);
