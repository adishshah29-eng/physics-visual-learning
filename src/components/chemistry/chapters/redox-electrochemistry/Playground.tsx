// src/components/chemistry/explore/ElectrochemistryExplore.tsx
import { useState } from 'react';

const HALF_CELLS = [
  { name: 'Li⁺/Li',   E0: -3.04, color: '#a78bfa' },
  { name: 'Zn²⁺/Zn',  E0: -0.76, color: '#06b6d4' },
  { name: 'Fe²⁺/Fe',  E0: -0.44, color: '#f97316' },
  { name: 'H⁺/H₂',   E0:  0.00, color: '#6b7280' },
  { name: 'Cu²⁺/Cu',  E0: +0.34, color: '#f59e0b' },
  { name: 'Ag⁺/Ag',   E0: +0.80, color: '#d1d5db' },
  { name: 'Au³⁺/Au',  E0: +1.50, color: '#fbbf24' },
  { name: 'F₂/F⁻',    E0: +2.87, color: '#10b981' },
];

export default function ElectrochemistryExplore() {
  const [anode, setAnode] = useState(1);   // Zn
  const [cathode, setCathode] = useState(4); // Cu (Daniel cell)

  const anodeCell = HALF_CELLS[anode];
  const cathodeCell = HALF_CELLS[cathode];
  const emf = (cathodeCell.E0 - anodeCell.E0).toFixed(2);
  const spontaneous = parseFloat(emf) > 0;

  return (
    <div className="space-y-5">
      {/* Cell diagram */}
      <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 sm:p-5">
        <p className="text-xs text-white/30 text-center mb-4 font-mono">Galvanic Cell Simulator</p>
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Anode */}
          <div className="flex-1 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-center">
            <p className="text-[10px] text-red-400 uppercase font-bold mb-2">Anode (−) Oxidation</p>
            <select
              value={anode}
              onChange={(e) => setAnode(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-xs mb-2"
            >
              {HALF_CELLS.map((h, i) => <option key={i} value={i}>{h.name}</option>)}
            </select>
            <p className="text-lg font-bold" style={{ color: anodeCell.color }}>
              E° = {anodeCell.E0 > 0 ? '+' : ''}{anodeCell.E0} V
            </p>
            <p className="text-xs text-white/30 font-mono mt-1">{anodeCell.name.split('/')[1]}(s) → {anodeCell.name.split('/')[0]}(aq) + e⁻</p>
          </div>

          {/* Bridge + EMF */}
          <div className="text-center">
            <div className="w-16 h-1 bg-amber-400/40 rounded mx-auto" />
            <p className="text-[9px] text-white/20 mt-0.5">salt bridge</p>
            <div className="mt-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-[10px] text-white/30">E°cell</p>
              <p className={`text-xl font-bold ${spontaneous ? 'text-sky-400' : 'text-red-400'}`}>{emf} V</p>
              <p className="text-[9px] mt-0.5" style={{ color: spontaneous ? '#38bdf8' : '#ef4444' }}>
                {spontaneous ? '✓ Spontaneous' : '✗ Non-spontaneous'}
              </p>
            </div>
            <div className="mt-1 text-[8px] text-white/20">e⁻ flow →</div>
          </div>

          {/* Cathode */}
          <div className="flex-1 rounded-xl border border-sky-500/30 bg-sky-500/5 p-4 text-center">
            <p className="text-[10px] text-sky-400 uppercase font-bold mb-2">Cathode (+) Reduction</p>
            <select
              value={cathode}
              onChange={(e) => setCathode(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-xs mb-2"
            >
              {HALF_CELLS.map((h, i) => <option key={i} value={i}>{h.name}</option>)}
            </select>
            <p className="text-lg font-bold" style={{ color: cathodeCell.color }}>
              E° = {cathodeCell.E0 > 0 ? '+' : ''}{cathodeCell.E0} V
            </p>
            <p className="text-xs text-white/30 font-mono mt-1">{cathodeCell.name.split('/')[0]}(aq) + e⁻ → {cathodeCell.name.split('/')[1]}(s)</p>
          </div>
        </div>
        <p className="text-xs text-white/30 text-center mt-4 font-mono">
          E°cell = E°cathode − E°anode = {cathodeCell.E0.toFixed(2)} − ({anodeCell.E0.toFixed(2)}) = {emf} V
        </p>
      </div>

      {/* SRP table */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-semibold text-white mb-3">Standard Reduction Potentials</p>
        <div className="space-y-1.5">
          {HALF_CELLS.slice().sort((a, b) => a.E0 - b.E0).map((h) => (
            <div key={h.name} className="flex items-center gap-3">
              <span className="text-xs font-mono text-white/50 w-16">{h.name}</span>
              <div className="flex-1 relative h-3 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 h-full rounded-full"
                  style={{
                    width: `${Math.abs(h.E0) / 3.0 * 50}%`,
                    left: h.E0 < 0 ? `${50 - Math.abs(h.E0) / 3.0 * 50}%` : '50%',
                    background: h.E0 < 0 ? '#ef4444' : '#38bdf8',
                  }}
                />
                <div className="absolute top-0 left-1/2 w-px h-full bg-white/20" />
              </div>
              <span className="text-xs font-mono w-14 text-right" style={{ color: h.color }}>
                {h.E0 > 0 ? '+' : ''}{h.E0} V
              </span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-white/20 mt-2">Higher E° = stronger oxidizing agent. Lower E° = stronger reducing agent.</p>
      </div>
    </div>
  );
}
