import React, { useState } from 'react';
import Molecule3D, { AtomData, BondData } from '../../ui/Molecule3D';

type Hydrocarbon = 'ethane' | 'ethene' | 'ethyne';

export default function HydrocarbonsExplore() {
  const [active, setActive] = useState<Hydrocarbon>('ethane');

  const molecules: Record<Hydrocarbon, {
    name: string;
    formula: string;
    hybridization: string;
    shape: string;
    desc: string;
    atoms: AtomData[];
    bonds: BondData[];
  }> = {
    ethane: {
      name: 'Ethane (Alkane)',
      formula: 'C₂H₆',
      hybridization: 'sp³ (Tetrahedral around each C)',
      shape: '3D Staggered (lowest energy)',
      desc: 'Saturated hydrocarbon with a carbon-carbon single bond. Free rotation around the C-C bond occurs, but the staggered conformation shown is the most stable state.',
      atoms: [
        { id: 'C1', position: [-0.75, 0, 0], element: 'C' },
        { id: 'C2', position: [0.75, 0, 0], element: 'C' },
        // C1 Hydrogens (staggered relative to C2)
        { id: 'H1', position: [-1.25, 1.0, 0], element: 'H' }, // Up
        { id: 'H2', position: [-1.25, -0.5, 0.866], element: 'H' }, // Down-Right
        { id: 'H3', position: [-1.25, -0.5, -0.866], element: 'H' }, // Down-Left
        // C2 Hydrogens (rotated 60deg relative to C1)
        { id: 'H4', position: [1.25, -1.0, 0], element: 'H' }, // Down
        { id: 'H5', position: [1.25, 0.5, 0.866], element: 'H' }, // Up-Right
        { id: 'H6', position: [1.25, 0.5, -0.866], element: 'H' }  // Up-Left
      ],
      bonds: [
        { source: 'C1', target: 'C2', type: 1 }, // C-C single
        { source: 'C1', target: 'H1', type: 1 },
        { source: 'C1', target: 'H2', type: 1 },
        { source: 'C1', target: 'H3', type: 1 },
        { source: 'C2', target: 'H4', type: 1 },
        { source: 'C2', target: 'H5', type: 1 },
        { source: 'C2', target: 'H6', type: 1 }
      ]
    },
    ethene: {
      name: 'Ethene (Alkene)',
      formula: 'C₂H₄',
      hybridization: 'sp² (Trigonal Planar around each C)',
      shape: 'Planar (Flat)',
      desc: 'Unsaturated hydrocarbon with a carbon-carbon double bond (one σ and one π bond). The π bond restricts rotation, locking all six atoms into a single 2D plane.',
      atoms: [
        { id: 'C1', position: [-0.67, 0, 0], element: 'C' },
        { id: 'C2', position: [0.67, 0, 0], element: 'C' },
        // All atoms exist exclusively in the XY plane
        { id: 'H1', position: [-1.2, 0.92, 0], element: 'H' },
        { id: 'H2', position: [-1.2, -0.92, 0], element: 'H' },
        { id: 'H3', position: [1.2, 0.92, 0], element: 'H' },
        { id: 'H4', position: [1.2, -0.92, 0], element: 'H' }
      ],
      bonds: [
        { source: 'C1', target: 'C2', type: 2 }, // C=C double
        { source: 'C1', target: 'H1', type: 1 },
        { source: 'C1', target: 'H2', type: 1 },
        { source: 'C2', target: 'H3', type: 1 },
        { source: 'C2', target: 'H4', type: 1 }
      ]
    },
    ethyne: {
      name: 'Ethyne / Acetylene (Alkyne)',
      formula: 'C₂H₂',
      hybridization: 'sp (Linear around each C)',
      shape: 'Linear (1D Axis)',
      desc: 'Highly unsaturated hydrocarbon featuring a carbon-carbon triple bond (one σ and two π bonds). The strong triple bond pulls carbon atoms very close together.',
      atoms: [
        { id: 'C1', position: [-0.6, 0, 0], element: 'C' }, // Closer C-C bond length
        { id: 'C2', position: [0.6, 0, 0], element: 'C' },
        { id: 'H1', position: [-1.6, 0, 0], element: 'H' },
        { id: 'H2', position: [1.6, 0, 0], element: 'H' }
      ],
      bonds: [
        { source: 'C1', target: 'C2', type: 3 }, // C≡C triple
        { source: 'C1', target: 'H1', type: 1 },
        { source: 'C2', target: 'H2', type: 1 }
      ]
    }
  };

  const current = molecules[active];

  return (
    <div className="flex flex-col bg-slate-900/40 text-slate-100 p-4 rounded-xl border border-slate-800 h-full overflow-y-auto w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-sky-400">Hydrocarbons: 3D Structure & Saturation</h2>
        <p className="text-xs text-slate-400">
          Compare the bond lengths, structural arrangement, and orbital hybridization of alkanes, alkenes, and alkynes.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.keys(molecules) as Hydrocarbon[]).map(key => (
          <button 
            key={key}
            onClick={() => setActive(key)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${active === key ? 'bg-sky-500 text-white shadow-[0_0_15px_#38bdf8] border-transparent' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'}`}
          >
            {molecules[key].name.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start flex-1 min-h-[400px]">
        
        {/* 3D Visualizer wrapper */}
        <div className="glass-panel h-[400px] rounded-xl border border-slate-800/50 bg-slate-950 relative overflow-hidden group">
          <p className="absolute top-3 left-3 text-xs text-white/50 font-bold uppercase tracking-widest z-10 pointer-events-none">3D Model Interactive</p>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none bg-black/50 px-3 py-1.5 rounded-full border border-white/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M5 14h14v7H5z"/><path d="M5 8v6"/><path d="M19 8v6"/><path d="M5 8V3h14v5"/><path d="m9 14 3-3 3 3"/></svg>
            <span className="text-[10px] uppercase font-bold text-white tracking-widest mt-0.5">Drag to Rotate</span>
          </div>

          <Molecule3D atoms={current.atoms} bonds={current.bonds} autoRotate={true} />
        </div>

        {/* Info Panel */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800/50 bg-slate-900 shadow-lg flex flex-col justify-center min-h-[400px]">
          <h3 className="text-3xl font-black text-white mb-2 tracking-tight">{current.name}</h3>
          <p className="font-mono text-emerald-400 mb-6 bg-emerald-950/30 px-3 py-1.5 rounded inline-block self-start border border-emerald-900/50">
            Formula: {current.formula}
          </p>
          
          <div className="space-y-5">
            <div className="flex gap-4 border-b border-slate-800 pb-5">
              <div className="flex-1">
                <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Hybridization</h4>
                <p className="text-sm font-bold text-sky-300">{current.hybridization}</p>
              </div>
              <div className="flex-1">
                <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Macro Shape</h4>
                <p className="text-sm font-bold text-amber-300">{current.shape}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Structural Properties</h4>
              <p className="text-sm text-slate-300 leading-relaxed p-3 bg-slate-950 rounded border border-slate-800">
                {current.desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
