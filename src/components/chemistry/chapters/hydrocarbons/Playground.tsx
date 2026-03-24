// src/components/chemistry/explore/HydrocarbonsExplore.tsx
import { useState } from 'react';

type HCType = 'alkane' | 'alkene' | 'alkyne' | 'aromatic';

const HC_DATA: Record<HCType, {
  general: string; hybridization: string; bond: string; reactions: string[];
  examples: { name: string; formula: string }[];
}> = {
  alkane: {
    general: 'CₙH₂ₙ₊₂',
    hybridization: 'sp³',
    bond: 'C–C (single), C–H',
    reactions: [
      'Halogenation (free radical substitution, UV light): CH₄ + Cl₂ → CH₃Cl + HCl',
      'Combustion: CₙH₂ₙ₊₂ + O₂ → CO₂ + H₂O',
      'Cracking (at high temperature)',
    ],
    examples: [
      { name: 'Methane', formula: 'CH₄' },
      { name: 'Ethane', formula: 'C₂H₆' },
      { name: 'Propane', formula: 'C₃H₈' },
      { name: 'Butane', formula: 'C₄H₁₀' },
    ],
  },
  alkene: {
    general: 'CₙH₂ₙ',
    hybridization: 'sp²',
    bond: 'C=C (double)',
    reactions: [
      "Electrophilic addition of H₂: CH₂=CH₂ + H₂ → C₂H₆ (Ni, Δ)",
      "Addition of Br₂ (decolorizes bromine water)",
      "Addition of HBr — Markownikoff's rule: CH₃CH=CH₂ + HBr → CH₃CHBrCH₃",
      "Anti-Markownikoff's (peroxide effect): CH₃CH=CH₂ + HBr → CH₃CH₂CH₂Br",
      "Ozonolysis: C=C → two carbonyl compounds",
      "Polymerization: nCH₂=CH₂ → (−CH₂−CH₂−)ₙ",
    ],
    examples: [
      { name: 'Ethene', formula: 'C₂H₄' },
      { name: 'Propene', formula: 'C₃H₆' },
      { name: 'But-1-ene', formula: 'C₄H₈' },
      { name: '2-Methylpropene', formula: 'C₄H₈' },
    ],
  },
  alkyne: {
    general: 'CₙH₂ₙ₋₂',
    hybridization: 'sp',
    bond: 'C≡C (triple)',
    reactions: [
      'Acidic character: HC≡CH + NaNH₂ → NaC≡CNa + NH₃',
      'Addition of H₂ (Lindlar\'s catalyst → cis alkene; Na in liq NH₃ → trans)',
      'Addition of HX follows Markownikoff\'s rule',
      'Addition of water (with H₂SO₄/HgSO₄) → aldehyde (from terminal alkynes)',
      'Polymerization of acetylene → benzene (at 300°C)',
    ],
    examples: [
      { name: 'Ethyne (Acetylene)', formula: 'C₂H₂' },
      { name: 'Propyne', formula: 'C₃H₄' },
      { name: 'But-1-yne', formula: 'C₄H₆' },
    ],
  },
  aromatic: {
    general: 'C₆H₅− (phenyl)',
    hybridization: 'sp² (all ring carbons)',
    bond: 'Delocalized π system',
    reactions: [
      'Halogenation: C₆H₆ + Cl₂ → C₆H₅Cl + HCl (FeCl₃ catalyst)',
      'Nitration: C₆H₆ + HNO₃ → C₆H₅NO₂ + H₂O (H₂SO₄)',
      "Friedel-Craft's Alkylation: C₆H₆ + RCl → C₆H₅R + HCl (AlCl₃)",
      "Friedel-Craft's Acylation: C₆H₆ + RCOCl → C₆H₅COR + HCl (AlCl₃)",
      'Directive influence: ortho/para directors (−OH, −NH₂, −R) vs meta directors (−NO₂, −SO₃H, −COOH)',
    ],
    examples: [
      { name: 'Benzene', formula: 'C₆H₆' },
      { name: 'Toluene', formula: 'C₆H₅CH₃' },
      { name: 'Naphthalene', formula: 'C₁₀H₈' },
      { name: 'Aniline', formula: 'C₆H₅NH₂' },
    ],
  },
};

const COLORS: Record<HCType, string> = {
  alkane: '#78716c',
  alkene: '#10b981',
  alkyne: '#06b6d4',
  aromatic: '#8b5cf6',
};

export default function HydrocarbonsExplore() {
  const [type, setType] = useState<HCType>('alkene');
  const data = HC_DATA[type];
  const color = COLORS[type];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(['alkane', 'alkene', 'alkyne', 'aromatic'] as HCType[]).map((t) => (
          <button key={t} onClick={() => setType(t)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all border ${
              type === t ? '' : 'bg-white/5 text-white/40 hover:bg-white/10 border-transparent'
            }`}
            style={type === t ? { background: `${COLORS[t]}25`, borderColor: `${COLORS[t]}50`, color: COLORS[t] } : {}}>
            {t === 'aromatic' ? '🔮 Aromatic' : t === 'alkane' ? '⚪ Alkane' : t === 'alkene' ? '🟢 Alkene' : '🔵 Alkyne'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'General Formula', value: data.general },
          { label: 'Hybridization', value: data.hybridization },
          { label: 'Characteristic Bond', value: data.bond },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
            <p className="text-[10px] text-white/30 uppercase mb-1">{item.label}</p>
            <p className="text-white font-bold font-mono">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-semibold text-white mb-3">Key Reactions</p>
        <div className="space-y-2">
          {data.reactions.map((r, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-white/60">
              <span className="mt-0.5 shrink-0" style={{ color }}>▸</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-semibold text-white mb-3">Examples</p>
        <div className="flex flex-wrap gap-2">
          {data.examples.map((e) => (
            <div key={e.name} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-center">
              <p className="text-xs text-white font-semibold">{e.name}</p>
              <p className="text-[10px] font-mono" style={{ color }}>{e.formula}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
