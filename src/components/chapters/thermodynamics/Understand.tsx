const ThermodynamicsUnderstand = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-medium text-foreground">Key Concepts & Formulas</h2>
      <p className="text-sm text-muted-foreground">
        Thermodynamics is formula-heavy for JEE. Know every process cold.
      </p>
    </div>

    <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
      <h3 className="text-sm font-semibold text-foreground">First Law of Thermodynamics</h3>
      <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">Q = ΔU + W</div>
      <p className="text-xs text-muted-foreground">Q = heat added, ΔU = change in internal energy, W = work done BY gas.</p>
    </div>

    <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
      <h3 className="text-sm font-semibold text-foreground">Ideal Gas & Internal Energy</h3>
      <div className="space-y-1">
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">PV = nRT</div>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">U = nCvT &nbsp; (depends only on T for ideal gas)</div>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">Cv = (f/2)R &nbsp; Cp = Cv + R &nbsp; γ = Cp/Cv</div>
      </div>
      <p className="text-xs text-muted-foreground">f = degrees of freedom: mono=3, di=5, poly=6</p>
    </div>

    <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
      <h3 className="text-sm font-semibold text-foreground">Isothermal Process (T = const)</h3>
      <div className="space-y-1">
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">PV = const &nbsp; (Boyle's law)</div>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">W = nRT ln(V₂/V₁)</div>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">ΔU = 0 &nbsp; Q = W</div>
      </div>
    </div>

    <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
      <h3 className="text-sm font-semibold text-foreground">Adiabatic Process (Q = 0)</h3>
      <div className="space-y-1">
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">PV^γ = const &nbsp; TV^(γ−1) = const</div>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">W = (P₁V₁ − P₂V₂) / (γ−1) = nCv(T₁−T₂)</div>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">Q = 0 &nbsp; ΔU = −W</div>
      </div>
    </div>

    <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
      <h3 className="text-sm font-semibold text-foreground">Isobaric (P = const) & Isochoric (V = const)</h3>
      <div className="space-y-1">
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">Isobaric: W = PΔV &nbsp; Q = nCpΔT</div>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">Isochoric: W = 0 &nbsp; Q = nCvΔT = ΔU</div>
      </div>
    </div>

    <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
      <h3 className="text-sm font-semibold text-foreground">Heat Engines & Carnot Cycle</h3>
      <div className="space-y-1">
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">η = W/Q_H = 1 − Q_C/Q_H</div>
        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">Carnot: η_max = 1 − T_C/T_H</div>
      </div>
    </div>

    <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 space-y-2">
      <h3 className="text-sm font-semibold text-primary">⚠️ JEE Common Traps</h3>
      <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
        <li><b>W = PΔV</b> is work done BY the gas. Some books use W = −PΔV (on the gas). Always check the sign convention in the question.</li>
        <li>In an adiabatic process, temperature <b>does change</b>. Students confuse "no heat" with "no temperature change" — those are different things.</li>
        <li>For a <b>cyclic process</b>: ΔU = 0 (it returns to the same state), so Q_net = W_net. The enclosed area in PV = net work.</li>
        <li>Carnot efficiency uses <b>absolute temperatures (K)</b>, not °C. Converting wrong gives wildly incorrect η.</li>
      </ul>
    </div>
  </div>
);

export default ThermodynamicsUnderstand;
