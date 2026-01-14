const Understand = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-foreground">
        Key Concepts
      </h2>

      {/* Position */}
      <div className="bg-secondary/30 p-4 rounded-lg">
        <h3 className="text-sm font-semibold">Position (x)</h3>
        <p className="text-sm text-muted-foreground">
          The location of an object with respect to a chosen origin.
        </p>
      </div>

      {/* Velocity */}
      <div className="bg-secondary/30 p-4 rounded-lg">
        <h3 className="text-sm font-semibold">Velocity (v)</h3>
        <p className="text-sm text-muted-foreground">
          Rate of change of position.
        </p>
        <div className="mt-2 font-mono text-xs bg-black/30 inline-block px-2 py-1 rounded">
          v = dx / dt
        </div>
      </div>

      {/* Acceleration */}
      <div className="bg-secondary/30 p-4 rounded-lg">
        <h3 className="text-sm font-semibold">Acceleration (a)</h3>
        <p className="text-sm text-muted-foreground">
          Rate of change of velocity.
        </p>
        <div className="mt-2 font-mono text-xs bg-black/30 inline-block px-2 py-1 rounded">
          a = dv / dt
        </div>
      </div>

      {/* Equations */}
      <div className="glass-panel p-4 rounded-lg">
        <h3 className="text-sm font-semibold mb-2">
          Equations of Motion (constant acceleration)
        </h3>
        <ul className="space-y-1 text-sm font-mono">
          <li>v = u + at</li>
          <li>s = ut + ½at²</li>
          <li>v² = u² + 2as</li>
        </ul>
      </div>
    </div>
  );
};

export default Understand;
