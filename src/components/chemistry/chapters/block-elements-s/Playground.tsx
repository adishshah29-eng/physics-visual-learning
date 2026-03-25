import React, { useState } from 'react';

type Metal = 'Li' | 'Na' | 'K' | 'Rb' | 'Cs' | 'Ca' | 'Sr' | 'Ba';

export default function SBlockExplore() {
  const [metal, setMetal] = useState<Metal>('Na');

  const data: Record<Metal, { name: string; group: number; flame: string; colorHex: string; waterReact: string; density: string; radius: string }> = {
    Li: { name: 'Lithium', group: 1, flame: 'Crimson Red', colorHex: '#dc2626', waterReact: 'Floats, fizzes steadily. Does not melt.', density: '0.53 g/cm³', radius: '152 pm' },
    Na: { name: 'Sodium', group: 1, flame: 'Golden Yellow', colorHex: '#eab308', waterReact: 'Melts into a ball, vigorous fizzing, may catch fire.', density: '0.97 g/cm³', radius: '186 pm' },
    K:  { name: 'Potassium', group: 1, flame: 'Lilac', colorHex: '#c084fc', waterReact: 'Instantly catches fire with lilac flame, highly exothermic.', density: '0.86 g/cm³', radius: '227 pm' },
    Rb: { name: 'Rubidium', group: 1, flame: 'Red-Violet', colorHex: '#db2777', waterReact: 'Violent explosion immediately upon contact with water.', density: '1.53 g/cm³', radius: '248 pm' },
    Cs: { name: 'Cesium', group: 1, flame: 'Blue', colorHex: '#3b82f6', waterReact: 'Shatters glass container, instantaneous explosive reaction.', density: '1.93 g/cm³', radius: '265 pm' },
    Ca: { name: 'Calcium', group: 2, flame: 'Brick Red', colorHex: '#ea580c', waterReact: 'Sinks, moderate bubbling of H₂ gas, forms cloudy Ca(OH)₂.', density: '1.55 g/cm³', radius: '197 pm' },
    Sr: { name: 'Strontium', group: 2, flame: 'Crimson', colorHex: '#be123c', waterReact: 'Sinks, vigorous bubbling of H₂ gas.', density: '2.63 g/cm³', radius: '215 pm' },
    Ba: { name: 'Barium', group: 2, flame: 'Apple Green', colorHex: '#84cc16', waterReact: 'Sinks, very rapid reaction forming Ba(OH)₂.', density: '3.51 g/cm³', radius: '222 pm' }
  };

  const current = data[metal];
  const group = current.group;

  return (
    <div className="flex flex-col bg-slate-900/40 text-slate-100 p-4 rounded-xl border border-slate-800 h-full overflow-y-auto w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-sky-400">s-Block Elements</h2>
        <p className="text-xs text-slate-400">
          Explore flame tests and reactivity trends of Alkali (Group 1) and Alkaline Earth (Group 2) metals.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="w-full text-xs text-slate-500 mb-1">Alkali Metals (Group 1)</div>
        {(['Li', 'Na', 'K', 'Rb', 'Cs'] as Metal[]).map(m => (
          <button 
            key={m}
            onClick={() => setMetal(m)}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors ${metal === m ? 'bg-slate-700 text-white border-slate-500' : 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700'}`}
          >
            {m}
          </button>
        ))}
        <div className="w-full text-xs text-slate-500 mt-2 mb-1">Alkaline Earth Metals (Group 2)</div>
        {(['Ca', 'Sr', 'Ba'] as Metal[]).map(m => (
          <button 
            key={m}
            onClick={() => setMetal(m)}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors ${metal === m ? 'bg-slate-700 text-white border-slate-500' : 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700'}`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Flame Test Vis */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800/50 bg-slate-950 flex flex-col items-center justify-center">
          <h3 className="text-sm font-bold text-slate-300 w-full mb-4">Flame Test</h3>
          
          <div className="relative w-24 h-32 flex items-end justify-center mb-4">
            {/* Bunsen burner base */}
            <div className="w-6 h-12 bg-slate-400 rounded-t-sm absolute bottom-0 z-20 border-x-4 border-slate-500"></div>
            {/* Base flame */}
            <div className="w-8 h-20 bg-blue-500/40 rounded-full absolute bottom-10 z-10 blur-sm"></div>
            <div className="w-4 h-12 bg-blue-300/60 rounded-full absolute bottom-10 z-10 blur-[2px]"></div>
            
            {/* Metal flame coloration */}
            <div 
              className="absolute bottom-12 rounded-t-[100%] rounded-b-[40%] blur-md transition-all duration-500 animate-pulse"
              style={{ 
                width: group === 1 && metal !== 'Li' ? '40px' : '30px',
                height: group === 1 && metal !== 'Li' ? '80px' : '60px',
                backgroundColor: current.colorHex,
                boxShadow: `0 0 20px 5px ${current.colorHex}60`
              }}
            ></div>
          </div>
          
          <div className="text-center">
            <p className="text-lg font-bold" style={{ color: current.colorHex }}>{current.flame}</p>
            <p className="text-xs text-slate-400 mt-1">Heat excites valence electrons. They emit this color when falling back to ground state.</p>
          </div>
        </div>

        {/* Reactivity & Properties */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800/50 bg-slate-950">
          <h3 className="text-sm font-bold text-slate-300 mb-4">Properties & Reactivity</h3>
          
          <div className="space-y-4">
            <div>
              <span className="text-xs text-slate-500 block mb-1">Reaction with Cold Water</span>
              <p className="text-sm text-sky-200 bg-sky-900/20 p-2 rounded border border-sky-800/30">
                {current.waterReact}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm font-mono">
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Density</span>
                <span className="text-emerald-400">{current.density}</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Atomic Radius</span>
                <span className="text-amber-400">{current.radius}</span>
              </div>
            </div>

            <div className="text-xs text-slate-400 mt-2">
              <span className="font-bold text-slate-300">Trend Note: </span>
              As you go down Group {current.group}, atomic radius increases, making it easier to lose the outermost electron. Thus, reactivity with water <span className="text-red-400 font-bold">increases</span> dramatically down the group.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
