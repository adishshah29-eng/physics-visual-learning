import React, { useState } from 'react';

type Compound = 'alcohol' | 'phenol' | 'ether';

export default function AlcoholsExplore() {
  const [active, setActive] = useState<Compound>('phenol');

  const compounds = {
    alcohol: {
      name: 'Aliphatic Alcohol (R-OH)',
      pKa: '~ 16',
      acidity: 'Weak Acid',
      conjBase: 'Alkoxide Ion (R-O⁻)',
      stability: 'Unstable. The negative charge is localized purely on the electronegative oxygen atom.',
      solubility: 'Soluble in water (up to ~C4) due to H-bonding.',
      color: '#38bdf8',
      reaction: 'R-OH  ⇌  H⁺  +  R-[O]⁻'
    },
    phenol: {
      name: 'Phenol (Ph-OH)',
      pKa: '~ 10',
      acidity: 'Moderate Acid (~10⁶x stronger than aliphatic)',
      conjBase: 'Phenoxide Ion (Ph-O⁻)',
      stability: 'Stable. The negative charge is delocalized into the benzene ring via resonance.',
      solubility: 'Sparingly soluble in water.',
      color: '#8b5cf6',
      reaction: 'Ph-OH  ⇌  H⁺  +  [Ph-O]⁻ (Resonance Stabilized)'
    },
    ether: {
      name: 'Ether (R-O-R\')',
      pKa: 'N/A (No acidic proton)',
      acidity: 'Not Acidic',
      conjBase: 'None',
      stability: 'Does not readily lose a proton.',
      solubility: 'Slightly soluble (can accept H-bonds but not donate them).',
      color: '#f59e0b',
      reaction: 'R-O-R\'  +  H⁺  ⇌  No Reaction (under normal conditions)'
    }
  };

  const current = compounds[active];

  return (
    <div className="flex flex-col bg-slate-900/40 text-slate-100 p-4 rounded-xl border border-slate-800 h-full overflow-y-auto w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-sky-400">Acidity of Oxygen Compounds</h2>
        <p className="text-xs text-slate-400">
          Compare the acidity and conjugate base stability of Alcohols, Phenols, and Ethers.
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {(['alcohol', 'phenol', 'ether'] as Compound[]).map(c => (
          <button 
            key={c}
            onClick={() => setActive(c)}
            className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${active === c ? 'text-white border-slate-500' : 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700'}`}
            style={active === c ? { backgroundColor: `${compounds[c].color}40`, borderTopColor: compounds[c].color } : {}}
          >
            {compounds[c].name.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Visualizer */}
        <div className="glass-panel h-64 flex flex-col items-center justify-center rounded-xl bg-slate-950 border border-slate-800/50 p-6 relative">
          <p className="absolute top-3 left-3 text-xs text-slate-500 font-bold uppercase tracking-widest text-left">Conjugate Base</p>
          
          <div className="w-full h-full flex items-center justify-center relative">
            {active === 'alcohol' && (
              <div className="flex items-center text-4xl font-bold tracking-widest text-sky-400">
                R<span className="text-slate-500 mx-2">-</span>
                <div className="relative">
                  O
                  <span className="absolute -top-3 -right-4 text-2xl text-red-500 font-black glow-red">⁻</span>
                </div>
              </div>
            )}
            
            {active === 'phenol' && (
              <div className="flex flex-col items-center">
                {/* Hexagon for Benzene ring */}
                <div className="relative w-24 h-28 flex items-center justify-center mb-2">
                  <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_10s_linear_infinite]">
                    <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="none" stroke="#8b5cf6" strokeWidth="4" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="10 5" className="opacity-60" />
                  </svg>
                  {/* Resonance indicator */}
                  <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full mix-blend-screen animate-pulse"></div>
                </div>
                <div className="w-1 h-6 bg-slate-500"></div>
                <div className="text-4xl font-bold text-purple-400 relative">
                  O
                  <span className="absolute -top-3 -right-4 text-2xl text-red-500 font-black glow-red">⁻</span>
                </div>
              </div>
            )}
            
            {active === 'ether' && (
              <div className="flex flex-col items-center text-slate-500 text-center">
                <span className="text-4xl mb-4 text-amber-500">∅</span>
                <p className="text-sm">Cannot act as an acid (no H attached to highly electronegative O).</p>
              </div>
            )}
          </div>
        </div>

        {/* Data Box */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800/50 bg-slate-900 shadow-lg relative min-h-64">
          <h3 className="text-xl font-bold mb-1" style={{ color: current.color }}>{current.name}</h3>
          
          <div className="flex gap-4 mb-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block mb-1">pKa</span>
              <span className="text-lg font-mono font-bold text-slate-200">{current.pKa}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block mb-1">Acidity</span>
              <span className="text-sm font-bold" style={{ color: current.color }}>{current.acidity}</span>
            </div>
          </div>
          
          <div className="space-y-4 text-xs">
            <div>
              <span className="text-slate-500 block mb-1">Dissociation Equilibrium</span>
              <div className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-emerald-400 text-center tracking-wider">
                {current.reaction}
              </div>
            </div>
            
            <div>
              <span className="text-slate-500 block mb-1">Conjugate Base Stability</span>
              <p className="text-slate-300 leading-relaxed bg-slate-800/50 p-2 rounded">
                <span className="font-bold text-slate-200">{current.conjBase}:</span> {current.stability}
              </p>
            </div>
            
            <div>
              <span className="text-slate-500 block mb-1">Misc Properties</span>
              <p className="text-slate-400 leading-relaxed">
                {current.solubility}
              </p>
            </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .glow-red { text-shadow: 0 0 10px rgba(239, 68, 68, 0.8); }
      `}} />
    </div>
  );
}
