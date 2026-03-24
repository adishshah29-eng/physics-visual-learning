import { clampPhysics, PHYSICS_LIMITS } from '@/lib/physicsValidation';
import React, { useState, useEffect, useRef } from 'react';

const G_SIM = 4e6;
const AU_PX = 100;
const CX = 350, CY = 175;
const STAR_R = 15, PLANET_R = 7, ESCAPE_R = 330;
const STARS = [[45,20],[120,55],[200,15],[280,40],[420,70],[500,30],[580,60],[640,20],[30,100],[160,110],[450,120],[620,130],[20,200],[180,190],[460,200],[650,180],[50,280],[220,270],[410,275],[600,265]];
const SECTOR_COLORS = ['#f59e0b','#22c55e','#a78bfa','#f43f5e','#38bdf8','#fb923c','#84cc16','#e879f9'];

const PRESETS = [
  { label: '🔵 Circular',    starMass: 1.0, rOrbit: 1.5, vFact: 1.0   },
  { label: '☄️ Comet',       starMass: 1.0, rOrbit: 1.5, vFact: 0.45  },
  { label: '🚀 Near Escape', starMass: 1.0, rOrbit: 1.5, vFact: 1.4   },
  { label: '🪐 Wide Orbit',  starMass: 1.0, rOrbit: 2.8, vFact: 1.0   },
];

