const WavesUnderstand = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-display tracking-wide text-white">Key Concepts & Formulas</h2>
      <p className="text-sm text-slate-400">
        Waves is a high-weight chapter for JEE. Master every formula below.
      </p>
    </div>

    <div className="glass-panel p-4 rounded-lg space-y-2">
      <h3 className="text-sm font-display tracking-wide text-white">General Wave Equation</h3>
      <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">y(x,t) = A sin(kx − ωt + φ)</div>
      <div className="space-y-1">
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">v = fλ = ω/k</div>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">k = 2π/λ &nbsp; ω = 2πf &nbsp; T = 1/f</div>
      </div>
    </div>

    <div className="glass-panel p-4 rounded-lg space-y-2">
      <h3 className="text-sm font-display tracking-wide text-white">Wave Speed in Different Media</h3>
      <div className="space-y-1">
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">String: v = √(T/μ) &nbsp; [T = tension, μ = linear mass density]</div>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">Sound in gas: v = √(γRT/M) &nbsp; [M = molar mass]</div>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">Sound in air ≈ 343 m/s at 20°C</div>
      </div>
    </div>

    <div className="glass-panel p-4 rounded-lg space-y-2">
      <h3 className="text-sm font-display tracking-wide text-white">Superposition Principle</h3>
      <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">y = y₁ + y₂ &nbsp; (algebraic addition)</div>
      <p className="text-xs text-slate-400">Constructive: Δφ = 0, 2π, 4π… &nbsp; Destructive: Δφ = π, 3π, 5π…</p>
    </div>

    <div className="glass-panel p-4 rounded-lg space-y-2">
      <h3 className="text-sm font-display tracking-wide text-white">Standing Waves</h3>
      <div className="space-y-1">
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">y = 2A sin(kx) cos(ωt)</div>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">Nodes: kx = nπ → x = nλ/2</div>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">Antinodes: kx = (n+½)π → x = (2n+1)λ/4</div>
      </div>
    </div>

    <div className="glass-panel p-4 rounded-lg space-y-2">
      <h3 className="text-sm font-display tracking-wide text-white">Harmonics (String fixed at both ends)</h3>
      <div className="space-y-1">
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">fₙ = n × v/(2L) &nbsp; n = 1, 2, 3…</div>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">λₙ = 2L/n</div>
      </div>
    </div>

    <div className="glass-panel p-4 rounded-lg space-y-2">
      <h3 className="text-sm font-display tracking-wide text-white">Beats</h3>
      <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">f_beat = |f₁ − f₂|</div>
      <p className="text-xs text-slate-400">Number of beats per second = |f₁ − f₂|. Used for tuning instruments.</p>
    </div>

    <div className="glass-panel p-4 rounded-lg space-y-2">
      <h3 className="text-sm font-display tracking-wide text-white">Intensity & Energy</h3>
      <div className="space-y-1">
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">I ∝ A² &nbsp; (intensity proportional to amplitude²)</div>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">I = ½ρω²A²v &nbsp; (power per unit area)</div>
      </div>
    </div>

    <div className="bg-primary/10 border border-sky-400/30 rounded-lg p-4 space-y-2">
      <h3 className="text-sm font-semibold text-primary">⚠️ JEE Common Traps</h3>
      <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
        <li><b>v = fλ</b> always, but wave speed depends on <b>medium only</b>, not frequency. When a wave crosses into a new medium, f stays constant but λ changes.</li>
        <li>In standing waves, <b>particles at nodes never move</b> but energy still passes through them. Students wrongly assume zero energy at nodes.</li>
        <li><b>Phase vs path difference</b>: Δφ = (2π/λ) × Δx. Forgetting the 2π/λ factor is a common JEE error.</li>
        <li>For <b>open organ pipe</b>, all harmonics are present (f, 2f, 3f…). For <b>closed pipe</b>, only odd harmonics (f, 3f, 5f…). Don't mix them.</li>
      </ul>
    </div>
  </div>
);

export default WavesUnderstand;
