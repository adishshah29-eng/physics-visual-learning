import React, { useState } from 'react';

type Phase = 'gas' | 'aqueous';

export default function AminesExplore() {
  const [phase, setPhase] = useState<Phase>('gas');

  const data = {
    gas: {
      title: 'Gas Phase (No Solvent)',
      desc: 'In the gas phase, basicity is determined solely by the +I (inductive) effect of alkyl groups.',
      trend: '3° > 2° > 1° > NH₃',
      explanation: 'Alkyl groups are electron-donating. More alkyl groups = higher electron density on nitrogen = stronger Lewis base. Therefore, tertiary amines are the strongest bases.',
      order: [
        { type: '3°', label: 'R₃N', str: 4 },
        { type: '2°', label: 'R₂NH', str: 3 },
        { type: '1°', label: 'RNH₂', str: 2 },
        { type: '0°', label: 'NH₃', str: 1 }
      ],
      color: '#fb923c' // orange
    },
    aqueous: {
      title: 'Aqueous Phase (Methyl substitution)',
      desc: 'In water, basicity depends on 3 competing factors: +I effect, Solvation (H-bonding), and Steric hindrance.',
      trend: '2° > 1° > 3° > NH₃',
      explanation: 'Secondary amines have the best balance. Tertiary amines have maximum +I effect but severe steric hindrance to protonation and very poor stabilization by water (solvation) because the conjugate acid has only one H to hydrogen-bond.',
      order: [
        { type: '2°', label: '(CH₃)₂NH', str: 4 },
        { type: '1°', label: 'CH₃NH₂', str: 3 },
        { type: '3°', label: '(CH₃)₃N', str: 2 },
        { type: '0°', label: 'NH₃', str: 1 }
      ],
      color: '#38bdf8' // sky
    }
  };

  const current = data[phase];

  return (
    <div className="flex flex-col bg-slate-900/40 text-slate-100 p-4 rounded-xl border border-slate-800 h-full overflow-y-auto w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-sky-400">Amine Basicity Trends</h2>
        <p className="text-xs text-slate-400">
          Compare how the basic strength of amines changes drastically depending on the solvent environment.
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setPhase('gas')}
          className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${phase === 'gas' ? 'text-white border-slate-500 bg-orange-500/30' : 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700'}`}
          style={phase === 'gas' ? { borderTopColor: '#fb923c' } : {}}
        >
          Gas Phase
        </button>
        <button 
          onClick={() => setPhase('aqueous')}
          className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${phase === 'aqueous' ? 'text-white border-slate-500 bg-sky-500/30' : 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700'}`}
          style={phase === 'aqueous' ? { borderTopColor: '#38bdf8' } : {}}
        >
          Aqueous Phase
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Visualizer */}
        <div className="glass-panel h-64 flex flex-col items-end justify-center rounded-xl bg-slate-950 border border-slate-800/50 p-6 relative">
          <p className="absolute top-3 left-3 text-xs text-slate-500 font-bold uppercase tracking-widest text-left">Basicity Strength</p>
          
          <div className="w-full flex-1 flex items-end justify-around pb-4 gap-2 mt-6">
            {current.order.map((item, i) => (
              <div key={i} className="flex flex-col items-center justify-end h-full">
                <span className="text-[10px] text-slate-400 mb-2 font-mono">{item.type}</span>
                <div 
                  className="w-12 rounded-t-sm transition-all duration-700 relative flex items-start justify-center pt-2"
                  style={{ 
                    height: `${item.str * 25}%`,
                    backgroundColor: current.color,
                    opacity: 0.8
                  }}
                >
                  {/* Rank indicator */}
                  <span className="text-white font-bold drop-shadow-md text-xs">{5 - item.str}</span>
                </div>
                <span className="text-xs font-bold text-slate-200 mt-2">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="w-full border-t border-slate-800 pt-2 text-center text-lg font-bold tracking-widest" style={{ color: current.color }}>
            {current.trend}
          </div>
        </div>

        {/* Data Box */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800/50 bg-slate-900 shadow-lg min-h-64 flex flex-col">
          <h3 className="text-xl font-bold mb-2" style={{ color: current.color }}>{current.title}</h3>
          
          <div className="bg-slate-950 p-3 rounded border border-slate-800 mb-4">
            <span className="text-xs font-bold text-slate-500 block mb-1">Dominant Factors</span>
            <p className="text-sm font-medium text-slate-200">{current.desc}</p>
          </div>
          
          <div className="space-y-2 flex-1">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Explanation</h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/30 p-3 rounded-lg border border-slate-800/50">
              {current.explanation}
            </p>
          </div>

          {phase === 'aqueous' && (
            <div className="mt-4 text-[10px] text-slate-400 italic">
              *Note: For ethyl substitution (N(C₂H₅)₃, etc.), the trend changes again to 2° {'>'} 3° {'>'} 1° {'>'} NH₃ due to increased +I effect of ethyl overcoming some steric hindrance compared to methyl.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
