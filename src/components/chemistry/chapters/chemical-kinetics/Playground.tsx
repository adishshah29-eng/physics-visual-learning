// src/components/chemistry/explore/ChemicalKineticsExplore.tsx
import { useState, useMemo } from 'react';

const ACTIVATION_ENERGY_DATA = [
  { reaction: 'H₂ + Cl₂ → 2HCl', Ea: 25, type: 'Fast', color: '#10b981' },
  { reaction: 'N₂ + 3H₂ → 2NH₃', Ea: 335, type: 'Slow', color: '#ef4444' },
  { reaction: 'CH₄ combustion', Ea: 50, type: 'Moderate', color: '#f59e0b' },
  { reaction: 'Fe + O₂ → Fe₂O₃', Ea: 145, type: 'Slow', color: '#f97316' },
];

function EnergyDiagram({ Ea, deltaH }: { Ea: number; deltaH: number }) {
  const w = 400, h = 200;
  const reactantY = 150;
  const productY = reactantY - deltaH * 0.3;
  const tsY = Math.min(reactantY, productY) - (Ea / 400) * 120 - 20;

  const path = `M 40,${reactantY} C 100,${reactantY} 150,${tsY} 200,${tsY} C 250,${tsY} 300,${productY} 360,${productY}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-48">
      <defs>
        <linearGradient id="kePath" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[50, 100, 150].map((y) => (
        <line key={y} x1="20" y1={y} x2="380" y2={y} stroke="white" strokeOpacity="0.05" strokeWidth="1" />
      ))}

      {/* Reaction path */}
      <path d={path} stroke="url(#kePath)" strokeWidth="2.5" fill="none" />

      {/* Reactants label */}
      <rect x="20" y={reactantY - 8} width="40" height="16" rx="4" fill="#06b6d430" />
      <text x="40" y={reactantY + 4} fill="#06b6d4" fontSize="9" textAnchor="middle" fontFamily="monospace">React.</text>

      {/* Products label */}
      <rect x="340" y={productY - 8} width="40" height="16" rx="4" fill="#10b98130" />
      <text x="360" y={productY + 4} fill="#10b981" fontSize="9" textAnchor="middle" fontFamily="monospace">Prod.</text>

      {/* Transition state */}
      <circle cx="200" cy={tsY} r="5" fill="#ef444460" stroke="#ef4444" strokeWidth="1.5" />
      <text x="200" y={tsY - 10} fill="#ef4444" fontSize="9" textAnchor="middle" fontFamily="monospace">‡ TS</text>

      {/* Ea arrow */}
      <line x1="220" y1={Math.min(reactantY, productY) - 5} x2="220" y2={tsY} stroke="#ef444460" strokeWidth="1" strokeDasharray="3,2" />
      <text x="235" y={(Math.min(reactantY, productY) + tsY) / 2} fill="#ef4444" fontSize="9" fontFamily="monospace">Ea</text>

      {/* ΔH arrow */}
      <line x1="310" y1={reactantY} x2="310" y2={productY} stroke="#f59e0b60" strokeWidth="1" strokeDasharray="3,2" />
      <text x="325" y={(reactantY + productY) / 2} fill="#f59e0b" fontSize="9" fontFamily="monospace">ΔH</text>
    </svg>
  );
}

function RateLawSimulator() {
  const [order, setOrder] = useState(1);
  const [k, setK] = useState(0.1);
  const [C0, setC0] = useState(1.0);

  const data = useMemo(() => {
    const pts: { t: number; C: number }[] = [];
    for (let t = 0; t <= 50; t += 1) {
      let C: number;
      if (order === 0) C = Math.max(0, C0 - k * t);
      else if (order === 1) C = C0 * Math.exp(-k * t);
      else C = C0 / (1 + k * C0 * t);
      pts.push({ t, C });
    }
    return pts;
  }, [order, k, C0]);

  const halfLife = useMemo(() => {
    if (order === 0) return (C0 / (2 * k)).toFixed(2);
    if (order === 1) return (0.693 / k).toFixed(2);
    return (1 / (k * C0)).toFixed(2);
  }, [order, k, C0]);

  const maxC = C0;
  const w = 340, h = 160;

  const pathStr = data
    .map((d, i) => {
      const x = 30 + (d.t / 50) * (w - 50);
      const y = h - 20 - (d.C / maxC) * (h - 40);
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    })
    .join(' ');

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-4">
      <p className="text-sm font-semibold text-white">Rate Law Simulator</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-[10px] text-white/30 uppercase block mb-1">Reaction Order</label>
          <select
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs"
          >
            <option value={0}>Zero Order</option>
            <option value={1}>First Order</option>
            <option value={2}>Second Order</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] text-white/30 uppercase block mb-1">Rate Constant k</label>
          <input
            type="number"
            value={k}
            onChange={(e) => setK(Math.max(0.01, Number(e.target.value)))}
            step="0.01"
            placeholder="0.1"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs"
          />
        </div>
        <div>
          <label className="text-[10px] text-white/30 uppercase block mb-1">Initial Conc. [A]₀</label>
          <input
            type="number"
            value={C0}
            onChange={(e) => setC0(Math.max(0.1, Number(e.target.value)))}
            step="0.1"
            placeholder="1.0"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs"
          />
        </div>
      </div>

      {/* Chart */}
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40">
        {/* Axes */}
        <line x1="30" y1={h - 20} x2={w - 10} y2={h - 20} stroke="white" strokeOpacity="0.2" />
        <line x1="30" y1="10" x2="30" y2={h - 20} stroke="white" strokeOpacity="0.2" />
        <text x={w / 2} y={h - 4} fill="white" fillOpacity="0.3" fontSize="8" textAnchor="middle">Time (s)</text>
        <text x="10" y={h / 2} fill="white" fillOpacity="0.3" fontSize="8" textAnchor="middle"
          transform={`rotate(-90 10 ${h / 2})`}>
          [A]
        </text>

        {/* Grid */}
        {[0.25, 0.5, 0.75].map((frac) => (
          <line
            key={frac}
            x1="30"
            y1={h - 20 - frac * (h - 40)}
            x2={w - 10}
            y2={h - 20 - frac * (h - 40)}
            stroke="white"
            strokeOpacity="0.05"
          />
        ))}

        {/* Curve */}
        <path d={pathStr} stroke="#06b6d4" strokeWidth="2" fill="none" />

        {/* Half-life marker */}
        <line
          x1={30 + (parseFloat(halfLife) / 50) * (w - 50)}
          y1={h - 20 - (maxC / 2 / maxC) * (h - 40)}
          x2={30 + (parseFloat(halfLife) / 50) * (w - 50)}
          y2={h - 20}
          stroke="#f59e0b"
          strokeOpacity="0.5"
          strokeDasharray="3,2"
        />
      </svg>

      <div className="flex gap-4 text-xs">
        <div className="bg-amber-500/10 rounded-lg px-3 py-2 border border-amber-500/20">
          <span className="text-white/40">t½ = </span>
          <span className="text-amber-400 font-bold">{halfLife} s</span>
        </div>
        <div className="bg-white/5 rounded-lg px-3 py-2 text-white/40">
          {order === 0 && 'Rate = k — independent of concentration'}
          {order === 1 && 'Rate = k[A] — t½ constant'}
          {order === 2 && 'Rate = k[A]² — t½ depends on [A]₀'}
        </div>
      </div>
    </div>
  );
}

function ArrheniusPanel() {
  const [Ea, setEa] = useState(50);
  const [A, setA] = useState(1e10);

  const temps = [280, 300, 320, 340, 360, 380, 400];
  const R = 8.314;
  const rates = temps.map((T) => A * Math.exp(-Ea * 1000 / (R * T)));
  const maxRate = Math.max(...rates);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-4">
      <p className="text-sm font-semibold text-white">Arrhenius Equation Explorer</p>
      <p className="text-xs text-white/40 font-mono">k = A · e^(-Ea/RT)</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-white/30 uppercase block mb-1">Activation Energy (kJ/mol)</label>
          <input
            type="number"
            value={Ea}
            onChange={(e) => setEa(Math.max(1, Number(e.target.value)))}
            placeholder="50"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs"
          />
        </div>
        <div>
          <label className="text-[10px] text-white/30 uppercase block mb-1">Pre-exponential factor A</label>
          <input
            type="number"
            value={A}
            onChange={(e) => setA(Math.max(1, Number(e.target.value)))}
            placeholder="1e10"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        {temps.map((T, i) => (
          <div key={T} className="flex items-center gap-2">
            <span className="text-xs text-white/40 font-mono w-12">{T} K</span>
            <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(rates[i] / maxRate) * 100}%`,
                  background: `hsl(${120 + (i / 6) * 60}, 80%, 60%)`,
                }}
              />
            </div>
            <span className="text-[10px] text-white/30 font-mono w-20 text-right">
              {rates[i].toExponential(2)}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-white/20">
        Higher temperature → more molecules with energy ≥ Ea → faster rate
      </p>
    </div>
  );
}

export default function ChemicalKineticsExplore() {
  const [view, setView] = useState<'energy' | 'rate' | 'arrhenius'>('rate');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'rate', label: '📈 Rate Laws' },
          { id: 'energy', label: '⚡ Energy Diagram' },
          { id: 'arrhenius', label: '🌡️ Arrhenius' },
        ].map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id as any)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              view === v.id
                ? 'bg-sky-500/25 border border-sky-500/50 text-sky-300'
                : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {view === 'rate' && <RateLawSimulator />}

      {view === 'energy' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ACTIVATION_ENERGY_DATA.map((rxn) => (
              <div key={rxn.reaction} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/50 mb-2 font-mono">{rxn.reaction}</p>
                <EnergyDiagram Ea={rxn.Ea} deltaH={-60} />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-white/30">Ea = {rxn.Ea} kJ/mol</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{ background: `${rxn.color}20`, color: rxn.color }}>
                    {rxn.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'arrhenius' && <ArrheniusPanel />}
    </div>
  );
}
