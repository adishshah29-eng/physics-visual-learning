import React, { useState, useEffect, useRef } from 'react';

const g = 9.8;

const SHAPES = [
  { label: 'Solid Disk',    key: 'disk'    as const, k: 0.5,     spokes: 8 },
  { label: 'Ring',          key: 'ring'    as const, k: 1.0,     spokes: 0 },
  { label: 'Solid Sphere',  key: 'sphere'  as const, k: 2 / 5,   spokes: 6 },
  { label: 'Hollow Sphere', key: 'hSphere' as const, k: 2 / 3,   spokes: 6 },
];
type ShapeKey   = 'disk' | 'ring' | 'sphere' | 'hSphere';
type MotionMode = 'rolling' | 'sliding' | 'slipping';

export default function RotationalMotionPlayground() {
  const [mass,     setMass]     = useState(2);
  const [radius,   setRadius]   = useState(0.5);
  const [angle,    setAngle]    = useState(30);
  const [shape,    setShape]    = useState<ShapeKey>('disk');
  const [mode,     setMode]     = useState<MotionMode>('rolling');
  const [mu,       setMu]       = useState(0.3);
  const [showFBD,  setShowFBD]  = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [, forceRender] = useState(0);

  const vRef       = useRef(0);
  const omegaRef   = useRef(0);
  const distRef    = useRef(0);
  const timeRef    = useRef(0);
  const rotRef     = useRef(0);
  const phaseRef   = useRef<'slip' | 'roll'>('slip');
  const trailRef   = useRef<{ t: number; v: number }[]>([]);
  const requestRef = useRef<number | null>(null);
  const prevTsRef  = useRef<number | null>(null);

  const shapeObj = SHAPES.find(s => s.key === shape) ?? SHAPES[0];
  const k     = shapeObj.k;
  const theta = (angle * Math.PI) / 180;
  const I     = k * mass * radius * radius;
  const RAMP_LENGTH_M = Math.max(3 / Math.sin(theta || 0.01), 0.1);
  const finished = distRef.current >= RAMP_LENGTH_M;

  const handleReset = () => {
    setIsPlaying(false);
    vRef.current = omegaRef.current = distRef.current = timeRef.current = rotRef.current = 0;
    phaseRef.current = 'slip';
    trailRef.current = [];
    prevTsRef.current = null;
    forceRender(p => p + 1);
  };

  useEffect(() => { handleReset(); }, [mode, shape]);

  useEffect(() => {
    if (!isPlaying || finished) {
      prevTsRef.current = null;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }
    const animate = (ts: number) => {
      if (prevTsRef.current !== null) {
        const dt = Math.min((ts - prevTsRef.current) / 1000, 0.033);
        let a_cm: number, al: number;
        if (mode === 'rolling') {
          a_cm = (g * Math.sin(theta)) / (1 + k);
          al   = a_cm / radius;
        } else if (mode === 'sliding') {
          a_cm = g * Math.sin(theta);
          al   = 0;
        } else {
          if (phaseRef.current === 'slip') {
            a_cm = g * (Math.sin(theta) - mu * Math.cos(theta));
            al   = (mu * mass * g * radius * Math.cos(theta)) / I;
            if (a_cm <= 0) { a_cm = 0; al = 0; }
            const nv = vRef.current + a_cm * dt;
            const no = omegaRef.current + al * dt;
            if (nv > 0 && no * radius >= nv) phaseRef.current = 'roll';
          } else {
            a_cm = (g * Math.sin(theta)) / (1 + k);
            al   = a_cm / radius;
          }
        }
        vRef.current     = Math.max(0, vRef.current + a_cm * dt);
        omegaRef.current = mode === 'rolling'
          ? vRef.current / radius
          : Math.max(0, omegaRef.current + al * dt);
        distRef.current  = Math.min(distRef.current + vRef.current * dt, RAMP_LENGTH_M);
        timeRef.current += dt;
        rotRef.current  += omegaRef.current * dt;
        const trail = trailRef.current;
        if (!trail.length || timeRef.current - trail[trail.length - 1].t >= 0.05) {
          trail.push({ t: timeRef.current, v: vRef.current });
          if (trail.length > 120) trail.shift();
        }
        forceRender(p => p + 1);
      }
      prevTsRef.current = ts;
      if (distRef.current < RAMP_LENGTH_M) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setIsPlaying(false);
      }
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isPlaying, mode, mu, theta, k, radius, mass, I, RAMP_LENGTH_M]);

  // ── Current display values ──
  const curV    = vRef.current;
  const curO    = omegaRef.current;
  const curD    = distRef.current;
  const curT    = timeRef.current;
  const rotDeg  = ((rotRef.current * 180) / Math.PI) % 360;
  const curH    = curD * Math.sin(theta);
  const keT     = 0.5 * mass * curV * curV;
  const keR     = 0.5 * I * curO * curO;
  const initPE  = mass * g * RAMP_LENGTH_M * Math.sin(theta);
  const pe      = Math.max(0, mass * g * (RAMP_LENGTH_M * Math.sin(theta) - curH));
  const totE    = initPE;

  let dispA = 0, dispAl = 0, frictionN = 0;
  if (mode === 'rolling') {
    dispA = (g * Math.sin(theta)) / (1 + k);
    dispAl = dispA / radius;
    frictionN = (k / (1 + k)) * mass * g * Math.sin(theta);
  } else if (mode === 'sliding') {
    dispA = g * Math.sin(theta);
  } else {
    if (phaseRef.current === 'slip') {
      dispA = Math.max(0, g * (Math.sin(theta) - mu * Math.cos(theta)));
      dispAl = (mu * mass * g * radius * Math.cos(theta)) / I;
      frictionN = mu * mass * g * Math.cos(theta);
    } else {
      dispA = (g * Math.sin(theta)) / (1 + k);
      dispAl = dispA / radius;
      frictionN = (k / (1 + k)) * mass * g * Math.sin(theta);
    }
  }

  // ── SVG layout ──
  const SVG_W = 700, SVG_H = 300, MARGIN = 30, RAMP_BASE_X = 100;
  const GROUND_Y  = SVG_H - MARGIN;
  const maxByVert  = (GROUND_Y - MARGIN) / Math.sin(theta || 0.01);
  const maxByHoriz = (SVG_W - RAMP_BASE_X - MARGIN) / Math.cos(theta || 0.01);
  const RAMP_LEN_PX = Math.min(maxByVert, maxByHoriz, 500);
  const RAMP_TOP_X  = RAMP_BASE_X;
  const RAMP_TOP_Y  = GROUND_Y - RAMP_LEN_PX * Math.sin(theta);
  const RAMP_BOT_X  = RAMP_BASE_X + RAMP_LEN_PX * Math.cos(theta);
  const RAMP_BOT_Y  = GROUND_Y;
  const DISK_R_PX   = 22;
  const nX = Math.sin(theta), nY = -Math.cos(theta);

  const progress = RAMP_LENGTH_M > 0 ? Math.min(curD / RAMP_LENGTH_M, 1) : 0;
  const dAX = RAMP_TOP_X + progress * (RAMP_BOT_X - RAMP_TOP_X);
  const dAY = RAMP_TOP_Y + progress * (RAMP_BOT_Y - RAMP_TOP_Y);
  const cx  = dAX + nX * DISK_R_PX;
  const cy  = dAY + nY * DISK_R_PX;

  const numTicks = Math.floor(RAMP_LEN_PX / 60);

  // v-t graph
  const trail    = trailRef.current;
  const maxT     = Math.max(...trail.map(p => p.t), 0.1);
  const maxVGr   = Math.max(...trail.map(p => p.v), 1);
  const GRAPH_W  = 660, GRAPH_H = 80;
  const pts = trail.map(p => {
    const x = 10 + (p.t / maxT) * (GRAPH_W - 20);
    const y = (GRAPH_H - 10) - (p.v / maxVGr) * (GRAPH_H - 20);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const isSlipping = mode === 'slipping' && phaseRef.current === 'slip' && curV > 0.1;

  return (
    <div className="flex flex-col bg-transparent text-slate-100 p-4 space-y-4 overflow-y-auto min-h-full">

      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-sky-400">Rotational Motion</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Compare rolling, sliding, and slipping across different shapes.
        </p>
      </div>

      {/* Shape selector */}
      <div className="flex gap-2 flex-wrap">
        {SHAPES.map(s => (
          <button key={s.key} onClick={() => setShape(s.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors
              ${shape === s.key
                ? 'bg-sky-500/20 text-sky-400 border-sky-500/50'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}>
            {s.label}
            <span className="ml-1 font-mono opacity-60">k={s.k.toFixed(2)}</span>
          </button>
        ))}
      </div>

      {/* Motion mode + FBD toggle */}
      <div className="flex gap-2 flex-wrap items-center">
        {(['rolling', 'sliding', 'slipping'] as MotionMode[]).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
              ${mode === m
                ? 'bg-purple-500/20 text-purple-400 border-purple-500/50'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}>
            {m === 'rolling' ? '🔄 Roll (no slip)' : m === 'sliding' ? '🏂 Slide (frictionless)' : '⚡ Slipping (with μ)'}
          </button>
        ))}
        <button onClick={() => setShowFBD(f => !f)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ml-auto
            ${showFBD ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
          📐 {showFBD ? 'Hide' : 'Show'} FBD
        </button>
      </div>

      {/* Slipping phase banner */}
      {mode === 'slipping' && (
        <div className={`rounded-lg p-2.5 text-xs font-medium border ${isSlipping
          ? 'bg-red-500/10 border-red-500/30 text-red-300'
          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'}`}>
          {isSlipping
            ? '⚡ Phase: Slipping — v_cm > Rω, kinetic friction acting'
            : curV > 0
              ? '🔄 Phase: Rolling — v_cm = Rω, static friction'
              : 'Adjust μ and angle, then press Play'}
        </div>
      )}

      {/* Main Canvas */}
      <div className="glass-panel rounded-xl overflow-hidden relative">
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto">
          <defs>
            <pattern id="rg2" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
            </pattern>
            <radialGradient id="dg" cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#1e3a5f"/>
            </radialGradient>
            <radialGradient id="sg" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#2e1065"/>
            </radialGradient>
            <filter id="glow2">
              <feGaussianBlur stdDeviation="2.5" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#rg2)"/>

          {/* Ground */}
          <line x1={0} y1={GROUND_Y} x2={SVG_W} y2={GROUND_Y} stroke="#334155" strokeWidth="1" strokeDasharray="4 3"/>

          {/* Ramp fill & surface */}
          <polygon points={`${RAMP_TOP_X},${RAMP_TOP_Y} ${RAMP_BOT_X},${RAMP_BOT_Y} ${RAMP_TOP_X},${RAMP_BOT_Y}`}
            fill="#1e293b" stroke="#475569" strokeWidth="2"/>
          <line x1={RAMP_TOP_X} y1={RAMP_TOP_Y} x2={RAMP_BOT_X} y2={RAMP_BOT_Y} stroke="#64748b" strokeWidth="2"/>

          {/* Tick marks */}
          {Array.from({ length: numTicks }, (_, i) => {
            const f = ((i + 1) * 60) / RAMP_LEN_PX;
            const tx = RAMP_TOP_X + f * (RAMP_BOT_X - RAMP_TOP_X);
            const ty = RAMP_TOP_Y + f * (RAMP_BOT_Y - RAMP_TOP_Y);
            return <line key={i} x1={tx + nY * 6} y1={ty - nX * 6} x2={tx - nY * 6} y2={ty + nX * 6}
              stroke="#475569" strokeWidth="1"/>;
          })}

          {/* Angle arc */}
          <path d={`M ${RAMP_BOT_X - 50} ${RAMP_BOT_Y} A 50 50 0 0 0 ${RAMP_BOT_X - 50 * Math.cos(theta)} ${RAMP_BOT_Y - 50 * Math.sin(theta)}`}
            fill="none" stroke="#f59e0b" strokeWidth="1.5"/>
          <text x={RAMP_BOT_X - 65} y={RAMP_BOT_Y - 10} fill="#f59e0b" fontSize="11" textAnchor="middle">{angle}°</text>

          {/* Height line */}
          <line x1={RAMP_TOP_X - 14} y1={RAMP_TOP_Y} x2={RAMP_TOP_X - 14} y2={RAMP_BOT_Y}
            stroke="#818cf8" strokeWidth="1" strokeDasharray="3 3"/>

          {/* Skid marks when slipping */}
          {isSlipping && (
            <line
              x1={cx - nX * DISK_R_PX} y1={cy - nY * DISK_R_PX}
              x2={cx - nX * DISK_R_PX - Math.cos(theta) * 50}
              y2={cy - nY * DISK_R_PX - Math.sin(theta) * 50}
              stroke="#ef4444" strokeWidth="3" strokeDasharray="5 4" opacity="0.5"/>
          )}

          {/* Disk body */}
          {shape === 'ring' ? (
            <g filter="url(#glow2)">
              <circle cx={cx} cy={cy} r={DISK_R_PX} fill="none" stroke="#38bdf8" strokeWidth={DISK_R_PX / 2.5}/>
              <circle cx={cx} cy={cy} r={DISK_R_PX} fill="none" stroke="#38bdf8" strokeWidth="2"/>
            </g>
          ) : (
            <g filter="url(#glow2)">
              <circle cx={cx} cy={cy} r={DISK_R_PX}
                fill={shape === 'sphere' || shape === 'hSphere' ? 'url(#sg)' : 'url(#dg)'}
                stroke={shape === 'sphere' || shape === 'hSphere' ? '#a78bfa' : '#38bdf8'}
                strokeWidth="2"/>
              {shape === 'hSphere' && (
                <circle cx={cx} cy={cy} r={DISK_R_PX * 0.5} fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.4"/>
              )}
            </g>
          )}

          {/* Spokes */}
          {shapeObj.spokes > 0 && Array.from({ length: shapeObj.spokes }, (_, i) => {
            const rad = ((rotDeg + (360 / shapeObj.spokes) * i) * Math.PI) / 180;
            return <line key={i} x1={cx} y1={cy}
              x2={cx + Math.cos(rad) * (DISK_R_PX - 3)}
              y2={cy + Math.sin(rad) * (DISK_R_PX - 3)}
              stroke={shape === 'sphere' || shape === 'hSphere' ? '#a78bfa' : '#38bdf8'}
              strokeWidth="1.5" opacity="0.65"/>;
          })}
          <circle cx={cx} cy={cy} r={3} fill={shape === 'sphere' || shape === 'hSphere' ? '#a78bfa' : '#38bdf8'}/>

          {/* FBD arrows */}
          {showFBD && (
            <g>
              {/* mg — downward */}
              <line x1={cx} y1={cy} x2={cx} y2={cy + 50} stroke="#ef4444" strokeWidth="2"/>
              <polygon points={`${cx},${cy + 56} ${cx - 4},${cy + 48} ${cx + 4},${cy + 48}`} fill="#ef4444"/>
              <text x={cx + 7} y={cy + 50} fill="#ef4444" fontSize="9">mg</text>

              {/* Normal — out of ramp */}
              {(() => {
                const nx2 = -nX, ny2 = -nY, s = 42;
                return <>
                  <line x1={cx} y1={cy} x2={cx + nx2 * s} y2={cy + ny2 * s} stroke="#22c55e" strokeWidth="2"/>
                  <polygon points={`${cx + nx2 * (s + 5)},${cy + ny2 * (s + 5)} ${cx + nx2 * s + ny2 * 4},${cy + ny2 * s - nx2 * 4} ${cx + nx2 * s - ny2 * 4},${cy + ny2 * s + nx2 * 4}`} fill="#22c55e"/>
                  <text x={cx + nx2 * (s + 14)} y={cy + ny2 * (s + 14)} fill="#22c55e" fontSize="9" textAnchor="middle">N</text>
                </>;
              })()}

              {/* Friction — up the ramp */}
              {frictionN > 0.01 && (() => {
                const fx = -(RAMP_BOT_X - RAMP_TOP_X) / RAMP_LEN_PX;
                const fy = -(RAMP_BOT_Y - RAMP_TOP_Y) / RAMP_LEN_PX;
                const s  = Math.min(frictionN * 5, 44);
                const bx = cx - nX * DISK_R_PX, by = cy - nY * DISK_R_PX;
                return <>
                  <line x1={bx} y1={by} x2={bx + fx * s} y2={by + fy * s} stroke="#f59e0b" strokeWidth="2"/>
                  <polygon points={`${bx + fx * (s + 5)},${by + fy * (s + 5)} ${bx + fx * s + fy * 4},${by + fy * s - fx * 4} ${bx + fx * s - fy * 4},${by + fy * s + fx * 4}`} fill="#f59e0b"/>
                  <text x={bx + fx * (s + 12)} y={by + fy * (s + 12)} fill="#f59e0b" fontSize="9" textAnchor="middle">f</text>
                </>;
              })()}
            </g>
          )}

          {/* Velocity arrow */}
          {curV > 0.05 && (
            <g>
              <line x1={cx} y1={cy - DISK_R_PX - 6}
                x2={cx + Math.min(curV * 8, 70) * Math.cos(theta)}
                y2={cy - DISK_R_PX - 6 + Math.min(curV * 8, 70) * Math.sin(theta)}
                stroke="#22c55e" strokeWidth="2"/>
              <text x={cx + 28 * Math.cos(theta)} y={cy - DISK_R_PX - 14} fill="#22c55e" fontSize="9" textAnchor="middle">v</text>
            </g>
          )}

          {/* ω arc */}
          {curO > 0.1 && (
            <g>
              <path d={`M ${cx + DISK_R_PX + 8} ${cy} A ${DISK_R_PX + 8} ${DISK_R_PX + 8} 0 0 1 ${cx} ${cy - DISK_R_PX - 8}`}
                fill="none" stroke="#a78bfa" strokeWidth="1.5"/>
              <circle cx={cx} cy={cy - DISK_R_PX - 8} r={2.5} fill="#a78bfa"/>
              <text x={cx + DISK_R_PX + 16} y={cy - 6} fill="#a78bfa" fontSize="9">ω</text>
            </g>
          )}

          <text x={SVG_W - 10} y={16} fill="#334155" fontSize="10" textAnchor="end">t = {curT.toFixed(2)} s</text>
          <text x={SVG_W - 10} y={30} fill="#475569" fontSize="9" textAnchor="end">s = {curD.toFixed(2)} m</text>
        </svg>

        <div className="absolute bottom-3 left-3 flex gap-2">
          <button onClick={() => setIsPlaying(p => !p)} disabled={finished}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors
              ${isPlaying ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'} disabled:opacity-40`}>
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button onClick={handleReset} className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm border border-slate-700 transition-colors">
            Reset
          </button>
        </div>
      </div>

      {/* v-t graph */}
      <div className="glass-panel rounded-xl p-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Velocity vs Time</h3>
        <svg viewBox={`0 0 ${GRAPH_W} ${GRAPH_H}`} className="w-full h-auto">
          <line x1={10} y1={10} x2={10} y2={GRAPH_H - 10} stroke="#334155" strokeWidth="1"/>
          <line x1={10} y1={GRAPH_H - 10} x2={GRAPH_W - 10} y2={GRAPH_H - 10} stroke="#334155" strokeWidth="1"/>
          <text x={6} y={GRAPH_H / 2} fill="#475569" fontSize="8" textAnchor="middle"
            transform={`rotate(-90, 6, ${GRAPH_H / 2})`}>v (m/s)</text>
          <text x={GRAPH_W / 2} y={GRAPH_H - 1} fill="#475569" fontSize="8" textAnchor="middle">t (s)</text>
          {trail.length > 1 && <polyline points={pts} fill="none" stroke="#38bdf8" strokeWidth="1.5"/>}
          {trail.length > 0 && (() => {
            const last = trail[trail.length - 1];
            const px = 10 + (last.t / maxT) * (GRAPH_W - 20);
            const py = (GRAPH_H - 10) - (last.v / maxVGr) * (GRAPH_H - 20);
            return <circle cx={px} cy={py} r={3.5} fill="#38bdf8"/>;
          })()}
        </svg>
      </div>

      {/* Energy bars */}
      <div className="glass-panel rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Energy Distribution</h3>
        <EnergyBar label="Translational KE (½mv²)" value={keT} max={totE || 1} color="bg-emerald-500" textColor="text-emerald-400"/>
        <EnergyBar label="Rotational KE (½Iω²)" value={keR} max={totE || 1} color="bg-purple-500" textColor="text-purple-400"/>
        <EnergyBar label="Potential Energy (mgh)" value={pe} max={totE || 1} color="bg-amber-500" textColor="text-amber-400"/>
        <p className="text-[10px] text-slate-600 text-center font-mono">
          KE_t + KE_r + PE = {(keT + keR + pe).toFixed(2)} J
          {Math.abs(keT + keR + pe - totE) < 1.5 ? ' ✓' : ''}
        </p>
      </div>

      {/* Parameters + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-panel rounded-xl p-4 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Parameters</h3>
          <NumberInput label="Mass" unit="kg" value={mass} onChange={v => { setMass(v); handleReset(); }}/>
          <NumberInput label="Radius" unit="m" value={radius} onChange={v => { setRadius(v); handleReset(); }}/>
          <NumberInput label="Incline Angle" unit="°" value={angle} onChange={v => { setAngle(Math.min(v, 80)); handleReset(); }}/>
          {mode === 'slipping' && (
            <NumberInput label="Friction Coeff (μ)" unit="" value={mu} onChange={v => { setMu(Math.min(v, 1)); handleReset(); }}/>
          )}
        </div>
        <div className="glass-panel rounded-xl p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Live Results</h3>
          <div className="grid grid-cols-2 gap-2">
            <Result label="Velocity (v)" value={`${curV.toFixed(3)} m/s`} color="text-emerald-400"/>
            <Result label="Angular Vel (ω)" value={`${curO.toFixed(3)} rad/s`} color="text-purple-400"/>
            <Result label="Acceleration (a)" value={`${dispA.toFixed(3)} m/s²`} color="text-red-400"/>
            <Result label="Angular Accel (α)" value={`${dispAl.toFixed(3)} rad/s²`} color="text-amber-400"/>
            <Result label="k = I/(mR²)" value={k.toFixed(4)} color="text-sky-400"/>
            <Result label="Friction (f)" value={`${frictionN.toFixed(2)} N`} color="text-yellow-400"/>
            <Result label="KE trans" value={`${keT.toFixed(2)} J`} color="text-emerald-400"/>
            <Result label="KE rot" value={`${keR.toFixed(2)} J`} color="text-purple-400"/>
          </div>
        </div>
      </div>

      {/* Key insight */}
      <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-4">
        <p className="text-xs text-sky-300 leading-relaxed">
          <span className="font-bold">Key insight: </span>
          Smaller <span className="font-mono">k = I/(mR²)</span> → faster rolling (solid sphere k=0.40 &gt; disk k=0.50 &gt; ring k=1.0).
          In <b>slipping mode</b>, kinetic friction torques the disk until <span className="font-mono">v = Rω</span> — then rolling begins.
          In <b>slide mode</b> (frictionless), <span className="font-mono">ω = 0</span> always; all energy is translational.
        </p>
      </div>
    </div>
  );
}

function NumberInput({ label, unit, value, onChange }: { label: string; unit: string; value: number; onChange: (v: number) => void }) {
  const [display, setDisplay] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value; setDisplay(raw);
    const p = parseFloat(raw); if (!isNaN(p) && p > 0) onChange(p);
  };
  const handleBlur = () => { const p = parseFloat(display); if (isNaN(p) || p <= 0) setDisplay(''); };
  return (
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</label>
      <div className="flex items-center bg-slate-800 rounded border border-slate-700 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500/50 transition-colors">
        <input type="number" value={display} placeholder={String(value)} onChange={handleChange} onBlur={handleBlur}
          className="w-full bg-transparent px-3 py-2 text-sm font-mono text-slate-100 outline-none placeholder:text-slate-500"/>
        {unit && <span className="text-xs text-slate-500 pr-3 select-none font-mono shrink-0">{unit}</span>}
      </div>
    </div>
  );
}

function EnergyBar({ label, value, max, color, textColor }: { label: string; value: number; max: number; color: string; textColor: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className={`font-mono ${textColor}`}>{value.toFixed(2)} J</span>
      </div>
      <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-75 ${color}`} style={{ width: `${Math.min((value / max) * 100, 100)}%` }}/>
      </div>
    </div>
  );
}

function Result({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-slate-800 border border-slate-700/50 rounded-lg p-2.5">
      <div className="text-[10px] text-slate-500 font-mono mb-1">{label}</div>
      <div className={`text-sm font-mono font-bold ${color}`}>{value}</div>
    </div>
  );
}
