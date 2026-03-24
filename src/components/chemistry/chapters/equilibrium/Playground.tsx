// src/components/chemistry/explore/EquilibriumExplore.tsx
import { useState } from 'react';

type Perturbation = 'none' | 'increase_conc_A' | 'decrease_conc_A' | 'increase_pressure' | 'decrease_pressure' | 'increase_temp' | 'decrease_temp' | 'add_catalyst';

const PERTURBATION_RESPONSES: Record<Perturbation, { shift: 'forward' | 'backward' | 'none'; effect: string; color: string }> = {
  none: { shift: 'none', effect: 'System is at equilibrium.', color: '#6b7280' },
  increase_conc_A: { shift: 'forward', effect: 'Adding more reactant A → equilibrium shifts forward to consume A.', color: '#10b981' },
  decrease_conc_A: { shift: 'backward', effect: 'Removing reactant A → equilibrium shifts backward to produce A.', color: '#ef4444' },
  increase_pressure: { shift: 'forward', effect: 'For N₂+3H₂⇌2NH₃: fewer moles on product side → shifts forward.', color: '#06b6d4' },
  decrease_pressure: { shift: 'backward', effect: 'Lower pressure favors side with more moles of gas → shifts backward.', color: '#8b5cf6' },
  increase_temp: { shift: 'backward', effect: 'Reaction is exothermic → increasing temp shifts equilibrium backward.', color: '#f59e0b' },
  decrease_temp: { shift: 'forward', effect: 'Reaction is exothermic → decreasing temp shifts equilibrium forward.', color: '#06b6d4' },
  add_catalyst: { shift: 'none', effect: 'Catalyst speeds up both forward and reverse equally — no shift in equilibrium position.', color: '#a78bfa' },
};

const LABEL: Record<Perturbation, string> = {
  none: 'Reset',
  increase_conc_A: '➕ Add N₂',
  decrease_conc_A: '➖ Remove N₂',
  increase_pressure: '⬆️ Increase Pressure',
  decrease_pressure: '⬇️ Decrease Pressure',
  increase_temp: '🔥 Increase Temp',
  decrease_temp: '❄️ Decrease Temp',
  add_catalyst: '⚗️ Add Catalyst',
};

function ConcentrationBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-mono text-white/50 w-14">{label}</span>
      <div className="flex-1 bg-white/5 rounded-full h-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="text-xs font-mono text-white/30 w-10 text-right">{value.toFixed(0)}%</span>
    </div>
  );
}

export default function EquilibriumExplore() {
  const [perturbation, setPerturbation] = useState<Perturbation>('none');

  const resp = PERTURBATION_RESPONSES[perturbation];

  // Simplified "concentrations" for visualization
  const base = { N2: 50, H2: 40, NH3: 60 };
  const concs = { ...base };
  if (resp.shift === 'forward') {
    concs.N2 = Math.max(10, base.N2 - 15);
    concs.H2 = Math.max(10, base.H2 - 15);
    concs.NH3 = Math.min(95, base.NH3 + 20);
  } else if (resp.shift === 'backward') {
    concs.N2 = Math.min(90, base.N2 + 15);
    concs.H2 = Math.min(90, base.H2 + 15);
    concs.NH3 = Math.max(10, base.NH3 - 20);
  }

  return (
    <div className="space-y-5">
      {/* Reaction display */}
      <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 sm:p-5 text-center">
        <p className="text-lg sm:text-2xl font-mono text-white mb-1 break-words">
          N₂(g) + 3H₂(g) <span className="text-sky-400">⇌</span> 2NH₃(g)   ΔH = −92 kJ
        </p>
        <p className="text-xs text-white/30">Haber Process — Industrial synthesis of ammonia</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Perturbation buttons */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-3">Apply Perturbation</p>
          <div className="space-y-2">
            {(Object.keys(LABEL) as Perturbation[]).map((key) => (
              <button
                key={key}
                onClick={() => setPerturbation(key)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all border ${
                  perturbation === key
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-white/5 border-transparent text-white/40 hover:border-white/10 hover:text-white/60'
                }`}
              >
                {LABEL[key]}
              </button>
            ))}
          </div>
        </div>

        {/* Response display */}
        <div className="space-y-4">
          {/* Shift indicator */}
          <div className="rounded-xl border p-4"
            style={{ borderColor: `${resp.color}40`, background: `${resp.color}08` }}>
            <div className="text-center mb-3">
              <p className="text-xs text-white/40 mb-1">Equilibrium Shift</p>
              {resp.shift === 'none' && (
                <span className="text-2xl">⚖️</span>
              )}
              {resp.shift === 'forward' && (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-white/30 text-sm">Reactants</span>
                  <span className="text-2xl text-green-400">→→→</span>
                  <span className="text-green-400 font-bold text-sm">Products</span>
                </div>
              )}
              {resp.shift === 'backward' && (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-red-400 font-bold text-sm">Reactants</span>
                  <span className="text-2xl text-red-400">←←←</span>
                  <span className="text-white/30 text-sm">Products</span>
                </div>
              )}
            </div>
            <p className="text-xs text-white/60 text-center">{resp.effect}</p>
          </div>

          {/* Concentration bars */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
            <p className="text-xs text-white/40 uppercase tracking-widest">Relative Concentrations</p>
            <ConcentrationBar label="[N₂]" value={concs.N2} color="#06b6d4" />
            <ConcentrationBar label="[H₂]" value={concs.H2} color="#8b5cf6" />
            <ConcentrationBar label="[NH₃]" value={concs.NH3} color="#10b981" />
          </div>
        </div>
      </div>

      {/* Key concept */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-semibold text-white mb-2">Le Chatelier's Principle</p>
        <p className="text-xs text-white/50 leading-relaxed">
          When a system at equilibrium is subjected to a change (stress), the equilibrium shifts in the direction that
          tends to counteract or minimize the effect of that change. This principle applies to changes in concentration,
          pressure, temperature, and volume.
        </p>
      </div>
    </div>
  );
}
