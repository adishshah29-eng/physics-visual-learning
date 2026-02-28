export interface Force {
  x: number;
  y: number;
}

export function addForces(forces: Force[]): Force {
  return forces.reduce(
    (sum, f) => ({ x: sum.x + f.x, y: sum.y + f.y }),
    { x: 0, y: 0 }
  );
}

export function acceleration(netForce: Force, mass: number): Force {
  return {
    x: netForce.x / mass,
    y: netForce.y / mass
  };
}
