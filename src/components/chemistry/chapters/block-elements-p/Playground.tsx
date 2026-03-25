import React, { useState } from 'react';
import Molecule3D, { AtomData, BondData } from '../../ui/Molecule3D';

type Allotrope = 'Diamond' | 'Graphite' | 'Fullerene';

export default function PBlockExplore() {
  const [active, setActive] = useState<Allotrope>('Diamond');

  // Procedural Diamond Lattice (small section)
  const createDiamond = () => {
    const atoms: AtomData[] = [];
    const bonds: BondData[] = [];
    let idCounter = 0;
    
    // Create a central tetrahedral atom and connect outwards
    // Just a simplified 5-atom tetrahedral core to represent the start of the lattice
    const core = { x: 0, y: 0, z: 0 };
    atoms.push({ id: `C${idCounter++}`, position: [core.x, core.y, core.z], element: 'C' });
    
    const d = 1.0;
    const branches = [
      [d, d, d], 
      [-d, -d, d], 
      [-d, d, -d], 
      [d, -d, -d]
    ];
    
    branches.forEach((b) => {
      const bId = `C${idCounter++}`;
      atoms.push({ id: bId, position: [b[0], b[1], b[2]], element: 'C' });
      bonds.push({ source: 'C0', target: bId, type: 1 });
      
      // Add a sub-branch to each to show the extending network
      const sbId1 = `C${idCounter++}`;
      const sbId2 = `C${idCounter++}`;
      // Just shifting them outwards slightly in different tetrahedral directions
      atoms.push({ id: sbId1, position: [b[0] + (b[0]>0?d:-d), b[1] + (b[1]>0?-d:d), b[2] + (b[2]>0?-d:d)], element: 'C' });
      atoms.push({ id: sbId2, position: [b[0] + (b[0]>0?-d:d), b[1] + (b[1]>0?d:-d), b[2] + (b[2]>0?-d:d)], element: 'C' });
      
      bonds.push({ source: bId, target: sbId1, type: 1 });
      bonds.push({ source: bId, target: sbId2, type: 1 });
    });

    return { atoms, bonds };
  };

  // Procedural Graphite (two 2D hexagonal layers)
  const createGraphite = () => {
    const atoms: AtomData[] = [];
    const bonds: BondData[] = [];
    
    const d = 1.0; // bond length
    const h = 2.5; // interlayer distance (Graphite layers are far apart)
    
    // Helper to build a single hexagon layer
    const buildLayer = (yLevel: number, startIndex: number) => {
      const r = d;
      // Six atoms in a perfect hexagon
      for (let i = 0; i < 6; i++) {
        const theta = (i * Math.PI) / 3;
        atoms.push({ 
          id: `C${startIndex + i}`, 
          position: [r * Math.cos(theta), yLevel, r * Math.sin(theta)], 
          element: 'C'
        });
      }
      // Connect hexagon
      for (let i = 0; i < 6; i++) {
        bonds.push({ source: `C${startIndex + i}`, target: `C${startIndex + ((i + 1) % 6)}`, type: 2 }); // Representing aromatic/delocalized
      }
      // Add another fused ring to the right
      const shiftX = r * 1.5;
      const shiftZ = r * Math.sin(Math.PI/3);
      for (let i = 0; i < 4; i++) {
        // We only need 4 new atoms, 2 are shared
        const theta = ((i+1) * Math.PI) / 3;
        atoms.push({ 
          id: `C${startIndex + 6 + i}`, 
          position: [shiftX + r * Math.cos(theta), yLevel, shiftZ + r * Math.sin(theta)], 
          element: 'C'
        });
      }
      // Connect fused ring (simplification)
      bonds.push({ source: `C${startIndex + 0}`, target: `C${startIndex + 6}`, type: 2 });
      bonds.push({ source: `C${startIndex + 6}`, target: `C${startIndex + 7}`, type: 2 });
      bonds.push({ source: `C${startIndex + 7}`, target: `C${startIndex + 8}`, type: 2 });
      bonds.push({ source: `C${startIndex + 8}`, target: `C${startIndex + 9}`, type: 2 });
      bonds.push({ source: `C${startIndex + 9}`, target: `C${startIndex + 1}`, type: 2 });
    };

    buildLayer(h/2, 0); // Top layer
    buildLayer(-h/2, 20); // Bottom layer

    return { atoms, bonds };
  };

  // Approximate Fullerene (Soccer ball shape / hollow sphere)
  const createFullerene = () => {
    const atoms: AtomData[] = [];
    const bonds: BondData[] = [];
    const r = 2.0;

    // Golden ratio for icosahedron vertices math approximation
    const t = (1.0 + Math.sqrt(5.0)) / 2.0;
    
    // We'll generate 20 vertices of a dodecahedron to represent a spherical carbon cage
    const phi = 1.61803;
    let idCounter = 0;

    const addAtom = (x:number, y:number, z:number) => {
      // Normalize to radius r
      const len = Math.sqrt(x*x + y*y + z*z);
      atoms.push({ 
        id: `C${idCounter++}`, 
        position: [(x/len)*r, (y/len)*r, (z/len)*r], 
        element: 'C' 
      });
    };

    // A simple spherical point distribution (Fibonacci sphere) to simulate a Buckyball cage
    const n = 32; // Not exactly 60, but visually represents a hollow carbon cage well in 3D
    for (let i = 0; i < n; i++) {
      const theta = 2 * Math.PI * i / 1.61803398875; // golden angle
      const phiAngle = Math.acos(1 - 2 * (i + 0.5) / n);
      addAtom(
        r * Math.sin(phiAngle) * Math.cos(theta),
        r * Math.sin(phiAngle) * Math.sin(theta),
        r * Math.cos(phiAngle)
      );
    }

    // Connect atoms to their 3 nearest neighbors to simulate the generic fullerene network
    for (let i = 0; i < atoms.length; i++) {
      let distances = [];
      const posI = atoms[i].position;
      for (let j = 0; j < atoms.length; j++) {
        if (i===j) continue;
        const posJ = atoms[j].position;
        const dist = Math.sqrt(Math.pow(posI[0]-posJ[0],2) + Math.pow(posI[1]-posJ[1],2) + Math.pow(posI[2]-posJ[2],2));
        distances.push({ id: atoms[j].id, dist });
      }
      distances.sort((a,b) => a.dist - b.dist);
      // Connect to 3 closest
      for (let k = 0; k < 3; k++) {
        // avoid duplicate bonds
        if (parseInt(atoms[i].id.replace('C','')) < parseInt(distances[k].id.replace('C',''))) {
           bonds.push({ source: atoms[i].id, target: distances[k].id, type: 1 });
        }
      }
    }

    return { atoms, bonds };
  };

  const allotropes = {
    Diamond: {
      desc: 'Each carbon atom is covalently bonded to 4 other carbon atoms in a rigid 3D tetrahedral network.',
      props: ['Hardest natural substance', 'Electrical insulator', 'High thermal conductivity', 'sp³ hybridized'],
      color: '#38bdf8',
      ...createDiamond()
    },
    Graphite: {
      desc: 'Carbon atoms form planar hexagonal layers. Weak Van der Waals forces between layers allow them to slide.',
      props: ['Soft & slippery (lubricant)', 'Electrical conductor (delocalized e⁻)', 'Sp² hybridized', 'Used in pencils'],
      color: '#94a3b8',
      ...createGraphite()
    },
    Fullerene: {
      desc: 'Buckminsterfullerene (C₆₀) is a discrete molecular form resembling a soccer ball (truncated icosahedron).',
      props: ['Molecular solid', 'Soluble in organic solvents', 'sp² hybridized (with strain)', 'Contains rings of 5 & 6 carbons'],
      color: '#c084fc',
      ...createFullerene()
    }
  };

  const current = allotropes[active];

  return (
    <div className="flex flex-col bg-slate-900/40 text-slate-100 p-4 rounded-xl border border-slate-800 h-full overflow-y-auto w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-sky-400">p-Block Elements: Carbon Allotropes</h2>
        <p className="text-xs text-slate-400">
          Explore the profound differences in properties of Carbon's allotropes, driven entirely by macromolecular bonding structure.
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {(['Diamond', 'Graphite', 'Fullerene'] as Allotrope[]).map(a => (
          <button 
            key={a}
            onClick={() => setActive(a)}
            className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${active === a ? 'text-white' : 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700'}`}
            style={active === a ? { backgroundColor: `${allotropes[a].color}30`, borderColor: allotropes[a].color } : {}}
          >
            {a}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start flex-1 min-h-[400px]">
        
        {/* 3D Visualizer wrapper */}
        <div className="glass-panel h-[400px] rounded-xl border border-slate-800/50 bg-slate-950 relative overflow-hidden group">
          <p className="absolute top-3 left-3 text-xs text-white/50 font-bold uppercase tracking-widest z-10 pointer-events-none">3D Lattice Interactive</p>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none bg-black/50 px-3 py-1.5 rounded-full border border-white/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M5 14h14v7H5z"/><path d="M5 8v6"/><path d="M19 8v6"/><path d="M5 8V3h14v5"/><path d="m9 14 3-3 3 3"/></svg>
            <span className="text-[10px] uppercase font-bold text-white tracking-widest mt-0.5">Drag to Rotate Lattice</span>
          </div>

          <Molecule3D key={active} atoms={current.atoms} bonds={current.bonds} autoRotate={true} />
        </div>

        {/* Data Box */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800/50 bg-slate-900 shadow-lg min-h-[400px] flex flex-col justify-center">
          <h3 className="text-3xl font-black mb-4 tracking-tight" style={{ color: current.color }}>{active}</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Structural Analysis</h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 rounded border border-slate-800 p-3 shadow-inner">
                {current.desc}
              </p>
            </div>
            
            <div className="h-px bg-slate-800 w-full"></div>

            <div>
              <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">Key Properties Formed</h4>
              <ul className="space-y-3">
                {current.props.map((prop, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-200">
                    <span className="text-base leading-none mt-0.5" style={{ color: current.color }}>⚡</span>
                    {prop}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
