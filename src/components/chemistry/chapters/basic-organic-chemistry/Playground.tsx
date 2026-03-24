// src/components/chemistry/explore/BasicOrganicExplore.tsx
import { useState } from 'react';

const EFFECTS = [
  {
    name: 'Inductive Effect', symbol: 'I',
    desc: 'Permanent displacement of electron density through σ bonds due to electronegativity difference. Withdrawing groups: −I (e.g. F, Cl, NO₂). Donating groups: +I (e.g. CH₃, C₂H₅).',
    color: '#06b6d4',
  },
  {
    name: 'Electromeric Effect', symbol: 'E',
    desc: 'Complete transfer of π electrons to one atom at the request of an attacking reagent. It is temporary. +E (π electrons towards carbon) and −E (away from carbon).',
    color: '#8b5cf6',
  },
  {
    name: 'Resonance', symbol: 'R',
    desc: 'Delocalization of π electrons or lone pairs over two or more atoms through conjugated systems. True structure is a resonance hybrid. Stabilizes the molecule.',
    color: '#f59e0b',
  },
  {
    name: 'Hyperconjugation', symbol: 'H',
    desc: 'Delocalization of electrons from C−H σ bond of an adjacent carbon into empty or partially filled p orbital. More α-H atoms = greater hyperconjugation = greater stability.',
    color: '#10b981',
  },
];

const INTERMEDIATES = [
  { name: 'Carbocation', charge: '+', desc: 'Carbon with 3 bonds, empty p orbital. Stability: 3° > 2° > 1° > methyl. Electrophile.', color: '#ef4444' },
  { name: 'Carbanion', charge: '−', desc: 'Carbon with 3 bonds and a lone pair. Stability: methyl > 1° > 2° > 3° (opposite to carbocation). Nucleophile.', color: '#06b6d4' },
  { name: 'Free Radical', charge: '•', desc: 'Carbon with 3 bonds and one unpaired electron. Stability: 3° > 2° > 1°. Neutral, highly reactive.', color: '#f59e0b' },
];

export default function BasicOrganicExplore() {
  const [tab, setTab] = useState<'effects' | 'intermediates' | 'reactions'>('effects');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'effects', label: '⚡ Electronic Effects' },
          { id: 'intermediates', label: '⚗️ Intermediates' },
          { id: 'reactions', label: '🔄 Reaction Types' },
        ].map((v) => (
          <button key={v.id} onClick={() => setTab(v.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === v.id
                ? 'bg-sky-500/25 border border-sky-500/50 text-sky-300'
                : 'bg-white/5 text-white/40 hover:bg-white/10 border border-transparent'
            }`}>{v.label}</button>
        ))}
      </div>

      {tab === 'effects' && (
        <div className="space-y-3">
          {EFFECTS.map((eff) => (
            <div key={eff.name} className="rounded-xl border border-white/10 bg-white/5 p-4 flex gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                style={{ background: `${eff.color}20`, color: eff.color, border: `1px solid ${eff.color}30` }}>
                {eff.symbol}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{eff.name}</p>
                <p className="text-xs text-white/50 mt-1 leading-relaxed">{eff.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'intermediates' && (
        <div className="space-y-3">
          {INTERMEDIATES.map((int) => (
            <div key={int.name} className="rounded-xl border p-4"
              style={{ borderColor: `${int.color}30`, background: `${int.color}08` }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-lg" style={{ color: int.color }}>C{int.charge}</span>
                <p className="text-white font-semibold">{int.name}</p>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">{int.desc}</p>
            </div>
          ))}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold text-white mb-2">Bond Fission</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-xs font-semibold text-amber-400 mb-1">Homolytic Fission</p>
                <p className="text-xs text-white/50">Each atom gets one electron → free radicals. Occurs in non-polar bonds, UV light.</p>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-xs font-semibold text-cyan-400 mb-1">Heterolytic Fission</p>
                <p className="text-xs text-white/50">Both electrons go to one atom → ions (carbocation/carbanion). Polar or in polar solvents.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'reactions' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { type: 'Substitution', icon: '↔', desc: 'One atom/group replaces another. e.g. halogenation of alkanes (SN1, SN2)', color: '#06b6d4' },
            { type: 'Addition', icon: '+', desc: 'Atoms add across a double/triple bond. e.g. hydrogenation of alkenes, halogen addition', color: '#10b981' },
            { type: 'Elimination', icon: '−', desc: 'Atoms are removed to form a π bond. e.g. dehydration of alcohols, dehydrohalogenation', color: '#f59e0b' },
            { type: 'Rearrangement', icon: '↻', desc: 'Atoms rearrange within the molecule. e.g. 1,2-hydride shift in carbocation chemistry', color: '#8b5cf6' },
          ].map((r) => (
            <div key={r.type} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg"
                  style={{ background: `${r.color}20`, color: r.color }}>{r.icon}</span>
                <p className="text-white font-semibold text-sm">{r.type}</p>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
