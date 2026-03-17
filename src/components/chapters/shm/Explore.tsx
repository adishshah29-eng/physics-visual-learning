const SHMExplore = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-foreground mb-2">
          Simple Harmonic Motion
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          SHM is the most important type of periodic motion in physics.
          It describes springs, pendulums, sound waves, and even
          quantum mechanical systems.
        </p>
      </div>

      <div className="glass-panel p-5 rounded-lg border-l-4 border-primary">
        <h3 className="text-sm font-semibold text-primary uppercase mb-2">
          Core Idea
        </h3>
        <p className="text-sm text-foreground/90">
          An object undergoes SHM when the <b>restoring force is
          proportional to displacement</b> and directed toward
          equilibrium. The more you displace it, the harder it
          pulls back.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium text-foreground">
          Real World Examples
        </h3>
        <ul className="text-sm text-muted-foreground list-disc
                       pl-5 space-y-2">
          <li>
            <b>Spring-mass system</b> — the classic SHM example
          </li>
          <li>
            <b>Simple pendulum</b> — SHM for small angles (θ &lt; 15°)
          </li>
          <li>
            <b>LC circuit</b> — charge oscillates like SHM
          </li>
          <li>
            <b>Sound waves</b> — air molecules vibrate in SHM
          </li>
          <li>
            <b>Tuning fork</b> — prongs oscillate in SHM
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-secondary/40 p-4 rounded-lg">
          <div className="text-lg mb-1">🌊</div>
          <h4 className="text-sm font-medium text-foreground">
            Periodic Motion
          </h4>
          <p className="text-xs text-muted-foreground">
            The motion repeats itself after every time period T.
          </p>
        </div>
        <div className="bg-secondary/40 p-4 rounded-lg">
          <div className="text-lg mb-1">⚖️</div>
          <h4 className="text-sm font-medium text-foreground">
            Energy Conservation
          </h4>
          <p className="text-xs text-muted-foreground">
            KE and PE keep exchanging but total energy stays constant.
          </p>
        </div>
      </div>

      <div className="text-xs text-muted-foreground italic">
        In this simulation, we model a horizontal spring-mass system.
        Gravity effects are ignored (horizontal surface).
      </div>
    </div>
  );
};

export default SHMExplore;