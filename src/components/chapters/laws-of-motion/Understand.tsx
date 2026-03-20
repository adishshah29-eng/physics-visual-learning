import React from "react";

const Understand: React.FC = () => {
  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">

      <ConceptCard
        index="01"
        title="First Law (Inertia)"
        desc="A body remains at rest or in uniform motion unless acted upon by an external force."
        formula="ΣF = 0  ⇒  v = constant"
      />

      <ConceptCard
        index="02"
        title="Second Law (Force)"
        desc="The rate of change of momentum is proportional to the applied force."
        formula="F = ma"
      />

      <ConceptCard
        index="03"
        title="Third Law (Action–Reaction)"
        desc="For every action, there is an equal and opposite reaction."
        formula="FAB = −FBA"
      />

      <ConceptCard
        index="04"
        title="Free Body Diagram (FBD)"
        desc="Shows all forces acting on an isolated body."
        formula="ΣFx , ΣFy"
      />

      <ConceptCard
        index="05"
        title="Friction"
        desc="Force resisting relative motion between surfaces."
        formula="f = μN"
      />

      <ConceptCard
        index="06"
        title="Momentum & Impulse"
        desc="Impulse changes momentum."
        formula="p = mv ,  J = FΔt"
      />

      <ConceptCard
        index="07"
        title="Circular Motion"
        desc="Requires centripetal force."
        formula="Fc = mv² / r"
      />
    </div>
  );
};

export default Understand;

/* ---------- Helper ---------- */

const ConceptCard = ({ index, title, desc, formula }: any) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20 border border-border/40">

    <div className="mt-0.5 bg-primary/20 px-1.5 py-0.5 rounded text-primary text-[10px] font-mono shrink-0">
      {index}
    </div>

    <div className="space-y-1">
      <h3 className="text-sm font-display tracking-wide text-white leading-tight">
        {title}
      </h3>

      <p className="text-xs text-slate-400 leading-snug">
        {desc}
      </p>

      <div className="font-mono text-[10px] text-primary bg-black/20 px-2 py-1 rounded inline-block">
        {formula}
      </div>
    </div>
  </div>
);
