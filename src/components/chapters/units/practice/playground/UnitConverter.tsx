import { useState, useMemo } from "react";
import { unitMap, Quantity } from "./unitData";

const UnitConverter = () => {
  const [quantity, setQuantity] = useState<Quantity>("length");
  const [value, setValue] = useState<string>(""); // string on purpose
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("cm");

  const units = unitMap[quantity].units;

  /* ================= SAFE CONVERSION ================= */

  const converted = useMemo(() => {
    if (value === "") return "";

    const num = Number(value);
    if (isNaN(num)) return "";

    return (num * units[fromUnit]) / units[toUnit];
  }, [value, fromUnit, toUnit, units]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Unit Conversion Playground</h3>

      {/* ================= Quantity Selector ================= */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            "length",
            "mass",
            "time",
            "area",
            "volume",
            "speed",
            "acceleration",
            "force",
            "energy",
            "power",
            "pressure",
            "density",
          ] as Quantity[]
        ).map((q) => (
          <button
            key={q}
            onClick={() => {
              setQuantity(q);
              const first = Object.keys(unitMap[q].units)[0];
              setFromUnit(first);
              setToUnit(first);
              setValue("");
            }}
            className={`px-3 py-1 text-xs rounded border transition
              ${
                quantity === q
                  ? "bg-primary/20 text-primary border-sky-400"
                  : "border-border text-slate-400 hover:bg-secondary/40"
              }`}
          >
            {q.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ================= Input ================= */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Enter value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="bg-secondary p-2 rounded text-sm outline-none"
        />

        <select
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value)}
          className="bg-secondary p-2 rounded text-sm"
        >
          {Object.keys(units).map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      {/* ================= Arrow ================= */}
      <div className="text-center text-slate-400">↓</div>

      {/* ================= Output ================= */}
      <div className="grid grid-cols-2 gap-4">
        <input
          disabled
          value={converted === "" ? "" : Number(converted).toPrecision(6)}
          placeholder="Result"
          className="bg-secondary p-2 rounded text-sm"
        />

        <select
          value={toUnit}
          onChange={(e) => setToUnit(e.target.value)}
          className="bg-secondary p-2 rounded text-sm"
        >
          {Object.keys(units).map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      {/* ================= Dimension ================= */}
      <div className="text-xs text-slate-400">
        Dimensional formula: [{unitMap[quantity].dimension}]
      </div>
    </div>
  );
};

export default UnitConverter;
