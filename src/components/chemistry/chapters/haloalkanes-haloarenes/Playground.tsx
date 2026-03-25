import React, { useState } from 'react';

type Mechanism = 'sn1' | 'sn2';

export default function HaloalkanesExplore() {
  const [mech, setMech] = useState<Mechanism>('sn2');
  const [step, setStep] = useState(0);

  const data = {
    sn2: {
      title: 'Sɴ2 Mechanism (Concerted)',
      desc: 'Bimolecular nucleophilic substitution. Happens in a single concerted step. Preferred by primary/methyl halides.',
      steps: [
        { title: 'Approach', desc: 'Nucleophile (Nu⁻) approaches the electrophilic carbon from the opposite side of the leaving group (back-side attack).', img: 'Nu⁻  →  R-X' },
        { title: 'Transition State', desc: 'Bonds are simultaneously breaking and forming. The carbon is briefly pentacoordinate.', img: '[ Nu ··· R ··· X ] ‡' },
        { title: 'Inversion', desc: 'Leaving group abandons the molecule. The stereocenter undergoes Walden inversion.', img: 'Nu-R  +  X⁻' }
      ],
      color: '#3b82f6',
      kinetics: 'Rate = k[R-X][Nu⁻]',
      solvent: 'Polar aprotic (Acetone, DMSO)'
    },
    sn1: {
      title: 'Sɴ1 Mechanism (Stepwise)',
      desc: 'Unimolecular nucleophilic substitution. Happens in two steps via a carbocation intermediate. Preferred by tertiary halides.',
      steps: [
        { title: 'Dissociation', desc: 'Leaving group departs, forming a planar carbocation intermediate. This is the slow, rate-determining step.', img: 'R-X  →  R⁺  +  X⁻' },
        { title: 'Attack', desc: 'Nucleophile attacks the planar carbocation from either face (top or bottom).', img: 'Nu⁻  →  R⁺' },
        { title: 'Racemization', desc: 'Formation of product. Because attack happens from both sides, it results in a racemic mixture (if chiral).', img: 'Nu-R  (50% R, 50% S)' }
      ],
      color: '#ef4444',
      kinetics: 'Rate = k[R-X]',
      solvent: 'Polar protic (H2O, Alcohols)'
    }
  };

  const current = data[mech];

  return (
    <div className="flex flex-col bg-slate-900/40 text-slate-100 p-4 rounded-xl border border-slate-800 h-full overflow-y-auto w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-sky-400">Nucleophilic Substitution</h2>
        <p className="text-xs text-slate-400">
          Compare the reaction mechanisms and kinetics of Sɴ1 and Sɴ2 reactions.
        </p>
      </div>

      <div className="flex gap-2 mb-4">
        <button 
          onClick={() => { setMech('sn2'); setStep(0); }}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mech === 'sn2' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
        >
          Sɴ2 Reaction
        </button>
        <button 
          onClick={() => { setMech('sn1'); setStep(0); }}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mech === 'sn1' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
        >
          Sɴ1 Reaction
        </button>
      </div>

      <div className="glass-panel rounded-xl p-5 mb-4 border" style={{ borderColor: `${current.color}40`, backgroundColor: `${current.color}10` }}>
        <h3 className="text-lg font-bold mb-2" style={{ color: current.color }}>{current.title}</h3>
        <p className="text-sm text-slate-300 mb-4">{current.desc}</p>
        
        <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-4">
          <div className="bg-slate-950/50 p-2 rounded border border-slate-800/50">
            <span className="text-slate-500 block mb-1">Kinetics</span>
            <span className="text-amber-400">{current.kinetics}</span>
          </div>
          <div className="bg-slate-950/50 p-2 rounded border border-slate-800/50">
            <span className="text-slate-500 block mb-1">Favored Solvent</span>
            <span className="text-emerald-400">{current.solvent}</span>
          </div>
        </div>

        {/* Interactive Steps */}
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-950 rounded-lg p-3">
            <button 
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="text-slate-400 disabled:opacity-30 hover:text-white px-2"
            >
              ◀ Prev
            </button>
            <div className="font-mono text-center">
              <span className="text-[10px] text-slate-500 block mb-1">STEP {step + 1} OF 3</span>
              <span className="font-bold text-lg" style={{ color: current.color }}>{current.steps[step].title}</span>
            </div>
            <button 
              onClick={() => setStep(Math.min(2, step + 1))}
              disabled={step === 2}
              className="text-slate-400 disabled:opacity-30 hover:text-white px-2"
            >
              Next ▶
            </button>
          </div>
          
          <div className="h-32 flex flex-col items-center justify-center bg-slate-900 rounded-xl border border-slate-800">
            <div className="text-2xl font-mono font-bold tracking-widest text-slate-200 mb-4">
              {current.steps[step].img}
            </div>
            <p className="text-xs text-slate-400 text-center max-w-sm px-4">
              {current.steps[step].desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
