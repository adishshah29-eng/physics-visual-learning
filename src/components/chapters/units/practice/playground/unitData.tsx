export type Quantity = "length" | "mass" | "time";

export const unitMap = {
  length: {
    base: "m",
    units: {
      mm: 0.001,
      cm: 0.01,
      m: 1,
      km: 1000,
    },
    dimension: "L",
  },
  mass: {
    base: "kg",
    units: {
      mg: 0.000001,
      g: 0.001,
      kg: 1,
    },
    dimension: "M",
  },
  time: {
    base: "s",
    units: {
      ms: 0.001,
      s: 1,
      min: 60,
      h: 3600,
    },
    dimension: "T",
  },
};
