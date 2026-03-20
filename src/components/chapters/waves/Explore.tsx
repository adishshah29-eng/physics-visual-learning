const WavesExplore = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-light text-white mb-2">Waves</h2>
      <p className="text-slate-400 leading-relaxed">
        Waves transfer energy without transferring matter. They are the backbone of
        sound, light, seismology, and modern communication. JEE heavily tests
        superposition, standing waves, and beats.
      </p>
    </div>

    <div className="glass-panel p-5 rounded-lg border-l-4 border-sky-400">
      <h3 className="text-sm font-semibold text-primary uppercase mb-2">Core Idea</h3>
      <p className="text-sm text-white/90">
        A transverse wave is described by <span className="font-mono">y = A sin(kx − ωt)</span>,
        where A is amplitude, k = 2π/λ is the wave number, and ω = 2πf is angular frequency.
        The key relation: <span className="font-mono">v = fλ = ω/k</span>.
      </p>
    </div>

    <div className="space-y-3">
      <h3 className="text-lg font-display tracking-wide text-white">Real World Examples</h3>
      <ul className="text-sm text-slate-400 list-disc pl-5 space-y-2">
        <li><b>Musical instruments</b> — standing waves in strings and air columns produce harmonics</li>
        <li><b>Noise-cancelling headphones</b> — destructive superposition eliminates sound</li>
        <li><b>Radio tuning</b> — beats help tune instruments; also used in radar</li>
        <li><b>Earthquake seismology</b> — P-waves (longitudinal) and S-waves (transverse) travel through Earth</li>
        <li><b>Ultrasound</b> — high-frequency waves for medical imaging via reflection/refraction</li>
      </ul>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-secondary/40 p-4 rounded-lg">
        <div className="text-lg mb-1">🎸</div>
        <h4 className="text-sm font-display tracking-wide text-white">Standing Waves</h4>
        <p className="text-xs text-slate-400">
          Two identical waves traveling in opposite directions create standing waves.
          Nodes (zero displacement) and antinodes (max displacement) stay fixed in space.
        </p>
      </div>
      <div className="bg-secondary/40 p-4 rounded-lg">
        <div className="text-lg mb-1">🔊</div>
        <h4 className="text-sm font-display tracking-wide text-white">Beats</h4>
        <p className="text-xs text-slate-400">
          Two waves with slightly different frequencies produce periodic amplitude
          variations called beats. f_beat = |f₁ − f₂|.
        </p>
      </div>
    </div>

    <div className="text-xs text-slate-400 italic">
      The simulation uses pixel-based units for easy visualization. Try changing
      frequency and wavelength to see how wave speed = fλ changes.
    </div>
  </div>
);

export default WavesExplore;
