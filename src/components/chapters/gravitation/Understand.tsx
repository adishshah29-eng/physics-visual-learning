const GravitationUnderstand = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-medium text-foreground">Key Concepts & Formulas</h2>
      <p className="text-sm text-muted-foreground">
        Gravitation is central to JEE — master every formula and the energy framework.
      </p>
    </div>

    <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
      <h3 className="text-sm font-semibold text-foreground">Newton's Law of Gravitation</h3>
      <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">F = GMm / r²</div>
      <p className="text-xs text-muted-foreground">G = 6.674 × 10⁻¹¹ N·m²/kg² (universal gravitational constant)</p>
    </div>

    <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
      <h3 className="text-sm font-semibold text-foreground">Gravitational Field & Surface Gravity</h3>
      <div className="space-y-1">
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">g = GM / R² &nbsp; (surface)</div>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">g_h = GM / (R+h)² = g·R² / (R+h)²</div>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">g_depth = g(1 − d/R) &nbsp; (inside Earth)</div>
      </div>
    </div>

    <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
      <h3 className="text-sm font-semibold text-foreground">Gravitational Potential & PE</h3>
      <div className="space-y-1">
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">V = −GM / r &nbsp; (potential, always negative)</div>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">U = −GMm / r &nbsp; (potential energy)</div>
      </div>
      <p className="text-xs text-muted-foreground">Zero reference is at r = ∞. PE is always negative in a bound system.</p>
    </div>

    <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
      <h3 className="text-sm font-semibold text-foreground">Orbital Motion (Circular Orbit)</h3>
      <div className="space-y-1">
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">v_orb = √(GM/r)</div>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">T = 2π√(r³/GM) &nbsp; (Kepler's 3rd: T² ∝ r³)</div>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">KE = GMm/(2r) &nbsp; PE = −GMm/r &nbsp; E = −GMm/(2r)</div>
      </div>
      <p className="text-xs text-muted-foreground">Note: KE = ½|PE| = |E_total| for any circular orbit (Virial theorem)</p>
    </div>

    <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
      <h3 className="text-sm font-semibold text-foreground">Escape Velocity</h3>
      <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">v_esc = √(2GM/R) = √(2gR) ≈ 11.2 km/s (Earth)</div>
      <p className="text-xs text-muted-foreground">v_esc = √2 × v_orbital (near surface). Independent of mass and direction!</p>
    </div>

    <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
      <h3 className="text-sm font-semibold text-foreground">Kepler's Laws</h3>
      <div className="space-y-1">
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">1st: Orbit is an ellipse; Sun at one focus</div>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">2nd: dA/dt = L/(2m) = const &nbsp; (equal areas)</div>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">3rd: T² / r³ = 4π² / (GM) = const</div>
      </div>
    </div>

    <div className="bg-secondary/30 p-4 rounded-lg space-y-1">
      <h3 className="text-sm font-semibold text-foreground">Satellite Periods</h3>
      <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">LEO: T ≈ 84 min &nbsp; Geo: T = 24 h at r ≈ 42,000 km</div>
    </div>

    <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 space-y-2">
      <h3 className="text-sm font-semibold text-primary">⚠️ JEE Common Traps</h3>
      <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
        <li>Escape velocity is <b>independent of the angle of projection</b> — only the speed matters</li>
        <li><b>g_h = g(1 − 2h/R)</b> is a linear approximation — only valid for h &lt;&lt; R. Exact: g(R/(R+h))²</li>
        <li>Higher orbital radius → <b>slower speed but longer period</b>. Students confuse v ∝ 1/√r with T ∝ r^(3/2)</li>
        <li>The formula g_depth = g(1−d/R) assumes <b>uniform density</b> Earth — JEE often specifies this</li>
      </ul>
    </div>
  </div>
);

export default GravitationUnderstand;
