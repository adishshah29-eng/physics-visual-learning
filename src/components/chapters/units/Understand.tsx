const UnitsUnderstand = () => {
  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-xl font-display tracking-wide text-white">
          SI Units & Dimensional Analysis
        </h2>
        <p className="text-sm text-slate-400">
          The International System of Units (SI) is based on seven fundamental quantities.
        </p>
      </div>

      {/* Base Units */}
      <div className="glass-panel p-4 rounded-lg space-y-2">
        <h3 className="text-md font-display tracking-wide text-white">
          Fundamental Quantities
        </h3>
        <p className="text-sm text-slate-400">
          These quantities are independent and cannot be derived from others.
        </p>
        <div className="text-sm text-primary font-mono bg-black/20 p-2 rounded">
          Length (m), Mass (kg), Time (s), Temperature (K), Current (A),
          Amount of substance (mol), Luminous intensity (cd)
        </div>
      </div>

      {/* Derived Units */}
      <div className="glass-panel p-4 rounded-lg space-y-2">
        <h3 className="text-md font-display tracking-wide text-white">
          Derived Quantities
        </h3>
        <p className="text-sm text-slate-400">
          Derived quantities are expressed in terms of fundamental units.
        </p>
        <div className="text-sm text-primary font-mono bg-black/20 p-2 rounded">
          Velocity → m s⁻¹, Force → kg m s⁻², Energy → kg m² s⁻²
        </div>
      </div>

      {/* Dimensional Formula */}
      <div className="bg-secondary/40 p-4 rounded-lg space-y-3">
        <h3 className="text-md font-display tracking-wide text-white">
          Dimensional Formula
        </h3>

        <p className="text-sm text-slate-400">
          The dimensional formula represents a physical quantity in terms of
          fundamental dimensions.
        </p>

        <div className="font-mono text-sm text-primary bg-black/20 p-2 rounded">
          Example: [Force] = M¹ L¹ T⁻²
        </div>
      </div>

      {/* Errors */}
      <div className="bg-secondary/40 p-4 rounded-lg space-y-3">
        <h3 className="text-md font-display tracking-wide text-white">
          Errors in Measurement
        </h3>

        <p className="text-sm text-slate-400">
          No measurement is perfectly accurate. Errors may arise due to instrument
          limitations or human factors.
        </p>

        <div className="text-sm text-primary font-mono bg-black/20 p-2 rounded">
          Absolute Error, Relative Error, Percentage Error
        </div>
      </div>

      <div className="text-xs text-slate-400 italic">
        Dimensional analysis is widely used in JEE to verify equations and derive relations.
      </div>

    </div>
  );
};

export default UnitsUnderstand;
