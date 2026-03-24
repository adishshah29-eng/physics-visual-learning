// src/components/chemistry/explore/PeriodicTableExplore.tsx
import { useState } from 'react';

type Trend = 'atomic_radius' | 'ionization_energy' | 'electronegativity' | 'electron_affinity';

// Simplified data for first 36 elements
const ELEMENTS_DATA = [
  { Z: 1,  sym: 'H',  period: 1, group: 1,  ar: 53,  ie: 1312, en: 2.20, ea: 73  },
  { Z: 2,  sym: 'He', period: 1, group: 18, ar: 31,  ie: 2372, en: 0,    ea: 0   },
  { Z: 3,  sym: 'Li', period: 2, group: 1,  ar: 167, ie: 520,  en: 0.98, ea: 60  },
  { Z: 4,  sym: 'Be', period: 2, group: 2,  ar: 112, ie: 900,  en: 1.57, ea: 0   },
  { Z: 5,  sym: 'B',  period: 2, group: 13, ar: 87,  ie: 800,  en: 2.04, ea: 27  },
  { Z: 6,  sym: 'C',  period: 2, group: 14, ar: 77,  ie: 1086, en: 2.55, ea: 122 },
  { Z: 7,  sym: 'N',  period: 2, group: 15, ar: 75,  ie: 1402, en: 3.04, ea: 0   },
  { Z: 8,  sym: 'O',  period: 2, group: 16, ar: 66,  ie: 1314, en: 3.44, ea: 141 },
  { Z: 9,  sym: 'F',  period: 2, group: 17, ar: 64,  ie: 1681, en: 3.98, ea: 328 },
  { Z: 10, sym: 'Ne', period: 2, group: 18, ar: 58,  ie: 2081, en: 0,    ea: 0   },
  { Z: 11, sym: 'Na', period: 3, group: 1,  ar: 190, ie: 496,  en: 0.93, ea: 53  },
  { Z: 12, sym: 'Mg', period: 3, group: 2,  ar: 145, ie: 738,  en: 1.31, ea: 0   },
  { Z: 13, sym: 'Al', period: 3, group: 13, ar: 118, ie: 577,  en: 1.61, ea: 43  },
  { Z: 14, sym: 'Si', period: 3, group: 14, ar: 111, ie: 786,  en: 1.90, ea: 134 },
  { Z: 15, sym: 'P',  period: 3, group: 15, ar: 106, ie: 1012, en: 2.19, ea: 72  },
  { Z: 16, sym: 'S',  period: 3, group: 16, ar: 102, ie: 1000, en: 2.58, ea: 200 },
  { Z: 17, sym: 'Cl', period: 3, group: 17, ar: 99,  ie: 1251, en: 3.16, ea: 349 },
  { Z: 18, sym: 'Ar', period: 3, group: 18, ar: 96,  ie: 1521, en: 0,    ea: 0   },
  { Z: 19, sym: 'K',  period: 4, group: 1,  ar: 243, ie: 419,  en: 0.82, ea: 48  },
  { Z: 20, sym: 'Ca', period: 4, group: 2,  ar: 194, ie: 590,  en: 1.00, ea: 2   },
  { Z: 31, sym: 'Ga', period: 4, group: 13, ar: 136, ie: 579,  en: 1.81, ea: 29  },
  { Z: 32, sym: 'Ge', period: 4, group: 14, ar: 125, ie: 762,  en: 2.01, ea: 119 },
  { Z: 33, sym: 'As', period: 4, group: 15, ar: 114, ie: 947,  en: 2.18, ea: 78  },
  { Z: 34, sym: 'Se', period: 4, group: 16, ar: 103, ie: 941,  en: 2.55, ea: 195 },
  { Z: 35, sym: 'Br', period: 4, group: 17, ar: 114, ie: 1140, en: 2.96, ea: 325 },
  { Z: 36, sym: 'Kr', period: 4, group: 18, ar: 112, ie: 1351, en: 0,    ea: 0   },
];

const GROUP_POSITIONS: Record<number, number> = {
  1: 1, 2: 2, 13: 3, 14: 4, 15: 5, 16: 6, 17: 7, 18: 8,
};

const TREND_CONFIG: Record<Trend, { label: string; unit: string; key: keyof typeof ELEMENTS_DATA[0]; color: string; direction: string }> = {
  atomic_radius:      { label: 'Atomic Radius',       unit: 'pm',      key: 'ar', color: '#06b6d4', direction: '↓ increases down, ← increases left' },
  ionization_energy:  { label: 'Ionization Energy',   unit: 'kJ/mol',  key: 'ie', color: '#ef4444', direction: '↑ increases up, → increases right' },
  electronegativity:  { label: 'Electronegativity',   unit: 'Pauling', key: 'en', color: '#f59e0b', direction: '↑ increases up, → increases right (F highest)' },
  electron_affinity:  { label: 'Electron Affinity',   unit: 'kJ/mol',  key: 'ea', color: '#8b5cf6', direction: 'Halogens have highest values' },
};

function lerp(t: number, r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) {
  return `rgb(${Math.round(r1 + t * (r2 - r1))},${Math.round(g1 + t * (g2 - g1))},${Math.round(b1 + t * (b2 - b1))})`;
}

