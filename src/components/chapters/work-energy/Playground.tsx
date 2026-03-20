import React, { useState, useEffect, useRef } from 'react';

const g = 9.8;

export default function WorkEnergyPlayground() {
  const [mass, setMass] = useState<number>(5);
  const [force, setForce] = useState<number>(30);
  const [mu, setMu] = useState<number>(0.2);
  const [targetDistance, setTargetDistance] = useState<number>(10);

  const [time, setTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  // --- Physics ---
  const fk = mu * mass * g;
  const isMoving = force > fk;
  const netForce = isMoving ? force - fk : 0;
  const acceleration = netForce / mass;
  const maxTime = isMoving && acceleration > 0
    ? Math.sqrt((2 * targetDistance) / acceleration)
    : 0;

  const currentTime = Math.min(time, maxTime);
  const currentDistance = Math.min(
    0.5 * acceleration * currentTime * currentTime,
    targetDistance
  );
  const currentVelocity = acceleration * currentTime;

  const workApplied = force * currentDistance;
  const workFriction = -fk * currentDistance;
  const netWork = workApplied + workFriction;
  const kineticEnergy = 0.5 * mass * currentVelocity * currentVelocity;
  const power = currentTime > 0 ? workApplied / currentTime : 0;

  const maxKE = 0.5 * mass * (acceleration * maxTime) ** 2;
  const maxWorkApplied = force * targetDistance;

  // --- Animation ---
  const animate = (timestamp: number) => {
    if (previousTimeRef.current !== null) {
      const dt = (timestamp - previousTimeRef.current) / 1000;
      setTime(prev => {
        const next = prev + dt;
        if (next >= maxTime) {
          setIsPlaying(false);
          return maxTime;
        }
        return next;
      });
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
  }, [isPlaying, maxTime]);

  useEffect(() => {
    setTime(0);
    setIsPlaying(false);
    previousTimeRef.current = null;
  }, [mass, force, mu, targetDistance]);

  const handlePlayPause = () => {
    if (time >= maxTime && isMoving) {
      setTime(0);
      setTimeout(() => setIsPlaying(true), 50);
    } else {
      setIsPlaying(p => !p);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
    previousTimeRef.current = null;
  };

  // --- SVG Layout ---
  const SVG_W = 800;
  const SVG_H = 220;
  const GROUND_Y = 170;
  const LEFT_PAD = 60;
  const RIGHT_PAD = 60;
  const TRACK_W = SVG_W - LEFT_PAD - RIGHT_PAD;
  const BLOCK_W = 56;
  const BLOCK_H = 40;

  const progress = maxTime > 0 ? currentTime / maxTime : 0;
  const blockLeft = LEFT_PAD + progress * (TRACK_W - BLOCK_W);
  const blockTop = GROUND_Y - BLOCK_H;
  const forceArrowLen = Math.min(force * 0.8, 90);
  const frictionArrowLen = Math.min(fk * 0.8, 70);

  return (
    <div className="flex flex-col bg-transparent text-slate-100
                    p-4 space-y-5 overflow-y-auto min-h-full">

      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-sky-400">
          Work, Energy & Power
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Apply a force over a distance and watch energy transform in real time.
        </p>
      </div>

      {/* SVG Canvas */}
      <div className="glass-panel
                      rounded-xl overflow-hidden relative">
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto">
          <defs>
            <pattern id="wgrid" width="40" height="40"
              patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none"
                stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wgrid)" />

          {/* Ground */}
          <line x1={LEFT_PAD} y1={GROUND_Y}
            x2={SVG_W - RIGHT_PAD} y2={GROUND_Y}
            stroke="#334155" strokeWidth="3" />
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={i}
              x1={LEFT_PAD + i * 44} y1={GROUND_Y}
              x2={LEFT_PAD + i * 44 - 14} y2={GROUND_Y + 14}
              stroke="#1e293b" strokeWidth="2" />
          ))}

          {/* Start marker */}
          <line x1={LEFT_PAD} y1={GROUND_Y - 60}
            x2={LEFT_PAD} y2={GROUND_Y}
            stroke="#475569" strokeWidth="1" strokeDasharray="4 3" />
          <text x={LEFT_PAD} y={GROUND_Y - 65}
            fill="#475569" fontSize="11" textAnchor="middle">
            0 m
          </text>

          {/* End marker */}
          <line
            x1={LEFT_PAD + TRACK_W - BLOCK_W} y1={GROUND_Y - 80}
            x2={LEFT_PAD + TRACK_W - BLOCK_W} y2={GROUND_Y}
            stroke="#10b981" strokeWidth="1.5" strokeDasharray="5 3" />
          <text
            x={LEFT_PAD + TRACK_W - BLOCK_W} y={GROUND_Y - 85}
            fill="#10b981" fontSize="11" textAnchor="middle">
            {targetDistance} m
          </text>

          {/* Block */}
          <rect x={blockLeft} y={blockTop}
            width={BLOCK_W} height={BLOCK_H} rx="5"
            fill="#1e3a5f" stroke="#38bdf8" strokeWidth="1.5" />
          <text
            x={blockLeft + BLOCK_W / 2}
            y={blockTop + BLOCK_H / 2 + 5}
            fill="#e2e8f0" fontSize="13" fontWeight="bold"
            textAnchor="middle">
            {mass}kg
          </text>

          {/* Force arrow → */}
          {force > 0 && (
            <g>
              <line
                x1={blockLeft + BLOCK_W}
                y1={blockTop + BLOCK_H / 2}
                x2={blockLeft + BLOCK_W + forceArrowLen}
                y2={blockTop + BLOCK_H / 2}
                stroke="#38bdf8" strokeWidth="2.5" />
              <polygon points={`
                ${blockLeft + BLOCK_W + forceArrowLen},${blockTop + BLOCK_H / 2 - 5}
                ${blockLeft + BLOCK_W + forceArrowLen + 10},${blockTop + BLOCK_H / 2}
                ${blockLeft + BLOCK_W + forceArrowLen},${blockTop + BLOCK_H / 2 + 5}
              `} fill="#38bdf8" />
              <text
                x={blockLeft + BLOCK_W + forceArrowLen / 2}
                y={blockTop + BLOCK_H / 2 - 10}
                fill="#38bdf8" fontSize="11" fontWeight="bold"
                textAnchor="middle">
                F={force}N
              </text>
            </g>
          )}

          {/* Friction arrow ← */}
          {fk > 0 && currentVelocity > 0.01 && (
            <g>
              <line
                x1={blockLeft}
                y1={blockTop + BLOCK_H / 2}
                x2={blockLeft - frictionArrowLen}
                y2={blockTop + BLOCK_H / 2}
                stroke="#ef4444" strokeWidth="2" />
              <polygon points={`
                ${blockLeft - frictionArrowLen},${blockTop + BLOCK_H / 2 - 5}
                ${blockLeft - frictionArrowLen - 10},${blockTop + BLOCK_H / 2}
                ${blockLeft - frictionArrowLen},${blockTop + BLOCK_H / 2 + 5}
              `} fill="#ef4444" />
              <text
                x={blockLeft - frictionArrowLen / 2}
                y={blockTop + BLOCK_H / 2 - 10}
                fill="#ef4444" fontSize="10" textAnchor="middle">
                f={fk.toFixed(1)}N
              </text>
            </g>
          )}

          {/* Distance label */}
          {currentDistance > 0.3 && (
            <text
              x={LEFT_PAD + (progress * (TRACK_W - BLOCK_W)) / 2}
              y={GROUND_Y + 22}
              fill="#64748b" fontSize="11" textAnchor="middle">
              {currentDistance.toFixed(2)} m
            </text>
          )}

          {/* Time */}
          <text x={SVG_W - RIGHT_PAD - 4} y={20}
            fill="#64748b" fontSize="11" textAnchor="end">
            t = {currentTime.toFixed(2)} s
          </text>

          {/* Warning */}
          {!isMoving && force > 0 && (
            <text x={SVG_W / 2} y={SVG_H / 2}
              fill="#f97316" fontSize="14"
              fontWeight="bold" textAnchor="middle">
              Force too weak to overcome friction ({fk.toFixed(1)} N)
            </text>
          )}
        </svg>

        {/* Play controls */}
        <div className="absolute bottom-3 left-3 flex gap-2">
          <button onClick={handlePlayPause} disabled={!isMoving}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium
                        border transition-colors
                        disabled:opacity-30 disabled:cursor-not-allowed
                        ${isPlaying
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              }`}>
            {isPlaying ? '⏸ Pause'
              : time >= maxTime && maxTime > 0 ? '↺ Replay' : '▶ Play'}
          </button>
          <button onClick={handleReset}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700
                       text-slate-300 rounded-lg text-sm border
                       border-slate-700 transition-colors">
            Reset
          </button>
        </div>
      </div>

      {/* Energy Bars */}
      <div className="glass-panel
                      rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider
                       text-slate-400">
          Energy Visualization
        </h3>
        <EnergyBar label="Work by Force" value={workApplied}
          max={maxWorkApplied || 1} color="bg-sky-500"
          textColor="text-sky-400" unit="J" />
        <EnergyBar label="Work by Friction"
          value={Math.abs(workFriction)}
          max={maxWorkApplied || 1} color="bg-red-500"
          textColor="text-red-400" unit="J" negative />
        <EnergyBar label="Kinetic Energy" value={kineticEnergy}
          max={maxKE || 1} color="bg-emerald-500"
          textColor="text-emerald-400" unit="J" />
      </div>

      {/* Parameters + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Inputs */}
        <div className="glass-panel
                        rounded-xl p-4 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider
                         text-slate-400">
            Parameters
          </h3>
          <NumberInput label="Mass" unit="kg"
            value={mass} onChange={setMass} />
          <NumberInput label="Applied Force" unit="N"
            value={force} onChange={setForce} />
          <NumberInput label="Friction Coefficient (μ)" unit=""
            value={mu} onChange={setMu} />
          <NumberInput label="Distance" unit="m"
            value={targetDistance} onChange={setTargetDistance} />
        </div>

        {/* Results */}
        <div className="glass-panel
                        rounded-xl p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider
                         text-slate-400 mb-3">
            Live Results
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Result label="W = F·d"
              value={`${workApplied.toFixed(1)} J`}
              color="text-sky-400" />
            <Result label="Wf = -μmgd"
              value={`${workFriction.toFixed(1)} J`}
              color="text-red-400" />
            <Result label="Net Work"
              value={`${netWork.toFixed(1)} J`}
              color="text-emerald-400" />
            <Result label="ΔKE = ½mv²"
              value={`${kineticEnergy.toFixed(1)} J`}
              color="text-emerald-400" />
            <Result label="Velocity"
              value={`${currentVelocity.toFixed(2)} m/s`}
              color="text-purple-400" />
            <Result label="Power"
              value={`${power.toFixed(1)} W`}
              color="text-amber-400" />
          </div>

          {/* Theorem check */}
          <div className="mt-3 bg-transparent/60 border border-slate-700/50
                          rounded-lg px-3 py-2 text-center">
            <span className="text-xs font-mono text-slate-400">
              ΣW = ΔKE → {netWork.toFixed(1)} J = {kineticEnergy.toFixed(1)} J{' '}
              <span className={
                Math.abs(netWork - kineticEnergy) < 0.5
                  ? 'text-emerald-400' : 'text-red-400'
              }>
                {Math.abs(netWork - kineticEnergy) < 0.5 ? '✓' : '≈'}
              </span>
            </span>
          </div>
        </div>
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

function EnergyBar({ label, value, max, color, textColor, unit, negative }: {
  label: string;
  value: number;
  max: number;
  color: string;
  textColor: string;
  unit: string;
  negative?: boolean;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className={`font-mono ${textColor}`}>
          {negative ? '-' : ''}{value.toFixed(1)} {unit}
        </span>
      </div>
      <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-100 ${color}`}
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