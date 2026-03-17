const WorkEnergyUnderstand = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium text-foreground">
          Key Concepts & Formulas
        </h2>
        <p className="text-sm text-muted-foreground">
          These are the core equations you need for JEE.
        </p>
      </div>

      <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Work (W)</h3>
        <p className="text-sm text-muted-foreground">
          Work is done when force has a component along displacement.
        </p>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">
          W = F · d · cosθ
        </div>
        <p className="text-xs text-muted-foreground">
          θ is angle between force and displacement. 
          If perpendicular, W = 0.
        </p>
      </div>

      <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
        <h3 className="text-sm font-semibold text-foreground">
          Kinetic Energy (KE)
        </h3>
        <p className="text-sm text-muted-foreground">
          Energy of motion. Depends on mass and velocity.
        </p>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">
          KE = ½mv²
        </div>
      </div>

      <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
        <h3 className="text-sm font-semibold text-foreground">
          Potential Energy (PE)
        </h3>
        <p className="text-sm text-muted-foreground">
          Energy stored due to position. Gravitational PE:
        </p>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">
          PE = mgh
        </div>
      </div>

      <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
        <h3 className="text-sm font-semibold text-foreground">
          Work-Energy Theorem
        </h3>
        <p className="text-sm text-muted-foreground">
          Net work done = change in kinetic energy.
        </p>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">
          W_net = ΔKE = ½mv² - ½mu²
        </div>
      </div>

      <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Power (P)</h3>
        <p className="text-sm text-muted-foreground">
          Rate of doing work.
        </p>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">
          P = W/t = F·v
        </div>
        <p className="text-xs text-muted-foreground">
          Unit: Watt (W) = Joule/second
        </p>
      </div>

      <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
        <h3 className="text-sm font-semibold text-foreground">
          Conservation of Energy
        </h3>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">
          KE + PE = constant (no friction)
        </div>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded mt-2">
          ½mv² + mgh = constant
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 space-y-2">
        <h3 className="text-sm font-semibold text-primary">
          ⚠️ JEE Common Traps
        </h3>
        <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
          <li>
            Work done by friction is always negative — 
            never forget the sign
          </li>
          <li>
            Normal force and gravity do zero work on 
            horizontal motion — don't include them
          </li>
          <li>
            Power = F·v only when force and velocity 
            are in the same direction
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WorkEnergyUnderstand;