export default function GravitationPlayground() {
  const [starMass, setStarMass] = useState(1.0);
  const [rOrbit,   setROrbit]   = useState(1.5);
  const [vFact,    setVFact]    = useState(1.0);
  const [showKepler, setShowKepler] = useState(false);
  const [isPlaying, setIsPlaying]   = useState(false);
  const [, forceRender] = useState(0);

  // Physics state refs
  const pxRef = useRef(0), pyRef = useRef(0);
  const vxRef = useRef(0), vyRef = useRef(0);
  const timeRef    = useRef(0);
  const trailRef   = useRef<{x:number;y:number}[]>([]);
  const sectorsRef = useRef<[number,number,number,number][]>([]);
  const lastSectPosRef  = useRef<{x:number;y:number}|null>(null);
  const lastSectTimeRef = useRef(0);
  const lastYRef        = useRef(0);
  const lastCrossRef    = useRef(0);
  const measuredTRef    = useRef(0);
  const statusRef  = useRef<'running'|'escaped'|'crashed'>('running');
  const reqRef     = useRef<number|null>(null);
  const prevTsRef  = useRef<number|null>(null);
  const gmRef      = useRef(G_SIM);
  const r0Ref      = useRef(150);

  // Keep refs current every render
  gmRef.current = G_SIM * starMass;
  r0Ref.current = rOrbit * AU_PX;

  const vCirc0 = Math.sqrt(gmRef.current / r0Ref.current);

  const handleReset = () => {
    setIsPlaying(false);
    const r0 = rOrbit * AU_PX;
    const vc = Math.sqrt(G_SIM * starMass / r0);
    pxRef.current = r0; pyRef.current = 0;
    vxRef.current = 0;  vyRef.current = -vFact * vc;
    timeRef.current = 0;
    trailRef.current = [];
    sectorsRef.current = [];
    lastSectPosRef.current = null;
    lastSectTimeRef.current = 0;
    lastYRef.current = 0;
    lastCrossRef.current = 0;
    measuredTRef.current = 0;
    statusRef.current = 'running';
    prevTsRef.current = null;
    forceRender(p => p + 1);
  };

  useEffect(() => { handleReset(); }, [starMass, rOrbit, vFact]);

  useEffect(() => {
    if (!isPlaying) {
      prevTsRef.current = null;
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
      return;
    }
    const animate = (ts: number) => {
      if (prevTsRef.current !== null) {
        const realDt = Math.min((ts - prevTsRef.current) / 1000, 0.05);
        const dt = realDt / 8;
        let done = false;

        for (let s = 0; s < 8; s++) {
          const px = pxRef.current, py = pyRef.current;
          const r  = Math.sqrt(px * px + py * py);
          if (r < STAR_R + 3) { statusRef.current = 'crashed'; done = true; break; }
          if (r > ESCAPE_R)   { statusRef.current = 'escaped'; done = true; break; }
          const r3 = r * r * r, gm = gmRef.current;
          const ax  = -gm * px / r3,  ay  = -gm * py / r3;
          pxRef.current += vxRef.current * dt + 0.5 * ax * dt * dt;
          pyRef.current += vyRef.current * dt + 0.5 * ay * dt * dt;
          const r2  = Math.sqrt(pxRef.current ** 2 + pyRef.current ** 2);
          const r23 = r2 * r2 * r2;
          const ax2 = -gm * pxRef.current / r23, ay2 = -gm * pyRef.current / r23;
          vxRef.current += 0.5 * (ax + ax2) * dt;
          vyRef.current += 0.5 * (ay + ay2) * dt;
        }

        // ── Subtask 5: Period measurement ──
        const prevY = lastYRef.current, currY = pyRef.current;
        if (prevY < 0 && currY >= 0 && pxRef.current > 0) {
          const t = timeRef.current + realDt;
          if (lastCrossRef.current > 0) measuredTRef.current = t - lastCrossRef.current;
          lastCrossRef.current = t;
        }
        lastYRef.current = pyRef.current;

        timeRef.current += realDt;

        // ── Subtask 2: Kepler sector recording (every 0.3 s) ──
        if (timeRef.current - lastSectTimeRef.current >= 0.3) {
          const np = { x: pxRef.current, y: pyRef.current };
          if (lastSectPosRef.current) {
            const lp = lastSectPosRef.current;
            sectorsRef.current.push([lp.x, lp.y, np.x, np.y]);
            if (sectorsRef.current.length > 8) sectorsRef.current.shift();
          }
          lastSectPosRef.current = np;
          lastSectTimeRef.current = timeRef.current;
        }

        const trail = trailRef.current;
        trail.push({ x: pxRef.current, y: pyRef.current });
        if (trail.length > 500) trail.shift();

        forceRender(p => p + 1);
        if (done) { setIsPlaying(false); return; }
      }
      prevTsRef.current = ts;
      reqRef.current = requestAnimationFrame(animate);
    };
    reqRef.current = requestAnimationFrame(animate);
    return () => { if (reqRef.current) cancelAnimationFrame(reqRef.current); };
  }, [isPlaying]);

  // ── Current physics ──
  const px = pxRef.current, py = pyRef.current;
  const vx = vxRef.current, vy = vyRef.current;
  const r   = Math.sqrt(px * px + py * py) || 1;
  const v   = Math.sqrt(vx * vx + vy * vy);
  const gm  = gmRef.current;
  const KE  = 0.5 * v * v;
  const PE  = -gm / r;
  const E   = KE + PE;
  const L   = Math.abs(px * vy - py * vx);    // spec. angular momentum
  const vEsc  = Math.sqrt(2 * gm / r);
  const vCC   = Math.sqrt(gm / r);

  // ── Subtask 3: Orbital elements ──
  const aSM  = E < -0.1 ? -gm / (2 * E) : Infinity;
  const ecc  = isFinite(aSM) ? Math.sqrt(Math.max(0, 1 + 2 * E * L * L / (gm * gm))) : Infinity;
  const rPeri = isFinite(aSM) ? aSM * (1 - ecc) : NaN;
  const rApo  = isFinite(aSM) ? aSM * (1 + ecc) : NaN;
  const T_theo = isFinite(aSM) ? 2 * Math.PI * Math.sqrt(aSM ** 3 / gm) : Infinity;

  // ── Subtask 4: Vis-viva ──
  const vVV = isFinite(aSM)
    ? Math.sqrt(Math.max(0, gm * (2 / r - 1 / aSM)))
    : Math.sqrt(2 * gm / r);

  const PE0 = gm / r0Ref.current;
  const finished = statusRef.current !== 'running';
  const orbitType =
    statusRef.current === 'escaped' ? 'Escaped 🚀' :
    statusRef.current === 'crashed' ? 'Crashed 💥' :
    E > 0 ? 'Hyperbolic' :
    isFinite(ecc) && ecc < 0.03 ? 'Circular' : 'Elliptical';

  const sx = CX + px, sy = CY + py;
  const trailPath = trailRef.current.length > 1
    ? trailRef.current.map((p, i) => `${i === 0 ? 'M' : 'L'}${CX + p.x} ${CY + p.y}`).join(' ')
    : '';
  const fMag = Math.min(38, (r0Ref.current ** 2 / (r * r)) * 18);
  const fvx  = -px / r * fMag, fvy = -py / r * fMag;
  const vS   = Math.min(v > 0 ? 55 / v : 0, 9);

  // Sector areas for display
  const sectorAreas = sectorsRef.current.map(([x1, y1, x2, y2]) =>
    Math.abs(x1 * y2 - x2 * y1) / 2
  );
  const avgArea = sectorAreas.length
    ? sectorAreas.reduce((a, b) => a + b, 0) / sectorAreas.length
    : 0;

  return (
    <div className="flex flex-col bg-transparent text-slate-100 p-4 space-y-4 overflow-y-auto min-h-full">

      <div>
        <h2 className="text-xl font-bold text-sky-400">Gravitation — Orbital Mechanics</h2>
        <p className="text-xs text-slate-400 mt-0.5">Kepler's laws, orbital elements, vis-viva equation and escape velocity.</p>
      </div>

      {/* Subtask 1: Preset buttons */}
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Preset:</span>
        {PRESETS.map(p => (
          <button key={p.label}
            onClick={() => { setStarMass(p.starMass); setROrbit(p.rOrbit); setVFact(p.vFact); }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors">
            {p.label}
          </button>
        ))}
      </div>

      {/* Status banner with Kepler toggle */}
      <div className={`rounded-lg p-2.5 text-xs font-semibold border flex items-center justify-between
        ${orbitType.includes('Circular') ? 'bg-sky-500/10 border-sky-500/30 text-sky-300' :
          orbitType.includes('Ellip') ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' :
          'bg-red-500/10 border-red-500/30 text-red-300'}`}>
        <span>
          {orbitType} &nbsp;|&nbsp; e = {isFinite(ecc) ? ecc.toFixed(3) : '∞'}
          &nbsp;|&nbsp; E = {E.toFixed(0)} {E < 0 ? '(Bound ✓)' : '(Unbound!)'}
        </span>
        <button onClick={() => setShowKepler(k => !k)}
          className={`px-2 py-1 rounded text-xs border ml-3 transition-colors
            ${showKepler
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              : 'bg-slate-800/60 text-slate-400 border-slate-600 hover:bg-slate-700'}`}>
          🔺 Kepler 2nd
        </button>
      </div>

      {/* Main SVG Canvas */}
      <div className="glass-panel rounded-xl overflow-hidden relative">
        <svg viewBox="0 0 700 350" className="w-full h-auto">
          <defs>
            <radialGradient id="gStar" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#fde68a"/><stop offset="100%" stopColor="#b45309"/>
            </radialGradient>
            <radialGradient id="gPlan" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#1e3a5f"/>
            </radialGradient>
            <filter id="fStar"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <filter id="fPlan"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <rect width="700" height="350" fill="#030d1a"/>
          {STARS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="0.8" fill="white" opacity="0.5"/>)}
          {[80,140,200,270].map(rr => (
            <circle key={rr} cx={CX} cy={CY} r={rr} fill="none" stroke="#f59e0b" strokeWidth="0.5"
              opacity={0.04 + 0.04 * (280 - rr) / 280}/>
          ))}
          {/* Reference orbit */}
          <circle cx={CX} cy={CY} r={r0Ref.current} fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="5 4"/>
          {/* Trail */}
          {trailPath && <path d={trailPath} fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.5"/>}
          {/* Subtask 2: Kepler sector triangles */}
          {showKepler && sectorsRef.current.map(([x1, y1, x2, y2], i) => (
            <polygon key={i}
              points={`${CX + x1},${CY + y1} ${CX + x2},${CY + y2} ${CX},${CY}`}
              fill={SECTOR_COLORS[i % SECTOR_COLORS.length]}
              opacity="0.22"
              stroke={SECTOR_COLORS[i % SECTOR_COLORS.length]}
              strokeWidth="0.5" strokeOpacity="0.5"/>
          ))}
          {/* r-line */}
          <line x1={CX} y1={CY} x2={sx} y2={sy} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3"/>
          {/* Star */}
          <circle cx={CX} cy={CY} r={STAR_R} fill="url(#gStar)" filter="url(#fStar)"/>
          {/* Planet */}
          <circle cx={sx} cy={sy} r={PLANET_R} fill="url(#gPlan)" stroke="#38bdf8" strokeWidth="1.5" filter="url(#fPlan)"/>
          {/* Gravity force arrow */}
          {r > 0.1 && (
            <g>
              <line x1={sx} y1={sy} x2={sx + fvx} y2={sy + fvy} stroke="#f59e0b" strokeWidth="1.8"/>
              <polygon
                points={`${sx+fvx},${sy+fvy} ${sx+fvx-fvy*0.25-fvx*0.25},${sy+fvy+fvx*0.25-fvy*0.25} ${sx+fvx+fvy*0.25-fvx*0.25},${sy+fvy-fvx*0.25-fvy*0.25}`}
                fill="#f59e0b"/>
              <text x={sx + fvx + (fvx > 0 ? 5 : -14)} y={sy + fvy - 3} fill="#f59e0b" fontSize="9">F</text>
            </g>
          )}
          {/* Velocity arrow */}
          {v > 0.5 && (
            <g>
              <line x1={sx} y1={sy} x2={sx + vx * vS} y2={sy + vy * vS} stroke="#22c55e" strokeWidth="2"/>
              <text x={sx + vx * vS + 4} y={sy + vy * vS - 4} fill="#22c55e" fontSize="9">v</text>
            </g>
          )}
          <text x={sx + 10} y={sy - 10} fill="#475569" fontSize="9">{(r / AU_PX).toFixed(2)} AU</text>
          <text x="690" y="16" fill="#334155" fontSize="10" textAnchor="end">t = {timeRef.current.toFixed(2)} s</text>
        </svg>

        <div className="absolute bottom-3 left-3 flex gap-2">
          <button onClick={() => setIsPlaying(p => !p)} disabled={finished}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors disabled:opacity-40
              ${isPlaying ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'}`}>
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button onClick={handleReset}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm border border-slate-700 transition-colors">
            Reset
          </button>
        </div>
      </div>

      {/* Subtask 2: Kepler sector area display */}
      {showKepler && sectorsRef.current.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Kepler's 2nd Law — Equal Areas in Equal Time (Δt = 0.3 s each)
          </h3>
          <div className="flex gap-3 flex-wrap">
            {sectorAreas.map((area, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ background: SECTOR_COLORS[i % SECTOR_COLORS.length] }}/>
                <span className="text-[10px] font-mono text-slate-300">{area.toFixed(0)}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-amber-300/70">
            Avg area = {avgArea.toFixed(0)} units² &nbsp;|&nbsp; dA/dt = L/2 = {(L / 2).toFixed(0)} = const
          </p>
        </div>
      )}

      {/* Energy bars */}
      <div className="glass-panel rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Energy (specific — per unit planet mass)</h3>
        <EnergyBar label="Kinetic Energy ½v²" value={Math.abs(KE)} max={PE0 || 1} color="bg-emerald-500" textColor="text-emerald-400"/>
        <EnergyBar label="|Potential Energy| GM/r" value={Math.abs(PE)} max={PE0 || 1} color="bg-amber-500" textColor="text-amber-400"/>
        <p className="text-[10px] text-slate-500 text-center font-mono">
          {isFinite(aSM)
            ? `KE/|PE| = ${Math.abs(KE / PE).toFixed(3)} (circular orbit → 0.500)`
            : `Total E = ${E.toFixed(0)}`}
        </p>
      </div>

      {/* Parameters + Results grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-panel rounded-xl p-4 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Parameters</h3>
          <NumberInput label="Star Mass" unit="M☉" value={starMass} onChange={val => setStarMass(val)}/>
          <NumberInput label="Orbital Distance" unit="AU" value={rOrbit} onChange={val => setROrbit(Math.min(val, 3.0))}/>
          <NumberInput label="Launch Speed (× v_circ)" unit="×" value={vFact} onChange={val => setVFact(Math.min(val, 1.8))}/>
          <p className="text-[10px] text-slate-500 font-mono">
            v_circ = {vCirc0.toFixed(1)} &nbsp;|&nbsp; v_esc = {(vCirc0 * Math.SQRT2).toFixed(1)} (×=1.414)
          </p>
        </div>

        {/* Subtasks 3, 4, 5 results */}
        <div className="glass-panel rounded-xl p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Live Results</h3>
          <div className="grid grid-cols-2 gap-2">
            <Result label="Speed v" value={v.toFixed(1)} color="text-emerald-400"/>
            <Result label="Vis-viva v ✓" value={`${vVV.toFixed(1)}`} color="text-teal-400"/>
            <Result label="v_escape" value={vEsc.toFixed(1)} color="text-red-400"/>
            <Result label="v_circular" value={vCC.toFixed(1)} color="text-sky-400"/>
            <Result label="Semi-major a" value={isFinite(aSM) ? `${(aSM/AU_PX).toFixed(2)} AU` : '∞'} color="text-sky-400"/>
            <Result label="Eccentricity e" value={isFinite(ecc) ? ecc.toFixed(3) : '∞'} color="text-amber-400"/>
            <Result label="r periapsis" value={isFinite(rPeri) ? `${(rPeri/AU_PX).toFixed(2)} AU` : '—'} color="text-emerald-400"/>
            <Result label="r apoapsis" value={isFinite(rApo) && rApo < 1e6 ? `${(rApo/AU_PX).toFixed(2)} AU` : '—'} color="text-red-400"/>
            <Result label="Theory T" value={isFinite(T_theo) ? `${T_theo.toFixed(2)} s` : '∞'} color="text-sky-400"/>
            <Result label="Measured T" value={measuredTRef.current > 0 ? `${measuredTRef.current.toFixed(2)} s` : '—'} color="text-purple-400"/>
            <Result label="Ang. Momentum L" value={L.toFixed(0)} color="text-teal-400"/>
            <Result label="Distance r" value={`${(r/AU_PX).toFixed(3)} AU`} color="text-purple-400"/>
          </div>
        </div>
      </div>

      <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-4">
        <p className="text-xs text-sky-300 leading-relaxed">
          <span className="font-bold">Vis-viva: </span>
          v² = GM(2/r − 1/a) — "Speed v" and "Vis-viva v" must always match ✓.
          <span className="font-bold"> Kepler's 3rd: </span>
          T²/a³ = const — check Theory T for Circular vs Wide Orbit.
          <span className="font-bold"> Toggle "Kepler 2nd" </span>
          to see equal-area triangles: all sectors have the same area because L is conserved.
        </p>
      </div>
    </div>
  );
}

function NumberInput({ label, unit, value, onChange }: { label: string; unit: string; value: number; onChange: (v: number) => void }) {
  const [display, setDisplay] = useState('');
  const onChange_ = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value; setDisplay(raw);
    const p = parseFloat(raw);
    let limits = PHYSICS_LIMITS.velocity || { min: -1e6, max: 1e6, fallback: 0, label };
    const l = label.toLowerCase();
    if (l.includes('mass')) limits = PHYSICS_LIMITS.mass;
    else if (l.includes('radius') || l.includes('amplitude') || l.includes('length') || l.includes('height')) limits = PHYSICS_LIMITS.radius;
    else if (l.includes('speed') || l.includes('velocity')) limits = PHYSICS_LIMITS.velocity;
    else if (l.includes('angle')) limits = PHYSICS_LIMITS.angle;
    else if (l.includes('gravity')) limits = PHYSICS_LIMITS.gravity;
    else if (l.includes('friction') || l.includes('mu') || l.includes('coeff')) limits = PHYSICS_LIMITS.mu || { min: 0, max: 1, fallback: 0.3, label };
    else if (l.includes('spring') || l.includes('constant')) limits = PHYSICS_LIMITS.springK || { min: 0.1, max: 1000, fallback: 10, label };
    else if (l.includes('force')) limits = PHYSICS_LIMITS.force || { min: -1000, max: 1000, fallback: 0, label };
    else if (l.includes('pressure')) limits = { min: 0.1, max: 1000000, fallback: 101325, label };
    else if (l.includes('volume')) limits = { min: 0.001, max: 1000, fallback: 1, label };
    else if (l.includes('temperature')) limits = PHYSICS_LIMITS.temperature || { min: 1, max: 10000, fallback: 300, label };
    else if (l.includes('freq')) limits = { min: 0.1, max: 20000, fallback: 440, label };
    if (!isNaN(p) && limits) onChange(clampPhysics(p, limits));
  };
  const onBlur = () => { const p = parseFloat(display); if (isNaN(p) || p <= 0) setDisplay(''); };
  return (
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</label>
      <div className="flex items-center bg-slate-800 rounded border border-slate-700 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500/50 transition-colors">
        <input type="number" value={display} placeholder={String(value)} onChange={onChange_} onBlur={onBlur}
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
        <span className={`font-mono ${textColor}`}>{value.toFixed(0)}</span>
      </div>
      <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-75 ${color}`}
          style={{ width: `${Math.min((value / max) * 100, 100)}%` }}/>
      </div>
    </div>
  );
}

function Result({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="bg-slate-800 border border-slate-700/50 rounded-lg p-2.5">
      <div className="text-[10px] text-slate-500 font-mono mb-1">{label}</div>
      <div className={`text-sm font-mono font-bold ${color}`}>{value}</div>
    </div>
  );
}
