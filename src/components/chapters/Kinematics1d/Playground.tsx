import { useEffect, useRef, useState, useMemo } from "react";

// Standard dimensions for SVG internal coordinate system
const VIEWBOX_WIDTH = 600;
const VIEWBOX_HEIGHT = 200;

const Playground = () => {
  // --- STATE ---
  const [x0, setX0] = useState("0");
  const [u, setU] = useState("10");
  const [a, setA] = useState("-5"); // Changed default to make curve visible
  const [T, setT] = useState("4");

  const [t, setTcur] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Refs for animation loop
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number>(0);

  // --- PARSE NUMBERS ---
  const x0n = Number(x0);
  const un = Number(u);
  const an = Number(a);
  const Tn = Number(T);

  // Validation
  const valid = !isNaN(x0n) && !isNaN(un) && !isNaN(an) && !isNaN(Tn) && Tn > 0;

  /* ================= PHYSICS ENGINE ================= */
  // Current values based on time 't'
  const currentX = x0n + un * t + 0.5 * an * t * t;
  const currentV = un + an * t;

  /* ================= ANIMATION LOOP ================= */
  useEffect(() => {
    if (playing) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      // If paused, we cancel the loop
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing]);

  const animate = (time: number) => {
    if (startRef.current === null) {
        // We are starting/resuming. 
        // We need to adjust start time so we don't jump if we paused.
        startRef.current = time - (previousTimeRef.current * 1000);
    }
    
    const elapsed = (time - startRef.current) / 1000;

    if (elapsed >= Tn) {
      setTcur(Tn);
      previousTimeRef.current = Tn;
      setPlaying(false); // Stop at end
    } else {
      setTcur(elapsed);
      previousTimeRef.current = elapsed;
      rafRef.current = requestAnimationFrame(animate);
    }
  };

  /* ================= HANDLERS ================= */
  const handlePlayPause = () => {
    if (t >= Tn) {
      // If finished, restart logic
      setTcur(0);
      previousTimeRef.current = 0;
      startRef.current = null;
      setPlaying(true);
    } else {
      setPlaying(!playing);
    }
  };

  const handleReset = () => {
    setPlaying(false);
    setTcur(0);
    previousTimeRef.current = 0;
    startRef.current = null;
  };

  /* ================= DATA PRE-CALCULATION ================= */
  const { xPoints, vPoints, xMeta, vMeta } = useMemo(() => {
    if (!valid) return { xPoints: [], vPoints: [], xMeta: {min:0, max:10}, vMeta: {min:0, max:10} };

    const steps = 150;
    const dt = Tn / steps;
    const xp = [];
    const vp = [];

    for (let i = 0; i <= steps; i++) {
      const ti = i * dt;
      const valX = x0n + un * ti + 0.5 * an * ti * ti;
      const valV = un + an * ti;
      xp.push({ t: ti, val: valX });
      vp.push({ t: ti, val: valV });
    }

    // Helper to get scale domain with padding
    const getMeta = (data: { val: number }[]) => {
      const vals = data.map((d) => d.val);
      let min = Math.min(...vals, 0); // Always include 0 for reference
      let max = Math.max(...vals, 0);

      // Avoid division by zero if flat line
      if (max === min) { max += 10; min -= 10; }

      const range = max - min;
      const padding = range * 0.1; // 10% padding
      return { min: min - padding, max: max + padding };
    };

    return {
      xPoints: xp,
      vPoints: vp,
      xMeta: getMeta(xp),
      vMeta: getMeta(vp),
    };
  }, [x0n, un, an, Tn, valid]);

  /* ================= RENDER ================= */
  return (
    <div className="max-w-5xl mx-auto p-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 font-sans">
      
      {/* 1. Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Kinematics 1D Lab</h1>
          <p className="text-sm text-slate-500">Visualize motion with real-time graphs</p>
        </div>

        <div className="flex gap-3">
          {/* RESET BUTTON */}
          <button 
            onClick={handleReset}
            className="px-4 py-2 rounded-lg font-semibold text-sm bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
          >
            Reset
          </button>

          {/* PLAY / PAUSE / RESTART BUTTON */}
          <button 
            disabled={!valid}
            onClick={handlePlayPause}
            className={`
              px-6 py-2 rounded-lg font-bold text-sm text-white shadow-lg transition-all transform active:scale-95
              ${!valid ? 'opacity-50 cursor-not-allowed bg-slate-400' : ''}
              ${playing ? 'bg-amber-500 hover:bg-amber-600' : (t >= Tn ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-emerald-600 hover:bg-emerald-700')}
            `}
          >
            {playing ? "Pause" : (t >= Tn ? "Restart" : "Start Simulation")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* 2. Inputs Column */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
          <h3 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-wider">Parameters</h3>
          <div className="grid grid-cols-2 gap-4">
             <Input label="x₀ (Pos)" val={x0} set={setX0} unit="m" />
             <Input label="u (Vel)" val={u} set={setU} unit="m/s" />
             <Input label="a (Acc)" val={a} set={setA} unit="m/s²" />
             <Input label="T (Time)" val={T} set={setT} unit="s" />
          </div>
        </div>

        {/* 3. Physics Equation Display (Visualizing the Math) */}
        <div className="lg:col-span-2 bg-slate-100 dark:bg-slate-900/50 p-5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col justify-center">
             <h3 className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">Physics Engine</h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Position Equation */}
                <div className="bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-slate-500 mb-1 italic">Displacement Formula</div>
                    <div className="font-mono text-sm md:text-base text-indigo-600 dark:text-indigo-400">
                        x(t) = x₀ + ut + ½at²
                    </div>
                    {/* Live substitution */}
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-400">
                        x({t.toFixed(2)}) = {x0n} + ({un}·{t.toFixed(2)}) + 0.5({an}·{t.toFixed(2)}²)
                    </div>
                </div>

                {/* Velocity Equation */}
                <div className="bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-slate-500 mb-1 italic">Velocity Formula</div>
                    <div className="font-mono text-sm md:text-base text-amber-600 dark:text-amber-500">
                        v(t) = u + at
                    </div>
                    {/* Live substitution */}
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-400">
                        v({t.toFixed(2)}) = {un} + ({an}·{t.toFixed(2)})
                    </div>
                </div>
             </div>
        </div>
      </div>

      {/* 4. Motion Visualization Track */}
      <div className="mb-10">
        <div className="flex justify-between items-end mb-2">
            <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase">Motion Visualizer</h3>
            <div className="font-mono text-sm">
                Current Pos: <span className="font-bold text-indigo-600">{currentX.toFixed(2)} m</span>
            </div>
        </div>
        
        {/* The Track Container */}
        <div className="relative h-24 bg-slate-200 dark:bg-slate-800 rounded-lg border-x-4 border-slate-300 dark:border-slate-700 overflow-hidden">
            {/* Ruler Ticks */}
            <Ruler min={xMeta.min} max={xMeta.max} />
            
            {/* The Zero Mark (Origin) */}
            <div 
                className="absolute top-0 bottom-0 w-0.5 bg-red-500/50 z-0"
                style={{ left: `${normalize(0, xMeta.min, xMeta.max) * 100}%` }}
            >
                <span className="absolute bottom-1 left-1 text-[10px] text-red-500 font-bold">0m</span>
            </div>

            {/* The Ball */}
            <div 
                className="absolute top-1/2 w-8 h-8 -ml-4 -mt-4 bg-indigo-600 rounded-full shadow-lg z-10 flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-white dark:ring-slate-900"
                style={{ 
                    left: `${normalize(currentX, xMeta.min, xMeta.max) * 100}%` 
                }}
            >
                x
            </div>

            {/* Velocity Vector (Arrow) */}
            <div 
                className="absolute top-1/2 h-1 bg-amber-500 z-0 origin-left opacity-70 transition-transform"
                style={{ 
                    left: `${normalize(currentX, xMeta.min, xMeta.max) * 100}%`,
                    width: `${Math.min(Math.abs(currentV) * 3, 100)}px`, // Scale length for visibility
                    transform: `translateY(-50%) rotate(${currentV >= 0 ? 0 : 180}deg)`
                }}
            />
        </div>
      </div>

      {/* 5. Accurate Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AccurateGraph 
          title="Position vs Time (x-t)" 
          data={xPoints} 
          meta={xMeta} 
          duration={Tn} 
          currentT={t} 
          currentVal={currentX} 
          unit="m" 
          color="#4f46e5" // Indigo-600
        />
        <AccurateGraph 
          title="Velocity vs Time (v-t)" 
          data={vPoints} 
          meta={vMeta} 
          duration={Tn} 
          currentT={t} 
          currentVal={currentV} 
          unit="m/s" 
          color="#d97706" // Amber-600
        />
      </div>

    </div>
  );
};

export default Playground;

/* ================= HELPER COMPONENTS ================= */

const normalize = (val: number, min: number, max: number) => (val - min) / (max - min);

// Input Component
const Input = ({ label, val, set, unit }: any) => (
    <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</label>
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded border border-transparent focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
            <input 
                type="number" 
                value={val} 
                onChange={(e) => set(e.target.value)}
                className="w-full bg-transparent p-2 text-sm font-mono outline-none"
            />
            <span className="text-xs text-slate-400 pr-2 select-none">{unit}</span>
        </div>
    </div>
);

// Ruler Component for the Motion Track
const Ruler = ({ min, max }: { min: number, max: number }) => {
    // Generate 10 ticks based on the data range
    const ticks = [];
    const step = 10;
    for(let i=0; i<=step; i++) {
        const pct = (i/step) * 100;
        const val = min + (i/step) * (max - min);
        ticks.push({ pct, val });
    }

    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none">
            {ticks.map((t, i) => (
                <div key={i} className="absolute top-0 bottom-0 w-px bg-slate-400/30" style={{ left: `${t.pct}%` }}>
                    <span className="absolute bottom-1 left-1 text-[9px] text-slate-500 font-mono">
                        {t.val.toFixed(0)}
                    </span>
                </div>
            ))}
        </div>
    );
};

// SVG Graph Component
const AccurateGraph = ({ title, data, meta, duration, currentT, currentVal, unit, color }: any) => {
    const mapX = (t: number) => (t / duration) * VIEWBOX_WIDTH;
    const mapY = (val: number) => {
        const n = normalize(val, meta.min, meta.max);
        return VIEWBOX_HEIGHT - (n * VIEWBOX_HEIGHT);
    };

    const points = data.map((p: any) => `${mapX(p.t)},${mapY(p.val)}`).join(" ");
    const areaPath = `${points} L ${VIEWBOX_WIDTH},${VIEWBOX_HEIGHT} L 0,${VIEWBOX_HEIGHT} Z`;
    
    // Grid Lines
    const ticks = [0, 0.25, 0.5, 0.75, 1].map(r => ({
        y: VIEWBOX_HEIGHT - (r * VIEWBOX_HEIGHT),
        val: meta.min + r * (meta.max - meta.min)
    }));

    const zeroY = mapY(0);

    return (
        <div className="flex flex-col gap-2">
            {/* Title Row */}
            <div className="flex justify-between items-baseline px-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{title}</span>
                <span className="font-mono text-lg font-bold" style={{ color }}>
                    {currentVal.toFixed(2)} <small className="text-xs text-slate-400">{unit}</small>
                </span>
            </div>

            {/* Graph Box */}
            <div className="relative border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg overflow-hidden h-64 shadow-sm">
                <svg viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} className="w-full h-full" preserveAspectRatio="none">
                    
                    {/* Horizontal Grid */}
                    {ticks.map((t, i) => (
                        <line key={i} x1={0} y1={t.y} x2={VIEWBOX_WIDTH} y2={t.y} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth={1} />
                    ))}

                    {/* Zero Line */}
                    {zeroY >= 0 && zeroY <= VIEWBOX_HEIGHT && (
                        <line x1={0} y1={zeroY} x2={VIEWBOX_WIDTH} y2={zeroY} stroke="currentColor" className="text-slate-300 dark:text-slate-600" strokeWidth={1} strokeDasharray="4 4" />
                    )}

                    {/* Vertical Cursor */}
                    <line x1={mapX(currentT)} y1={0} x2={mapX(currentT)} y2={VIEWBOX_HEIGHT} stroke="currentColor" className="text-slate-400" strokeWidth={1.5} />

                    {/* Data */}
                    <path d={areaPath} fill={color} fillOpacity={0.1} stroke="none" />
                    <polyline points={points} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" />

                    {/* Dot */}
                    <circle cx={mapX(currentT)} cy={mapY(currentVal)} r={5} fill={color} stroke="white" strokeWidth={2} />
                </svg>

                {/* Y-Axis Labels Overlay */}
                <div className="absolute top-0 bottom-0 left-2 pointer-events-none flex flex-col justify-between py-1">
                    {/* We reverse map to match SVG layout (top is max) */}
                    {[...ticks].reverse().map((t, i) => (
                        <span key={i} className="text-[10px] text-slate-400 bg-white/70 dark:bg-slate-900/70 px-1 rounded font-mono">
                            {t.val.toFixed(1)}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};