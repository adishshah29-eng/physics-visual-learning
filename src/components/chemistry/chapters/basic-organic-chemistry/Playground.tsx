import React, { useState } from 'react';
import Molecule3D, { AtomData, BondData } from '../../ui/Molecule3D';

type Enantiomer = 'lacticR' | 'lacticS';

export default function BasicOrganicExplore() {
  const [active, setActive] = useState<Enantiomer>('lacticR');

  // Lactic acid chiral center (C2 is the center)
  // Simplified coordinates to easily visualize mirror images
  const createLacticAcid = (isR: boolean) => {
    // Shared core (C2 is at origin, C1 is left, C3 is right)
    const baseAtoms: AtomData[] = [
      { id: 'C2', position: [0, 0, 0], element: 'C' },      // Chiral center
      { id: 'C1', position: [-1.2, -0.7, 0], element: 'C' }, // Carboxyl Carbon
      { id: 'O1', position: [-1.5, -1.8, 0], element: 'O', radius: 0.5 }, // =O
      { id: 'O2', position: [-2.0, 0.2, 0], element: 'O', radius: 0.5 },  // -OH
      { id: 'H1', position: [-2.8, -0.1, 0], element: 'H', radius: 0.3 }, // H on carboxyl OH
      { id: 'C3', position: [1.3, -0.5, 0], element: 'C' },  // Methyl Carbon
      { id: 'H2', position: [1.5, -1.5, 0], element: 'H' },  // Methyl H
      { id: 'H3', position: [1.8, -0.1, 0.8], element: 'H' }, // Methyl H
      { id: 'H4', position: [1.8, -0.1, -0.8], element: 'H' }, // Methyl H
    ];
    
    // The substituents on the chiral C2 that flip
    // -OH group and -H group
    // In R-Lactic Acid, OH is coming OUT (+z), H is going IN (-z)
    // In S-Lactic Acid, OH is going IN (-z), H is coming OUT (+z)
    // Both are pointing "up"
    
    const zDir = isR ? 1 : -1;
    
    baseAtoms.push(
      { id: 'O3', position: [0, 1.2, 1.0 * zDir], element: 'O', radius: 0.6 }, // Hydroxyl O
      { id: 'H5', position: [0, 1.8, 1.5 * zDir], element: 'H', radius: 0.3 }, // Hydroxyl H
      { id: 'H6', position: [0, 1.0, -1.0 * zDir], element: 'H', radius: 0.3 }  // Direct H on chiral center
    );

    const bonds: BondData[] = [
      { source: 'C2', target: 'C1', type: 1 },
      { source: 'C1', target: 'O1', type: 2 },
      { source: 'C1', target: 'O2', type: 1 },
      { source: 'O2', target: 'H1', type: 1 },
      
      { source: 'C2', target: 'C3', type: 1 },
      { source: 'C3', target: 'H2', type: 1 },
      { source: 'C3', target: 'H3', type: 1 },
      { source: 'C3', target: 'H4', type: 1 },

      { source: 'C2', target: 'O3', type: 1 },
      { source: 'O3', target: 'H5', type: 1 },
      { source: 'C2', target: 'H6', type: 1 }
    ];

    return { atoms: baseAtoms, bonds };
  };

  const models = {
    lacticR: {
      name: '(R)-Lactic Acid',
      desc: 'The R-enantiomer rotates plane-polarized light in a specific direction. Try rotating the model to see how it can NEVER be superimposed on the S-enantiomer, despite having the exact same connectivity.',
      ...createLacticAcid(true)
    },
    lacticS: {
      name: '(S)-Lactic Acid',
      desc: 'The S-enantiomer is the perfect non-superimposable mirror image of the (R) version. These are known as enantiomers.',
      ...createLacticAcid(false)
    }
  };

  const current = models[active];

  return (
    <div className="flex flex-col bg-slate-900/40 text-slate-100 p-4 rounded-xl border border-slate-800 h-full overflow-y-auto w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-sky-400">Basic Organic Chemistry: Stereoisomerism</h2>
        <p className="text-xs text-slate-400">
          Explore chirality in 3D. A chiral molecule is one that cannot be superimposed on its mirror image.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          onClick={() => setActive('lacticR')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${active === 'lacticR' ? 'bg-purple-500 text-white shadow-[0_0_15px_#a855f7] border-transparent' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'}`}
        >
          (R)-Lactic Acid
        </button>
        <button 
          onClick={() => setActive('lacticS')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${active === 'lacticS' ? 'bg-fuchsia-500 text-white shadow-[0_0_15px_#d946ef] border-transparent' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'}`}
        >
          (S)-Lactic Acid
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start flex-1 min-h-[400px]">
        {/* 3D Visualizer wrapper */}
        <div className="glass-panel h-[400px] rounded-xl border border-slate-800/50 bg-slate-950 relative overflow-hidden group">
          <p className="absolute top-3 left-3 text-xs text-white/50 font-bold uppercase tracking-widest z-10 pointer-events-none">Interactive 3D Mirror Images</p>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none bg-black/50 px-3 py-1.5 rounded-full border border-white/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M5 14h14v7H5z"/><path d="M5 8v6"/><path d="M19 8v6"/><path d="M5 8V3h14v5"/><path d="m9 14 3-3 3 3"/></svg>
            <span className="text-[10px] uppercase font-bold text-white tracking-widest mt-0.5">Drag to Rotate</span>
          </div>

          <Molecule3D key={active} atoms={current.atoms} bonds={current.bonds} autoRotate={false} />
        </div>

        {/* Info Panel */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800/50 bg-slate-900 shadow-lg flex flex-col justify-center min-h-[400px]">
          <h3 className="text-3xl font-black text-white mb-2 tracking-tight">{current.name}</h3>
          <p className="font-mono text-purple-400 mb-6 bg-purple-950/30 px-3 py-1.5 rounded inline-block self-start border border-purple-900/50">
            C₃H₆O₃
          </p>
          
          <div className="space-y-5">
            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Optical Activity</h4>
              <p className="text-sm font-bold text-slate-200">Enantiomer pairs rotate polarized light in opposite directions.</p>
            </div>
            
            <div className="h-px bg-slate-800 w-full"></div>

            <div>
              <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Chirality (The Handedness of Molecules)</h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 rounded border border-slate-800 p-3 shadow-inner">
                {current.desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
