// src/components/chemistry/explore/AtomicStructureExplore.tsx
import { useState, useEffect, useRef } from 'react';

const ELEMENTS = [
  { symbol: 'H',  name: 'Hydrogen',  Z: 1,  shells: [1] },
  { symbol: 'He', name: 'Helium',    Z: 2,  shells: [2] },
  { symbol: 'Li', name: 'Lithium',   Z: 3,  shells: [2, 1] },
  { symbol: 'Be', name: 'Beryllium', Z: 4,  shells: [2, 2] },
  { symbol: 'B',  name: 'Boron',     Z: 5,  shells: [2, 3] },
  { symbol: 'C',  name: 'Carbon',    Z: 6,  shells: [2, 4] },
  { symbol: 'N',  name: 'Nitrogen',  Z: 7,  shells: [2, 5] },
  { symbol: 'O',  name: 'Oxygen',    Z: 8,  shells: [2, 6] },
  { symbol: 'F',  name: 'Fluorine',  Z: 9,  shells: [2, 7] },
  { symbol: 'Ne', name: 'Neon',      Z: 10, shells: [2, 8] },
  { symbol: 'Na', name: 'Sodium',    Z: 11, shells: [2, 8, 1] },
  { symbol: 'Mg', name: 'Magnesium', Z: 12, shells: [2, 8, 2] },
  { symbol: 'Al', name: 'Aluminium', Z: 13, shells: [2, 8, 3] },
  { symbol: 'Si', name: 'Silicon',   Z: 14, shells: [2, 8, 4] },
  { symbol: 'P',  name: 'Phosphorus',Z: 15, shells: [2, 8, 5] },
  { symbol: 'S',  name: 'Sulfur',    Z: 16, shells: [2, 8, 6] },
  { symbol: 'Cl', name: 'Chlorine',  Z: 17, shells: [2, 8, 7] },
  { symbol: 'Ar', name: 'Argon',     Z: 18, shells: [2, 8, 8] },
  { symbol: 'K',  name: 'Potassium', Z: 19, shells: [2, 8, 8, 1] },
  { symbol: 'Ca', name: 'Calcium',   Z: 20, shells: [2, 8, 8, 2] },
];

const ORBITAL_INFO = [
  { name: '1s', shape: 'Spherical', n: 1, l: 0, electrons: 2, color: '#06b6d4' },
  { name: '2s', shape: 'Spherical (larger)', n: 2, l: 0, electrons: 2, color: '#0ea5e9' },
  { name: '2p', shape: 'Dumbbell-shaped', n: 2, l: 1, electrons: 6, color: '#8b5cf6' },
  { name: '3s', shape: 'Spherical (largest)', n: 3, l: 0, electrons: 2, color: '#10b981' },
  { name: '3p', shape: 'Dumbbell-shaped (larger)', n: 3, l: 1, electrons: 6, color: '#22c55e' },
  { name: '3d', shape: 'Complex (4-lobed)', n: 3, l: 2, electrons: 10, color: '#f59e0b' },
];

const QUANTUM_INFO = [
  { symbol: 'n', name: 'Principal', meaning: 'Shell / energy level', values: '1, 2, 3, 4...', effect: 'Determines size and energy of orbital' },
  { symbol: 'l', name: 'Angular Momentum', meaning: 'Sub-shell / orbital shape', values: '0 to (n-1)', effect: 's(0), p(1), d(2), f(3)' },
  { symbol: 'm', name: 'Magnetic', meaning: 'Orientation of orbital', values: '-l to +l', effect: 'Number of orbitals in each sub-shell' },
  { symbol: 'mₛ', name: 'Spin', meaning: 'Spin of the electron', values: '+½ or -½', effect: 'Two electrons per orbital (opposite spins)' },
];

