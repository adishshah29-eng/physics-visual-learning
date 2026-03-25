import React, { useState } from 'react';

type Carbonyl = 'aldehyde' | 'ketone';

export default function AldehydesExplore() {
  const [active, setActive] = useState<Carbonyl>('aldehyde');
  const [step, setStep] = useState(0);

  const data = {
    aldehyde: {
      name: 'Aldehyde (R-CHO)',
      reactivity: 'Higher',
      electronic: 'Only one electron-donating alkyl group (+I effect). The carbonyl carbon is more electrophilic (more positive).',
      steric: 'Only one bulky alkyl group. The nucleophile can easily approach the carbonyl carbon.',
      color: '#10b981', // emerald
      steps: [
        { label: 'Approach', desc: 'Nucleophile approaches the highly positive carbonyl carbon. Little steric hindrance from the small H atom.', img: 'Nu⁻  →  R-CH=O' },
        { label: 'Attack', desc: 'Nucleophile attacks, breaking the π bond. Electrons move to oxygen forming an alkoxide intermediate.', img: 'R-CH(Nu)-O⁻' },
        { label: 'Protonation', desc: 'The alkoxide grabs a proton from the solvent to form the final addition product.', img: 'R-CH(Nu)-OH' }
      ]
    },
    ketone: {
      name: 'Ketone (R-CO-R\')',
      reactivity: 'Lower',
      electronic: 'Two electron-donating alkyl groups (+I effect). The carbonyl carbon is less electrophilic (charge is stabilized).',
      steric: 'Two bulky alkyl groups crowd the carbonyl carbon, making nucleophilic approach difficult (steric hindrance).',
      color: '#f59e0b', // amber
      steps: [
        { label: 'Approach', desc: 'Nucleophile approach is slow and hindered by the two bulky alkyl (R/R\') groups.', img: 'Nu⁻  →  R-CO-R\'' },
        { label: 'Attack', desc: 'If successful, nucleophile attacks forming a very crowded alkoxide intermediate.', img: 'R-C(R\')(Nu)-O⁻' },
        { label: 'Protonation', desc: 'Protonation yields the final product. The equilibrium often favors reactants more than in aldehydes.', img: 'R-C(R\')(Nu)-OH' }
      ]
    }
  };

  const current = data[active];

  return (
    <div className="flex flex-col bg-slate-900/40 text-slate-100 p-4 rounded-xl border border-slate-800 h-full overflow-y-auto w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-sky-400">Nucleophilic Addition to Carbonyls</h2>
        <p className="text-xs text-slate-400">
          Compare the reactivity of Aldehydes and Ketones towards nucleophilic attack.
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {(['aldehyde', 'ketone'] as Carbonyl[]).map(c => (
          <button 
            key={c}
            onClick={() => { setActive(c); setStep(0); }}
            className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${active === c ? 'text-white border-slate-500' : 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700'}`}
            style={active === c ? { backgroundColor: `${data[c].color}40`, borderTopColor: data[c].color } : {}}
          >
            {data[c].name.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Reactivity Factors */}
        <div className="flex flex-col gap-4">
          <div className="glass-panel p-5 rounded-xl border border-slate-800/50 bg-slate-900 shadow-lg">
            <h3 className="text-xl font-bold mb-4" style={{ color: current.color }}>{current.name}</h3>
            
            <div className="mb-4">
              <span className="text-[10px] text-slate-500 uppercase block mb-1">Overall Reactivity</span>
              <span className="text-lg font-bold" style={{ color: current.color }}>{current.reactivity}</span>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <span className="text-xs font-bold text-sky-400 block mb-1">1. Electronic Factor (+I Effect)</span>
                <p className="text-xs text-slate-300">{current.electronic}</p>
              </div>
              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <span className="text-xs font-bold text-amber-500 block mb-1">2. Steric Factor</span>
                <p className="text-xs text-slate-300">{current.steric}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mechanism Visualizer */}
        <div className="glass-panel rounded-xl border border-slate-800/50 bg-slate-950 overflow-hidden flex flex-col h-full min-h-64">
          <div className="p-3 border-b border-slate-800/50 bg-slate-900 flex justify-between items-center">
            <button 
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="text-slate-400 disabled:opacity-30 hover:text-white px-2 text-xs font-bold tracking-widest uppercase"
            >
              ◀ Prev
            </button>
            <span className="text-xs font-bold" style={{ color: current.color }}>{current.steps[step].label}</span>
            <button 
              onClick={() => setStep(Math.min(2, step + 1))}
              disabled={step === 2}
              className="text-slate-400 disabled:opacity-30 hover:text-white px-2 text-xs font-bold tracking-widest uppercase"
            >
              Next ▶
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative">
            {/* Visual representation of hindrance */}
            {(step === 0) && (
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <div className={`rounded-full border-[10px] border-white transition-all duration-1000 ${active === 'ketone' ? 'w-48 h-48 border-amber-500' : 'w-24 h-24 border-emerald-500'}`}></div>
              </div>
            )}

            <div className="text-2xl font-mono font-bold tracking-widest text-slate-200 mb-6 drop-shadow-lg z-10 transition-all">
              {current.steps[step].img}
            </div>
            
            <p className="text-sm text-slate-300 z-10 bg-slate-900/80 p-3 rounded-lg border border-slate-800 backdrop-blur-sm">
              {current.steps[step].desc}
            </p>
          </div>
          
          {/* Reaction Coordinate Progress */}
          <div className="h-1 bg-slate-800 w-full relative">
            <div 
              className="h-full transition-all duration-500 ease-out" 
              style={{ 
                width: `${((step + 1) / 3) * 100}%`,
                backgroundColor: current.color
              }}
            ></div>
          </div>
        </div>

      </div>
    </div>
  );
}
