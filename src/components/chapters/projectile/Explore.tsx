const ProjectileExplore = () => {
  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-2xl font-light text-white mb-2">
          Projectile Motion
        </h2>
        <p className="text-slate-400 leading-relaxed">
          Projectile motion is the motion of an object projected into the air
          with an initial velocity, after which it moves only under the
          influence of gravity.
        </p>
      </div>

      <div className="glass-panel p-5 rounded-lg border-l-4 border-sky-400">
        <h3 className="text-sm font-semibold text-primary uppercase mb-2">
          Core Idea
        </h3>
        <p className="text-sm text-white/90">
          Once the object is projected, <b>no force acts on it except gravity</b>.
          Gravity acts vertically downward, so the horizontal and vertical
          motions evolve independently.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-display tracking-wide text-white">
          How to Visualize It
        </h3>
        <ul className="text-sm text-slate-400 list-disc pl-5 space-y-2">
          <li>
            Horizontally, the object moves with constant velocity.
          </li>
          <li>
            Vertically, the object accelerates downward due to gravity.
          </li>
          <li>
            The combination of these two motions produces a curved (parabolic)
            path.
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-secondary/40 p-4 rounded-lg">
          <div className="text-lg mb-1">⚽</div>
          <h4 className="text-sm font-display tracking-wide text-white">
            Sports
          </h4>
          <p className="text-xs text-slate-400">
            A football kick or basketball shot follows projectile motion.
          </p>
        </div>

        <div className="bg-secondary/40 p-4 rounded-lg">
          <div className="text-lg mb-1">💣</div>
          <h4 className="text-sm font-display tracking-wide text-white">
            Ballistics
          </h4>
          <p className="text-xs text-slate-400">
            Shells and bullets are analyzed using projectile motion equations.
          </p>
        </div>
      </div>

      <div className="text-xs text-slate-400 italic">
        In this simulation, air resistance is neglected and gravity is assumed
        constant.
      </div>

    </div>
  );
};

export default ProjectileExplore;
