// src/components/chemistry/explore/ThermodynamicsExplore.tsx
import { useState } from 'react';

const ENTHALPY_DATA = [
  { reaction: 'C(s) + O₂(g) → CO₂(g)',  deltaH: -393.5, type: 'Combustion',   color: '#ef4444' },
  { reaction: 'H₂(g) + ½O₂(g) → H₂O(l)',deltaH: -285.8, type: 'Combustion',   color: '#ef4444' },
  { reaction: 'N₂(g) + 3H₂(g) → 2NH₃(g)',deltaH: -92.4, type: 'Formation',    color: '#10b981' },
  { reaction: 'NaCl(s) → Na⁺(aq) + Cl⁻(aq)', deltaH: +3.9, type: 'Solution',  color: '#06b6d4' },
  { reaction: 'H₂O(l) → H₂O(g)',        deltaH: +44.0,  type: 'Vaporisation', color: '#8b5cf6' },
  { reaction: 'C(s, graphite) → C(g)',   deltaH: +716.7, type: 'Atomization',  color: '#f59e0b' },
];

export default function ThermodynamicsExplore() {
  const [selected, setSelected] = useState<null | typeof ENTHALPY_DATA[0]>(null);

  const maxAbs = Math.max(...ENTHALPY_DATA.map((d) => Math.abs(d.deltaH)));

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-semibold text-white mb-3">Standard Enthalpies of Reactions</p>
        <p className="text-xs text-white/40 mb-4">Click a reaction to see details. Negative = exothermic (releases heat), Positive = endothermic (absorbs heat).</p>
        <div className="space-y-2">
          {ENTHALPY_DATA.map((rxn) => {
            const isExo = rxn.deltaH < 0;
            const frac = Math.abs(rxn.deltaH) / maxAbs;
            return (
              <button
                key={rxn.reaction}
                onClick={() => setSelected(rxn === selected ? null : rxn)}
                className="w-full text-left rounded-lg p-3 border transition-all hover:bg-white/5"
                style={{ borderColor: selected === rxn ? rxn.color + '60' : 'rgba(255,255,255,0.08)' }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono text-white/70">{rxn.reaction}</span>
                  <span className={`text-xs font-bold ml-2 shrink-0 ${isExo ? 'text-red-400' : 'text-blue-400'}`}>
                    {rxn.deltaH > 0 ? '+' : ''}{rxn.deltaH} kJ/mol
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/30 w-16">{rxn.type}</span>
                  <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${frac * 100}%`, background: rxn.color }}
                    />
                  </div>
                  <span className="text-[10px]">{isExo ? '🔥 Exo' : '❄️ Endo'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gibbs free energy */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <p className="text-sm font-semibold text-amber-400 mb-3">ΔG = ΔH − TΔS (Gibbs Free Energy)</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { dH: '−', dS: '+', dG: '− always', spontaneous: 'Yes (always)', color: '#10b981' },
            { dH: '+', dS: '−', dG: '+ always', spontaneous: 'No (never)',   color: '#ef4444' },
            { dH: '−', dS: '−', dG: '± depends on T', spontaneous: 'At low T',  color: '#f59e0b' },
            { dH: '+', dS: '+', dG: '± depends on T', spontaneous: 'At high T', color: '#06b6d4' },
          ].map((row, i) => (
            <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="flex gap-2 text-xs font-mono mb-1">
                <span className="text-white/50">ΔH={row.dH}</span>
                <span className="text-white/50">ΔS={row.dS}</span>
              </div>
              <p className="text-xs text-white/70">ΔG: <span className="font-semibold">{row.dG}</span></p>
              <p className="text-[10px] mt-1" style={{ color: row.color }}>Spontaneous: {row.spontaneous}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
