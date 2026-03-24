import { clampPhysics, PHYSICS_LIMITS } from '@/lib/physicsValidation';
import React, { useState, useEffect, useRef, useMemo } from 'react';

const R_GAS = 8.314;
type Process = 'isothermal' | 'adiabatic' | 'isobaric' | 'isochoric';
type ViewMode = 'single' | 'compare' | 'carnot';

const PROC_META: Record<Process, { label: string; color: string; short: string }> = {
  isothermal: { label: 'Isothermal (T=const)', color: '#38bdf8', short: 'Iso-T' },
  adiabatic:  { label: 'Adiabatic (Q=0)',      color: '#f59e0b', short: 'Adia' },
  isobaric:   { label: 'Isobaric (P=const)',   color: '#22c55e', short: 'Iso-P' },
  isochoric:  { label: 'Isochoric (V=const)',  color: '#a78bfa', short: 'Iso-V' },
};
const ALL_PROC: Process[] = ['isothermal', 'adiabatic', 'isobaric', 'isochoric'];

// ── Physics helpers ──
function calcState(proc: Process, t: number, n: number, T1: number, V1_m3: number, V2_m3: number, gamma: number) {
  const Cv = R_GAS / (gamma - 1), Cp = gamma * Cv;
  let V: number, P: number, T: number, W: number, Q: number, dU: number, dS: number;
  if (proc === 'isothermal') {
    V = V1_m3 + t * (V2_m3 - V1_m3); T = T1;
    P = n * R_GAS * T / V;
    W = n * R_GAS * T1 * Math.log(V / V1_m3); dU = 0; Q = W;
    dS = Q / T1;
  } else if (proc === 'adiabatic') {
    V = V1_m3 + t * (V2_m3 - V1_m3);
    T = T1 * Math.pow(V1_m3 / V, gamma - 1);
    P = n * R_GAS * T / V;
    dU = n * Cv * (T - T1); W = -dU; Q = 0; dS = 0;
  } else if (proc === 'isobaric') {
    V = V1_m3 + t * (V2_m3 - V1_m3);
    P = n * R_GAS * T1 / V1_m3;
    T = P * V / (n * R_GAS);
    W = P * (V - V1_m3); dU = n * Cv * (T - T1); Q = W + dU;
    dS = n * Cp * Math.log(T / T1);
  } else {
    V = V1_m3; T = T1 + t * T1 * 2;
    P = n * R_GAS * T / V;
    W = 0; dU = n * Cv * (T - T1); Q = dU;
    dS = n * Cv * Math.log(T / T1);
  }
  return { V, P, T, W, Q, dU, dS, V_L: V * 1e3, P_atm: P / 1e5 };
}

function pvCurve(proc: Process, n: number, T1: number, V1_m3: number, V2_m3: number, gamma: number, steps = 80) {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const s = calcState(proc, i / steps, n, T1, V1_m3, V2_m3, gamma);
    return { v: s.V_L, p: s.P_atm };
  });
}

