const GravitationExplore = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-light text-foreground mb-2">Gravitation</h2>
      <p className="text-muted-foreground leading-relaxed">
        Gravity is the weakest yet most far-reaching of nature's four forces. It governs
        the motion of planets, moons, and galaxies — everything from falling apples to
        the large-scale structure of the universe.
      </p>
    </div>

    <div className="glass-panel p-5 rounded-lg border-l-4 border-primary">
      <h3 className="text-sm font-semibold text-primary uppercase mb-2">Core Idea</h3>
      <p className="text-sm text-foreground/90">
        Every object with mass attracts every other object. The force is proportional to
        the <b>product of masses</b> and inversely proportional to the <b>square of
        the distance</b> between them: <span className="font-mono">F = GMm/r²</span>.
      </p>
    </div>

    <div className="space-y-3">
      <h3 className="text-lg font-medium text-foreground">Real World Examples</h3>
      <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-2">
        <li><b>Planetary orbits</b> — Earth orbits the Sun in an ellipse (Kepler's 1st Law)</li>
        <li><b>Moon's tides</b> — gravitational pull of the Moon on Earth's oceans</li>
        <li><b>GPS satellites</b> — must account for both special and general relativity corrections</li>
        <li><b>Geostationary satellites</b> — orbit at exactly one Earth rotation period (24 h)</li>
        <li><b>Escape velocity</b> — rockets need v &gt; 11.2 km/s to leave Earth's gravity</li>
      </ul>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-secondary/40 p-4 rounded-lg">
        <div className="text-lg mb-1">🪐</div>
        <h4 className="text-sm font-medium text-foreground">Kepler's Laws</h4>
        <p className="text-xs text-muted-foreground">
          Planets sweep equal areas in equal time (angular momentum conservation)
          and T² ∝ r³ (period-radius relation).
        </p>
      </div>
      <div className="bg-secondary/40 p-4 rounded-lg">
        <div className="text-lg mb-1">🚀</div>
        <h4 className="text-sm font-medium text-foreground">Orbital Energy</h4>
        <p className="text-xs text-muted-foreground">
          Total energy E = KE + PE is negative for bound orbits.
          At escape, E = 0 and velocity = √(2GM/r).
        </p>
      </div>
    </div>

    <div className="text-xs text-muted-foreground italic">
      The simulation uses scaled units. Star mass controls GM, and the orbit
      distance is in AU (Astronomical Units). Try different launch speeds to see
      circular, elliptical, and hyperbolic orbits.
    </div>
  </div>
);

export default GravitationExplore;
