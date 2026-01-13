const UnitsExplore = () => {
  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-2xl font-light text-foreground mb-2">
          Units & Measurements
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Physics is a quantitative science. Every physical quantity must be
          measured and expressed using proper units to make sense of the
          physical world.
        </p>
      </div>

      <div className="glass-panel p-5 rounded-lg border-l-4 border-primary">
        <h3 className="text-sm font-semibold text-primary uppercase mb-2">
          Why Units Matter
        </h3>
        <p className="text-sm text-foreground/90">
          Without units, numbers have no physical meaning. Units allow scientists
          across the world to communicate measurements clearly and consistently.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium text-foreground">
          What Do We Measure?
        </h3>
        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-2">
          <li>Length (how long)</li>
          <li>Mass (how heavy)</li>
          <li>Time (how long a process takes)</li>
          <li>Temperature, electric current, luminous intensity, amount of substance</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-secondary/40 p-4 rounded-lg">
          <div className="text-lg mb-1">📏</div>
          <h4 className="text-sm font-medium text-foreground">
            Everyday Measurement
          </h4>
          <p className="text-xs text-muted-foreground">
            Measuring height, weight, speed, or temperature all require standard units.
          </p>
        </div>

        <div className="bg-secondary/40 p-4 rounded-lg">
          <div className="text-lg mb-1">🔬</div>
          <h4 className="text-sm font-medium text-foreground">
            Scientific Experiments
          </h4>
          <p className="text-xs text-muted-foreground">
            Precision and accuracy are crucial in laboratory measurements.
          </p>
        </div>
      </div>

      <div className="text-xs text-muted-foreground italic">
        In physics, the SI (International System of Units) is universally accepted.
      </div>

    </div>
  );
};

export default UnitsExplore;
