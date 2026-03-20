const RotationalExplore = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-white mb-2">
          Rotational Motion
        </h2>
        <p className="text-slate-400 leading-relaxed">
          Rotational motion extends Newton's laws to spinning and rolling
          objects. Every translational concept — force, mass, acceleration,
          momentum, kinetic energy — has a rotational counter-part.
        </p>
      </div>

      <div className="glass-panel p-5 rounded-lg border-l-4 border-sky-400">
        <h3 className="text-sm font-semibold text-primary uppercase mb-2">
          Core Idea
        </h3>
        <p className="text-sm text-white/90">
          A net <b>torque</b> causes angular acceleration, just as a net
          force causes linear acceleration. The resistance to angular
          acceleration is <b>moment of inertia</b> — the rotational
          analogue of mass.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-display tracking-wide text-white">
          Real World Examples
        </h3>
        <ul className="text-sm text-slate-400 list-disc
                       pl-5 space-y-2">
          <li>
            <b>Spinning top</b> — precession and conservation of angular momentum
          </li>
          <li>
            <b>Wheel rolling downhill</b> — energy split between translation and rotation
          </li>
          <li>
            <b>Figure skater pulling arms in</b> — decreasing I increases ω
          </li>
          <li>
            <b>Helicopter rotor</b> — torque balance via tail rotor
          </li>
          <li>
            <b>Opening a door</b> — torque depends on where you push
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-secondary/40 p-4 rounded-lg">
          <div className="text-lg mb-1">⚙️</div>
          <h4 className="text-sm font-display tracking-wide text-white">
            Moment of Inertia
          </h4>
          <p className="text-xs text-slate-400">
            Depends on both mass and how that mass is distributed
            about the axis. Farther from axis → larger I.
          </p>
        </div>
        <div className="bg-secondary/40 p-4 rounded-lg">
          <div className="text-lg mb-1">🔄</div>
          <h4 className="text-sm font-display tracking-wide text-white">
            Rolling Without Slipping
          </h4>
          <p className="text-xs text-slate-400">
            When v = Rω, there's no sliding at the contact point.
            Friction is static, doing no work.
          </p>
        </div>
      </div>

      <div className="text-xs text-slate-400 italic">
        This simulation models a solid disk rolling without slipping
        down a frictionless incline. Gravity provides the torque.
      </div>
    </div>
  );
};

export default RotationalExplore;
