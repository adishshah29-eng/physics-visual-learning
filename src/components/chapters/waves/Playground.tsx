import React, { useState, useEffect, useRef } from 'react';

type WaveMode = 'single' | 'superposition' | 'standing' | 'beats' | 'doppler' | 'harmonics';

const MODES: { key: WaveMode; label: string }[] = [
  { key: 'single',        label: '〰️ Single' },
  { key: 'superposition', label: '➕ Superpose' },
  { key: 'standing',      label: '🎸 Standing' },
  { key: 'beats',         label: '🔊 Beats' },
  { key: 'doppler',       label: '🚗 Doppler' },
  { key: 'harmonics',     label: '🎵 Harmonics' },
];

export default function WavesPlayground() {
  const [amp1, setAmp1]       = useState(40);
  const [freq1, setFreq1]     = useState(2);
  const [waveLen1, setWaveLen1] = useState(200);
  const [amp2, setAmp2]       = useState(40);
  const [freq2, setFreq2]     = useState(2.5);
  const [waveLen2, setWaveLen2] = useState(200);
  const [phase2, setPhase2]   = useState(0);
  const [mode, setMode]       = useState<WaveMode>('single');
  const [srcSpeed, setSrcSpeed] = useState(80);
  const [harmN, setHarmN]     = useState(4);
  const [tracerX, setTracerX] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [, forceRender] = useState(0);

  const timeRef   = useRef(0);
  const reqRef    = useRef<number | null>(null);
  const prevTsRef = useRef<number | null>(null);

  const handleReset = () => {
    setIsPlaying(false); timeRef.current = 0; prevTsRef.current = null;
    forceRender(p => p + 1);
  };

  useEffect(() => {
    if (!isPlaying) { prevTsRef.current = null; if (reqRef.current) cancelAnimationFrame(reqRef.current); return; }
    const animate = (ts: number) => {
      if (prevTsRef.current !== null) {
        timeRef.current += Math.min((ts - prevTsRef.current) / 1000, 0.05);
      }
      prevTsRef.current = ts;
      forceRender(p => p + 1);
      reqRef.current = requestAnimationFrame(animate);
    };
    reqRef.current = requestAnimationFrame(animate);
    return () => { if (reqRef.current) cancelAnimationFrame(reqRef.current); };
  }, [isPlaying]);

  const t = timeRef.current;
  const SVG_W = 700, SVG_H = 300, MID_Y = SVG_H / 2, STEPS = 350;

  const w1 = 2 * Math.PI * freq1, k1 = 2 * Math.PI / waveLen1;
  const w2 = 2 * Math.PI * freq2, k2 = 2 * Math.PI / waveLen2;
  const v1 = freq1 * waveLen1;
  const phi2 = (phase2 * Math.PI) / 180;

  const y1 = (x: number) => amp1 * Math.sin(k1 * x - w1 * t);
  const y2 = (x: number) => amp2 * Math.sin(k2 * x - w2 * t + phi2);
  const yStand = (x: number) => 2 * amp1 * Math.sin(k1 * x) * Math.cos(w1 * t);
  const yBeat = (x: number) => {
    const wA = (w1 + w2) / 2, kA = (k1 + k2) / 2;
    const wD = (w1 - w2) / 2, kD = (k1 - k2) / 2;
    return 2 * amp1 * Math.cos(kD * x - wD * t) * Math.sin(kA * x - wA * t);
  };

  const buildPath = (fn: (x: number) => number, yOff = MID_Y) => {
    let d = '';
    for (let i = 0; i <= STEPS; i++) {
      const x = (i / STEPS) * SVG_W;
      d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${(yOff - fn(x)).toFixed(1)} `;
    }
    return d;
  };

  // Standing wave nodes/antinodes
  const nodes: number[] = [], antinodes: number[] = [];
  if (mode === 'standing') {
    for (let i = 0; i < STEPS; i++) {
      const x = (i / STEPS) * SVG_W;
      if (Math.abs(Math.sin(k1 * x)) < 0.02) nodes.push(x);
      if (Math.abs(Math.abs(Math.sin(k1 * x)) - 1) < 0.02) antinodes.push(x);
    }
  }

  // Doppler (subtask 1)
  const vWave = v1;
  const srcX = mode === 'doppler' ? (srcSpeed * t) % SVG_W : 0;
  const fObs_front = vWave > srcSpeed ? freq1 * vWave / (vWave - srcSpeed) : Infinity;
  const fObs_behind = freq1 * vWave / (vWave + srcSpeed);

  // Harmonics (subtask 2)
  const HARM_COLORS = ['#38bdf8', '#22c55e', '#f59e0b', '#a78bfa', '#ef4444', '#ec4899'];
  const stringL = SVG_W - 60;

  // Superposition resultant at tracer point
  const yResult = (x: number) => {
    if (mode === 'superposition') return y1(x) + y2(x);
    if (mode === 'single') return y1(x);
    if (mode === 'standing') return yStand(x);
    if (mode === 'beats') return yBeat(x);
    return 0;
  };

  // Tracer Y (subtask 4)
  const tracerY = yResult(tracerX);

  // Resultant amplitude for intensity (subtask 5)
  let resultantAmpSq = amp1 * amp1;
  if (mode === 'superposition') {
    resultantAmpSq = amp1 * amp1 + amp2 * amp2 + 2 * amp1 * amp2 * Math.cos(phi2);
  }

  const fBeat = Math.abs(freq1 - freq2);

  return (
    <div className="flex flex-col bg-slate-950 text-slate-100 p-4 space-y-4 overflow-y-auto min-h-full">

      <div>
        <h2 className="text-xl font-bold text-sky-400">Waves — Superposition & Beyond</h2>
        <p className="text-xs text-slate-400 mt-0.5">Single, superposition, standing, beats, Doppler, and harmonics.</p>
      </div>

      {/* Mode selector */}
      <div className="flex gap-1.5 flex-wrap">
        {MODES.map(m => (
          <button key={m.key} onClick={() => { setMode(m.key); handleReset(); }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors
              ${mode === m.key ? 'bg-sky-500/20 text-sky-400 border-sky-500/50' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Status */}
      <div className="rounded-lg p-2.5 text-xs font-medium border bg-slate-800/50 border-slate-700/50 text-slate-300 flex gap-4 flex-wrap">
        <span>v₁ = <span className="text-sky-400 font-mono">{v1.toFixed(0)}</span> px/s</span>
        {mode === 'beats' && <span>f_beat = <span className="text-amber-400 font-mono">{fBeat.toFixed(2)}</span> Hz</span>}
        {mode === 'standing' && <span>Nodes: <span className="text-red-400 font-mono">{nodes.length}</span> Antinodes: <span className="text-emerald-400 font-mono">{antinodes.length}</span></span>}
        {mode === 'doppler' && <>
          <span>f_front = <span className="text-emerald-400 font-mono">{fObs_front < 1e4 ? fObs_front.toFixed(2) : '∞'}</span> Hz</span>
          <span>f_behind = <span className="text-red-400 font-mono">{fObs_behind.toFixed(2)}</span> Hz</span>
        </>}
        {mode === 'superposition' && <span>φ₂ = <span className="text-purple-400 font-mono">{phase2}°</span> &nbsp; I_res ∝ <span className="text-amber-400 font-mono">{resultantAmpSq.toFixed(0)}</span></span>}
      </div>

      {/* Main SVG */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative">
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto">
          <defs>
            <pattern id="wgrid2" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={SVG_W} height={SVG_H} fill="url(#wgrid2)" />
          <line x1={0} y1={MID_Y} x2={SVG_W} y2={MID_Y} stroke="#334155" strokeWidth="1" strokeDasharray="4 3" />

          {/* ── Single ── */}
          {mode === 'single' && <>
            <path d={buildPath(y1)} fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1={50} y1={MID_Y + amp1 + 20} x2={50 + waveLen1} y2={MID_Y + amp1 + 20} stroke="#f59e0b" strokeWidth="1.5" />
            <line x1={50} y1={MID_Y + amp1 + 16} x2={50} y2={MID_Y + amp1 + 24} stroke="#f59e0b" strokeWidth="1" />
            <line x1={50 + waveLen1} y1={MID_Y + amp1 + 16} x2={50 + waveLen1} y2={MID_Y + amp1 + 24} stroke="#f59e0b" strokeWidth="1" />
            <text x={50 + waveLen1 / 2} y={MID_Y + amp1 + 33} fill="#f59e0b" fontSize="10" textAnchor="middle">λ = {waveLen1} px</text>
          </>}

          {/* ── Superposition (subtask 3: phase) ── */}
          {mode === 'superposition' && <>
            <path d={buildPath(y1)} fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.4" />
            <path d={buildPath(y2)} fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity="0.4" />
            <path d={buildPath(x => y1(x) + y2(x))} fill="none" stroke="#22c55e" strokeWidth="2.5" />
          </>}

          {/* ── Standing ── */}
          {mode === 'standing' && <>
            <path d={buildPath(x => 2 * amp1 * Math.abs(Math.sin(k1 * x)))} fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
            <path d={buildPath(x => -2 * amp1 * Math.abs(Math.sin(k1 * x)))} fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
            <path d={buildPath(yStand)} fill="none" stroke="#f59e0b" strokeWidth="2.5" />
            {nodes.map((nx, i) => <circle key={`n${i}`} cx={nx} cy={MID_Y} r={4} fill="#ef4444" stroke="#0f172a" strokeWidth="1.5" />)}
            {antinodes.map((ax, i) => <circle key={`a${i}`} cx={ax} cy={MID_Y} r={4} fill="#22c55e" stroke="#0f172a" strokeWidth="1.5" />)}
          </>}

          {/* ── Beats ── */}
          {mode === 'beats' && <>
            <path d={buildPath(x => 2 * amp1 * Math.abs(Math.cos(((k1 - k2) / 2) * x - ((w1 - w2) / 2) * t)))} fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <path d={buildPath(x => -2 * amp1 * Math.abs(Math.cos(((k1 - k2) / 2) * x - ((w1 - w2) / 2) * t)))} fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <path d={buildPath(yBeat)} fill="none" stroke="#38bdf8" strokeWidth="2" />
          </>}

          {/* ── Doppler (subtask 1) ── */}
          {mode === 'doppler' && (() => {
            const circles: JSX.Element[] = [];
            for (let i = 0; i < 8; i++) {
              const emitT = t - i * (1 / freq1);
              if (emitT < 0) continue;
              const emitX = (srcSpeed * emitT) % SVG_W;
              const r = vWave * (t - emitT);
              if (r > 0 && r < SVG_W) {
                circles.push(
                  <circle key={i} cx={30 + emitX} cy={MID_Y} r={r} fill="none"
                    stroke="#38bdf8" strokeWidth="1" opacity={Math.max(0.1, 1 - r / SVG_W)} />
                );
              }
            }
            return <>
              {circles}
              <circle cx={30 + srcX} cy={MID_Y} r={8} fill="#ef4444" stroke="#fbbf24" strokeWidth="2" />
              <text x={30 + srcX} y={MID_Y - 16} fill="#ef4444" fontSize="10" textAnchor="middle">Source</text>
              <text x={SVG_W - 30} y={MID_Y - 40} fill="#22c55e" fontSize="10" textAnchor="end">Observer →</text>
              <text x={SVG_W - 30} y={MID_Y - 26} fill="#22c55e" fontSize="9" textAnchor="end">f = {fObs_front < 1e4 ? fObs_front.toFixed(1) : '∞'} Hz</text>
              <text x={20} y={MID_Y - 40} fill="#ef4444" fontSize="10">← Observer</text>
              <text x={20} y={MID_Y - 26} fill="#ef4444" fontSize="9">f = {fObs_behind.toFixed(1)} Hz</text>
            </>;
          })()}

          {/* ── Harmonics (subtask 2) ── */}
          {mode === 'harmonics' && (() => {
            const elems: JSX.Element[] = [];
            const x0 = 30;
            for (let n = 1; n <= harmN; n++) {
              const color = HARM_COLORS[(n - 1) % HARM_COLORS.length];
              const kn = (n * Math.PI) / stringL;
              const wn = n * w1;
              let d = '';
              for (let i = 0; i <= STEPS; i++) {
                const x = (i / STEPS) * stringL;
                const y = MID_Y - (amp1 / n) * Math.sin(kn * x) * Math.cos(wn * t);
                d += `${i === 0 ? 'M' : 'L'}${(x0 + x).toFixed(1)} ${y.toFixed(1)} `;
              }
              elems.push(<path key={n} d={d} fill="none" stroke={color} strokeWidth={n === 1 ? 2.5 : 1.5} opacity={n === 1 ? 1 : 0.5} />);
            }
            // Fixed ends
            elems.push(<circle key="L" cx={x0} cy={MID_Y} r={5} fill="#ef4444" stroke="#0f172a" strokeWidth="2" />);
            elems.push(<circle key="R" cx={x0 + stringL} cy={MID_Y} r={5} fill="#ef4444" stroke="#0f172a" strokeWidth="2" />);
            // Legend
            for (let n = 1; n <= harmN; n++) {
              elems.push(
                <g key={`leg${n}`}>
                  <line x1={SVG_W - 90} y1={20 + (n - 1) * 16} x2={SVG_W - 72} y2={20 + (n - 1) * 16}
                    stroke={HARM_COLORS[(n - 1) % HARM_COLORS.length]} strokeWidth="2" />
                  <text x={SVG_W - 68} y={24 + (n - 1) * 16} fill={HARM_COLORS[(n - 1) % HARM_COLORS.length]} fontSize="9">
                    n={n} f={n}f₁
                  </text>
                </g>
              );
            }
            return <>{elems}</>;
          })()}

          {/* ── Particle tracer (subtask 4) ── */}
          {(mode === 'single' || mode === 'superposition' || mode === 'standing') && <>
            <line x1={tracerX} y1={MID_Y - 90} x2={tracerX} y2={MID_Y + 90} stroke="#475569" strokeWidth="0.5" strokeDasharray="2 2" />
            <circle cx={tracerX} cy={MID_Y - tracerY} r={6} fill="none" stroke="#f43f5e" strokeWidth="2">
              <animate attributeName="r" values="5;7;5" dur="0.8s" repeatCount="indefinite" />
            </circle>
            <text x={tracerX + 10} y={MID_Y - tracerY - 8} fill="#f43f5e" fontSize="9">y={tracerY.toFixed(1)}</text>
          </>}

          <text x={SVG_W - 10} y={16} fill="#334155" fontSize="10" textAnchor="end">t = {t.toFixed(2)} s</text>
        </svg>

        <div className="absolute bottom-3 left-3 flex gap-2">
          <button onClick={() => setIsPlaying(p => !p)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors
              ${isPlaying ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'}`}>
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button onClick={handleReset}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm border border-slate-700 transition-colors">
            Reset
          </button>
        </div>
      </div>

      {/* Subtask 5: Intensity + energy bars */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Wave Properties</h3>
        <EnergyBar label="Amplitude A₁" value={amp1} max={100} color="bg-sky-500" textColor="text-sky-400" unit="px" />
        {mode === 'superposition' && <>
          <EnergyBar label="Amplitude A₂" value={amp2} max={100} color="bg-purple-500" textColor="text-purple-400" unit="px" />
          <EnergyBar label="Resultant I ∝ A²" value={resultantAmpSq} max={(amp1 + amp2) ** 2} color="bg-emerald-500" textColor="text-emerald-400" unit="px²" />
          <p className="text-[10px] text-slate-500 font-mono text-center">
            I_res = A₁² + A₂² + 2A₁A₂cos(φ) = {resultantAmpSq.toFixed(0)}
            {Math.abs(phase2) < 1 ? ' (constructive ✓)' : Math.abs(phase2 - 180) < 1 ? ' (destructive ✗)' : ''}
          </p>
        </>}
        {mode === 'standing' && <EnergyBar label="Standing Amp (2A)" value={2 * amp1} max={200} color="bg-amber-500" textColor="text-amber-400" unit="px" />}
        {mode === 'beats' && <EnergyBar label="Beat Period" value={fBeat > 0 ? 1 / fBeat : 0} max={5} color="bg-amber-500" textColor="text-amber-400" unit="s" />}
      </div>

      {/* Parameters + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Wave 1</h3>
          <NumberInput label="Amplitude (A₁)" unit="px" value={amp1} onChange={v => { setAmp1(Math.min(v, 80)); handleReset(); }} />
          <NumberInput label="Frequency (f₁)" unit="Hz" value={freq1} onChange={v => { setFreq1(v); handleReset(); }} />
          <NumberInput label="Wavelength (λ₁)" unit="px" value={waveLen1} onChange={v => { setWaveLen1(v); handleReset(); }} />
          {(mode === 'superposition' || mode === 'beats') && <>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-2">Wave 2</h3>
            <NumberInput label="Amplitude (A₂)" unit="px" value={amp2} onChange={v => { setAmp2(Math.min(v, 80)); handleReset(); }} />
            <NumberInput label="Frequency (f₂)" unit="Hz" value={freq2} onChange={v => { setFreq2(v); handleReset(); }} />
            <NumberInput label="Wavelength (λ₂)" unit="px" value={waveLen2} onChange={v => { setWaveLen2(v); handleReset(); }} />
            {mode === 'superposition' && (
              <NumberInput label="Phase φ₂" unit="°" value={phase2} onChange={v => { setPhase2(v); handleReset(); }} />
            )}
          </>}
          {mode === 'doppler' && (
            <NumberInput label="Source Speed" unit="px/s" value={srcSpeed} onChange={v => { setSrcSpeed(v); handleReset(); }} />
          )}
          {mode === 'harmonics' && (
            <NumberInput label="Harmonics to show" unit="" value={harmN} onChange={v => { setHarmN(Math.min(Math.floor(v), 6)); handleReset(); }} />
          )}
          {(mode === 'single' || mode === 'superposition' || mode === 'standing') && (
            <NumberInput label="Tracer X position" unit="px" value={tracerX} onChange={v => setTracerX(v)} />
          )}
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Live Results</h3>
          <div className="grid grid-cols-2 gap-2">
            <Result label="v₁ = f₁λ₁" value={`${v1.toFixed(0)} px/s`} color="text-sky-400" />
            <Result label="Period T₁" value={`${(1 / freq1).toFixed(3)} s`} color="text-emerald-400" />
            <Result label="ω₁" value={`${w1.toFixed(2)} rad/s`} color="text-purple-400" />
            <Result label="k₁" value={`${k1.toFixed(4)} /px`} color="text-amber-400" />
            {mode === 'superposition' && <>
              <Result label="Phase φ₂" value={`${phase2}°`} color="text-purple-400" />
              <Result label="I_resultant" value={resultantAmpSq.toFixed(0)} color="text-emerald-400" />
            </>}
            {mode === 'doppler' && <>
              <Result label="f (front)" value={fObs_front < 1e4 ? `${fObs_front.toFixed(1)} Hz` : '∞'} color="text-emerald-400" />
              <Result label="f (behind)" value={`${fObs_behind.toFixed(1)} Hz`} color="text-red-400" />
            </>}
            {mode === 'beats' && <>
              <Result label="f_beat" value={`${fBeat.toFixed(2)} Hz`} color="text-amber-400" />
              <Result label="T_beat" value={fBeat > 0 ? `${(1 / fBeat).toFixed(3)} s` : '—'} color="text-amber-400" />
            </>}
            {mode === 'harmonics' && <>
              <Result label="Fundamental" value={`f₁ = ${freq1} Hz`} color="text-sky-400" />
              <Result label="Highest" value={`${harmN}f₁ = ${harmN * freq1} Hz`} color="text-amber-400" />
            </>}
            <Result label="y(tracer)" value={`${tracerY.toFixed(1)} px`} color="text-red-400" />
            <Result label="I ∝ A₁²" value={`${(amp1 * amp1).toFixed(0)}`} color="text-sky-400" />
          </div>
        </div>
      </div>

      <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-4">
        <p className="text-xs text-sky-300 leading-relaxed">
          <span className="font-bold">Doppler: </span>f_obs = f × v/(v ± v_s). Circles compress ahead and stretch behind.
          <span className="font-bold"> Harmonics: </span>fₙ = n × v/(2L). All harmonics on one string.
          <span className="font-bold"> Phase: </span>set φ₂ = 0° for constructive, 180° for destructive.
          <span className="font-bold"> Tracer: </span>the red dot follows a single particle's vertical oscillation.
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
          className="w-full bg-transparent px-3 py-2 text-sm font-mono text-slate-100 outline-none placeholder:text-slate-500" />
        {unit && <span className="text-xs text-slate-500 pr-3 select-none font-mono shrink-0">{unit}</span>}
      </div>
    </div>
  );
}

function EnergyBar({ label, value, max, color, textColor, unit }: { label: string; value: number; max: number; color: string; textColor: string; unit: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className={`font-mono ${textColor}`}>{value.toFixed(1)} {unit}</span>
      </div>
      <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-75 ${color}`}
          style={{ width: `${Math.min((Math.abs(value) / max) * 100, 100)}%` }} />
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
