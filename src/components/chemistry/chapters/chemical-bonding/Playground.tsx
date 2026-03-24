// src/components/chemistry/explore/ChemicalBondingExplore.tsx
import { useState } from 'react';

type BondType = 'ionic' | 'covalent' | 'vsepr' | 'mo';

const VSEPR_SHAPES = [
  { formula: 'BeCl₂', bp: 2, lp: 0, shape: 'Linear', angle: '180°', example: 'CO₂', color: '#06b6d4' },
  { formula: 'BF₃',   bp: 3, lp: 0, shape: 'Trigonal Planar', angle: '120°', example: 'SO₃', color: '#10b981' },
  { formula: 'CH₄',   bp: 4, lp: 0, shape: 'Tetrahedral', angle: '109.5°', example: 'SiCl₄', color: '#8b5cf6' },
  { formula: 'NH₃',   bp: 3, lp: 1, shape: 'Trigonal Pyramidal', angle: '107°', example: 'PCl₃', color: '#f59e0b' },
  { formula: 'H₂O',   bp: 2, lp: 2, shape: 'Bent / V-Shaped', angle: '104.5°', example: 'H₂S', color: '#ef4444' },
  { formula: 'PCl₅',  bp: 5, lp: 0, shape: 'Trigonal Bipyramidal', angle: '90°/120°', example: 'AsF₅', color: '#f97316' },
  { formula: 'SF₆',   bp: 6, lp: 0, shape: 'Octahedral', angle: '90°', example: 'XeF₄ (distorted)', color: '#a78bfa' },
];

const HYBRIDIZATION = [
  { type: 'sp',   shape: 'Linear', angle: '180°', orbitals: '1s + 1p', examples: 'BeCl₂, C₂H₂, CO₂' },
  { type: 'sp²',  shape: 'Trigonal Planar', angle: '120°', orbitals: '1s + 2p', examples: 'BF₃, C₂H₄, benzene' },
  { type: 'sp³',  shape: 'Tetrahedral', angle: '109.5°', orbitals: '1s + 3p', examples: 'CH₄, NH₃, H₂O' },
  { type: 'sp³d', shape: 'Trigonal Bipyramidal', angle: '90°/120°', orbitals: '1s + 3p + 1d', examples: 'PCl₅, AsF₅' },
  { type: 'sp³d²',shape: 'Octahedral', angle: '90°', orbitals: '1s + 3p + 2d', examples: 'SF₆, [CoF₆]³⁻' },
];

const MO_MOLECULES = [
  { name: 'H₂',  config: 'σ1s²', bondOrder: 1, magnetic: 'Diamagnetic' },
  { name: 'He₂', config: 'σ1s² σ*1s²', bondOrder: 0, magnetic: 'Does not exist' },
  { name: 'N₂',  config: 'σ1s² σ*1s² σ2s² σ*2s² π2p⁴ σ2p²', bondOrder: 3, magnetic: 'Diamagnetic' },
  { name: 'O₂',  config: 'σ1s² σ*1s² σ2s² σ*2s² σ2p² π2p⁴ π*2p²', bondOrder: 2, magnetic: 'Paramagnetic' },
  { name: 'F₂',  config: 'σ1s² σ*1s² σ2s² σ*2s² σ2p² π2p⁴ π*2p⁴', bondOrder: 1, magnetic: 'Diamagnetic' },
  { name: 'Ne₂', config: 'σ1s² σ*1s² σ2s² σ*2s² σ2p² π2p⁴ π*2p⁴ σ*2p²', bondOrder: 0, magnetic: 'Does not exist' },
];

