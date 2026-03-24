import React, { useState, useEffect, useMemo } from "react";
import { Play, RotateCcw, Pause } from "lucide-react";
import { clampPhysics, PHYSICS_LIMITS } from '@/lib/physicsValidation';

/* ================= CONSTANTS ================= */

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 460;

const ORIGIN_X = 40;
const BALL_RADIUS = 7;
const GROUND_Y = CANVAS_HEIGHT - BALL_RADIUS;

/* ================= COMPONENT ================= */

const SimulationPanel: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  // 🔑 EDITABLE PARAMETERS
  const [velocity, setVelocity] = useState(25);
  const [angle, setAngle] = useState(30);
  const [gravity, setGravity] = useState(9.8);

  const setVelocitySafe = (v: number) => {
    setVelocity(clampPhysics(v, PHYSICS_LIMITS.velocity));
    reset();
  };
  const setAngleSafe = (v: number) => {
    setAngle(clampPhysics(v, PHYSICS_LIMITS.angle));
    reset();
  };
  const setGravitySafe = (v: number) => {
    setGravity(clampPhysics(v, PHYSICS_LIMITS.gravity));
    reset();
  };

  const [showVectors, setShowVectors] = useState(true);

  const [time, setTime] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  /* ================= PHYSICS ================= */

  const rad = (angle * Math.PI) / 180;

  const vx = velocity * Math.cos(rad);
  const vy0 = velocity * Math.sin(rad);

  const safeGravity = gravity > 0 ? gravity : 9.8;
  const T = (2 * velocity * Math.sin(rad)) / safeGravity;
  const Hmax = (velocity ** 2 * Math.sin(rad) ** 2) / (2 * safeGravity);
  const R = (velocity ** 2 * Math.sin(2 * rad)) / safeGravity;

  /* ================= AUTO SCALE ================= */

  const scale = useMemo(() => {
    if (R <= 0 || Hmax <= 0) return 1;
    const sx = (CANVAS_WIDTH - ORIGIN_X - 40) / R;
    const sy = (GROUND_Y - 20) / Hmax;
    return Math.min(sx, sy);
  }, [R, Hmax]);

  /* ================= ANALYTIC TRAJECTORY ================= */

  const trajectory = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    const steps = 160;

    for (let i = 0; i <= steps; i++) {
      const t = (T * i) / steps;
      const x = vx * t;
      const yRaw = vy0 * t - 0.5 * gravity * t * t;
      pts.push({ x, y: Math.max(0, yRaw) });
    }
    return pts;
  }, [velocity, angle, gravity]);

  /* ================= BALL ANIMATION ================= */

  useEffect(() => {
    let frame: number;

    if (isPlaying) {
      const start = Date.now();

      const animate = () => {
        const t = (Date.now() - start) / 100;
        const x = vx * t;
        const y = vy0 * t - 0.5 * gravity * t * t;

        if (y <= 0 && t > 0) {
          setPos({ x: R, y: 0 });
          setTime(T);
          setIsPlaying(false);
          return;
        }

        setTime(t);
        setPos({ x, y });
        frame = requestAnimationFrame(animate);
      };

      frame = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(frame);
  }, [isPlaying, velocity, angle, gravity]);

  const reset = () => {
    setIsPlaying(false);
    setTime(0);
    setPos({ x: 0, y: 0 });
  };

  const hasStarted = time > 0;

  /* ================= PATH (TIME-BASED) ================= */

  const visibleTrajectory = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < trajectory.length; i++) {
      const tPoint = (T * i) / (trajectory.length - 1);
      if (tPoint <= time) pts.push(trajectory[i]);
      else break;
    }
    return pts;
  }, [trajectory, time, T]);

  /* ================= SVG COORDINATES ================= */

  const ox = ORIGIN_X;
  const oy = GROUND_Y;

  const sx = ox + pos.x * scale;
  const sy = oy - pos.y * scale;

  const r = Math.sqrt(pos.x ** 2 + pos.y ** 2);

  const pathPoints = visibleTrajectory
    .map(p => `${ox + p.x * scale},${oy - p.y * scale}`)
    .join(" ");

  /* ================= RENDER ================= */

  return (
    <div className="flex flex-col bg-background border rounded-lg overflow-hidden">

      {/* ================= CANVAS ================= */}
      <div className="relative w-full aspect-[16/9] bg-[radial-gradient(circle_at_center,_rgba(30,41,59,0.35),_rgba(5,6,12,1))]">
        <svg viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} className="absolute inset-0">

          {visibleTrajectory.length > 1 && (
            <polyline points={pathPoints} fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.7" />
          )}

          <circle cx={ox} cy={oy} r={BALL_RADIUS} fill="#38bdf8" />

          {showVectors && hasStarted && (
            <>
              <line x1={ox} y1={oy} x2={sx} y2={sy} stroke="white" strokeDasharray="6 6" />
              <line x1={ox} y1={oy} x2={sx} y2={oy} stroke="#38bdf8" opacity={0.4} />
              <line x1={sx} y1={oy} x2={sx} y2={sy} stroke="#38bdf8" opacity={0.4} />
            </>
          )}

          <circle cx={sx} cy={sy} r={BALL_RADIUS} fill="#38bdf8" />

          {showVectors && hasStarted && (
            <>
              <text x={ox + 8} y={oy - 10} fontSize="12" fill="white">
                θ₀ = {angle}°
              </text>
              <text x={sx + 8} y={sy - 8} fontSize="12" fill="white">
                r = {r.toFixed(2)} m
              </text>
            </>
          )}
        </svg>
      </div>

      {/* ================= PARAMETERS & RESULTS (EDITABLE) ================= */}
      <div className="border-t border-white/10 bg-black/60 backdrop-blur p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* INPUTS */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
              Input Parameters
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <InputBox label="Initial Velocity (m/s)" value={velocity}
                onChange={setVelocitySafe} />
              <InputBox label="Angle (°)" value={angle}
                onChange={setAngleSafe} />
              <InputBox label="Gravity (m/s²)" value={gravity}
                onChange={setGravitySafe} />
            </div>
          </div>

          {/* RESULTS */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
              Calculated Results
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm font-mono">
              <ResultBox label="Time of Flight (T)" value={`${T.toFixed(2)} s`} />
              <ResultBox label="Max Height (Hₘₐₓ)" value={`${Hmax.toFixed(2)} m`} />
              <ResultBox label="Range (R)" value={`${R.toFixed(2)} m`} />
              <ResultBox label="vₓ" value={`${vx.toFixed(2)} m/s`} />
              <ResultBox label="vᵧ₀" value={`${vy0.toFixed(2)} m/s`} />
            </div>
          </div>

        </div>
      </div>

      {/* ================= CONTROLS ================= */}
      <div className="p-4 space-y-4 bg-black/40">

        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" checked={showVectors} onChange={() => setShowVectors(!showVectors)} />
          Show vectors
        </label>

        <div className="grid grid-cols-2 gap-4">
          <Slider label="Velocity" value={velocity} min={5} max={60}
            onChange={setVelocitySafe} />
          <Slider label="Angle" value={angle} min={0} max={90}
            onChange={setAngleSafe} />
        </div>

        <div className="flex justify-between">
          <button onClick={reset} className="px-4 py-2 bg-secondary rounded">
            <RotateCcw className="inline w-4 h-4 mr-1" /> Reset
          </button>
          <button onClick={() => setIsPlaying(!isPlaying)} className="px-6 py-2 bg-primary text-white rounded">
            {isPlaying ? <Pause /> : <Play />}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= HELPERS ================= */

const Slider = ({ label, value, min, max, onChange }: any) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <input type="range" min={min} max={max} value={value}
      onChange={e => onChange(Number(e.target.value))} className="w-full" />
  </div>
);

const InputBox = ({ label, value, onChange }: any) => (
  <div className="p-3 rounded-md bg-white/5 border border-white/10">
    <div className="text-xs text-muted-foreground mb-1">{label}</div>
    <input
      type="number"
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full bg-black/60 border border-white/10 rounded px-2 py-1 text-white"
    />
  </div>
);

const ResultBox = ({ label, value }: any) => (
  <div className="p-3 rounded-md bg-white/10 border border-white/10">
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="mt-1 text-primary">{value}</div>
  </div>
);

export default SimulationPanel;
