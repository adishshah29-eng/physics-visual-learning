import React, { useState } from 'react';

type BasePair = 'AT' | 'GC';

export default function BiomoleculesExplore() {
  const [pair, setPair] = useState<BasePair>('AT');

  return (
    <div className="flex flex-col bg-slate-900/40 text-slate-100 p-4 rounded-xl border border-slate-800 h-full overflow-y-auto w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-sky-400">DNA Base Pairing</h2>
        <p className="text-xs text-slate-400">
          Visualize the hydrogen bonding between complementary nitrogenous bases in DNA.
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setPair('AT')}
          className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${pair === 'AT' ? 'text-white border-slate-500 bg-sky-500/30' : 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700'}`}
          style={pair === 'AT' ? { borderTopColor: '#38bdf8' } : {}}
        >
          Adenine - Thymine
        </button>
        <button 
          onClick={() => setPair('GC')}
          className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${pair === 'GC' ? 'text-white border-slate-500 bg-emerald-500/30' : 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700'}`}
          style={pair === 'GC' ? { borderTopColor: '#10b981' } : {}}
        >
          Guanine - Cytosine
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        {/* Visualizer */}
        <div className="glass-panel h-64 flex flex-col items-center justify-center rounded-xl bg-slate-950 border border-slate-800/50 p-6 relative overflow-hidden">
          <p className="absolute top-3 left-3 text-xs text-slate-500 font-bold uppercase tracking-widest text-left">Hydrogen Bonds</p>
          
          <div className="flex items-center justify-center gap-4 mt-4 w-full h-full relative">
            {pair === 'AT' ? (
              <>
                <div className="text-4xl font-bold text-sky-400">A</div>
                <div className="flex flex-col gap-4 mx-4">
                  <div className="w-12 h-1 border-b-2 border-dashed border-slate-500 animate-pulse"></div>
                  <div className="w-12 h-1 border-b-2 border-dashed border-slate-500 animate-pulse delay-75"></div>
                </div>
                <div className="text-4xl font-bold text-sky-400">T</div>
              </>
            ) : (
              <>
                <div className="text-4xl font-bold text-emerald-400">G</div>
                <div className="flex flex-col gap-3 mx-4">
                  <div className="w-12 h-1 border-b-2 border-dashed border-slate-500 animate-pulse"></div>
                  <div className="w-12 h-1 border-b-2 border-dashed border-slate-500 animate-pulse delay-75"></div>
                  <div className="w-12 h-1 border-b-2 border-dashed border-slate-500 animate-pulse delay-150"></div>
                </div>
                <div className="text-4xl font-bold text-emerald-400">C</div>
              </>
            )}
            
            {/* Background Helix Hint */}
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 20 0 Q 80 25 20 50 T 20 100" fill="none" stroke="white" strokeWidth="2" />
              <path d="M 80 0 Q 20 25 80 50 T 80 100" fill="none" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          
          <p className="text-center font-bold text-lg mt-4" style={{ color: pair === 'AT' ? '#38bdf8' : '#10b981' }}>
            {pair === 'AT' ? '2 Hydrogen Bonds' : '3 Hydrogen Bonds'}
          </p>
        </div>

        {/* Data Box */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800/50 bg-slate-900 shadow-lg min-h-64 flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-4" style={{ color: pair === 'AT' ? '#38bdf8' : '#10b981' }}>
            {pair === 'AT' ? 'Adenine (Purine) & Thymine (Pyrimidine)' : 'Guanine (Purine) & Cytosine (Pyrimidine)'}
          </h3>
          
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-800/80 mb-4">
            {pair === 'AT' 
              ? 'Adenine pairs with Thymine forming two intermolecular hydrogen bonds. This pair is slightly weaker and easier to denature (melt) during DNA replication compared to GC rich regions.' 
              : 'Guanine pairs with Cytosine forming three intermolecular hydrogen bonds. GC-rich regions of DNA are structurally more stable and have a higher melting temperature (Tm).'}
          </p>

          <div className="text-xs text-slate-400">
            <span className="font-bold text-slate-300 uppercase tracking-widest block mb-1">Chargaff's Rule</span>
            In double-stranded DNA, the ratio of Purines to Pyrimidines is 1:1. specifically, %A = %T and %G = %C.
          </div>
        </div>
      </div>
    </div>
  );
}