function BohrModel({ element }: { element: typeof ELEMENTS[0] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const anglesRef = useRef<number[]>([]);

  useEffect(() => {
    anglesRef.current = element.shells.map((_, i) => i * 0.5);
  }, [element]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const SHELL_RADII = [50, 85, 120, 155];
    const SHELL_COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];
    const SPEEDS = [0.025, 0.016, 0.011, 0.008];

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background glow
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
      grd.addColorStop(0, 'rgba(6,182,212,0.08)');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw orbits
      element.shells.forEach((_, i) => {
        ctx.beginPath();
        ctx.arc(cx, cy, SHELL_RADII[i], 0, Math.PI * 2);
        ctx.strokeStyle = `${SHELL_COLORS[i]}30`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Nucleus
      const nucGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20);
      nucGrd.addColorStop(0, '#fcd34d');
      nucGrd.addColorStop(0.6, '#f59e0b');
      nucGrd.addColorStop(1, '#d97706');
      ctx.beginPath();
      ctx.arc(cx, cy, 20, 0, Math.PI * 2);
      ctx.fillStyle = nucGrd;
      ctx.fill();

      // Nucleus label
      ctx.fillStyle = '#000';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(element.symbol, cx, cy);

      // Draw electrons on each shell
      element.shells.forEach((count, shellIdx) => {
        const r = SHELL_RADII[shellIdx];
        const baseAngle = anglesRef.current[shellIdx];
        anglesRef.current[shellIdx] += SPEEDS[shellIdx];

        for (let e = 0; e < count; e++) {
          const angle = baseAngle + (2 * Math.PI * e) / count;
          const ex = cx + r * Math.cos(angle);
          const ey = cy + r * Math.sin(angle);

          // Electron glow
          const eGrd = ctx.createRadialGradient(ex, ey, 0, ex, ey, 8);
          eGrd.addColorStop(0, SHELL_COLORS[shellIdx]);
          eGrd.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(ex, ey, 8, 0, Math.PI * 2);
          ctx.fillStyle = eGrd;
          ctx.fill();

          // Electron dot
          ctx.beginPath();
          ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = SHELL_COLORS[shellIdx];
          ctx.fill();
        }
      });

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [element]);

  return (
    <canvas
      ref={canvasRef}
      width={360}
      height={360}
      className="w-full max-w-[360px] mx-auto"
    />
  );
}

export default function AtomicStructureExplore() {
  const [selectedElement, setSelectedElement] = useState(ELEMENTS[5]); // Carbon default
  const [view, setView] = useState<'bohr' | 'orbital' | 'quantum'>('bohr');

  const config = selectedElement.shells.join(', ');

  return (
    <div className="space-y-6">
      {/* View toggle */}
      <div className="flex gap-2">
        {[
          { id: 'bohr', label: '🔵 Bohr Model' },
          { id: 'orbital', label: '🌀 Orbital Types' },
          { id: 'quantum', label: '📐 Quantum Numbers' },
        ].map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id as any)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              view === v.id
                ? 'bg-sky-500/25 border border-sky-500/50 text-sky-300'
                : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* BOHR MODEL VIEW */}
      {view === 'bohr' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 flex flex-col items-center">
            <BohrModel element={selectedElement} />
            <div className="mt-2 text-center">
              <p className="text-white font-bold">{selectedElement.name}</p>
              <p className="text-white/40 text-xs font-mono">Z = {selectedElement.Z} | e⁻ config: {config}</p>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-3">
              Select Element
            </p>
            <div className="grid grid-cols-5 gap-1.5 max-h-[320px] overflow-y-auto pr-1">
              {ELEMENTS.map((el) => (
                <button
                  key={el.symbol}
                  onClick={() => setSelectedElement(el)}
                  className={`rounded-lg p-2 text-center transition-all border ${
                    selectedElement.symbol === el.symbol
                      ? 'bg-cyan-500/30 border-cyan-500/60 text-cyan-300'
                      : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                  }`}
                >
                  <div className="text-xs font-bold">{el.symbol}</div>
                  <div className="text-[9px] text-white/30 font-mono">{el.Z}</div>
                </button>
              ))}
            </div>

            {/* Shell info */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 mt-2">
              <p className="text-xs text-white/40 mb-2">Shell Configuration</p>
              <div className="flex gap-3 flex-wrap">
                {selectedElement.shells.map((count, i) => (
                  <div key={i} className="text-center">
                    <div className="text-lg font-bold text-white">{count}</div>
                    <div className="text-[10px] text-white/30">Shell {i + 1}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/50 mt-3">
                Valence electrons:{' '}
                <span className="text-cyan-400 font-bold">
                  {selectedElement.shells[selectedElement.shells.length - 1]}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ORBITAL TYPES VIEW */}
      {view === 'orbital' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ORBITAL_INFO.map((orb) => (
            <div key={orb.name} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: `${orb.color}30`, color: orb.color }}
                >
                  {orb.name}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{orb.name} orbital</p>
                  <p className="text-white/30 text-xs">n={orb.n}, l={orb.l}</p>
                </div>
              </div>
              <div
                className="rounded-lg p-3 text-xs space-y-1"
                style={{ background: `${orb.color}10` }}
              >
                <p className="text-white/60"><span className="text-white/30">Shape: </span>{orb.shape}</p>
                <p className="text-white/60"><span className="text-white/30">Max e⁻: </span>{orb.electrons}</p>
              </div>
            </div>
          ))}
          <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Filling Order (Aufbau)</p>
            <div className="flex flex-wrap gap-2">
              {['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p'].map((orb, i) => (
                <span
                  key={orb}
                  className="px-2.5 py-1 rounded-full text-xs font-mono"
                  style={{
                    background: i < 6 ? '#06b6d420' : '#ffffff10',
                    color: i < 6 ? '#06b6d4' : '#ffffff60',
                    border: `1px solid ${i < 6 ? '#06b6d430' : '#ffffff15'}`,
                  }}
                >
                  {orb}
                </span>
              ))}
            </div>
            <p className="text-xs text-white/30 mt-3">
              Filled left to right following the diagonal rule (n + l rule)
            </p>
          </div>
        </div>
      )}

      {/* QUANTUM NUMBERS VIEW */}
      {view === 'quantum' && (
        <div className="space-y-4">
          {QUANTUM_INFO.map((q) => (
            <div key={q.symbol} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400 text-sm shrink-0">
                  {q.symbol}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{q.name} Quantum Number ({q.symbol})</p>
                  <p className="text-white/50 text-xs mt-0.5">{q.meaning}</p>
                  <div className="flex gap-4 mt-2">
                    <div>
                      <span className="text-[10px] text-white/30 uppercase">Allowed Values</span>
                      <p className="text-cyan-400 text-xs font-mono">{q.values}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/30 uppercase">Significance</span>
                      <p className="text-white/60 text-xs">{q.effect}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Pauli + Hund's */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
              <p className="text-sky-400 font-semibold text-sm mb-1">Pauli's Exclusion Principle</p>
              <p className="text-white/50 text-xs">
                No two electrons in an atom can have the same set of all four quantum numbers.
                Each orbital holds max 2 electrons with opposite spins.
              </p>
            </div>
            <div className="rounded-xl border border-indigo-400/20 bg-indigo-400/5 p-4">
              <p className="text-indigo-300 font-semibold text-sm mb-1">Hund's Rule</p>
              <p className="text-white/50 text-xs">
                Electrons occupy orbitals of the same energy (degenerate) singly before pairing.
                Unpaired electrons give extra stability.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
