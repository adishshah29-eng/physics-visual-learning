import React, { useState } from 'react';

const ELLINGHAM_DATA = [
  { id: 'mg', label: '2Mg + O₂ → 2MgO', color: '#ef4444', dH: -1200, dS: -200, points: [{t:0, g:-1200}, {t:1000, g:-1000}, {t:2000, g:-800}] },
  { id: 'al', label: '4/3Al + O₂ → 2/3Al₂O₃', color: '#3b82f6', dH: -1050, dS: -200, points: [{t:0, g:-1050}, {t:1000, g:-850}, {t:2000, g:-650}] },
  { id: 'zn', label: '2Zn + O₂ → 2ZnO', color: '#10b981', dH: -700, dS: -200, points: [{t:0, g:-700}, {t:1000, g:-500}, {t:2000, g:-300}] },
  { id: 'co', label: '2C + O₂ → 2CO', color: '#eab308', dH: -200, dS: +200, points: [{t:0, g:-200}, {t:1000, g:-400}, {t:2000, g:-600}] },
];

export default function MetallurgyExplore() {
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);

  const SVG_W = 600;
  const SVG_H = 400;
  const PAD = 40;
  
  const minT = 0;
  const maxT = 2000;
  const minG = -1300;
  const maxG = 0;

  const getX = (t: number) => PAD + ((t - minT) / (maxT - minT)) * (SVG_W - 2 * PAD);
  const getY = (g: number) => PAD + ((maxG - g) / (maxG - minG)) * (SVG_H - 2 * PAD);

  return (
    <div className="flex flex-col bg-slate-900/40 text-slate-100 p-4 rounded-xl border border-slate-800 h-full overflow-y-auto w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-sky-400">Ellingham Diagram</h2>
        <p className="text-xs text-slate-400">
          ΔG° vs Temperature for the oxidation of metals. A metal can reduce the oxide of other metals that are <b>above</b> its own line.
        </p>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden relative bg-slate-950 p-2">
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto">
          {/* Grid setup */}
          <line x1={PAD} y1={PAD} x2={PAD} y2={SVG_H - PAD} stroke="#334155" strokeWidth="1" />
          <line x1={PAD} y1={SVG_H - PAD} x2={SVG_W - PAD} y2={SVG_H - PAD} stroke="#334155" strokeWidth="1" />
          
          <text x={PAD - 10} y={SVG_H / 2} fill="#64748b" fontSize="12" textAnchor="middle" transform={`rotate(-90, ${PAD - 10}, ${SVG_H / 2})`}>ΔG° (kJ/mol)</text>
          <text x={SVG_W / 2} y={SVG_H - 10} fill="#64748b" fontSize="12" textAnchor="middle">Temperature (°C)</text>

          {/* Grid Lines */}
          {[0, 500, 1000, 1500, 2000].map(t => (
            <g key={`t-${t}`}>
              <line x1={getX(t)} y1={PAD} x2={getX(t)} y2={SVG_H - PAD} stroke="#1e293b" strokeWidth="1" />
              <text x={getX(t)} y={SVG_H - PAD + 15} fill="#475569" fontSize="10" textAnchor="middle">{t}</text>
            </g>
          ))}
          {[0, -300, -600, -900, -1200].map(g => (
            <g key={`g-${g}`}>
              <line x1={PAD} y1={getY(g)} x2={SVG_W - PAD} y2={getY(g)} stroke="#1e293b" strokeWidth="1" />
              <text x={PAD - 5} y={getY(g) + 4} fill="#475569" fontSize="10" textAnchor="end">{g}</text>
            </g>
          ))}

          {/* Data Lines */}
          {ELLINGHAM_DATA.map(metal => {
            const isHovered = hoveredLine === metal.id;
            const isDimmed = hoveredLine && !isHovered;
            
            return (
              <g key={metal.id} 
                 onMouseEnter={() => setHoveredLine(metal.id)}
                 onMouseLeave={() => setHoveredLine(null)}
                 className="cursor-pointer transition-opacity"
                 style={{ opacity: isDimmed ? 0.2 : 1 }}
              >
                <path 
                  d={`M ${getX(metal.points[0].t)} ${getY(metal.points[0].g)} L ${getX(metal.points[2].t)} ${getY(metal.points[2].g)}`} 
                  fill="none" 
                  stroke={metal.color} 
                  strokeWidth={isHovered ? "4" : "2"} 
                />
                
                {/* Invisible wider path for easier hovering */}
                <path 
                  d={`M ${getX(metal.points[0].t)} ${getY(metal.points[0].g)} L ${getX(metal.points[2].t)} ${getY(metal.points[2].g)}`} 
                  fill="none" 
                  stroke="transparent" 
                  strokeWidth="20" 
                />
                
                <text 
                  x={getX(metal.points[2].t) - 10} 
                  y={getY(metal.points[2].g) - 10} 
                  fill={metal.color} 
                  fontSize={isHovered ? "14" : "12"} 
                  fontWeight="bold"
                  textAnchor="end"
                >
                  {metal.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {hoveredLine && (
        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          {ELLINGHAM_DATA.map(m => m.id === hoveredLine && (
            <div key={m.id}>
              <h3 className="text-sm font-bold" style={{color: m.color}}>{m.label}</h3>
              <p className="text-xs text-slate-300 mt-1">
                Notice the slope of this line. {m.id === 'co' ? "Carbon oxidation produces 2 moles of gas from 1 mole of oxygen, increasing entropy, so ΔG becomes MORE negative as T rises. Carbon is a great reducing agent at high temps!" : "Metal oxidations decrease in entropy (gas to solid/liquid), so ΔG becomes LESS negative as T rises."}
              </p>
            </div>
          ))}
        </div>
      )}
      
      {!hoveredLine && (
        <div className="mt-4 p-3 bg-sky-900/20 rounded-lg border border-sky-800/30">
          <p className="text-xs text-sky-400">
            Hover over the lines to interact. The lower the line on the diagram, the more stable the oxide. A metal (like Mg) can reduce the oxide of a metal above it (like Al2O3).
          </p>
        </div>
      )}
    </div>
  );
}