export default function ChemicalBondingExplore() {
  const [view, setView] = useState<BondType>('vsepr');
  const [selected, setSelected] = useState(0);

  const shape = VSEPR_SHAPES[selected];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'vsepr', label: '🔷 VSEPR Shapes' },
          { id: 'hybridization', label: '🔀 Hybridization' },
          { id: 'mo', label: '🌀 MO Theory' },
          { id: 'ionic', label: '⚡ Ionic vs Covalent' },
        ].map((v) => (
          <button key={v.id} onClick={() => setView(v.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              view === v.id
                ? 'bg-sky-500/25 border border-sky-500/50 text-sky-300'
                : 'bg-white/5 text-white/40 hover:bg-white/10 border border-transparent'
            }`}>{v.label}</button>
        ))}
      </div>

      {view === 'vsepr' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <p className="text-[10px] text-white/30 uppercase tracking-widest">Select Molecule</p>
            {VSEPR_SHAPES.map((s, i) => (
              <button key={s.formula} onClick={() => setSelected(i)}
                className={`w-full text-left rounded-xl px-4 py-3 border transition-all ${
                  selected === i
                    ? 'border-sky-500/40 bg-sky-500/10'
                    : 'border-white/10 bg-white/5 hover:border-white/15'
                }`}>
                <div className="flex items-center justify-between">
                  <span className="text-white font-mono font-bold text-sm">{s.formula}</span>
                  <span className="text-xs text-white/40">{s.shape}</span>
                </div>
                <p className="text-[10px] text-white/30 mt-0.5">
                  {s.bp} bond pair{s.bp !== 1 ? 's' : ''}, {s.lp} lone pair{s.lp !== 1 ? 's' : ''}
                </p>
              </button>
            ))}
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold"
                style={{ background: `${shape.color}20`, border: `2px solid ${shape.color}40`, color: shape.color }}>
                {shape.formula.split('')[0]}
              </div>
              <p className="text-xl font-bold text-white">{shape.formula}</p>
              <p className="text-sm font-semibold mt-1" style={{ color: shape.color }}>{shape.shape}</p>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Bond Angle', value: shape.angle },
                { label: 'Bond Pairs', value: shape.bp.toString() },
                { label: 'Lone Pairs', value: shape.lp.toString() },
                { label: 'Similar molecule', value: shape.example },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-xs">
                  <span className="text-white/40">{row.label}</span>
                  <span className="text-white font-semibold">{row.value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-white/30 mt-4 leading-relaxed">
              Lone pairs occupy more space than bond pairs, compressing the bond angle.
            </p>
          </div>
        </div>
      )}

      {view === 'hybridization' && (
        <div className="space-y-3">
          {HYBRIDIZATION.map((h) => (
            <div key={h.type} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center font-bold text-sky-300 text-lg shrink-0">
                  {h.type}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-white font-semibold text-sm">{h.shape}</p>
                    <span className="text-xs text-white/30 font-mono">∠ {h.angle}</span>
                  </div>
                  <p className="text-xs text-white/40 mb-1">Orbitals: {h.orbitals}</p>
                  <p className="text-xs text-sky-300/70">e.g. {h.examples}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'mo' && (
        <div className="space-y-3">
          <p className="text-xs text-white/40">Bond order = (bonding e⁻ − antibonding e⁻) / 2. Bond order = 0 means the molecule doesn't exist.</p>
          {MO_MOLECULES.map((m) => (
            <div key={m.name} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-white font-bold text-lg w-10">{m.name}</span>
                <span className="text-xs font-mono text-white/40 flex-1">{m.config}</span>
                <div className="flex gap-3">
                  <div className="text-center">
                    <p className="text-[10px] text-white/30">Bond Order</p>
                    <p className={`text-lg font-bold ${m.bondOrder > 0 ? 'text-cyan-400' : 'text-red-400'}`}>{m.bondOrder}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-white/30">Magnetic</p>
                    <p className={`text-xs font-semibold ${m.magnetic === 'Paramagnetic' ? 'text-amber-400' : 'text-white/50'}`}>{m.magnetic}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'ionic' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              type: 'Ionic Bond', color: '#ef4444',
              points: [
                'Formed by complete transfer of electrons',
                'Between metals and non-metals',
                'Strong electrostatic attraction',
                'High melting and boiling points',
                'Conducts electricity when dissolved/melted',
                'e.g. NaCl, MgO, CaF₂',
              ],
            },
            {
              type: 'Covalent Bond', color: '#06b6d4',
              points: [
                'Formed by sharing of electron pairs',
                'Between non-metals',
                'Can be single, double, or triple bonds',
                'Lower melting and boiling points',
                'Generally poor conductors of electricity',
                'e.g. H₂O, CO₂, CH₄, N₂',
              ],
            },
          ].map((bond) => (
            <div key={bond.type} className="rounded-xl border p-4" style={{ borderColor: `${bond.color}30` }}>
              <p className="font-semibold mb-3" style={{ color: bond.color }}>{bond.type}</p>
              <ul className="space-y-1.5">
                {bond.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-xs text-white/60">
                    <span className="mt-0.5" style={{ color: bond.color }}>◆</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