export default function ThermodynamicsPlayground() {
  const [n, setN]           = useState(1);
  const [T1, setT1]         = useState(300);
  const [V1, setV1]         = useState(10);
  const [gamma, setGamma]   = useState(1.4);
  const [process, setProcess] = useState<Process>('isothermal');
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [carnotTH, setCarnotTH]   = useState(600);
  const [carnotTC, setCarnotTC]   = useState(300);
  const reqRef    = useRef<number | null>(null);
  const prevTsRef = useRef<number | null>(null);
  const particlesRef = useRef(Array.from({ length: 20 }, () => ({
    x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
  })));

  const V1_m3 = V1 * 1e-3, V2_m3 = V1 * 3 * 1e-3;

  useEffect(() => {
    if (!isPlaying) { prevTsRef.current = null; if (reqRef.current) cancelAnimationFrame(reqRef.current); return; }
    const animate = (ts: number) => {
      if (prevTsRef.current !== null) {
        const dt = Math.min((ts - prevTsRef.current) / 1000, 0.05);
        setProgress(p => { const next = p + dt * 0.35; if (next >= 1) { setIsPlaying(false); return 1; } return next; });
      }
      prevTsRef.current = ts;
      reqRef.current = requestAnimationFrame(animate);
    };
    reqRef.current = requestAnimationFrame(animate);
    return () => { if (reqRef.current) cancelAnimationFrame(reqRef.current); };
  }, [isPlaying]);

  const handleReset = () => { setIsPlaying(false); setProgress(0); prevTsRef.current = null; };

  // Current state
  const cur = calcState(process, progress, n, T1, V1_m3, V2_m3, gamma);

  // Comparison: final state for all processes
  const finals = useMemo(() => {
    const out: Record<Process, ReturnType<typeof calcState>> = {} as any;
    for (const p of ALL_PROC) out[p] = calcState(p, 1, n, T1, V1_m3, V2_m3, gamma);
    return out;
  }, [n, T1, V1, gamma]);

  // PV curves
  const curves = useMemo(() => {
    const out: Record<string, { v: number; p: number }[]> = {};
    if (viewMode === 'single') {
      out[process] = pvCurve(process, n, T1, V1_m3, V2_m3, gamma);
    } else if (viewMode === 'compare') {
      for (const p of ALL_PROC) out[p] = pvCurve(p, n, T1, V1_m3, V2_m3, gamma);
    } else {
      // Carnot: iso-T_H expand → adia expand → iso-T_C compress → adia compress
      const P1c = n * R_GAS * carnotTH / V1_m3;
      const V2c_m3 = V2_m3;
      const P2c = P1c * V1_m3 / V2c_m3;
      const V3c_m3 = V2c_m3 * Math.pow(carnotTH / carnotTC, 1 / (gamma - 1));
      const V4c_m3 = V1_m3 * Math.pow(carnotTH / carnotTC, 1 / (gamma - 1));
      const segs = [
        { label: 'Iso-T_H', pts: Array.from({ length: 30 }, (_, i) => { const v = V1_m3 + (i / 29) * (V2c_m3 - V1_m3); return { v: v * 1e3, p: n * R_GAS * carnotTH / v / 1e5 }; }) },
        { label: 'Adiabatic↓', pts: Array.from({ length: 30 }, (_, i) => { const v = V2c_m3 + (i / 29) * (V3c_m3 - V2c_m3); const t = carnotTH * Math.pow(V2c_m3 / v, gamma - 1); return { v: v * 1e3, p: n * R_GAS * t / v / 1e5 }; }) },
        { label: 'Iso-T_C', pts: Array.from({ length: 30 }, (_, i) => { const v = V3c_m3 + (i / 29) * (V4c_m3 - V3c_m3); return { v: v * 1e3, p: n * R_GAS * carnotTC / v / 1e5 }; }) },
        { label: 'Adiabatic↑', pts: Array.from({ length: 30 }, (_, i) => { const v = V4c_m3 + (i / 29) * (V1_m3 - V4c_m3); const t = carnotTC * Math.pow(V4c_m3 / v, gamma - 1); return { v: v * 1e3, p: n * R_GAS * t / v / 1e5 }; }) },
      ];
      const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#a78bfa'];
      segs.forEach((s, i) => { out[`carnot_${i}`] = s.pts; (out as any)[`carnot_${i}_color`] = colors[i]; });
    }
    return out;
  }, [viewMode, process, n, T1, V1, gamma, carnotTH, carnotTC]);

  // Chart bounds
  const allPts = Object.values(curves).filter(Array.isArray).flat() as { v: number; p: number }[];
  const vMin = Math.min(...allPts.map(p => p.v)) * 0.8 || 1;
  const vMax = Math.max(...allPts.map(p => p.v)) * 1.15 || 40;
  const pMin = Math.min(...allPts.map(p => p.p)) * 0.7 || 0.1;
  const pMax = Math.max(...allPts.map(p => p.p)) * 1.15 || 10;

  const CX = 60, CY = 20, CW = 440, CH = 220;
  const sx = (v: number) => CX + ((v - vMin) / (vMax - vMin)) * CW;
  const sp = (p: number) => CY + CH - ((p - pMin) / (pMax - pMin)) * CH;

  const toPath = (pts: { v: number; p: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(p.v).toFixed(1)} ${sp(p.p).toFixed(1)}`).join(' ');

  // Piston
  const PX = 540, PY = 50, PW = 50, PH_MAX = 200;
  const pistonFill = process === 'isochoric'
    ? PH_MAX * 0.5
    : PH_MAX * 0.25 + ((cur.V_L - vMin) / (vMax - vMin)) * PH_MAX * 0.55;
  const tempNorm = Math.min(1, Math.max(0, (cur.T - 200) / 800));

  // Particles (subtask 3)
  const particles = particlesRef.current;
  const speed = 0.5 + tempNorm * 2.5;
  particles.forEach(p => {
    p.x += p.vx * speed * 0.003;
    p.y += p.vy * speed * 0.003;
    if (p.x < 0 || p.x > 1) { p.vx *= -1; p.x = Math.max(0, Math.min(1, p.x)); }
    if (p.y < 0 || p.y > 1) { p.vy *= -1; p.y = Math.max(0, Math.min(1, p.y)); }
  });

  const carnotEta = viewMode === 'carnot' ? (1 - carnotTC / carnotTH) : 0;
  const finishedAnim = progress >= 1;

  // Work area for single mode
  const workArea = (() => {
    if (viewMode !== 'single' || process === 'isochoric') return '';
    const c = curves[process]; if (!c) return '';
    const idx = Math.floor(progress * 80);
    const pts = c.slice(0, idx + 1); if (pts.length < 2) return '';
    let d = toPath(pts);
    d += ` L${sx(pts[pts.length - 1].v).toFixed(1)} ${sp(pMin).toFixed(1)}`;
    d += ` L${sx(pts[0].v).toFixed(1)} ${sp(pMin).toFixed(1)} Z`;
    return d;
  })();

  return (
    <div className="flex flex-col bg-transparent text-slate-100 p-4 space-y-4 overflow-y-auto min-h-full">

      <div>
        <h2 className="text-xl font-bold text-sky-400">Thermodynamics — PV Processes</h2>
        <p className="text-xs text-slate-400 mt-0.5">Isothermal, adiabatic, isobaric, isochoric — plus Carnot cycle and comparison mode.</p>
      </div>

      {/* View mode selector */}
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Mode:</span>
        {([['single', '📊 Single'], ['compare', '🔀 Compare All'], ['carnot', '♻️ Carnot Cycle']] as [ViewMode, string][]).map(([k, l]) => (
          <button key={k} onClick={() => { setViewMode(k); handleReset(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
              ${viewMode === k ? 'bg-sky-500/20 text-sky-400 border-sky-500/50' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Process selector (single mode) */}
      {viewMode === 'single' && (
        <div className="flex gap-2 flex-wrap">
          {ALL_PROC.map(p => (
            <button key={p} onClick={() => { setProcess(p); handleReset(); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors
                ${process === p ? 'text-white' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}
              style={process === p ? { background: PROC_META[p].color + '22', borderColor: PROC_META[p].color + '80', color: PROC_META[p].color } : {}}>
              {PROC_META[p].label}
            </button>
          ))}
        </div>
      )}

      {/* Carnot temperatures */}
      {viewMode === 'carnot' && (
        <div className="flex gap-4 flex-wrap glass-panel rounded-xl p-3">
          <div className="flex-1 min-w-[120px]">
            <NumberInput label="Hot Reservoir T_H" unit="K" value={carnotTH} onChange={v => { setCarnotTH(v); handleReset(); }} />
          </div>
          <div className="flex-1 min-w-[120px]">
            <NumberInput label="Cold Reservoir T_C" unit="K" value={carnotTC} onChange={v => { setCarnotTC(Math.min(v, carnotTH - 1)); handleReset(); }} />
          </div>
          <div className="flex items-end">
            <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-lg px-3 py-2 text-sm font-mono text-emerald-400">
              η = {(carnotEta * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      )}

      {/* Main PV + Piston */}
      <div className="glass-panel rounded-xl overflow-hidden relative">
        <svg viewBox="0 0 620 280" className="w-full h-auto">
          <defs>
            <pattern id="thgrid2" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="620" height="280" fill="url(#thgrid2)" />

          {/* Axes */}
          <line x1={CX} y1={CY} x2={CX} y2={CY + CH} stroke="#475569" strokeWidth="1.5" />
          <line x1={CX} y1={CY + CH} x2={CX + CW} y2={CY + CH} stroke="#475569" strokeWidth="1.5" />
          <text x={CX - 8} y={CY + CH / 2} fill="#64748b" fontSize="11" textAnchor="middle"
            transform={`rotate(-90, ${CX - 8}, ${CY + CH / 2})`}>P (atm)</text>
          <text x={CX + CW / 2} y={CY + CH + 18} fill="#64748b" fontSize="11" textAnchor="middle">V (L)</text>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(f => {
            const v = vMin + f * (vMax - vMin), p = pMin + f * (pMax - pMin);
            return <g key={f}>
              <text x={sx(v)} y={CY + CH + 14} fill="#475569" fontSize="8" textAnchor="middle">{v.toFixed(1)}</text>
              <text x={CX - 4} y={sp(p) + 3} fill="#475569" fontSize="8" textAnchor="end">{p.toFixed(1)}</text>
              <line x1={CX} y1={sp(p)} x2={CX + CW} y2={sp(p)} stroke="#1e293b" strokeWidth="0.5" />
              <line x1={sx(v)} y1={CY} x2={sx(v)} y2={CY + CH} stroke="#1e293b" strokeWidth="0.5" />
            </g>;
          })}

          {/* Work area fill (single) */}
          {workArea && <path d={workArea} fill={PROC_META[process].color} opacity="0.12" />}

          {/* Curves */}
          {Object.entries(curves).filter(([k]) => !k.endsWith('_color')).map(([key, pts]) => {
            const color = key.startsWith('carnot_')
              ? (['#ef4444', '#f59e0b', '#3b82f6', '#a78bfa'][parseInt(key.split('_')[1])])
              : PROC_META[key as Process]?.color ?? '#38bdf8';
            const isActive = viewMode === 'single' && key === process;
            const path = toPath(pts as { v: number; p: number }[]);
            return <g key={key}>
              {/* Full curve faint in single */}
              {viewMode === 'single' && <path d={path} fill="none" stroke={color} strokeWidth="1" opacity="0.25" strokeDasharray="4 3" />}
              {/* Animated or full */}
              {isActive ? (() => {
                const idx = Math.floor(progress * 80);
                const partial = toPath((pts as { v: number; p: number }[]).slice(0, idx + 1));
                return <path d={partial} fill="none" stroke={color} strokeWidth="2.5" />;
              })() : (
                <path d={path} fill="none" stroke={color} strokeWidth={viewMode === 'compare' ? 2 : 1.5} opacity={viewMode === 'compare' ? 0.85 : 1} />
              )}
            </g>;
          })}

          {/* Legend (compare mode) */}
          {viewMode === 'compare' && ALL_PROC.map((p, i) => (
            <g key={p}>
              <line x1={CX + 10} y1={CY + 8 + i * 16} x2={CX + 28} y2={CY + 8 + i * 16} stroke={PROC_META[p].color} strokeWidth="2" />
              <text x={CX + 32} y={CY + 12 + i * 16} fill={PROC_META[p].color} fontSize="9">{PROC_META[p].short}</text>
            </g>
          ))}

          {/* Carnot legend + labels */}
          {viewMode === 'carnot' && ['Iso-T_H (expand)', 'Adiabatic ↓', 'Iso-T_C (compress)', 'Adiabatic ↑'].map((l, i) => (
            <g key={i}>
              <line x1={CX + 10} y1={CY + 8 + i * 16} x2={CX + 28} y2={CY + 8 + i * 16}
                stroke={['#ef4444', '#f59e0b', '#3b82f6', '#a78bfa'][i]} strokeWidth="2" />
              <text x={CX + 32} y={CY + 12 + i * 16} fill={['#ef4444', '#f59e0b', '#3b82f6', '#a78bfa'][i]} fontSize="8">{l}</text>
            </g>
          ))}

          {/* Current dot (single) */}
          {viewMode === 'single' && progress > 0 && progress < 1 && (
            <circle cx={sx(cur.V_L)} cy={sp(cur.P_atm)} r={5} fill="white" stroke={PROC_META[process].color} strokeWidth="2">
              <animate attributeName="r" values="4;6;4" dur="1.2s" repeatCount="indefinite" />
            </circle>
          )}

          {/* ─── Piston + Particles (subtask 3) ─── */}
          <rect x={PX} y={PY} width={PW} height={PH_MAX} rx="3" fill="none" stroke="#475569" strokeWidth="2" />
          <rect x={PX + 2} y={PY + PH_MAX - pistonFill} width={PW - 4} height={pistonFill - 2} rx="2"
            fill={`hsl(${30 - tempNorm * 30}, ${60 + tempNorm * 30}%, ${25 + tempNorm * 30}%)`} opacity="0.7" />
          <rect x={PX - 4} y={PY + PH_MAX - pistonFill - 8} width={PW + 8} height="8" rx="2"
            fill="#64748b" stroke="#94a3b8" strokeWidth="1" />
          {particles.map((p, i) => {
            const px = PX + 4 + p.x * (PW - 8);
            const py = PY + PH_MAX - pistonFill + 4 + p.y * Math.max(pistonFill - 16, 8);
            return <circle key={i} cx={px} cy={py} r={1.8}
              fill={tempNorm > 0.5 ? '#ef4444' : '#38bdf8'}
              opacity={0.4 + tempNorm * 0.4} />;
          })}
          <text x={PX + PW / 2} y={PY - 4} fill="#64748b" fontSize="9" textAnchor="middle">Piston</text>
          <text x={PX + PW / 2} y={PY + PH_MAX + 14} fill="#475569" fontSize="9" textAnchor="middle">{cur.T.toFixed(0)} K</text>
        </svg>

        <div className="absolute bottom-3 left-3 flex gap-2">
          {viewMode === 'single' && <>
            <button onClick={() => setIsPlaying(p => !p)} disabled={finishedAnim}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors disabled:opacity-40
                ${isPlaying ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'}`}>
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
            <button onClick={handleReset}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm border border-slate-700 transition-colors">
              Reset
            </button>
          </>}
        </div>
      </div>

      {/* Subtask 4: Comparison Table */}
      {viewMode === 'compare' && (
        <div className="glass-panel rounded-xl p-4 overflow-x-auto">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Process Comparison (V₁ → 3V₁)</h3>
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-slate-400">
                <th className="text-left pb-2">Process</th>
                <th className="text-right pb-2">W (J)</th>
                <th className="text-right pb-2">Q (J)</th>
                <th className="text-right pb-2">ΔU (J)</th>
                <th className="text-right pb-2">T₂ (K)</th>
                <th className="text-right pb-2">ΔS (J/K)</th>
              </tr>
            </thead>
            <tbody>
              {ALL_PROC.map(p => {
                const f = finals[p]; const m = PROC_META[p];
                return (
                  <tr key={p} className="border-t border-slate-800">
                    <td className="py-2 font-semibold" style={{ color: m.color }}>{m.short}</td>
                    <td className="text-right text-emerald-400">{f.W.toFixed(0)}</td>
                    <td className="text-right text-red-400">{f.Q.toFixed(0)}</td>
                    <td className="text-right text-amber-400">{f.dU.toFixed(0)}</td>
                    <td className="text-right text-slate-300">{f.T.toFixed(0)}</td>
                    <td className="text-right text-purple-400">{f.dS.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="text-[10px] text-slate-500 mt-2">All rows verify Q = ΔU + W (1st law). ΔS = 0 for adiabatic (reversible).</p>
        </div>
      )}

      {/* Energy bars (single mode) */}
      {viewMode === 'single' && (
        <div className="glass-panel rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Energy Exchange (Q = ΔU + W)</h3>
          <EnergyBar label="Heat (Q)" value={cur.Q} color="bg-red-500" textColor="text-red-400" />
          <EnergyBar label="Work (W)" value={cur.W} color="bg-emerald-500" textColor="text-emerald-400" />
          <EnergyBar label="ΔU" value={cur.dU} color="bg-amber-500" textColor="text-amber-400" />
          {/* Subtask 5: Entropy */}
          <EnergyBar label="ΔS (entropy)" value={cur.dS} color="bg-purple-500" textColor="text-purple-400" />
          <p className="text-[10px] text-slate-500 text-center font-mono">
            Q={cur.Q.toFixed(1)} = ΔU({cur.dU.toFixed(1)}) + W({cur.W.toFixed(1)})
            {Math.abs(cur.Q - cur.W - cur.dU) < 0.5 ? ' ✓' : ''}
            &nbsp;|&nbsp; ΔS = {cur.dS.toFixed(3)} J/K
          </p>
        </div>
      )}

      {/* Parameters + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-panel rounded-xl p-4 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Parameters</h3>
          <NumberInput label="Moles (n)" unit="mol" value={n} onChange={v => { setN(v); handleReset(); }} />
          <NumberInput label="Initial Temperature" unit="K" value={T1} onChange={v => { setT1(v); handleReset(); }} />
          <NumberInput label="Initial Volume" unit="L" value={V1} onChange={v => { setV1(v); handleReset(); }} />
          <NumberInput label="γ (Cp/Cv)" unit="" value={gamma} onChange={v => { setGamma(Math.min(Math.max(v, 1.01), 1.67)); handleReset(); }} />
        </div>
        <div className="glass-panel rounded-xl p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Live Results</h3>
          <div className="grid grid-cols-2 gap-2">
            <Result label="Pressure" value={`${cur.P_atm.toFixed(3)} atm`} color="text-sky-400" />
            <Result label="Volume" value={`${cur.V_L.toFixed(2)} L`} color="text-emerald-400" />
            <Result label="Temperature" value={`${cur.T.toFixed(1)} K`} color="text-red-400" />
            <Result label="Work" value={`${cur.W.toFixed(1)} J`} color="text-emerald-400" />
            <Result label="Heat Q" value={`${cur.Q.toFixed(1)} J`} color="text-red-400" />
            <Result label="ΔU" value={`${cur.dU.toFixed(1)} J`} color="text-amber-400" />
            <Result label="ΔS (entropy)" value={`${cur.dS.toFixed(3)} J/K`} color="text-purple-400" />
            <Result label="γ" value={gamma.toFixed(2)} color="text-teal-400" />
          </div>
        </div>
      </div>

      <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-4">
        <p className="text-xs text-sky-300 leading-relaxed">
          <span className="font-bold">Compare mode: </span>same expansion, see which process does more work (area under curve).
          <span className="font-bold"> Carnot cycle: </span>the most efficient engine between two temperatures — η = 1 − T_C/T_H.
          <span className="font-bold"> Entropy: </span>ΔS = 0 for adiabatic, positive for isothermal expansion.
        </p>
      </div>
    </div>
  );
}

function NumberInput({ label, unit, value, onChange }: { label: string; unit: string; value: number; onChange: (v: number) => void }) {
  const [display, setDisplay] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  const handleBlur = () => { const p = parseFloat(display); if (isNaN(p) || p <= 0) setDisplay(''); };
  return (
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</label>
      <div className="flex items-center bg-slate-800 rounded border border-slate-700 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500/50 transition-colors">
        <input type="number" value={display} placeholder={String(value)} onChange={handleChange} onBlur={handleBlur}
          className="w-full bg-transparent px-3 py-2 text-sm font-mono text-slate-100 outline-none placeholder:text-slate-500" />
        {unit && <span className="text-xs text-slate-500 pr-3 select-none font-mono shrink-0">{unit}</span>}
      </div>
    </div>
  );
}

function EnergyBar({ label, value, color, textColor }: { label: string; value: number; color: string; textColor: string }) {
  const maxBar = 5000;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className={`font-mono ${textColor}`}>{value.toFixed(1)}{label.includes('entropy') ? ' J/K' : ' J'}</span>
      </div>
      <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-75 ${color}`}
          style={{ width: `${Math.min((Math.abs(value) / maxBar) * 100, 100)}%` }} />
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
