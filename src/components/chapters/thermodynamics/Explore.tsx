const ThermodynamicsExplore = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-light text-foreground mb-2">Thermodynamics</h2>
      <p className="text-muted-foreground leading-relaxed">
        Thermodynamics governs how heat, work, and internal energy are related.
        It explains everything from engine efficiency to why your coffee cools down.
      </p>
    </div>

    <div className="glass-panel p-5 rounded-lg border-l-4 border-primary">
      <h3 className="text-sm font-semibold text-primary uppercase mb-2">Core Idea</h3>
      <p className="text-sm text-foreground/90">
        The <b>First Law</b> (energy conservation): heat added to a system either
        increases internal energy or does work: <span className="font-mono">Q = ΔU + W</span>.
        The <b>Second Law</b>: heat spontaneously flows from hot to cold; perfect
        conversion of heat to work is impossible.
      </p>
    </div>

    <div className="space-y-3">
      <h3 className="text-lg font-medium text-foreground">Real World Examples</h3>
      <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-2">
        <li><b>Car engine (Otto cycle)</b> — converts fuel heat into mechanical work</li>
        <li><b>Refrigerator</b> — pumps heat from cold to hot using work (Carnot cycle reversed)</li>
        <li><b>Pressure cooker</b> — isochoric-like heating raises both T and P</li>
        <li><b>Bicycle pump</b> — adiabatic compression heats the air</li>
        <li><b>Atmosphere</b> — adiabatic lapse rate controls temperature vs altitude</li>
      </ul>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-secondary/40 p-4 rounded-lg">
        <div className="text-lg mb-1">🔥</div>
        <h4 className="text-sm font-medium text-foreground">PV Diagrams</h4>
        <p className="text-xs text-muted-foreground">
          Area under the curve = work done. Different processes sweep different areas
          even between the same initial and final states.
        </p>
      </div>
      <div className="bg-secondary/40 p-4 rounded-lg">
        <div className="text-lg mb-1">❄️</div>
        <h4 className="text-sm font-medium text-foreground">Carnot Efficiency</h4>
        <p className="text-xs text-muted-foreground">
          No engine can exceed η = 1 − T_cold/T_hot. This sets the ultimate limit
          for all heat engines.
        </p>
      </div>
    </div>

    <div className="text-xs text-muted-foreground italic">
      The simulation models an ideal gas undergoing quasi-static processes.
      Select a process type and watch the PV curve trace in real time.
    </div>
  </div>
);

export default ThermodynamicsExplore;
