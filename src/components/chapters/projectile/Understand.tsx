const ProjectileUnderstand = () => {
  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-xl font-medium text-foreground">
          Mathematical Description
        </h2>
        <p className="text-sm text-muted-foreground">
          Projectile motion is analyzed by resolving motion into horizontal
          and vertical components.
        </p>
      </div>

      {/* Horizontal Motion */}
      <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
        <h3 className="text-md font-medium text-foreground">
          Horizontal Motion (x-direction)
        </h3>
        <p className="text-sm text-muted-foreground">
          There is no acceleration in the horizontal direction.
        </p>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded inline-block">
          Vx = V₀ cosθ (constant)
        </div>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded inline-block">
          x = V₀ cosθ · t
        </div>
      </div>

      {/* Vertical Motion */}
      <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
        <h3 className="text-md font-medium text-foreground">
          Vertical Motion (y-direction)
        </h3>
        <p className="text-sm text-muted-foreground">
          The vertical motion is uniformly accelerated due to gravity.
        </p>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded inline-block">
          Vy = V₀ sinθ − gt
        </div>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded inline-block">
          y = V₀ sinθ · t − ½gt²
        </div>
      </div>

      {/* Key Results */}
      <div className="bg-secondary/40 p-4 rounded-lg space-y-3">
        <h3 className="text-md font-medium text-foreground">
          Important Results (JEE Focus)
        </h3>

        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">
          Time of flight: T = 2V₀ sinθ / g
        </div>

        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">
          Maximum height: H = V₀² sin²θ / (2g)
        </div>

        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">
          Range: R = V₀² sin2θ / g
        </div>
      </div>

      <div className="text-xs text-muted-foreground italic">
        These results are valid only when the projectile lands at the same level
        from which it was projected.
      </div>

    </div>
  );
};

export default ProjectileUnderstand;
