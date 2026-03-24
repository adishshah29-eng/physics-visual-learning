// src/components/chemistry/explore/BasicConceptsExplore.tsx
import { useState } from 'react';

export default function BasicConceptsExplore() {
  const [moles, setMoles] = useState(1);
  const [molarMass, setMolarMass] = useState(18); // water
  const [selectedCompound, setSelectedCompound] = useState('H₂O');

  const COMPOUNDS = [
    { name: 'H₂O', M: 18.015, formula: 'H₂O' },
    { name: 'NaCl', M: 58.44, formula: 'NaCl' },
    { name: 'CO₂', M: 44.01, formula: 'CO₂' },
    { name: 'NH₃', M: 17.03, formula: 'NH₃' },
    { name: 'H₂SO₄', M: 98.08, formula: 'H₂SO₄' },
    { name: 'CaCO₃', M: 100.09, formula: 'CaCO₃' },
  ];

  const mass = (moles * molarMass).toFixed(3);
  const molecules = (moles * 6.022e23).toExponential(3);
  const stp_volume = (moles * 22.4).toFixed(2);

  return (
    <div className="space-y-5">
      {/* Mole Calculator */}
      <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 sm:p-5">
        <p className="text-sm font-semibold text-white mb-4">Mole Calculator</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
          <div>
            <label className="text-[10px] text-white/30 uppercase block mb-1">Compound</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
              value={selectedCompound}
              onChange={(e) => {
                const c = COMPOUNDS.find((x) => x.name === e.target.value)!;
                setSelectedCompound(c.name);
                setMolarMass(c.M);
              }}
            >
              {COMPOUNDS.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-white/30 uppercase block mb-1">Number of Moles</label>
            <input
              type="number"
              value={moles}
              onChange={(e) => setMoles(Math.max(0, Number(e.target.value)))}
              step="0.1"
              placeholder="1"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Mass', value: `${mass} g`, color: '#10b981' },
            { label: 'Molecules', value: molecules, color: '#06b6d4' },
            { label: 'Volume @STP', value: `${stp_volume} L`, color: '#8b5cf6' },
          ].map((r) => (
            <div key={r.label} className="rounded-xl bg-white/5 p-3 text-center border border-white/10">
              <p className="text-[10px] text-white/30 uppercase mb-1">{r.label}</p>
              <p className="font-bold text-sm" style={{ color: r.color }}>{r.value}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-white/20 mt-3 font-mono">
          M({selectedCompound}) = {molarMass} g/mol | Avogadro's number = 6.022 × 10²³
        </p>
      </div>

      {/* Laws */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { name: 'Law of Conservation of Mass', desc: 'Mass is neither created nor destroyed in a chemical reaction. Total mass of reactants = Total mass of products.', emoji: '⚖️' },
          { name: 'Law of Definite Proportions', desc: 'A pure compound always contains the same elements in the same ratio by mass.', emoji: '📐' },
          { name: 'Law of Multiple Proportions', desc: 'When two elements form more than one compound, masses of one element that combine with a fixed mass of the other are in simple whole-number ratios.', emoji: '✖️' },
          { name: "Avogadro's Law", desc: 'Equal volumes of all gases, at the same T and P, contain the same number of molecules.', emoji: '🫧' },
        ].map((law) => (
          <div key={law.name} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-start gap-2 mb-1">
              <span className="text-xl">{law.emoji}</span>
              <p className="text-xs font-semibold text-white">{law.name}</p>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">{law.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
