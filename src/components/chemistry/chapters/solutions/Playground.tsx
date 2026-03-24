// src/components/chemistry/explore/SolutionsExplore.tsx
import { useState } from 'react';

const Kf: Record<string, number> = { Water: 1.86, Benzene: 5.12, Camphor: 37.7 };
const Kb: Record<string, number> = { Water: 0.512, Benzene: 2.53, Camphor: 5.95 };

export default function SolutionsExplore() {
  const [solvent, setSolvent] = useState('Water');
  const [molality, setMolality] = useState(1);
  const [vantHoff, setVantHoff] = useState(1);

  const deltaFP = (Kf[solvent] * molality * vantHoff).toFixed(3);
  const deltaBP = (Kb[solvent] * molality * vantHoff).toFixed(3);
  const osmotic = (molality * 8.314 * 298 * vantHoff / 1000).toFixed(3);

  return (
    <div className="space-y-5">
      {/* Raoult's Law */}
      <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
        <p className="text-sm font-semibold text-sky-400 mb-2">Raoult's Law</p>
        <p className="text-xs text-white/50 leading-relaxed mb-3">
          The partial vapour pressure of each component of an ideal solution is equal to its mole fraction multiplied by the vapour pressure of the pure component: <span className="font-mono text-sky-300">p₁ = x₁ · p₁°</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg bg-white/5 p-3">
            <p className="text-[10px] text-white/30 uppercase mb-1">Positive Deviation</p>
            <p className="text-xs text-white/60">Observed vapour pressure &gt; Raoult's prediction. A–B interactions weaker than A–A, B–B. e.g. ethanol-water.</p>
          </div>
          <div className="rounded-lg bg-white/5 p-3">
            <p className="text-[10px] text-white/30 uppercase mb-1">Negative Deviation</p>
            <p className="text-xs text-white/60">Observed vapour pressure &lt; Raoult's prediction. A–B interactions stronger. e.g. chloroform-acetone.</p>
          </div>
        </div>
      </div>

      {/* Colligative properties calculator */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-semibold text-white mb-4">Colligative Properties Calculator</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div>
            <label className="text-[10px] text-white/30 uppercase block mb-1">Solvent</label>
            <select
              value={solvent}
              onChange={(e) => setSolvent(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs"
            >
              {Object.keys(Kf).map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-white/30 uppercase block mb-1">Molality (m)</label>
            <input type="number" value={molality}
              onChange={(e) => setMolality(Math.max(0, Number(e.target.value)))}
              step="0.1" placeholder="1"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs" />
          </div>
          <div>
            <label className="text-[10px] text-white/30 uppercase block mb-1">van't Hoff (i)</label>
            <input type="number" value={vantHoff}
              onChange={(e) => setVantHoff(Math.max(1, Number(e.target.value)))}
              step="0.1" placeholder="1"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'ΔTf (Freezing pt. depression)', value: `−${deltaFP} °C`, color: '#06b6d4', formula: `Kf × m × i = ${Kf[solvent]} × ${molality} × ${vantHoff}` },
            { label: 'ΔTb (Boiling pt. elevation)', value: `+${deltaBP} °C`, color: '#ef4444', formula: `Kb × m × i = ${Kb[solvent]} × ${molality} × ${vantHoff}` },
            { label: 'π (Osmotic pressure)', value: `${osmotic} kPa`, color: '#10b981', formula: 'π = iMRT (approx.)' },
          ].map((r) => (
            <div key={r.label} className="rounded-xl bg-white/5 border border-white/8 p-3">
              <p className="text-[10px] text-white/30 mb-1 leading-tight">{r.label}</p>
              <p className="text-lg font-bold mb-1" style={{ color: r.color }}>{r.value}</p>
              <p className="text-[9px] text-white/20 font-mono">{r.formula}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
          <p className="text-xs text-amber-400 font-semibold mb-1">van't Hoff Factor (i)</p>
          <p className="text-xs text-white/50">i = 1 for non-electrolytes. For NaCl → Na⁺ + Cl⁻, i ≈ 2. For CaCl₂ → Ca²⁺ + 2Cl⁻, i ≈ 3. Abnormal molar mass when i ≠ 1.</p>
        </div>
      </div>
    </div>
  );
}
