const RotationalUnderstand = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display tracking-wide text-white">
          Key Concepts & Formulas
        </h2>
        <p className="text-sm text-slate-400">
          Rotational motion has a direct parallel to every linear concept.
          Memorize the analogies — JEE loves mixing them.
        </p>
      </div>

      <div className="glass-panel p-4 rounded-lg space-y-2">
        <h3 className="text-sm font-display tracking-wide text-white">
          Torque & Newton's Second Law (Rotation)
        </h3>
        <p className="text-sm text-slate-400">
          Torque is the rotational analogue of force:
        </p>
        <div className="font-mono text-sm text-primary
                        bg-black/20 p-2 rounded">
          τ = r × F = rF sinθ
        </div>
        <div className="font-mono text-sm text-primary
                        bg-black/20 p-2 rounded">
          τ_net = Iα
        </div>
      </div>

      <div className="glass-panel p-4 rounded-lg space-y-2">
        <h3 className="text-sm font-display tracking-wide text-white">
          Moment of Inertia (Common Shapes)
        </h3>
        <div className="space-y-1">
          <div className="font-mono text-sm text-primary
                          bg-black/20 p-2 rounded">
            Solid disk / cylinder: I = ½mR²
          </div>
          <div className="font-mono text-sm text-primary
                          bg-black/20 p-2 rounded">
            Hollow cylinder / ring: I = mR²
          </div>
          <div className="font-mono text-sm text-primary
                          bg-black/20 p-2 rounded">
            Solid sphere: I = (2/5)mR²
          </div>
          <div className="font-mono text-sm text-primary
                          bg-black/20 p-2 rounded">
            Thin rod (center): I = (1/12)mL²
          </div>
          <div className="font-mono text-sm text-primary
                          bg-black/20 p-2 rounded">
            Thin rod (end): I = (1/3)mL²
          </div>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-lg space-y-2">
        <h3 className="text-sm font-display tracking-wide text-white">
          Parallel & Perpendicular Axis Theorems
        </h3>
        <div className="font-mono text-sm text-primary
                        bg-black/20 p-2 rounded">
          I = I_cm + Md² &nbsp;&nbsp; (parallel axis)
        </div>
        <div className="font-mono text-sm text-primary
                        bg-black/20 p-2 rounded">
          I_z = I_x + I_y &nbsp;&nbsp; (perpendicular axis, planar bodies)
        </div>
      </div>

      <div className="glass-panel p-4 rounded-lg space-y-2">
        <h3 className="text-sm font-display tracking-wide text-white">
          Angular Momentum & Conservation
        </h3>
        <div className="font-mono text-sm text-primary
                        bg-black/20 p-2 rounded">
          L = Iω &nbsp;&nbsp; (for fixed axis)
        </div>
        <div className="font-mono text-sm text-primary
                        bg-black/20 p-2 rounded">
          τ_ext = 0 ⟹ L = constant
        </div>
        <p className="text-xs text-slate-400">
          When no external torque acts, angular momentum is conserved.
          This is why a spinning skater speeds up when pulling arms in.
        </p>
      </div>

      <div className="glass-panel p-4 rounded-lg space-y-2">
        <h3 className="text-sm font-display tracking-wide text-white">
          Rotational Kinetic Energy & Rolling
        </h3>
        <div className="space-y-1">
          <div className="font-mono text-sm text-primary
                          bg-black/20 p-2 rounded">
            KE_rot = ½Iω²
          </div>
          <div className="font-mono text-sm text-primary
                          bg-black/20 p-2 rounded">
            Rolling: v = Rω &nbsp;&nbsp; a = Rα
          </div>
          <div className="font-mono text-sm text-primary
                          bg-black/20 p-2 rounded">
            KE_total = ½mv² + ½Iω² = ½mv²(1 + I/(mR²))
          </div>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-lg space-y-2">
        <h3 className="text-sm font-display tracking-wide text-white">
          Rolling Down an Incline
        </h3>
        <div className="font-mono text-sm text-primary
                        bg-black/20 p-2 rounded">
          a = g sinθ / (1 + I/(mR²))
        </div>
        <p className="text-xs text-slate-400">
          Objects with smaller I/(mR²) accelerate faster. A solid sphere
          beats a hollow sphere; both beat a ring.
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
            Moment of inertia depends on the <b>axis of rotation</b> —
            the same body has different I about different axes
          </li>
          <li>
            In rolling without slipping, <b>friction is static</b> and does
            no work. Students often incorrectly apply kinetic friction
          </li>
          <li>
            The parallel axis theorem requires I_cm, not I about any
            arbitrary parallel axis — always shift from the <b>centre of mass</b>
          </li>
          <li>
            Perpendicular axis theorem works <b>only for planar (2D) bodies</b> —
            do not apply it to spheres or cylinders
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RotationalUnderstand;
