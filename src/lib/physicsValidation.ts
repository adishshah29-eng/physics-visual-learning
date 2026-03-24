export interface PhysicsInputConfig {
  min: number;
  max: number;
  fallback: number;
  label: string;
}

export const PHYSICS_LIMITS: Record<string, PhysicsInputConfig> = {
  velocity:    { min: 0.1,  max: 1000,  fallback: 25,  label: 'velocity (m/s)' },
  angle:       { min: 0,    max: 90,    fallback: 45,  label: 'angle (°)' },
  gravity:     { min: 0.1,  max: 100,   fallback: 9.8, label: 'gravity (m/s²)' },
  mass:        { min: 0.01, max: 10000, fallback: 1,   label: 'mass (kg)' },
  radius:      { min: 0.01, max: 1000,  fallback: 1,   label: 'radius (m)' },
  springK:     { min: 0.1,  max: 10000, fallback: 10,  label: 'spring constant (N/m)' },
  amplitude:   { min: 0.01, max: 100,   fallback: 1,   label: 'amplitude (m)' },
  time:        { min: 0.1,  max: 1000,  fallback: 10,  label: 'time (s)' },
  force:       { min: 0,    max: 100000,fallback: 10,  label: 'force (N)' },
  mu:          { min: 0,    max: 1,     fallback: 0.3, label: 'friction coefficient' },
  temperature: { min: 1,    max: 10000, fallback: 300, label: 'temperature (K)' },
};

/**
 * Clamp a physics value to safe bounds. Returns fallback for NaN/Infinity.
 */
export function clampPhysics(
  value: number,
  config: PhysicsInputConfig
): number {
  if (!isFinite(value) || isNaN(value)) return config.fallback;
  return Math.max(config.min, Math.min(config.max, value));
}

/**
 * Parse and validate a numeric input string for physics simulations.
 * Returns null if the value is invalid (caller should show error).
 */
export function parsePhysicsInput(
  raw: string,
  config: PhysicsInputConfig
): number | null {
  const n = parseFloat(raw);
  if (isNaN(n) || !isFinite(n)) return null;
  return clampPhysics(n, config);
}
