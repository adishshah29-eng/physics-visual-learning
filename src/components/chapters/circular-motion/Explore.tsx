const CircularMotionExplore = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-foreground mb-2">
          Circular Motion
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          When an object moves in a circle at constant speed, its
          direction is always changing — which means it's always
          accelerating, even though its speed stays the same.
        </p>
      </div>

      <div className="glass-panel p-5 rounded-lg border-l-4 border-primary">
        <h3 className="text-sm font-semibold text-primary uppercase mb-2">
          Core Idea
        </h3>
        <p className="text-sm text-foreground/90">
          The acceleration always points <b>toward the center</b> of
          the circle. This is called centripetal acceleration. The force
          causing it is the centripetal force — it's not a new type of
          force, just the net inward force in that situation.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium text-foreground">
          Real World Examples
        </h3>
        <ul className="text-sm text-muted-foreground list-disc
                       pl-5 space-y-2">
          <li>
            <b>Car on a curved road</b> — friction provides
            centripetal force
          </li>
          <li>
            <b>Satellite orbiting Earth</b> — gravity provides
            centripetal force
          </li>
          <li>
            <b>Ball on a string</b> — tension provides
            centripetal force
          </li>
          <li>
            <b>Roller coaster loop</b> — normal force + gravity
            together provide centripetal force
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-secondary/40 p-4 rounded-lg">
          <div className="text-lg mb-1">🌀</div>
          <h4 className="text-sm font-medium text-foreground">
            Uniform Circular Motion
          </h4>
          <p className="text-xs text-muted-foreground">
            Constant speed, changing direction.
            Speed is constant but velocity is not.
          </p>
        </div>
        <div className="bg-secondary/40 p-4 rounded-lg">
          <div className="text-lg mb-1">🎡</div>
          <h4 className="text-sm font-medium text-foreground">
            Non-Uniform Circular Motion
          </h4>
          <p className="text-xs text-muted-foreground">
            Both speed and direction change.
            Tangential acceleration exists.
          </p>
        </div>
      </div>

      <div className="text-xs text-muted-foreground italic">
        In this simulation, we study uniform circular motion —
        constant speed, purely centripetal acceleration.
      </div>
    </div>
  );
};

export default CircularMotionExplore;