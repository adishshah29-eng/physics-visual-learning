import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Define the structure of an atom
export interface AtomData {
  id: string | number;
  position: [number, number, number];
  element: string; // 'C', 'H', 'O', 'N', etc.
  radius?: number; // scale relative to standard
}

// Define bonds between two atoms by their IDs
export interface BondData {
  source: string | number;
  target: string | number;
  type: 1 | 2 | 3; // single, double, triple
}

interface Molecule3DProps {
  atoms: AtomData[];
  bonds: BondData[];
  autoRotate?: boolean;
}

// Elemental properties for rendering
const ELEMENT_COLORS: Record<string, string> = {
  C: '#374151',  // Dark Gray
  H: '#f8fafc',  // White
  O: '#ef4444',  // Red
  N: '#3b82f6',  // Blue
  Cl: '#22c55e', // Green
  F: '#bbf7d0',  // Light Green
  Br: '#991b1b', // Dark Red
  I: '#7e22ce',  // Purple
  S: '#eab308',  // Yellow
  P: '#f97316',  // Orange
  Default: '#ec4899', // Pink fallback
};

const ELEMENT_RADII: Record<string, number> = {
  H: 0.3,
  C: 0.7,
  O: 0.6,
  N: 0.65,
  Cl: 0.99,
  F: 0.5,
  Br: 1.14,
  I: 1.33,
  S: 1.0,
  P: 1.0,
  Default: 0.7,
};

function Atom({ position, element, customRadius }: { position: [number, number, number], element: string, customRadius?: number }) {
  const color = ELEMENT_COLORS[element] || ELEMENT_COLORS.Default;
  const radius = customRadius || ELEMENT_RADII[element] || ELEMENT_RADII.Default;
  
  return (
    <mesh position={position} castShadow receiveShadow>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshPhysicalMaterial 
        color={color} 
        roughness={0.2} 
        metalness={0.1}
        clearcoat={0.8}
        clearcoatRoughness={0.2}
      />
    </mesh>
  );
}

function Bond({ start, end, type }: { start: THREE.Vector3, end: THREE.Vector3, type: number }) {
  const distance = start.distanceTo(end);
  const position = start.clone().lerp(end, 0.5);
  
  // Calculate orientation
  const orientation = new THREE.Matrix4();
  const offsetRotation = new THREE.Matrix4();
  offsetRotation.makeRotationX(Math.PI / 2);
  orientation.lookAt(start, end, new THREE.Vector3(0, 1, 0));
  orientation.multiply(offsetRotation);

  const thickness = 0.15;
  const spacing = 0.4; // space between multiple bonds
  
  const renderCylinders = () => {
    if (type === 1) {
      return (
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[thickness, thickness, distance, 16]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.8} />
        </mesh>
      );
    } else if (type === 2) {
      return (
        <group>
          <mesh position={[spacing/2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[thickness * 0.8, thickness * 0.8, distance, 16]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[-spacing/2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[thickness * 0.8, thickness * 0.8, distance, 16]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.8} />
          </mesh>
        </group>
      );
    } else {
      return (
        <group>
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[thickness * 0.8, thickness * 0.8, distance, 16]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[spacing, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[thickness * 0.8, thickness * 0.8, distance, 16]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[-spacing, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[thickness * 0.8, thickness * 0.8, distance, 16]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.8} />
          </mesh>
        </group>
      );
    }
  };

  return (
    <group position={position} quaternion={new THREE.Quaternion().setFromRotationMatrix(orientation)}>
      {renderCylinders()}
    </group>
  );
}

function MoleculeScene({ atoms, bonds, autoRotate }: Molecule3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  const atomMap = useMemo(() => {
    const map = new Map<string | number, THREE.Vector3>();
    atoms.forEach(a => map.set(a.id, new THREE.Vector3(...a.position)));
    return map;
  }, [atoms]);

  // Calculate center of mass to center the molecule
  const center = useMemo(() => {
    const vec = new THREE.Vector3();
    atoms.forEach(a => vec.add(new THREE.Vector3(...a.position)));
    if (atoms.length > 0) vec.divideScalar(atoms.length);
    return vec;
  }, [atoms]);

  return (
    <group>
      <group ref={groupRef} position={[-center.x, -center.y, -center.z]}>
        {atoms.map((atom) => (
          <Atom key={atom.id} position={atom.position} element={atom.element} customRadius={atom.radius} />
        ))}
        {bonds.map((bond, i) => {
          const start = atomMap.get(bond.source);
          const end = atomMap.get(bond.target);
          if (!start || !end) return null;
          return <Bond key={`bond-${i}`} start={start} end={end} type={bond.type} />;
        })}
      </group>
      <ContactShadows resolution={512} scale={10} blur={2} opacity={0.5} far={10} color="#000000" position={[0, -2.5, 0]} />
    </group>
  );
}

export default function Molecule3D({ atoms, bonds, autoRotate = true }: Molecule3DProps) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas shadows camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight castShadow position={[10, 10, 10]} intensity={1.5} shadow-mapSize={[1024, 1024]}>
          <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
        </directionalLight>
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#38bdf8" />
        
        <MoleculeScene atoms={atoms} bonds={bonds} autoRotate={autoRotate} />
        
        <OrbitControls 
          enablePan={false}
          minDistance={3}
          maxDistance={15}
          autoRotate={false} 
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
