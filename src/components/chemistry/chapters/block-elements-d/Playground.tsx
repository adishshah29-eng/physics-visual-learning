import React, { useState } from 'react';

type Complex = 'aqua' | 'ammine' | 'chloro';

export default function DBlockExplore() {
  const [active, setActive] = useState<Complex>('aqua');

  const complexes = {
    aqua: {
      name: '[Cu(H₂O)₆]²⁺',
      color: '#3b82f6', // Light blue
      ligand: 'H₂O (Weak-field ligand)',
      splitting: 'Small Δ₀',
      absorbed: 'Red / Orange region (lower energy)',
      observed: 'Pale Blue',
      desc: 'Water is a weak-field ligand, causing a relatively small splitting of the d-orbitals. It absorbs lower-energy red light, making the transmitted light appear pale blue.',
      gap: 30
    },
    ammine: {
      name: '[Cu(NH₃)₄(H₂O)₂]²⁺',
      color: '#1d4ed8', // Deep blue/violet
      ligand: 'NH₃ (Stronger-field ligand)',
      splitting: 'Larger Δ₀',
      absorbed: 'Yellow region (higher energy)',
      observed: 'Deep Royal Blue',
      desc: 'Ammonia is a stronger ligand than water. It causes a larger d-orbital splitting, so the complex absorbs higher-energy yellow light, appearing deep blue.',
      gap: 50
    },
    chloro: {
      name: '[CuCl₄]²⁻',
      color: '#bef264', // Yellowish-green
      ligand: 'Cl⁻ (Very weak-field ligand, tetrahedral)',
      splitting: 'Very small Δt (Δt ≈ 4/9 Δ₀)',
      absorbed: 'Red/Infrared region',
      observed: 'Yellow-Green',
      desc: 'Chloride is a very weak-field ligand and often forms tetrahedral complexes with Cu²⁺. Tetrahedral splitting is much smaller than octahedral, absorbing at the red extreme, appearing yellow-green.',
      gap: 15
    }
  };

  const current = complexes[active];

  return (
    <div className="flex flex-col bg-slate-900/40 text-slate-100 p-4 rounded-xl border border-slate-800 h-full overflow-y-auto w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-sky-400">d-Block Elements & Coordination</h2>
        <p className="text-xs text-slate-400">
          Explore how different ligands change the d-orbital splitting (Crystal Field Theory) and color of Copper(II) complexes.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {(['aqua', 'ammine', 'chloro'] as Complex[]).map(c => (
          <button 
            key={c}
            onClick={() => setActive(c)}
            className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${active === c ? 'text-white border-slate-500' : 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700'}`}
            style={active === c ? { backgroundColor: `${complexes[c].color}40`, borderTopColor: complexes[c].color } : {}}
          >
            {complexes[c].name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Solution Flask Visualizer */}
        <div className="glass-panel h-64 flex flex-col items-center justify-center rounded-xl bg-slate-950 border border-slate-800/50 p-4 relative overflow-hidden">
          <p className="absolute top-3 left-3 text-xs text-slate-500 font-bold uppercase tracking-widest text-left">Observed<br/>Solution</p>
          
          <div className="relative w-32 h-40 mt-4">
            {/* Flask Neck */}
            <div className="absolute top-0 left-10 w-12 h-16 border-x-4 border-slate-300/40 bg-white/5 z-20"></div>
            {/* Flask Body */}
            <div className="absolute bottom-0 left-0 w-32 h-28 border-4 border-slate-300/40 rounded-b-3xl rounded-t-[40%] bg-white/5 z-20 overflow-hidden">
              {/* Liquid inside */}
              <div 
                className="absolute bottom-0 w-full rounded-b-2xl transition-all duration-700 ease-in-out"
                style={{ 
                  height: '80%', 
                  backgroundColor: current.color,
                  boxShadow: `0 0 30px ${current.color}`
                }}
              >
                {/* Surface highlight */}
                <div className="w-full h-3 bg-white/30 rounded-[50%] absolute top-0"></div>
              </div>
            </div>
            {/* Label */}
            <div className="absolute -bottom-8 w-full text-center text-sm font-bold shadow-black drop-shadow-md text-white z-30">
              {current.observed}
            </div>
          </div>
        </div>

        {/* d-Orbital Splitting Diagram */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800/50 bg-slate-900 shadow-lg relative min-h-64">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 text-center">d-Orbital Splitting</h3>
          
          <div className="flex items-center justify-center gap-6 h-32 relative mt-4">
            {/* Energy Axis */}
            <div className="absolute left-0 bottom-0 top-0 w-0.5 bg-slate-700 flex flex-col justify-between items-center py-2">
              <div className="w-2 h-2 border-t-2 border-l-2 border-slate-500 rotate-45 -translate-y-1"></div>
              <span className="text-[10px] text-slate-500 -rotate-90 origin-center whitespace-nowrap -translate-x-4 uppercase tracking-widest">Energy</span>
            </div>

            {/* Degenerate state (hidden for simplicity but anchors the mental model) */}
            
            {/* Split states */}
            <div className="flex flex-col items-center justify-center w-full relative">
              
              {/* Top orbitals (eg or t2) */}
              <div className="flex gap-2 transition-all duration-500" style={{ transform: `translateY(-${current.gap}px)` }}>
                {active === 'chloro' ? (
                  /* Tetrahedral: 3 top */
                  <>
                    <div className="w-8 h-1 bg-slate-600 rounded-full relative"><div className="absolute -top-3 left-3 text-red-400 font-bold text-xs">↑</div></div>
                    <div className="w-8 h-1 bg-slate-600 rounded-full relative"><div className="absolute -top-3 left-3 text-red-400 font-bold text-xs">↑</div></div>
                    <div className="w-8 h-1 bg-slate-600 rounded-full relative"><div className="absolute -top-3 left-3 text-red-400 font-bold text-xs">↑</div></div>
                  </>
                ) : (
                  /* Octahedral: 2 top */
                  <>
                    <div className="w-8 h-1 bg-slate-600 rounded-full relative"><div className="absolute -top-3 left-2 text-red-400 font-bold text-xs">↑↓</div></div>
                    <div className="w-8 h-1 bg-slate-600 rounded-full relative"><div className="absolute -top-3 left-3 text-red-400 font-bold text-xs">↑</div></div>
                  </>
                )}
              </div>

              {/* The Gap (\Delta) */}
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center transition-all duration-500" style={{ height: current.gap * 2 }}>
                <div className="border-l border-dashed border-sky-500/50 h-full relative flex items-center">
                  <span className="bg-slate-900 text-[10px] text-sky-400 px-1 absolute -translate-x-1/2 border border-sky-900 rounded">{active === 'chloro' ? 'Δt' : 'Δ₀'}</span>
                </div>
              </div>

              {/* Bottom orbitals (t2g or e) */}
              <div className="flex gap-2 transition-all duration-500" style={{ transform: `translateY(${current.gap}px)` }}>
                {active === 'chloro' ? (
                  /* Tetrahedral: 2 bottom */
                  <>
                    <div className="w-8 h-1 bg-slate-600 rounded-full relative"><div className="absolute -top-3 left-2 text-red-400 font-bold text-xs">↑↓</div></div>
                    <div className="w-8 h-1 bg-slate-600 rounded-full relative"><div className="absolute -top-3 left-2 text-red-400 font-bold text-xs">↑↓</div></div>
                  </>
                ) : (
                  /* Octahedral: 3 bottom */
                  <>
                    <div className="w-8 h-1 bg-slate-600 rounded-full relative"><div className="absolute -top-3 left-2 text-red-400 font-bold text-xs">↑↓</div></div>
                    <div className="w-8 h-1 bg-slate-600 rounded-full relative"><div className="absolute -top-3 left-2 text-red-400 font-bold text-xs">↑↓</div></div>
                    <div className="w-8 h-1 bg-slate-600 rounded-full relative"><div className="absolute -top-3 left-2 text-red-400 font-bold text-xs">↑↓</div></div>
                  </>
                )}
              </div>

            </div>
          </div>
          
          <div className="mt-6 text-xs text-slate-300">
            <p className="mb-2"><span className="text-slate-500">Ligand Field:</span> <span className="text-emerald-400 font-mono">{current.ligand}</span></p>
            <p className="mb-2"><span className="text-slate-500">Light Absorbed:</span> <span className="text-amber-400 font-mono">{current.absorbed}</span></p>
            <p className="text-slate-400 leading-tight border-t border-slate-800 pt-2 mt-2">{current.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
