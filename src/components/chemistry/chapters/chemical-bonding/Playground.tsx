import React, { useState } from 'react';
import Molecule3D, { AtomData, BondData } from '../../ui/Molecule3D';

type Geometry = 'linear' | 'trigonalPlanar' | 'tetrahedral' | 'trigonalBipyramidal' | 'octahedral';

export default function VSEPRExplore() {
  const [active, setActive] = useState<Geometry>('tetrahedral');

  const geometries: Record<Geometry, {
    name: string;
    example: string;
    angle: string;
    desc: string;
    atoms: AtomData[];
    bonds: BondData[];
  }> = {
    linear: {
      name: 'Linear',
      example: 'CO₂ (Carbon Dioxide)',
      angle: '180°',
      desc: 'Two electron distinct domains (bonded pairs) arranged as far apart as possible to minimize repulsion.',
      atoms: [
        { id: 'C', position: [0, 0, 0], element: 'C' },
        { id: 'O1', position: [-2, 0, 0], element: 'O' },
        { id: 'O2', position: [2, 0, 0], element: 'O' }
      ],
      bonds: [
        { source: 'C', target: 'O1', type: 2 },
        { source: 'C', target: 'O2', type: 2 }
      ]
    },
    trigonalPlanar: {
      name: 'Trigonal Planar',
      example: 'BF₃ (Boron Trifluoride)',
      angle: '120°',
      desc: 'Three bonding pairs spread out on a flat plane. The central atom is sp² hybridized.',
      atoms: [
        { id: 'B', position: [0, 0, 0], element: 'P', radius: 0.8 }, // Using Orange for Boron
        { id: 'F1', position: [0, 2, 0], element: 'F' },
        { id: 'F2', position: [-1.732, -1, 0], element: 'F' }, // roughly cos(30)*2, sin(30)*2
        { id: 'F3', position: [1.732, -1, 0], element: 'F' }
      ],
      bonds: [
        { source: 'B', target: 'F1', type: 1 },
        { source: 'B', target: 'F2', type: 1 },
        { source: 'B', target: 'F3', type: 1 }
      ]
    },
    tetrahedral: {
      name: 'Tetrahedral',
      example: 'CH₄ (Methane)',
      angle: '109.5°',
      desc: 'Four bonding pairs maximize their distance in three-dimensional space, forming a tetrahedron. Central atom is sp³ hybridized.',
      atoms: [
        { id: 'C', position: [0, 0, 0], element: 'C' },
        { id: 'H1', position: [0, 2, 0], element: 'H' },
        { id: 'H2', position: [1.88, -0.66, 0], element: 'H' }, // simplification of coordinates spreading them out
        { id: 'H3', position: [-0.94, -0.66, 1.63], element: 'H' },
        { id: 'H4', position: [-0.94, -0.66, -1.63], element: 'H' }
      ],
      bonds: [
        { source: 'C', target: 'H1', type: 1 },
        { source: 'C', target: 'H2', type: 1 },
        { source: 'C', target: 'H3', type: 1 },
        { source: 'C', target: 'H4', type: 1 }
      ]
    },
    trigonalBipyramidal: {
      name: 'Trigonal Bipyramidal',
      example: 'PF₅ (Phosphorus Pentafluoride)',
      angle: '90° & 120°',
      desc: 'Five bonding pairs. Consists of three equatorial bonds in a plane (120° apart) and two axial bonds perpendicular to the plane (90°).',
      atoms: [
        { id: 'P', position: [0, 0, 0], element: 'P' },
        { id: 'F1', position: [0, 2, 0], element: 'F' }, // Axial Top
        { id: 'F2', position: [0, -2, 0], element: 'F' }, // Axial Bottom
        { id: 'F3', position: [2, 0, 0], element: 'F' }, // Equatorial
        { id: 'F4', position: [-1, 0, 1.732], element: 'F' }, // Equatorial
        { id: 'F5', position: [-1, 0, -1.732], element: 'F' } // Equatorial
      ],
      bonds: [
        { source: 'P', target: 'F1', type: 1 },
        { source: 'P', target: 'F2', type: 1 },
        { source: 'P', target: 'F3', type: 1 },
        { source: 'P', target: 'F4', type: 1 },
        { source: 'P', target: 'F5', type: 1 }
      ]
    },
    octahedral: {
      name: 'Octahedral',
      example: 'SF₆ (Sulfur Hexafluoride)',
      angle: '90°',
      desc: 'Six bonding pairs arranged symmetrically along the x, y, and z axes around the central atom.',
      atoms: [
        { id: 'S', position: [0, 0, 0], element: 'S' },
        { id: 'F1', position: [0, 2, 0], element: 'F' },
        { id: 'F2', position: [0, -2, 0], element: 'F' },
        { id: 'F3', position: [2, 0, 0], element: 'F' },
        { id: 'F4', position: [-2, 0, 0], element: 'F' },
        { id: 'F5', position: [0, 0, 2], element: 'F' },
        { id: 'F6', position: [0, 0, -2], element: 'F' }
      ],
      bonds: [
        { source: 'S', target: 'F1', type: 1 },
        { source: 'S', target: 'F2', type: 1 },
        { source: 'S', target: 'F3', type: 1 },
        { source: 'S', target: 'F4', type: 1 },
        { source: 'S', target: 'F5', type: 1 },
        { source: 'S', target: 'F6', type: 1 }
      ]
    }
  };

  const current = geometries[active];

  return (
    <div className="flex flex-col bg-slate-900/40 text-slate-100 p-4 rounded-xl border border-slate-800 h-full overflow-y-auto w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-sky-400">VSEPR Theory in 3D</h2>
        <p className="text-xs text-slate-400">
          Valence Shell Electron Pair Repulsion theory dictates molecular shape. Interact with and rotate the 3D models!
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.keys(geometries) as Geometry[]).map(g => (
          <button 
            key={g}
            onClick={() => setActive(g)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${active === g ? 'bg-sky-500 text-white shadow-[0_0_10px_#38bdf8]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            {geometries[g].name}
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
          <p className="font-mono text-sky-400 mb-6 bg-slate-950 px-3 py-1.5 rounded inline-block self-start border border-sky-900/50">
            {current.example}
          </p>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Bond Angle</h4>
              <p className="text-2xl font-light text-slate-200">{current.angle}</p>
            </div>
            
            <div className="h-px w-full bg-slate-800"></div>
            
            <div>
              <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">VSEPR Explanation</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {current.desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
