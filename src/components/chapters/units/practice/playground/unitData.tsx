export type Quantity =
  | "length"
  | "mass"
  | "time"
  | "area"
  | "volume"
  | "speed"
  | "acceleration"
  | "force"
  | "energy"
  | "power"
  | "pressure"
  | "density";
;
export const unitMap = {
  length: {
    base: "m",
    units: {
      mm: 1e-3,
      cm: 1e-2,
      m: 1,
      km: 1e3,
      inch: 0.0254,
      ft: 0.3048,
    },
    dimension: "L",
  },

  mass: {
    base: "kg",
    units: {
      mg: 1e-6,
      g: 1e-3,
      kg: 1,
      tonne: 1e3,
    },
    dimension: "M",
  },

  time: {
    base: "s",
    units: {
      ms: 1e-3,
      s: 1,
      min: 60,
      h: 3600,
      day: 86400,
    },
    dimension: "T",
  },

  area: {
    base: "m²",
    units: {
      "cm²": 1e-4,
      "m²": 1,
      "km²": 1e6,
      hectare: 1e4,
    },
    dimension: "L²",
  },

  volume: {
    base: "m³",
    units: {
      "cm³": 1e-6,
      "m³": 1,
      liter: 1e-3,
      ml: 1e-6,
    },
    dimension: "L³",
  },

  speed: {
    base: "m/s",
    units: {
      "m/s": 1,
      "km/h": 5 / 18,
    },
    dimension: "LT⁻¹",
  },

  acceleration: {
    base: "m/s²",
    units: {
      "m/s²": 1,
      "cm/s²": 0.01,
      g: 9.8,
    },
    dimension: "LT⁻²",
  },

  force: {
    base: "N",
    units: {
      N: 1,
      dyne: 1e-5,
      kN: 1e3,
    },
    dimension: "MLT⁻²",
  },

  energy: {
    base: "J",
    units: {
      J: 1,
      kJ: 1e3,
      cal: 4.184,
      eV: 1.602e-19,
    },
    dimension: "ML²T⁻²",
  },

  power: {
    base: "W",
    units: {
      W: 1,
      kW: 1e3,
      hp: 746,
    },
    dimension: "ML²T⁻³",
  },

  pressure: {
    base: "Pa",
    units: {
      Pa: 1,
      kPa: 1e3,
      bar: 1e5,
      atm: 1.013e5,
    },
    dimension: "ML⁻¹T⁻²",
  },

  density: {
    base: "kg/m³",
    units: {
      "kg/m³": 1,
      "g/cm³": 1e3,
    },
    dimension: "ML⁻³",
  },
};