export default function PeriodicTableExplore() {
  const [trend, setTrend] = useState<Trend>('atomic_radius');
  const [hovered, setHovered] = useState<typeof ELEMENTS_DATA[0] | null>(null);

  const cfg = TREND_CONFIG[trend];
  const values = ELEMENTS_DATA.map((e) => e[cfg.key] as number);
  const minV = Math.min(...values.filter((v) => v > 0));
  const maxV = Math.max(...values);

  function getColor(val: number): string {
    if (val === 0) return '#1f1f2e';
    const t = (val - minV) / (maxV - minV);
    if (trend === 'atomic_radius') return lerp(t, 13, 148, 136, 239, 68, 68);
    if (trend === 'ionization_energy') return lerp(t, 13, 148, 136, 239, 68, 68);
    if (trend === 'electronegativity') return lerp(t, 30, 58, 138, 245, 158, 11);
    return lerp(t, 30, 58, 138, 139, 92, 246);
  }

  const hEl = hovered;

  return (
    <div className="space-y-5">
      {/* Trend selector */}
      <div className="flex flex-wrap gap-2">
        {(Object.entries(TREND_CONFIG) as [Trend, typeof TREND_CONFIG.atomic_radius][]).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setTrend(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              trend === key
                ? 'text-white border'
                : 'bg-white/5 text-white/40 hover:bg-white/10 border border-transparent'
            }`}
            style={trend === key ? { background: `${val.color}25`, borderColor: `${val.color}50`, color: val.color } : {}}
          >
            {val.label}
          </button>
        ))}
      </div>

      {/* Info bar */}
      <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold" style={{ color: cfg.color }}>{cfg.label}</p>
          <p className="text-[10px] text-white/40 mt-0.5">{cfg.direction}</p>
        </div>
        {hEl && (
          <div className="text-right">
            <p className="text-white font-bold">{hEl.sym}</p>
            <p className="text-xs text-white/50">
              {cfg.label}: <span style={{ color: cfg.color }} className="font-semibold">
                {(hEl[cfg.key] as number) || 'N/A'} {cfg.unit}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Periodic Table Grid */}
      <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3 sm:p-4 overflow-x-auto">
        {/* Period labels + element cells */}
        {[1, 2, 3, 4].map((period) => {
          const rowElements = ELEMENTS_DATA.filter((e) => e.period === period);
          return (
            <div key={period} className="flex items-center gap-1 mb-1">
              <span className="text-[9px] text-white/20 font-mono w-4">{period}</span>
              <div className="flex gap-1">
                {([1, 2, 13, 14, 15, 16, 17, 18] as const).map((grp) => {
                  const el = rowElements.find((e) => e.group === grp);
                  if (!el) {
                    // Empty slot between group 2 and 13
                    return (
                      <div key={grp} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg opacity-0" />
                    );
                  }
                  const val = el[cfg.key] as number;
                  const bg = getColor(val);
                  return (
                    <div
                      key={grp}
                      onMouseEnter={() => setHovered(el)}
                      onMouseLeave={() => setHovered(null)}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-110 hover:z-10 relative"
                      style={{ background: bg }}
                    >
                      <span className="text-[9px] text-white/50 font-mono">{el.Z}</span>
                      <span className="text-sm font-bold text-white">{el.sym}</span>
                      {val > 0 && (
                        <span className="text-[8px] text-white/50 font-mono">
                          {val > 100 ? val.toFixed(0) : val.toFixed(1)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Group labels */}
        <div className="flex gap-1 mt-2 ml-5">
          {[1, 2, 13, 14, 15, 16, 17, 18].map((g) => (
            <div key={g} className="w-10 sm:w-12 text-center text-[9px] text-white/20 font-mono">{g}</div>
          ))}
        </div>

        {/* Color scale */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-[10px] text-white/30">Low</span>
          <div
            className="flex-1 h-2 rounded-full"
            style={{
              background: trend === 'atomic_radius'
                ? 'linear-gradient(to right, #0d9488, #ef4444)'
                : trend === 'electronegativity'
                  ? 'linear-gradient(to right, #1e3a8a, #f59e0b)'
                  : 'linear-gradient(to right, #1e3a8a, #8b5cf6)',
            }}
          />
          <span className="text-[10px] text-white/30">High</span>
        </div>
      </div>

      {/* Trend Explanation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-semibold text-white mb-2">Across a Period (→)</p>
          <p className="text-xs text-white/50">
            {trend === 'atomic_radius' && 'Atomic radius decreases → nuclear charge increases but same shell.'}
            {trend === 'ionization_energy' && 'Ionization energy increases → electrons held more tightly.'}
            {trend === 'electronegativity' && 'Electronegativity increases → more electron-attracting power.'}
            {trend === 'electron_affinity' && 'Generally increases → more tendency to gain electrons.'}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-semibold text-white mb-2">Down a Group (↓)</p>
          <p className="text-xs text-white/50">
            {trend === 'atomic_radius' && 'Atomic radius increases → new shells added, greater shielding.'}
            {trend === 'ionization_energy' && 'Ionization energy decreases → outer electrons farther from nucleus.'}
            {trend === 'electronegativity' && 'Electronegativity decreases → outer electrons more shielded.'}
            {trend === 'electron_affinity' && 'Generally decreases (except Group 17 anomaly: Cl > F).'}
          </p>
        </div>
      </div>
    </div>
  );
}
