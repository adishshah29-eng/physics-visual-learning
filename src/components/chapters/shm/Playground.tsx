import React, { useState, useEffect, useRef } from 'react';

const g = 9.8;

export default function SHMPlayground() {
  const [mass, setMass] = useState<number>(1);
  const [springK, setSpringK] = useState<number>(10);
  const [amplitude, setAmplitude] = useState<number>(3);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  // --- Physics ---
  const omega = Math.sqrt(springK / mass);       // angular frequency
  const period = (2 * Math.PI) / omega;          // time period
  const frequency = 1 / period;                  // frequency
  const maxVelocity = omega * amplitude;         // v_max at equilibrium
  const maxAcceleration = omega * omega * amplitude; // a_max at extremes
  const totalEnergy = 0.5 * springK * amplitude * amplitude; // E = ½kA²

  // --- Current state ---
  const displacement = amplitude * Math.cos(omega * time);  // x = A cos(ωt)
  const velocity = -amplitude * omega * Math.sin(omega * time); // v = -Aω sin(ωt)
  const acceleration = -omega * omega * displacement;        // a = -ω²x
  const ke = 0.5 * mass * velocity * velocity;              // KE = ½mv²
  const pe = 0.5 * springK * displacement * displacement;  // PE = ½kx²

  // --- Animation ---
  const animate = (timestamp: number) => {
    if (previousTimeRef.current !== null) {
      const dt = (timestamp - previousTimeRef.current) / 1000;
      setTime(prev => prev + dt);
    }
    previousTimeRef.current = timestamp;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      previousTimeRef.current = null;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, omega]);

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
    previousTimeRef.current = null;
  };

  // --- SVG spring-mass layout ---
  const SVG_W = 700;
  const SVG_H = 200;
  const WALL_X = 60;
  const EQUIL_X = 420;
  const BLOCK_W = 50;
  const BLOCK_H = 40;
  const BLOCK_Y = SVG_H / 2 - BLOCK_H / 2;

  // Map displacement (-A to +A) to pixels
  const MAX_PX = 120;
  const scale = MAX_PX / Math.max(amplitude, 0.1);
  const blockX = EQUIL_X + displacement * scale - BLOCK_W / 2;

  // Spring coil points
  const springStart = WALL_X + 10;
  const springEnd = blockX;
  const coils = 12;
  const coilH = 12;
  const springPath = (() => {
    const len = springEnd - springStart;
    const step = len / coils;
    let d = `M ${springStart} ${SVG_H / 2}`;
    for (let i = 0; i < coils; i++) {
      const x1 = springStart + i * step + step * 0.25;
      const x2 = springStart + i * step + step * 0.75;
      const x3 = springStart + (i + 1) * step;
      const yTop = SVG_H / 2 - coilH;
      const yBot = SVG_H / 2 + coilH;
      d += ` L ${x1} ${yTop} L ${x2} ${yBot} L ${x3} ${SVG_H / 2}`;
    }
    return d;
  })();

  // Trail points for the last 2 seconds
  const TRAIL_STEPS = 120;
  const trailPoints = Array.from({ length: TRAIL_STEPS }, (_, i) => {
    const t = time - (TRAIL_STEPS - i) * 0.016;
    if (t < 0) return null;
    const x = EQUIL_X + amplitude * Math.cos(omega * t) * scale;
    const y = SVG_H / 2;
    return `${x},${y}`;
  }).filter(Boolean).join(' ');

  return (
    <div className="flex flex-col bg-transparent text-slate-100
                    p-4 space-y-5 overflow-y-auto min-h-full">

      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-sky-400">
          Simple Harmonic Motion
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          A spring-mass system oscillating about equilibrium.
          Displacement, velocity and acceleration update in real time.
        </p>
      </div>

      {/* Spring-Mass Canvas */}
      <div className="glass-panel
                      rounded-xl overflow-hidden relative">
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto">
          <defs>
            <pattern id="shmgrid" width="40" height="40"
              patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none"
                stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#shmgrid)" />

          {/* Wall */}
          <rect x={0} y={0} width={WALL_X} height={SVG_H}
            fill="#1e293b" />
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i}
              x1={WALL_X} y1={i * 26}
              x2={WALL_X - 14} y2={i * 26 + 14}
              stroke="#334155" strokeWidth="2" />
          ))}
          <line x1={WALL_X} y1={0} x2={WALL_X} y2={SVG_H}
            stroke="#475569" strokeWidth="3" />

          {/* Equilibrium line */}
          <line x1={EQUIL_X} y1={20} x2={EQUIL_X} y2={SVG_H - 20}
            stroke="#334155" strokeWidth="1" strokeDasharray="4 3" />
          <text x={EQUIL_X} y={16}
            fill="#475569" fontSize="10" textAnchor="middle">
            x=0
          </text>

          {/* Amplitude markers */}
          <line
            x1={EQUIL_X + amplitude * scale} y1={SVG_H / 2 - 20}
            x2={EQUIL_X + amplitude * scale} y2={SVG_H / 2 + 20}
            stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3"
            opacity="0.5" />
          <line
            x1={EQUIL_X - amplitude * scale} y1={SVG_H / 2 - 20}
            x2={EQUIL_X - amplitude * scale} y2={SVG_H / 2 + 20}
            stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3"
            opacity="0.5" />
          <text
            x={EQUIL_X + amplitude * scale}
            y={SVG_H / 2 - 24}
            fill="#f59e0b" fontSize="9" textAnchor="middle">
            +A
          </text>
          <text
            x={EQUIL_X - amplitude * scale}
            y={SVG_H / 2 - 24}
            fill="#f59e0b" fontSize="9" textAnchor="middle">
            -A
          </text>

          {/* Spring */}
          <path d={springPath}
            fill="none" stroke="#64748b" strokeWidth="2"
            strokeLinecap="round" />

          {/* Block */}
          <rect x={blockX} y={BLOCK_Y}
            width={BLOCK_W} height={BLOCK_H} rx="4"
            fill="#1e3a5f" stroke="#38bdf8" strokeWidth="2" />
          <text x={blockX + BLOCK_W / 2} y={BLOCK_Y + BLOCK_H / 2 + 5}
            fill="#e2e8f0" fontSize="12" fontWeight="bold"
            textAnchor="middle">
            {mass}kg
          </text>

          {/* Velocity arrow */}
          {Math.abs(velocity) > 0.1 && (
            <g>
              <line
                x1={blockX + BLOCK_W / 2}
                y1={BLOCK_Y - 6}
                x2={blockX + BLOCK_W / 2 + velocity * 4}
                y2={BLOCK_Y - 6}
                stroke="#22c55e" strokeWidth="2" />
              <polygon
                points={`
                  ${blockX + BLOCK_W / 2 + velocity * 4 + (velocity > 0 ? 6 : -6)},${BLOCK_Y - 6}
                  ${blockX + BLOCK_W / 2 + velocity * 4},${BLOCK_Y - 10}
                  ${blockX + BLOCK_W / 2 + velocity * 4},${BLOCK_Y - 2}
                `}
                fill="#22c55e" />
              <text
                x={blockX + BLOCK_W / 2 + velocity * 2}
                y={BLOCK_Y - 14}
                fill="#22c55e" fontSize="9" textAnchor="middle">
                v
              </text>
            </g>
          )}

          {/* Displacement label */}
          <text
            x={EQUIL_X + (displacement * scale) / 2}
            y={SVG_H / 2 + BLOCK_H / 2 + 18}
            fill="#94a3b8" fontSize="10" textAnchor="middle">
            x = {displacement.toFixed(2)} m
          </text>

          {/* Time */}
          <text x={SVG_W - 10} y={16}
            fill="#334155" fontSize="10" textAnchor="end">
            t = {time.toFixed(2)} s
          </text>
        </svg>

        {/* Controls */}
        <div className="absolute bottom-3 left-3 flex gap-2">
          <button onClick={() => setIsPlaying(p => !p)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium
                        border transition-colors
                        ${isPlaying
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              }`}>
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button onClick={handleReset}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700
                       text-slate-300 rounded-lg text-sm border
                       border-slate-700 transition-colors">
            Reset
          </button>
        </div>
      </div>

      {/* Energy bars */}
      <div className="glass-panel
                      rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider
                       text-slate-400">
          Energy Distribution
        </h3>
        <EnergyBar label="Kinetic Energy (KE = ½mv²)"
          value={ke} max={totalEnergy || 1}
          color="bg-emerald-500" textColor="text-emerald-400" />
        <EnergyBar label="Potential Energy (PE = ½kx²)"
          value={pe} max={totalEnergy || 1}
          color="bg-amber-500" textColor="text-amber-400" />
        <EnergyBar label="Total Energy (E = ½kA²)"
          value={totalEnergy} max={totalEnergy || 1}
          color="bg-sky-500" textColor="text-sky-400" />
        <p className="text-[10px] text-slate-600 text-center font-mono">
          KE + PE = {(ke + pe).toFixed(2)} J
          {Math.abs(ke + pe - totalEnergy) < 0.1 ? ' ✓' : ''}
        </p>
      </div>

      {/* Parameters + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Inputs */}
        <div className="glass-panel
                        rounded-xl p-4 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider
                         text-slate-400">Parameters</h3>
          <NumberInput label="Mass" unit="kg"
            value={mass} onChange={v => { setMass(v); handleReset(); }} />
          <NumberInput label="Spring Constant (k)" unit="N/m"
            value={springK} onChange={v => { setSpringK(v); handleReset(); }} />
          <NumberInput label="Amplitude (A)" unit="m"
            value={amplitude} onChange={v => { setAmplitude(v); handleReset(); }} />
        </div>

        {/* Results */}
        <div className="glass-panel
                        rounded-xl p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider
                         text-slate-400 mb-3">Live Results</h3>
          <div className="grid grid-cols-2 gap-2">
            <Result label="Displacement"
              value={`${displacement.toFixed(3)} m`}
              color="text-sky-400" />
            <Result label="Velocity"
              value={`${velocity.toFixed(3)} m/s`}
              color="text-emerald-400" />
            <Result label="Acceleration"
              value={`${acceleration.toFixed(3)} m/s²`}
              color="text-red-400" />
            <Result label="Period (T)"
              value={`${period.toFixed(3)} s`}
              color="text-purple-400" />
            <Result label="Frequency (f)"
              value={`${frequency.toFixed(3)} Hz`}
              color="text-teal-400" />
            <Result label="ω (angular freq)"
              value={`${omega.toFixed(3)} rad/s`}
              color="text-amber-400" />
            <Result label="v_max"
              value={`${maxVelocity.toFixed(3)} m/s`}
              color="text-emerald-400" />
            <Result label="a_max"
              value={`${maxAcceleration.toFixed(3)} m/s²`}
              color="text-red-400" />
          </div>
        </div>
      </div>

      {/* Key insight */}
      <div className="bg-sky-500/10 border border-sky-500/30
                      rounded-xl p-4">
        <p className="text-xs text-sky-300 leading-relaxed">
          <span className="font-bold">Key insight: </span>
          In SHM, acceleration is always directed toward the equilibrium
          position and proportional to displacement: <span className="font-mono">a = -ω²x</span>.
          At the extremes (x = ±A), KE = 0 and PE is maximum.
          At equilibrium (x = 0), PE = 0 and KE is maximum.
        </p>
      </div>
    </div>
  );
}

// ─── NumberInput ───

function NumberInput({ label, unit, value, onChange }: {
  label: string;
  unit: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const [display, setDisplay] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplay(raw);
    const parsed = parseFloat(raw);
    if (!isNaN(parsed) && parsed > 0) onChange(parsed);
  };

  const handleBlur = () => {
    const parsed = parseFloat(display);
    if (isNaN(parsed) || parsed <= 0) setDisplay('');
  };

  return (
    <div>
      <label className="block text-[10px] font-bold text-slate-400
                         uppercase mb-1">
        {label}
      </label>
      <div className="flex items-center bg-slate-800 rounded border
                      border-slate-700 focus-within:border-sky-500
                      focus-within:ring-1 focus-within:ring-sky-500/50
                      transition-colors">
        <input
          type="number"
          value={display}
          placeholder={String(value)}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full bg-transparent px-3 py-2 text-sm
                     font-mono text-slate-100 outline-none
                     placeholder:text-slate-500"
        />
        {unit && (
          <span className="text-xs text-slate-500 pr-3 select-none
                           font-mono shrink-0">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── EnergyBar ───

function EnergyBar({ label, value, max, color, textColor }: {
  label: string;
  value: number;
  max: number;
  color: string;
  textColor: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className={`font-mono ${textColor}`}>
          {value.toFixed(2)} J
        </span>
      </div>
      <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-75 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Result Box ───

function Result({ label, value, color }: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-slate-800 border border-slate-700/50 rounded-lg p-2.5">
      <div className="text-[10px] text-slate-500 font-mono mb-1">{label}</div>
      <div className={`text-sm font-mono font-bold ${color}`}>{value}</div>
    </div>
  );
}