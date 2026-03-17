const CircularMotionUnderstand = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium text-foreground">
          Key Concepts & Formulas
        </h2>
        <p className="text-sm text-muted-foreground">
          These are the formulas JEE expects you to apply instantly.
        </p>
      </div>

      <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
        <h3 className="text-sm font-semibold text-foreground">
          Centripetal Acceleration
        </h3>
        <p className="text-sm text-muted-foreground">
          Always directed toward the center of the circle.
        </p>
        <div className="font-mono text-sm text-primary
                        bg-black/20 p-2 rounded">
          a = v²/r = ω²r
        </div>
      </div>

      <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
        <h3 className="text-sm font-semibold text-foreground">
          Centripetal Force
        </h3>
        <p className="text-sm text-muted-foreground">
          The net inward force required to maintain circular motion.
        </p>
        <div className="font-mono text-sm text-primary
                        bg-black/20 p-2 rounded">
          F = mv²/r = mω²r
        </div>
      </div>

      <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
        <h3 className="text-sm font-semibold text-foreground">
          Angular Velocity
        </h3>
        <p className="text-sm text-muted-foreground">
          How fast the angle is changing.
        </p>
        <div className="font-mono text-sm text-primary
                        bg-black/20 p-2 rounded">
          ω = v/r = 2π/T = 2πf
        </div>
      </div>

      <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
        <h3 className="text-sm font-semibold text-foreground">
          Period & Frequency
        </h3>
        <p className="text-sm text-muted-foreground">
          Time for one full revolution and revolutions per second.
        </p>
        <div className="font-mono text-sm text-primary
                        bg-black/20 p-2 rounded">
          T = 2πr/v &nbsp;&nbsp; f = 1/T
        </div>
      </div>

      <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
        <h3 className="text-sm font-semibold text-foreground">
          Banking of Roads
        </h3>
        <p className="text-sm text-muted-foreground">
          Optimal banking angle for no friction needed:
        </p>
        <div className="font-mono text-sm text-primary
                        bg-black/20 p-2 rounded">
          tan θ = v²/rg
        </div>
      </div>

      <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
        <h3 className="text-sm font-semibold text-foreground">
          Vertical Circle — Min Speed at Top
        </h3>
        <p className="text-sm text-muted-foreground">
          For a ball on a string to complete a vertical circle:
        </p>
        <div className="font-mono text-sm text-primary
                        bg-black/20 p-2 rounded">
          v_min (top) = √(gr)
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/30
                      rounded-lg p-4 space-y-2">
        <h3 className="text-sm font-semibold text-primary">
          ⚠️ JEE Common Traps
        </h3>
        <ul className="text-xs text-muted-foreground space-y-2
                       list-disc pl-4">
          <li>
            Centripetal force is <b>not</b> a separate force —
            it's always provided by an existing force
            (tension, gravity, friction, normal)
          </li>
          <li>
            Speed is constant in uniform circular motion
            but <b>velocity is not</b> — direction changes
          </li>
          <li>
            Centrifugal force only exists in a
            <b> rotating (non-inertial) frame</b> —
            not in ground frame
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CircularMotionUnderstand;