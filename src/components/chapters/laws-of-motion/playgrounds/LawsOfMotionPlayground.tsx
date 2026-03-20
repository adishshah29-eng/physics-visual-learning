import { useEffect, useRef, useState, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ArrowRightLeft,
  Scale,
  MousePointer2,
  Settings2,
  Calculator, // Added icon
} from "lucide-react";

/* ---------------- TYPES ---------------- */
type Mode = "first-law" | "second-law" | "third-law";

interface Body {
  x: number;      
  v: number;      
  m: number;      
  w: number;
  h: number;
  color: string;
}

/* ---------------- CONSTANTS ---------------- */
const PIXELS_PER_METER = 50;
const GRAVITY = 9.8;
const GROUND_RATIO = 0.8;
const VELOCITY_EPS = 0.01;
const DAMPING = 0.999;

/* ================= PLAYGROUND ================= */
export default function LawsOfMotionPlayground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  /* -------- STATE -------- */
  const [mode, setMode] = useState<Mode>("second-law");
  const [isPlaying, setIsPlaying] = useState(false);

  const [forceStr, setForceStr] = useState("100");
  const [massAStr, setMassAStr] = useState("5");
  const [massBStr, setMassBStr] = useState("5");
  const [muStr, setMuStr] = useState("0.2");

  const F = Number(forceStr) || 0;
  const mA = Math.max(0.1, Number(massAStr) || 1);
  const mB = Math.max(0.1, Number(massBStr) || 1);
  const mu = Math.max(0, Number(muStr) || 0);

  const bodiesRef = useRef<Body[]>([]);

  /* -------- RESIZE -------- */
  const resizeCanvas = useCallback(() => {
    const c = canvasRef.current;
    const p = containerRef.current;
    if (!c || !p) return;
    if (c.width !== p.clientWidth || c.height !== p.clientHeight) {
      c.width = p.clientWidth;
      c.height = p.clientHeight;
      initBodies();
    }
  }, [mode, mA, mB]);

  useEffect(() => {
    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [resizeCanvas]);

  /* -------- INIT -------- */
  const initBodies = () => {
    const c = canvasRef.current;
    if (!c) return;
    const centerY = c.width / 2;
    if (mode === "third-law") {
      bodiesRef.current = [
        { x: centerY - 60, v: 0, m: mA, w: 60, h: 60, color: "#3b82f6" }, 
        { x: centerY,      v: 0, m: mB, w: 60, h: 60, color: "#f59e0b" }, 
      ];
    } else {
      bodiesRef.current = [
        { x: 50, v: 0, m: mA, w: 60, h: 60, color: "#3b82f6" }, 
      ];
    }
  };

  useEffect(initBodies, [mode, mA, mB]);

  /* -------- PHYSICS STEP -------- */
  const stepPhysics = (dt: number) => {
    const c = canvasRef.current;
    if (!c) return;

    bodiesRef.current.forEach((b, i) => {
      let netF = 0;

      if (mode === "first-law") netF = F;

      if (mode === "second-law") {
        const N = b.m * GRAVITY;
        const fMax = mu * N;
        if (Math.abs(b.v) < VELOCITY_EPS) {
          if (Math.abs(F) <= fMax) { netF = 0; b.v = 0; } 
          else { netF = F - Math.sign(F) * fMax; }
        } else {
          netF = F - Math.sign(b.v) * fMax;
        }
      }

      if (mode === "third-law") netF = i === 0 ? -F : F;

      const a = netF / b.m;
      b.v += a * dt;
      b.v *= DAMPING; 
      if (Math.abs(b.v) < VELOCITY_EPS && Math.abs(netF) < 0.1) b.v = 0;
      b.x += b.v * PIXELS_PER_METER * dt;

      // Bounce
      if (b.x < 0) { b.x = 0; b.v = -b.v * 0.5; }
      if (b.x + b.w > c.width) { b.x = c.width - b.w; b.v = -b.v * 0.5; }
    });
  };

  /* -------- DRAW -------- */
  const draw = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    // Clear
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, c.width, c.height);
    drawGrid(ctx, c.width, c.height);

    const groundY = c.height * GROUND_RATIO;
    ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(c.width, groundY);
    ctx.strokeStyle = "#475569"; ctx.lineWidth = 2; ctx.stroke();

    bodiesRef.current.forEach((b, i) => {
      const bodyY = groundY - b.h;
      const cx = b.x + b.w / 2;
      const cy = bodyY + b.h / 2;

      // Body
      const grad = ctx.createLinearGradient(b.x, bodyY, b.x, bodyY + b.h);
      grad.addColorStop(0, b.color);
      grad.addColorStop(1, adjustBrightness(b.color, -30));
      ctx.save();
      ctx.shadowBlur = 15; ctx.shadowColor = b.color;
      ctx.fillStyle = grad; ctx.fillRect(b.x, bodyY, b.w, b.h);
      ctx.restore();
      ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 1; ctx.strokeRect(b.x, bodyY, b.w, b.h);

      // Label
      ctx.fillStyle = "white"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(`${b.m}kg`, cx, cy + 4);

      // Vectors
      if (Math.abs(b.v) > 0.1) drawArrow(ctx, cx, bodyY - 10, b.v * 15, "#94a3b8", `v: ${b.v.toFixed(1)}`);
      
      let appliedVal = F;
      if (mode === "third-law") appliedVal = i === 0 ? -F : F;
      drawArrow(ctx, cx, cy, appliedVal, "#22c55e", "F-app");

      if (mode === "second-law") {
         const N = b.m * GRAVITY;
         const fMax = mu * N;
         let fVal = 0;
         if (Math.abs(b.v) > VELOCITY_EPS) fVal = -Math.sign(b.v) * fMax;
         else if (Math.abs(F) > fMax) fVal = -Math.sign(F) * fMax;
         else fVal = -F;
         
         if (Math.abs(fVal) > 1) drawArrow(ctx, cx, bodyY + b.h + 15, fVal, "#ef4444", "Fric");
         const net = appliedVal + fVal;
         if (Math.abs(net) > 1) drawArrow(ctx, cx, bodyY - 35, net, "#22d3ee", "Net", true);
      }
    });
  };

  useEffect(() => {
    const loop = (t: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = t;
      const dt = Math.min(0.064, (t - lastTimeRef.current) / 1000);
      lastTimeRef.current = t;
      if (isPlaying) stepPhysics(dt);
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current!);
  }, [isPlaying, F, mu, mode]);

  /* -------- CALC HELPERS -------- */
  // Calculations for display
  const fMax = mu * mA * GRAVITY;
  const isStatic = Math.abs(bodiesRef.current[0]?.v || 0) < VELOCITY_EPS;
  const frictionForce = isStatic 
    ? (Math.abs(F) <= fMax ? Math.abs(F) : fMax)
    : fMax;
  const netForce = Math.abs(F - (Math.sign(F) * frictionForce));
  const accel = netForce / mA;

  /* ================= UI ================= */
  return (
    <div className="flex flex-col h-full w-full bg-transparent text-slate-200 font-sans">
      
      {/* HEADER */}
      <div className="shrink-0 p-3 border-b border-slate-800 flex flex-wrap justify-between items-center gap-3 bg-slate-900/80 backdrop-blur-sm">
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
          <IconBtn icon={MousePointer2} label="Inertia" active={mode === "first-law"} onClick={() => setMode("first-law")} />
          <IconBtn icon={Scale} label="F=ma" active={mode === "second-law"} onClick={() => setMode("second-law")} />
          <IconBtn icon={ArrowRightLeft} label="Pairs" active={mode === "third-law"} onClick={() => setMode("third-law")} />
        </div>
        <div className="flex gap-2">
          <Btn icon={RotateCcw} label="Reset" onClick={initBodies} />
          <Btn
            icon={isPlaying ? Pause : Play}
            label={isPlaying ? "Pause" : "Play"}
            variant={isPlaying ? "yellow" : "green"}
            onClick={() => setIsPlaying(!isPlaying)}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* CANVAS */}
        <div ref={containerRef} className="flex-1 relative border-b lg:border-b-0 lg:border-r border-slate-800 min-h-[300px]">
          <canvas ref={canvasRef} className="block w-full h-full" />
          <div className="absolute top-3 left-3 pointer-events-none">
              <span className="bg-slate-900/80 border border-slate-800 px-2 py-1 rounded text-[10px] font-mono text-cyan-400">
                  {mode.toUpperCase()}
              </span>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="w-full lg:w-72 flex-shrink-0 bg-slate-900/50 p-4 space-y-5 overflow-y-auto">
          
          {/* INPUTS */}
          <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-2">
                <Settings2 size={14} className="text-blue-500" /> Inputs
              </div>
              <NumInput label="Applied Force (N)" value={forceStr} setValue={setForceStr} />
              <div className="grid grid-cols-2 gap-3">
                  <NumInput label="Mass A (kg)" value={massAStr} setValue={setMassAStr} min={0.1} />
                  {mode === "third-law" && <NumInput label="Mass B (kg)" value={massBStr} setValue={setMassBStr} min={0.1} />}
              </div>
              {mode === "second-law" && <NumInput label="Friction Coeff (μ)" value={muStr} setValue={setMuStr} step={0.05} max={1} />}
          </div>

          {/* CALCULATIONS / FORMULAS */}
          <div className="bg-transparent/80 p-3 rounded-lg border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                  <Calculator size={12} /> Physics Math
              </div>

              {/* DYNAMIC FORMULA SECTION */}
              {mode === "first-law" && (
                 <FormulaBlock 
                    label="Net Force"
                    formula="F_net = F_app"
                    calc={`${F} N`}
                 />
              )}

              {mode === "second-law" && (
                <>
                  <FormulaBlock 
                    label="Friction Force"
                    formula="f_k = μ · m · g"
                    calc={`${mu} · ${mA} · 9.8 = ${frictionForce.toFixed(1)} N`}
                    color="text-red-400"
                  />
                  <FormulaBlock 
                    label="Net Force"
                    formula="ΣF = F_app - f_k"
                    calc={`${F} - ${frictionForce.toFixed(1)} = ${netForce.toFixed(1)} N`}
                    color="text-cyan-400"
                  />
                  <FormulaBlock 
                    label="Acceleration"
                    formula="a = ΣF / m"
                    calc={`${netForce.toFixed(1)} / ${mA} = ${accel.toFixed(2)} m/s²`}
                    color="text-white"
                  />
                </>
              )}

              {mode === "third-law" && (
                <div className="text-xs text-slate-400 space-y-2">
                    <p>Newton's 3rd Law:</p>
                    <div className="font-mono text-center bg-slate-900 p-2 rounded text-cyan-400">F_AB = -F_BA</div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-center mt-2">
                        <div className="bg-slate-900 p-1 rounded">
                            <div className="text-slate-500">Force on A</div>
                            <div className="text-white">{-F} N</div>
                        </div>
                        <div className="bg-slate-900 p-1 rounded">
                            <div className="text-slate-500">Force on B</div>
                            <div className="text-white">{F} N</div>
                        </div>
                    </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- HELPERS ---------------- */

const FormulaBlock = ({ label, formula, calc, color }: any) => (
    <div className="border-b border-slate-800/50 pb-2 last:border-0">
        <div className="flex justify-between items-baseline mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">{label}</span>
            <span className="text-[10px] font-mono text-slate-400">{formula}</span>
        </div>
        <div className={`text-xs font-mono text-right ${color || "text-slate-200"}`}>
            {calc}
        </div>
    </div>
);

// Graphics Utils
function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y <= h; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
}
function drawArrow(ctx: CanvasRenderingContext2D, x: number, y: number, mag: number, color: string, label: string, isDashed = false) {
  if (Math.abs(mag) < 1) return;
  const maxLen = 100; let len = mag * 1.0; 
  if (Math.abs(len) > maxLen) len = Math.sign(len) * maxLen;
  const endX = x + len; const dir = Math.sign(mag);
  ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2.5;
  if(isDashed) ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(endX, y); ctx.stroke(); ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(endX, y); ctx.lineTo(endX - (6 * dir), y - 4); ctx.lineTo(endX - (6 * dir), y + 4); ctx.fill();
  ctx.font = "bold 10px sans-serif"; ctx.textAlign = "center"; ctx.fillText(label, x + len / 2, y - 8); ctx.restore();
}
function adjustBrightness(col: string, amt: number) { return col; }

// UI Components
const NumInput = ({ label, value, setValue, step = 1, min }: any) => (
  <div>
    <label className="text-[10px] uppercase text-slate-500 font-bold block mb-1">{label}</label>
    <input type="number" step={step} min={min} value={value} onChange={(e) => setValue(e.target.value)}
      className="w-full bg-slate-800 border border-slate-700 text-slate-200 px-3 py-2 rounded text-xs font-mono focus:outline-none focus:border-blue-500 focus:bg-slate-700 transition-colors" />
  </div>
);
const Btn = ({ icon: Icon, label, onClick, variant }: any) => {
    const s = variant === "green" ? "bg-green-600 hover:bg-green-500 text-white shadow-green-900/20" : 
              variant === "yellow" ? "bg-yellow-600 hover:bg-yellow-500 text-white shadow-yellow-900/20" : 
              "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700";
    return <button onClick={onClick} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all active:scale-95 ${s}`}><Icon size={14} /> {label}</button>;
};
const IconBtn = ({ icon: Icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-all ${active ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}`}>
    <Icon size={14} /> <span className="hidden sm:inline text-[10px] font-bold uppercase">{label}</span>
  </button>
);