import React, { useState, useEffect, useRef } from 'react';

export default function CircularMotionPlayground() {
  const [mass, setMass] = useState<number>(2);
  const [radius, setRadius] = useState<number>(3);
  const [speed, setSpeed] = useState<number>(5);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [angle, setAngle] = useState<number>(0);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  // --- Physics ---
  const omega = speed / radius;
  const period = (2 * Math.PI) / omega;
  const centripetal = (mass * speed * speed) / radius;
  const centripetalAcc = speed * speed / radius;
  const kineticEnergy = 0.5 * mass * speed * speed;

  // --- Animation ---
  const animate = (timestamp: number) => {
    if (previousTimeRef.current !== null) {
      const dt = (timestamp - previousTimeRef.current) / 1000;
      setAngle(prev => prev + omega * dt);
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
    setAngle(0);
    previousTimeRef.current = null;
  };

  // --- SVG ---
  const SVG_W = 560;
  const SVG_H = 400;
  const CX = 280;
  const CY = 200;
  const MAX_R = 150;
  const scale = MAX_R / 10;
  const r = radius * scale;

  const ballX = CX + r * Math.cos(angle);
  const ballY = CY + r * Math.sin(angle);

  const vx = -Math.sin(angle) * speed * 3;
  const vy = Math.cos(angle) * speed * 3;
  const vLen = Math.sqrt(vx * vx + vy * vy);
  const vNx = (vx / vLen) * Math.min(vLen, 70);
  const vNy = (vy / vLen) * Math.min(vLen, 70);

  const fcx = CX - ballX;
  const fcy = CY - ballY;
  const fcLen = Math.sqrt(fcx * fcx + fcy * fcy);
  const fcNx = (fcx / fcLen) * 55;
  const fcNy = (fcy / fcLen) * 55;

  return (
    <div className="flex flex-col bg-transparent text-slate-100
                    p-4 space-y-5 overflow-y-auto min-h-full">

      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-sky-400">Circular Motion</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Velocity is always tangent. Centripetal force always points inward.
        </p>
      </div>

      {/* Canvas + Results */}
      <div className="flex flex-col lg:flex-row gap-4">

        {/* SVG */}
        <div className="glass-panel
                        rounded-xl overflow-hidden flex-1 relative">
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto">
            <defs>
              <pattern id="cgrid" width="40" height="40"
                patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none"
                  stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              </pattern>
              <marker id="vel-arrow" markerWidth="8" markerHeight="6"
                refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#22c55e" />
              </marker>
              <marker id="fc-arrow" markerWidth="8" markerHeight="6"
                refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" />
              </marker>
              <radialGradient id="ballGrad" cx="40%" cy="35%">
                <stop offset="0%" stopColor="#7dd3fc" />
                <stop offset="100%" stopColor="#0369a1" />
              </radialGradient>
            </defs>

            <rect width="100%" height="100%" fill="url(#cgrid)" />

            {/* Orbit */}
            <circle cx={CX} cy={CY} r={r}
              fill="none" stroke="#1e40af"
              strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />

            {/* Radius line */}
            <line x1={CX} y1={CY} x2={ballX} y2={ballY}
              stroke="#334155" strokeWidth="1.5" strokeDasharray="4 3" />
            <text x={(CX + ballX) / 2 + 8} y={(CY + ballY) / 2 - 8}
              fill="#475569" fontSize="11">
              r = {radius}m
            </text>

            {/* Center */}
            <circle cx={CX} cy={CY} r={5}
              fill="#334155" stroke="#475569" strokeWidth="1.5" />
            <text x={CX + 8} y={CY - 8}
              fill="#475569" fontSize="11">O</text>

            {/* Centripetal force */}
            <line x1={ballX} y1={ballY}
              x2={ballX + fcNx} y2={ballY + fcNy}
              stroke="#f59e0b" strokeWidth="2.5"
              markerEnd="url(#fc-arrow)" />
            <text x={ballX + fcNx / 2 - 16} y={ballY + fcNy / 2 - 8}
              fill="#f59e0b" fontSize="10" fontWeight="bold">Fc</text>

            {/* Velocity */}
            <line x1={ballX} y1={ballY}
              x2={ballX + vNx} y2={ballY + vNy}
              stroke="#22c55e" strokeWidth="2.5"
              markerEnd="url(#vel-arrow)" />
            <text x={ballX + vNx + 6} y={ballY + vNy}
              fill="#22c55e" fontSize="10" fontWeight="bold">v</text>

            {/* Ball */}
            <circle cx={ballX} cy={ballY} r={14}
              fill="url(#ballGrad)" stroke="#38bdf8" strokeWidth="2" />
            <text x={ballX} y={ballY + 4}
              fill="white" fontSize="10"
              fontWeight="bold" textAnchor="middle">
              {mass}kg
            </text>

            {/* Legend */}
            <g transform="translate(16,16)">
              <rect width="130" height="52" rx="6"
                fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
              <line x1="10" y1="18" x2="26" y2="18"
                stroke="#22c55e" strokeWidth="2" />
              <text x="32" y="22" fill="#94a3b8" fontSize="10">
                Velocity (tangent)
              </text>
              <line x1="10" y1="36" x2="26" y2="36"
                stroke="#f59e0b" strokeWidth="2" />
              <text x="32" y="40" fill="#94a3b8" fontSize="10">
                Centripetal Force
              </text>
            </g>

            {/* Angle */}
            <text x={SVG_W - 12} y={SVG_H - 12}
              fill="#334155" fontSize="10" textAnchor="end">
              θ = {((angle % (2 * Math.PI)) * 180 / Math.PI).toFixed(1)}°
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
                         text-slate-300 rounded-lg text-sm
                         border border-slate-700 transition-colors">
              Reset
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:w-56 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider
                         text-slate-400">Live Results</h3>
          <Result label="Centripetal Force" unit="N"
            value={centripetal.toFixed(2)}
            formula="F = mv²/r" color="text-amber-400" />
          <Result label="Centripetal Acc." unit="m/s²"
            value={centripetalAcc.toFixed(2)}
            formula="a = v²/r" color="text-sky-400" />
          <Result label="Angular Velocity" unit="rad/s"
            value={omega.toFixed(3)}
            formula="ω = v/r" color="text-purple-400" />
          <Result label="Period" unit="s"
            value={period.toFixed(2)}
            formula="T = 2πr/v" color="text-emerald-400" />
          <Result label="Kinetic Energy" unit="J"
            value={kineticEnergy.toFixed(2)}
            formula="KE = ½mv²" color="text-rose-400" />
          <Result label="Frequency" unit="Hz"
            value={(1 / period).toFixed(3)}
            formula="f = 1/T" color="text-teal-400" />
        </div>
      </div>

      {/* Parameters */}
      <div className="glass-panel
                      rounded-xl p-4 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider
                       text-slate-400">Parameters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumberInput label="Mass" unit="kg"
            value={mass} onChange={setMass} />
          <NumberInput label="Radius" unit="m"
            value={radius} onChange={setRadius} />
          <NumberInput label="Speed" unit="m/s"
            value={speed} onChange={setSpeed} />
        </div>
      </div>

      {/* Key insight */}
      <div className="bg-amber-500/10 border border-amber-500/30
                      rounded-xl p-4">
        <p className="text-xs text-amber-300 leading-relaxed">
          <span className="font-bold">Key insight: </span>
          Centripetal force is not a new force — it's the net inward
          force provided by tension, gravity, normal force, or friction
          depending on the situation. Without it, the object flies off
          in a straight line (Newton's 1st Law).
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

// ─── Result Box (Circular) ───

function Result({ label, value, unit, formula, color }: {
  label: string;
  value: string;
  unit: string;
  formula: string;
  color: string;
}) {
  return (
    <div className="bg-slate-800 border border-slate-700/50
                    rounded-lg p-3 space-y-1">
      <div className="text-[10px] text-slate-500">{label}</div>
      <div className={`text-base font-mono font-bold ${color}`}>
        {value}{' '}
        <span className="text-xs text-slate-400">{unit}</span>
      </div>
      <div className="text-[10px] font-mono text-slate-600">{formula}</div>
    </div>
  );
}