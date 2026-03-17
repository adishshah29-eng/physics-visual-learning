const WorkEnergyExplore = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-foreground mb-2">
          Work, Energy & Power
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Work and energy are two of the most fundamental concepts in 
          physics. Understanding them unlocks everything from simple 
          machines to rocket engines.
        </p>
      </div>

      <div className="glass-panel p-5 rounded-lg border-l-4 border-primary">
        <h3 className="text-sm font-semibold text-primary uppercase mb-2">
          Core Idea
        </h3>
        <p className="text-sm text-foreground/90">
          Work is done when a force moves an object. Energy is the 
          capacity to do work. Power is how fast work gets done. 
          <b> Energy is always conserved</b> — it only changes form.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium text-foreground">
          Real World Examples
        </h3>
        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-2">
          <li>Pushing a car — force applied over a distance = work done</li>
          <li>A falling ball — potential energy converts to kinetic energy</li>
          <li>A motor lifting a load — power determines how fast it works</li>
          <li>A bowler releasing a cricket ball — muscle energy → ball KE</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-secondary/40 p-4 rounded-lg">
          <div className="text-lg mb-1">⚡</div>
          <h4 className="text-sm font-medium text-foreground">
            Work-Energy Theorem
          </h4>
          <p className="text-xs text-muted-foreground">
            Net work done on an object equals its change in kinetic energy.
          </p>
        </div>
        <div className="bg-secondary/40 p-4 rounded-lg">
          <div className="text-lg mb-1">🔋</div>
          <h4 className="text-sm font-medium text-foreground">
            Conservation of Energy
          </h4>
          <p className="text-xs text-muted-foreground">
            Total mechanical energy stays constant in absence of friction.
          </p>
        </div>
      </div>

      <div className="text-xs text-muted-foreground italic">
        In this simulation, adjust force, mass and distance to see 
        how work, kinetic energy and power change in real time.
      </div>
    </div>
  );
};

export default WorkEnergyExplore;