const SHMUnderstand = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display tracking-wide text-white">
          Key Concepts & Formulas
        </h2>
        <p className="text-sm text-slate-400">
          SHM has the highest formula density of any Class 11 chapter.
          Master these cold.
        </p>
      </div>

      <div className="glass-panel p-4 rounded-lg space-y-2">
        <h3 className="text-sm font-display tracking-wide text-white">
          Defining Equation
        </h3>
        <p className="text-sm text-slate-400">
          The condition for SHM — restoring force proportional
          to displacement:
        </p>
        <div className="font-mono text-sm text-primary
                        bg-black/20 p-2 rounded">
          F = -kx &nbsp;&nbsp; or &nbsp;&nbsp; a = -ω²x
        </div>
      </div>

      <div className="glass-panel p-4 rounded-lg space-y-2">
        <h3 className="text-sm font-display tracking-wide text-white">
          Displacement, Velocity, Acceleration
        </h3>
        <div className="space-y-1">
          <div className="font-mono text-sm text-primary
                          bg-black/20 p-2 rounded">
            x = A cos(ωt + φ)
          </div>
          <div className="font-mono text-sm text-primary
                          bg-black/20 p-2 rounded">
            v = -Aω sin(ωt + φ)
          </div>
          <div className="font-mono text-sm text-primary
                          bg-black/20 p-2 rounded">
            a = -Aω² cos(ωt + φ)
          </div>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-lg space-y-2">
        <h3 className="text-sm font-display tracking-wide text-white">
          Angular Frequency & Period
        </h3>
        <div className="font-mono text-sm text-primary
                        bg-black/20 p-2 rounded">
          ω = √(k/m) &nbsp;&nbsp; T = 2π√(m/k)
        </div>
        <p className="text-xs text-slate-400">
          Period depends only on mass and spring constant —
          NOT on amplitude.
        </p>
      </div>

      <div className="glass-panel p-4 rounded-lg space-y-2">
        <h3 className="text-sm font-display tracking-wide text-white">
          Velocity at any displacement x
        </h3>
        <div className="font-mono text-sm text-primary
                        bg-black/20 p-2 rounded">
          v = ω√(A² - x²)
        </div>
        <p className="text-xs text-slate-400">
          v is max at x=0, zero at x=±A
        </p>
      </div>

      <div className="glass-panel p-4 rounded-lg space-y-2">
        <h3 className="text-sm font-display tracking-wide text-white">
          Energy in SHM
        </h3>
        <div className="space-y-1">
          <div className="font-mono text-sm text-primary
                          bg-black/20 p-2 rounded">
            KE = ½mω²(A² - x²)
          </div>
          <div className="font-mono text-sm text-primary
                          bg-black/20 p-2 rounded">
            PE = ½mω²x² = ½kx²
          </div>
          <div className="font-mono text-sm text-primary
                          bg-black/20 p-2 rounded">
            E_total = ½kA² = ½mω²A²
          </div>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-lg space-y-2">
        <h3 className="text-sm font-display tracking-wide text-white">
          Simple Pendulum
        </h3>
        <div className="font-mono text-sm text-primary
                        bg-black/20 p-2 rounded">
          T = 2π√(L/g)
        </div>
        <p className="text-xs text-slate-400">
          Valid only for small angles. Independent of mass.
        </p>
      </div>

      <div className="bg-primary/10 border border-sky-400/30
                      rounded-lg p-4 space-y-2">
        <h3 className="text-sm font-semibold text-primary">
          ⚠️ JEE Common Traps
        </h3>
        <ul className="text-xs text-slate-400 space-y-2
                       list-disc pl-4">
          <li>
            Period is <b>independent of amplitude</b> — doubling A
            does not change T
          </li>
          <li>
            At x = A/2, KE = (3/4)E and PE = (1/4)E —
            memorize this ratio
          </li>
          <li>
            Phase constant φ depends on initial conditions,
            not on the system itself
          </li>
          <li>
            Pendulum SHM is only valid for <b>small angles</b>
            (sinθ ≈ θ)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SHMUnderstand;