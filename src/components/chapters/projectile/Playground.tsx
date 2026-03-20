import { useEffect, useRef, useState, useMemo } from "react";

// --- CONSTANTS ---
const G_DEFAULT = 9.81;

const ProjectilePlayground = () => {
  // --- STATE ---
  const [v0, setV0] = useState("40");     
  const [angle, setAngle] = useState("60"); 
  const [h0, setH0] = useState("0");      
  const [g, setG] = useState("9.8");      

  // Simulation
  const [t, setTcur] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Refs
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number>(0);

  // --- PHYSICS ENGINE ---
  const v0n = Number(v0);
  const angn = Number(angle);
  const h0n = Number(h0);
  const gn = Number(g);
  const rad = (angn * Math.PI) / 180;
  
  const v0x = v0n * Math.cos(rad);
  const v0y = v0n * Math.sin(rad);

  // Flight Time Calculation
  const discriminant = Math.sqrt(v0y * v0y + 2 * gn * h0n);
  const totalTime = (!isNaN(gn) && gn > 0) ? (v0y + discriminant) / gn : 0;
  const valid = !isNaN(v0n) && !isNaN(angn) && !isNaN(h0n) && !isNaN(gn) && gn > 0 && totalTime > 0;

  // State at specific time
  const getPhysicsAt = (time: number) => {
    // Clamp time to stop exactly at ground
    const safeT = Math.max(0, Math.min(time, totalTime));
    
    return {
      x: v0x * safeT,
      y: h0n + v0y * safeT - 0.5 * gn * safeT * safeT,
      vx: v0x,
      vy: v0y - gn * safeT,
      t: safeT
    };
  };

  const current = getPhysicsAt(t);

  // --- ANIMATION ---
  useEffect(() => {
    if (playing) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [playing]);

  const animate = (timestamp: number) => {
    if (startRef.current === null) startRef.current = timestamp - (prevTimeRef.current * 1000);
    const elapsed = (timestamp - startRef.current) / 1000;

    if (elapsed >= totalTime) {
      setTcur(totalTime);
      prevTimeRef.current = totalTime;
      setPlaying(false);
    } else {
      setTcur(elapsed);
      prevTimeRef.current = elapsed;
      rafRef.current = requestAnimationFrame(animate);
    }
  };

  const handleReset = () => {
    setPlaying(false);
    setTcur(0);
    prevTimeRef.current = 0;
    startRef.current = null;
  };

  const handlePlayPause = () => {
    if (t >= totalTime) handleReset();
    setTimeout(() => setPlaying(p => !p), 0);
  };

  // --- DATA GENERATION ---
  const { trajectoryData, yData, vyData } = useMemo(() => {
    if (!valid) return { trajectoryData: [], yData: [], vyData: [] };
    
    // High resolution for smooth curves
    const steps = 200; 
    const dt = totalTime / steps;
    const traj = [];
    const yArr = [];
    const vyArr = [];
    
    for (let i = 0; i <= steps; i++) {
      const ti = i * dt;
      const state = getPhysicsAt(ti);
      traj.push({ x: state.x, y: state.y });
      yArr.push({ t: ti, y: state.y });
      vyArr.push({ t: ti, v: state.vy });
    }
    return { trajectoryData: traj, yData: yArr, vyData: vyArr };
  }, [v0n, angn, h0n, gn, totalTime, valid]);

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans text-slate-100 bg-transparent min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-slate-800/50 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Projectile Motion</h1>
          <p className="text-sm text-slate-500">2D Kinematics & Vector Analysis</p>
        </div>
        <div className="flex gap-3">
           <Button label="Reset" onClick={handleReset} color="slate" />
           <Button label={playing ? "Pause" : t >= totalTime ? "Restart" : "Launch"} onClick={handlePlayPause} disabled={!valid} color={playing ? "amber" : t >= totalTime ? "indigo" : "emerald"} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Inputs & Stats */}
        <div className="lg:col-span-3 space-y-6">
          <Panel title="Parameters">
            <div className="space-y-4">
              <Input label="Velocity (v₀)" val={v0} set={setV0} unit="m/s" />
              <Input label="Angle (θ)" val={angle} set={setAngle} unit="deg" />
              <Input label="Height (h₀)" val={h0} set={setH0} unit="m" />
              <Input label="Gravity (g)" val={g} set={setG} unit="m/s²" />
            </div>
          </Panel>

          <Panel title="Live Physics">
            <Stat label="Time (t)" val={t.toFixed(2)} unit="s" />
            <div className="h-px glass-panel border-slate-700 dark:bg-slate-700 my-2" />
            <Stat label="Pos X" val={current.x.toFixed(2)} unit="m" />
            <Stat label="Pos Y" val={current.y.toFixed(2)} unit="m" />
            <div className="h-px glass-panel border-slate-700 dark:bg-slate-700 my-2" />
            <Stat label="Vel X" val={current.vx.toFixed(2)} unit="m/s" />
            <Stat label="Vel Y" val={current.vy.toFixed(2)} unit="m/s" />
          </Panel>
        </div>

        {/* RIGHT COLUMN: Graphs */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* 1. TRAJECTORY GRAPH (Y vs X) */}
          <div className="glass-panel rounded-xl border border-slate-800/50 shadow-sm p-1 relative">
             <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-slate-900/90 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 shadow-sm">
                Trajectory Path
             </div>
             <ScientificGraph 
                data={trajectoryData}
                xKey="x"
                yKey="y"
                currentX={current.x}
                currentY={current.y}
                xLabel="Distance (m)"
                yLabel="Height (m)"
                color="#4f46e5"
                aspectRatio={true} // Tries to keep 1:1 visually if possible
             />
          </div>

          {/* 2. SUB GRAPHS (Y-t and Vy-t) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="h-64 glass-panel rounded-xl border border-slate-800/50 shadow-sm p-1">
                <ScientificGraph 
                    data={yData}
                    xKey="t"
                    yKey="y"
                    currentX={current.t}
                    currentY={current.y}
                    xLabel="Time (s)"
                    yLabel="Height (m)"
                    color="#8b5cf6"
                />
             </div>
             <div className="h-64 glass-panel rounded-xl border border-slate-800/50 shadow-sm p-1">
                <ScientificGraph 
                    data={vyData}
                    xKey="t"
                    yKey="v"
                    currentX={current.t}
                    currentY={current.vy}
                    xLabel="Time (s)"
                    yLabel="Velocity Y (m/s)"
                    color="#f59e0b"
                />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectilePlayground;

/* ================= COMPONENT LIBRARY ================= */

const Panel = ({ title, children }: any) => (
  <div className="glass-panel p-5 rounded-xl border border-slate-800/50 shadow-sm">
    <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">{title}</h3>
    {children}
  </div>
);

const Button = ({ label, onClick, color, disabled }: any) => {
  const colors: any = {
    slate: "glass-panel border-slate-700 text-slate-300 hover:border-sky-400 hover:text-white",
    emerald: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20",
    amber: "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20",
    indigo: "bg-sky-500 text-white hover:bg-sky-600 shadow-indigo-500/20",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`px-5 py-2 rounded-lg font-bold text-sm transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${colors[color]}`}>
      {label}
    </button>
  );
};

const Input = ({ label, val, set, unit }: any) => (
  <div>
    <label className="block text-[10px] font-bold text-slate-500 mb-1">{label}</label>
    <div className="flex bg-slate-100 bg-slate-800 rounded border border-transparent focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
      <input type="number" value={val} onChange={(e) => set(e.target.value)} className="w-full bg-transparent p-2 text-sm font-mono outline-none text-slate-100" />
      <span className="glass-panel border-slate-700 dark:bg-slate-700 px-3 flex items-center text-xs text-slate-500 font-mono select-none">{unit}</span>
    </div>
  </div>
);

const Stat = ({ label, val, unit }: any) => (
  <div className="flex justify-between items-baseline py-1">
    <span className="text-xs text-slate-500">{label}</span>
    <span className="font-mono text-sm font-bold text-slate-300 dark:text-slate-200">
      {val} <span className="text-[10px] text-slate-400 font-normal">{unit}</span>
    </span>
  </div>
);

/* ================= SCIENTIFIC GRAPHING ENGINE ================= */
/* This component handles "Nice Number" ticks and accurate SVG mapping */

const ScientificGraph = ({ data, xKey, yKey, currentX, currentY, xLabel, yLabel, color, aspectRatio }: any) => {
  const VIEW_W = 800;
  const VIEW_H = 400;
  const PADDING_L = 50; // Space for Y axis labels
  const PADDING_B = 30; // Space for X axis labels
  const DRAW_W = VIEW_W - PADDING_L;
  const DRAW_H = VIEW_H - PADDING_B;

  // 1. Calculate Nice Domain
  const getNiceDomain = (arr: any[], key: string) => {
    const vals = arr.map(d => d[key]);
    let min = Math.min(...vals);
    let max = Math.max(...vals);
    
    // Default handles for empty data
    if (min === Infinity) { min=0; max=10; }
    if (min === max) { min -= 5; max += 5; }

    // Always include 0 in the view for context (optional but good for physics)
    if (min > 0) min = 0;
    if (max < 0) max = 0;

    const range = max - min;
    // Calculate "rough" interval
    const roughStep = range / 5; 
    // Round to nice magnitude (1, 2, 5, 10, 20, 50 etc)
    const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
    const normalizedStep = roughStep / magnitude;
    
    let niceStep;
    if (normalizedStep < 1.5) niceStep = 1 * magnitude;
    else if (normalizedStep < 3) niceStep = 2 * magnitude;
    else if (normalizedStep < 7) niceStep = 5 * magnitude;
    else niceStep = 10 * magnitude;

    // Expand domain to fit nice steps
    const niceMin = Math.floor(min / niceStep) * niceStep;
    const niceMax = Math.ceil(max / niceStep) * niceStep;
    
    return { min: niceMin, max: niceMax, step: niceStep };
  };

  const xDom = useMemo(() => getNiceDomain(data, xKey), [data, xKey]);
  const yDom = useMemo(() => getNiceDomain(data, yKey), [data, yKey]);

  // 2. Map Coordinates
  const mapX = (val: number) => PADDING_L + ((val - xDom.min) / (xDom.max - xDom.min)) * DRAW_W;
  const mapY = (val: number) => DRAW_H - ((val - yDom.min) / (yDom.max - yDom.min)) * DRAW_H;

  // 3. Generate Grid Lines (Ticks)
  const xTicks = [];
  for (let v = xDom.min; v <= xDom.max; v += xDom.step) xTicks.push(v);
  
  const yTicks = [];
  for (let v = yDom.min; v <= yDom.max; v += yDom.step) yTicks.push(v);

  // 4. Generate Path
  const path = data.map((p: any) => `${mapX(p[xKey])},${mapY(p[yKey])}`).join(" ");

  // 5. Zero Line Location
  const zeroY = mapY(0);

  return (
    <div className="w-full h-full relative font-mono text-xs select-none">
       <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-full h-full block">
          
          {/* GRID & TICKS */}
          {/* Horizontal Grid (Y-Axis) */}
          {yTicks.map(tick => (
             <g key={`y-${tick}`}>
                <line x1={PADDING_L} y1={mapY(tick)} x2={VIEW_W} y2={mapY(tick)} stroke="#e2e8f0" strokeWidth={1} className="dark:stroke-slate-800" />
                <text x={PADDING_L - 8} y={mapY(tick) + 4} textAnchor="end" fill="#94a3b8">{Number(tick.toFixed(2))}</text>
             </g>
          ))}

          {/* Vertical Grid (X-Axis) */}
          {xTicks.map(tick => (
             <g key={`x-${tick}`}>
                <line x1={mapX(tick)} y1={0} x2={mapX(tick)} y2={DRAW_H} stroke="#e2e8f0" strokeWidth={1} className="dark:stroke-slate-800" />
                <text x={mapX(tick)} y={DRAW_H + 15} textAnchor="middle" fill="#94a3b8">{Number(tick.toFixed(2))}</text>
             </g>
          ))}

          {/* AXIS LABELS */}
          <text x={VIEW_W / 2 + PADDING_L/2} y={VIEW_H - 5} textAnchor="middle" fill="#64748b" fontWeight="bold">{xLabel}</text>
          <text transform={`rotate(-90)`} x={-DRAW_H / 2} y={15} textAnchor="middle" fill="#64748b" fontWeight="bold">{yLabel}</text>

          {/* ZERO LINE EMPHASIS */}
          {zeroY >= 0 && zeroY <= DRAW_H && (
             <line x1={PADDING_L} y1={zeroY} x2={VIEW_W} y2={zeroY} stroke="#94a3b8" strokeWidth={1.5} />
          )}

          {/* DATA PATH */}
          <polyline points={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" />

          {/* LIVE CURSOR */}
          {/* Dashed Crosshair */}
          <line x1={mapX(currentX)} y1={0} x2={mapX(currentX)} y2={DRAW_H} stroke={color} strokeDasharray="4 4" strokeOpacity={0.5} />
          <line x1={PADDING_L} y1={mapY(currentY)} x2={VIEW_W} y2={mapY(currentY)} stroke={color} strokeDasharray="4 4" strokeOpacity={0.5} />

          {/* Data Point */}
          <circle cx={mapX(currentX)} cy={mapY(currentY)} r={5} fill={color} stroke="white" strokeWidth={2} />
       </svg>
    </div>
  );
};